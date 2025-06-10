/* eslint-disable @typescript-eslint/no-unused-vars */

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Modal, Pressable } from "react-native";
import '../../global.css';
import { store } from 'expo-router/build/global-state/router-store';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'expo-router';
export default function Question() {
  type Question = {
    question: string;
    options: string[];
    answer: string
  }
  const [data, setData] = useState<Question>({} as Question)
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])
  const [length, setLength] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [isCorrect, setIsCorrect] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [shuffledHistory, setShuffledHistory] = useState<{ [key: number]: string[] }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false)
  const letter = ["A", "B", "C"]
  const [score, setScore] = useState(0)

  const navigation = useRouter()
  const fetchLength = async () => {
    const response = await axios.get(`https://quizz-backend-nine.vercel.app/api/quiz/length`)
    // const response = await axios.get(`http://192.168.100.108:5000/api/quiz/length`)
    setLength(response.data)
  }

  // Load answered
  useEffect(() => {
    const loadAnswered = async () => {
      const stored = await AsyncStorage.getItem("answered")
      if (stored) {
        setAnswers(JSON.parse(stored))
      }
    }
  })
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`https://quizz-backend-nine.vercel.app/api/quiz/${currentQuestion}`)
      // const response = await axios.get(`http://192.168.100.108:5000/api/quiz/${currentQuestion}`)
      console.log(response.data)
      setData(response.data)
      // Load previous answer if exists
      const storedAnswer = answers[currentQuestion];
      if (storedAnswer) {
        setSelectedAnswer(storedAnswer);
        setIsAnswered(true);
      } else {
        setSelectedAnswer("");
        setIsAnswered(false);
      }
      console.log(length)
    };

    fetchData()
    fetchLength()


  }, [currentQuestion])

  const shuffleOption = async () => {
    if (shuffledHistory[currentQuestion]) {
      setShuffledOptions(shuffledHistory[currentQuestion]);
      return;
    }
    const shuffledData = [...data.options]
    for (let i = shuffledData.length - 1; i > 0; i--) {
      const random = Math.floor(Math.random() * (i + 1));
      [shuffledData[i], shuffledData[random]] = [shuffledData[random], shuffledData[i]]
    }

    setShuffledOptions(shuffledData)
    setShuffledHistory(prev => ({
      ...prev,
      [currentQuestion]: shuffledData
    }))
  }

  useEffect(() => {
    shuffleOption()
  }, [data])

  const handleAnswer = async (answer: string) => {
    setIsAnswered(true)
    setSelectedAnswer(answer)

    // simpan jawaban ke local
    const answered = { ...answers, [currentQuestion]: answer }
    setAnswers(answered)
    await AsyncStorage.setItem("answered", JSON.stringify(answered))

    if (answer === data.answer) {
      setIsCorrect(true)
      setScore(score + 1)
      const currentScore = await AsyncStorage.getItem("score")
      const convertedScore = currentScore ? Number(currentScore) : 0
      await AsyncStorage.setItem("score", (convertedScore + 1).toString())
      // console.log(currentScore)
    }

    setTimeout(() => {
      handleNextQuestion()
    }, 900)
  }

  const handleNextQuestion = async () => {
    if (currentQuestion <= length) {
      setCurrentQuestion(currentQuestion + 1)
      setIsAnswered(false)
      setSelectedAnswer("")
      setIsCorrect(false)
    }
  }


  const handlePreviousQuestion = async () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1)
      setIsAnswered(false)
      setSelectedAnswer("")
      setIsCorrect(false)
    }
  }

  const handleReset = async () => {
    setCurrentQuestion(1);
    setScore(0);
    setAnswers({});
    await AsyncStorage.removeItem("score");
    await AsyncStorage.removeItem("answers");

    navigation.replace("/")
  }

  return (
    <View
      className="flex-1 from-blue-50 to-indigo-100 justify-center items-center"

    >
      <Modal animationType="fade" visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-40">
          <View className="bg-white rounded-2xl p-6 w-[80%] max-w-md shadow-lg">
            <Text className="text-lg font-semibold mb-4 text-center">Apakah anda yakin ingin keluar?</Text>
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                <Text>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleReset}
                className="px-4 py-2 rounded bg-red-500"
              >
                <Text className="text-white">Keluar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <View className='flex-row justify-between items-center bg-red-500 p-2 mb-6 rounded-full border-2 border-white'>
        <Pressable onPress={() => setModalVisible(true)}>
          <FontAwesomeIcon icon={faDoorOpen} color="white" size={20} />
        </Pressable>
      </View>

      {

        currentQuestion > length ? (
          <View className=" flex-col bg-white p-6 rounded-lg shadow-lg w-[20rem] items-center">
            <Text className="text-3xl font-bold mb-4">Quiz Selesai!</Text>
            <Text className="text-xl mb-4">Score kamu: {score} / {length}</Text>
          </View>
        )
          : (
            <View className="text-center text-white bg-white w-[20rem]  p-4">
              <View className="flex-row justify-between items-center">
                <View className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
                  <Text className="text-white">{currentQuestion}</Text>
                </View>
                <Text>{`${currentQuestion} / ${length}`}</Text>
              </View>
              <Text className="text-2xl my-5 font-bold text-start">{data?.question}</Text>
              <View className="flex gap-2 flex-col">
                {shuffledOptions.map((item, index) => (
                  <TouchableOpacity key={index} disabled={isAnswered} onPress={() => handleAnswer(item)} className="flex-row gap-2 bg-gray-200  items-center  p-2 rounded-full">
                    <View className={`w-8 h-8 rounded-full items-center justify-center
                      ${isAnswered
                        ? data?.answer === item
                          ? "bg-green-500"
                          : selectedAnswer === item
                            ? "bg-red-500"
                            : "bg-black"
                        : "bg-black"
                      }`}>
                      <Text className="text-white text-md font-bold">{letter[index]}</Text>
                    </View>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}

              </View>
              <View className="flex-row justify-end gap-2 mt-2">

                {
                  currentQuestion > 1 && (
                    <TouchableOpacity
                      onPress={handlePreviousQuestion}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-md font-bold"
                    >
                      <Text className="text-white">&#8592;</Text>
                    </TouchableOpacity>
                  )
                }

                <TouchableOpacity disabled={!isAnswered} onPress={handleNextQuestion} className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-md font-bold">
                  <Text className="text-white">&#8594;</Text>
                </TouchableOpacity>
              </View>
            </View>
          )

      }

    </View >
  );
}

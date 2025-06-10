import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, TextInput, View } from 'react-native'

const Index = () => {
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`https://quizz-backend-nine.vercel.app/api/quiz`)
      setData(response.data)
    }
    fetchData()
  }, [])
  const handleSearch = (text) => {

    setSearch(text);

    const filteredSeach = data.filter((item) => {
      return item.question.toLowerCase().includes(text.toLowerCase())
    })

    setFilteredData(filteredSeach)
  }


  return (
    <ScrollView className='flex-1 bg-gradient-to-br from-blue-50 to-indigo-100'>
      <View className='flex-1 items-center px-4 py-6'>


        {/* Search Bar */}
        <View className='bg-white w-full max-w-sm flex-row items-center px-4 py-3 rounded-xl shadow-lg border border-gray-100 mb-6'>
          <FontAwesomeIcon icon={faSearch} size={18} color="#6B7280" />
          <TextInput
            placeholder='Search for a word...'
            value={search}
            onChangeText={handleSearch}
            className='flex-1 ml-3 text-base text-gray-700'
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Dictionary Card */}
        <View className='bg-white w-full max-w-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>

          {/* Card Content */}
          <View className='px-6 py-6'>

            {/* Question Section */}
            <View className='mb-6'>
              <View className='flex-row items-center mb-2'>
                <View className='w-1 h-6 bg-indigo-500 rounded-full mr-3'></View>
                <Text className='font-bold text-lg text-gray-800'>English</Text>
              </View>
              {
                filteredData.length > 0 ? (
                  <Text className='text-2xl font-semibold text-gray-900 ml-4'>{filteredData[0].question}</Text>
                ) : data.length > 0 ? (
                  <Text className='text-2xl font-semibold text-gray-900 ml-4'>{data[0].question}</Text>
                ) : (
                  <Text className='text-2xl font-semibold text-gray-900 ml-4'>Loading...</Text>
                )
              }

            </View>

            {/* Divider */}
            <View className='h-px bg-gray-200 mb-6'></View>

            {/* Answer Section */}
            <View>
              <View className='flex-row items-center mb-2'>
                <View className='w-1 h-6 bg-purple-500 rounded-full mr-3'></View>
                <Text className='font-bold text-lg text-gray-800'>Indonesian</Text>
              </View>
              {
                filteredData.length > 0 ? (
                  <Text className='text-2xl font-semibold text-gray-900 ml-4'>{filteredData[0].answer}</Text>
                ) : data.length > 0 ? (
                  <Text className='text-2xl font-semibold text-gray-900 ml-4'>{data[0].answer}</Text>
                ) : (
                  <Text className='text-2xl font-semibold text-gray-900 ml-4'>Loading...</Text>
                )
              }

            </View>

          </View>
        </View>

        <Text className='flex-1 font-extrabold text-2xl  text-gray-700 mt-8'>List of Question</Text>
        <View className='bg-white w-full flex-col px-4 py-3 rounded-xl shadow-lg border border-gray-100'>
          {data.length === 0 ? (
            <View className='flex-1 justify-center items-center'>
              <Text className='text-lg font-bold text-gray-800'>Loading...</Text>
            </View>
          ) : (
            data.map((item, index) => (
              <View key={index} className='flex-row'>
                <View className='rounded-full items-center  w-8 h-8 bg-indigo-100'>
                  <Text className='font-bold text-lg text-gray-800'>{index + 1}</Text>
                </View>
                <Text className='text-lg font-semibold text-gray-900 ml-2'>
                  {item.question} = {item.answer}
                </Text>
              </View>
            ))
          )}

        </View>

      </View>
    </ScrollView>
  )
}

export default Index
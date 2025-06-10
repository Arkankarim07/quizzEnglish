import { faPlay, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Link, router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
const Index = () => {

//   const [isReady, setIsReady] = useState(false)

//   useEffect(() => {
//     // Delay 1 tick untuk memastikan layout sudah mount
//     const timeout = setTimeout(() => {
//       setIsReady(true)
//     }, 0)

//     return () => clearTimeout(timeout)
//   }, [])

//   useEffect(() => {
//     if (isReady) {
//       router.replace('/Search')
//     }
//   }, [isReady])

    
    return (
        <View className="flex-1 from-blue-50 to-indigo-100  justify-center items-center">
            <View className='text-white bg-white w-[20rem] shadow-lg border border-gray-100 rounded-2xl p-4'>
                <Text className='text-2xl font-extrabold text-center'>QUIZZ ENGLISH</Text>
                <Link href="/Quizz" asChild>
                    <TouchableOpacity>
                        <View className='flex-row rounded-lg justify-center items-center bg-green-500 gap-4 mt-4 p-3'>
                            <FontAwesomeIcon icon={faPlay} />
                            <Text className='font-extrabold text-center text-white'>START</Text>
                        </View>
                    </TouchableOpacity>
                </Link>
                <Link href="/Search" asChild>
                    <TouchableOpacity>
                        <View className='flex-row  justify-center items-center bg-blue-400 gap-4 rounded-lg mt-4 p-3'>
                            <FontAwesomeIcon icon={faSearch} />
                            <Text className=' font-extrabold text-center'>Search</Text>
                        </View>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    )
}

export default Index
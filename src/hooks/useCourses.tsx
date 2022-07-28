import { useEffect, useState } from 'react'
import { CheckedCourse } from '../@types'

const isStorageValid = (key: string, daysElapsed: number) => {
  const storedVideos = JSON.parse(localStorage.getItem(key))
  const storedSavedTime = new Date(JSON.parse(localStorage.getItem(key + '.fetch-date'))).getTime()
  const expiredStorage = Math.abs(new Date().getTime() - storedSavedTime) / 36e5 > 24 * daysElapsed

  return storedVideos !== null && storedSavedTime !== null && !expiredStorage
}

const writeStorage = (key: string, courses: CheckedCourse[][]) => {
  localStorage.setItem(key, JSON.stringify(courses))
  localStorage.setItem(key + '.fetch-date', JSON.stringify(new Date()))
}

const writeStorageInvalid = (key: string, initialValue?: any) => {
  localStorage.setItem(key, JSON.stringify(initialValue))
  localStorage.setItem(key + '.fetch-date', JSON.stringify(initialValue))
}

const useLocalStorage = (key: string, initialValue?: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (isStorageValid(key, 7)) {
        const major: CheckedCourse[][] = JSON.parse(localStorage.getItem(key))
        writeStorage(key, major)
        return major
      } else {
        writeStorageInvalid(key)
        return initialValue
      }
    } catch (error) {
      console.warn(error)
      return initialValue
    }
  })

  const setValue = (value: any) => {
    try {
      setStoredValue(value)
      writeStorage(key, value)
    } catch (error) {
      console.warn(error)
    }
  }
  return [storedValue, setValue]
}

const useCourses = () => {
  const key = 'niaefeup-tts.courses'
  const [courses, setCourses] = useLocalStorage(key, [])

  useEffect(() => {
    writeStorage(key, courses)
  }, [courses, setCourses])

  return [courses, setCourses]
}

export default useCourses

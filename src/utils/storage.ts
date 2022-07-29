import { CheckedCourse } from '../@types'

const isStorageValid = (key: string, daysElapsed: number) => {
  const stored = JSON.parse(localStorage.getItem(key))
  const storedFetchDate = JSON.parse(localStorage.getItem(key + '.fetch-date'))

  if (storedFetchDate === null) return false

  const savedTime = new Date(storedFetchDate).getTime()
  const expiredStorage = Math.abs(new Date().getTime() - savedTime) / 36e5 > 24 * daysElapsed

  return stored !== null && savedTime !== null && !expiredStorage
}

const writeStorage = (key: string, courses: CheckedCourse[][]) => {
  localStorage.setItem(key, JSON.stringify(courses))
  localStorage.setItem(key + '.fetch-date', JSON.stringify(new Date()))
}

const writeStorageInvalid = (key: string) => {
  localStorage.setItem(key + '.fetch-date', null)
}

const getCoursesStorage = () => {
  const key = 'niaefeup-tts.courses'
  const initialValue = []
  try {
    if (isStorageValid(key, 7)) {
      const courses: CheckedCourse[][] = JSON.parse(localStorage.getItem(key))
      return courses
    } else {
      return []
    }
  } catch (error) {
    console.warn(error)
    return initialValue
  }
}

const setCoursesStorage = (courses: CheckedCourse[][]) => {
  const key = 'niaefeup-tts.courses'
  writeStorage(key, courses)
}

const StorageAPI = {
  getCoursesStorage,
  setCoursesStorage,
}

export default StorageAPI

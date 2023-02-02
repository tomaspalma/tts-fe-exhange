import { MultipleOptions } from '../@types'
import { getCourseTeachers } from '../utils'


const INITIAL_VALUE = { index: 0, selected: [], options: [], names: Array.from({ length: 10 }, (_, i) => `Horário ${i + 1}`), teachers: [], filteredTeachers: [] }

const isStorageValid = (key: string, daysElapsed: number) => {
  const stored = JSON.parse(localStorage.getItem(key))
  const storedFetchDate = JSON.parse(localStorage.getItem(key + '.fetch-date'))

  if (storedFetchDate === null) return false

  const savedTime = new Date(storedFetchDate).getTime()
  const expiredStorage = Math.abs(new Date().getTime() - savedTime) / 36e5 > 24 * daysElapsed

  return stored !== null && savedTime !== null && !expiredStorage
}

const writeStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
  localStorage.setItem(key + '.fetch-date', JSON.stringify(new Date()))
}

const writeStorageInvalid = (key: string, INITIAL_VALUE?: any) => {
  localStorage.setItem(key, JSON.stringify(INITIAL_VALUE))
  localStorage.setItem(key + '.fetch-date', null)
}

const getOptionsStorage = (): MultipleOptions => {
  const key = 'niaefeup-tts.options'
  try {
    if (isStorageValid(key, 7)) {
      const courseOptions: MultipleOptions = JSON.parse(localStorage.getItem(key))
      // For older files (which don't have the attribute 'names')
      if (courseOptions.names === undefined) courseOptions.names = INITIAL_VALUE.names

      for (let i = 0; i < courseOptions.options.length; i++) {
        for (let j = 0; j < courseOptions.options[i].length; j++) {
          if (courseOptions.options[i][j].teachers === undefined) {
            courseOptions.options[i][j].teachers = getCourseTeachers(courseOptions.options[i][j])
          }
          if (courseOptions.options[i][j].filteredTeachers === undefined) {
            courseOptions.options[i][j].filteredTeachers = getCourseTeachers(courseOptions.options[i][j])
          }
        }
      }

      for (let i = 0; i < courseOptions.selected.length; i++) {
          if (courseOptions.selected[i].teachers === undefined) {
            courseOptions.selected[i].teachers = getCourseTeachers(courseOptions.selected[i])
          }
          if (courseOptions.selected[i].filteredTeachers === undefined) {
            courseOptions.selected[i].filteredTeachers = getCourseTeachers(courseOptions.selected[i])
          }
      }

      

      return courseOptions

    } else {
      writeStorageInvalid(key, INITIAL_VALUE)
      return INITIAL_VALUE
    }
  } catch (error) {
    console.warn(error)
    return INITIAL_VALUE
  }
}

const setOptionsStorage = (courseOptions: MultipleOptions): void => {
  const key = 'niaefeup-tts.options'
  writeStorage(key, courseOptions)
}

const deleteOptionsStorage = (): void => {
  const key = 'niaefeup-tts.options'
  writeStorageInvalid(key, INITIAL_VALUE)
}

const StorageAPI = {
  getOptionsStorage,
  setOptionsStorage,
  deleteOptionsStorage,
}

export default StorageAPI

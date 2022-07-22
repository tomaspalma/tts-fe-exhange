import { CourseSchedule, Lesson, LessonBoxRef } from '../@types'

const minHour = 8
const maxHour = 23
const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

// FIXME: backend has to replace unwanted types (basically the ones not in this list)
const lessonTypes = ['T', 'TP', 'PL', 'OT', 'L', 'P', 'TC', 'S']

const getDisplayDate = () => {
  const date = new Date()
  return `${dayNames[date.getDay()]}, ${date.getDate() + 1} ${monthNames[date.getMonth()]}`
}

const getSemester = () => {
  //jan-jul --> 2º Semestre
  const date = new Date()
  const month = date.getMonth()

  return month >= 0 && month <= 6 ? '2ºS' : '1ºS'
}

const getSchoolYear = () => {
  const date = new Date()
  const month = date.getMonth()
  const year = date.getFullYear()

  return month >= 0 && month <= 6
    ? `${year - 1}/${year.toString().slice(2, 4)}`
    : `${year}/${(year + 1).toString().slice(2, 4)}`
}

const convertWeekday = (dayNumber: number) => {
  if (dayNumber < 1 || dayNumber > 8) return null

  const weekdays = ['2ªf', '3ªf', '4ªf', '5ªf', '6ªf', 'Sab', 'Dom']
  return weekdays[dayNumber - 1]
}

const convertWeekdayLong = (dayNumber: number) => {
  if (dayNumber < 1 || dayNumber > 8) return null

  const weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
  return weekdays[dayNumber - 1]
}

const convertHour = (hourNumber: string) => {
  if (parseFloat(hourNumber) < 0 || parseFloat(hourNumber) > 24) return null

  const split = hourNumber.split('.')
  const hour = split[0].padStart(2, '0')
  const minutes = split[1] === '0' || !split[1] ? '00' : '30'

  return `${hour}:${minutes}`
}

const timesCollide = (first: CourseSchedule, second: CourseSchedule) => {
  if (first.day !== second.day) return false
  return second.start_time < first.start_time + first.duration
}

const getScheduleOptionDisplayText = (option: CourseSchedule | null) => {
  const className = option.class_name !== null ? option.class_name : option.composed_class_name
  return [className, option.teacher_acronym, convertWeekday(option.day), getLessonBoxTime(option)].join(', ')
}

const getLessonBoxTime = (schedule: CourseSchedule) => {
  console.log(`${schedule.class_name} = start_time: ${schedule.start_time}; duration: ${schedule.duration};converted_start_hour: ${convertHour(schedule.start_time)} ; convert_finished_hour: ${convertHour(addHour(schedule.start_time, schedule.duration))}`); 
  console.log(`${schedule.start_time} + ${schedule.duration} = ${addHour(schedule.start_time, schedule.duration)}`)
  return [convertHour(schedule.start_time), convertHour(addHour(schedule.start_time, schedule.duration))].join('-')
}

const addHour = (hour1: string, hour2: string) : string => {
  return (parseFloat(hour1) + parseFloat(hour2)).toString()
}

const getLessonBoxStyles = (lesson: Lesson, maxHour: number, minHour: number) => {
  const step = (maxHour - minHour) * 2
  const top = (parseFloat(lesson.schedule.start_time) - minHour) * 2
  const length = parseFloat(lesson.schedule.duration) * 2

  return {
    top: `${(top * 100) / step}%`,
    left: `${((lesson.schedule.day) * 100) / 6}%`,
    height: `${length * (100 / step)}%`,
  }
}

const getLessonBoxName = (lessonBoxRef: LessonBoxRef, prefix?: string): string => {
  const tokens: string[] = ['lesson', lessonBoxRef.type, lessonBoxRef.acronym, lessonBoxRef.id.toString()]
  return prefix ? [prefix, tokens].flat().join('-') : tokens.join('-')
}

const getLessonTypeLongName = (type: string) => {
  switch (type) {
    case 'T':
      return 'Aula Teórica'

    case 'P':
      return 'Aula Prática'

    case 'TP':
      return 'Aula Teórico-Prática'

    case 'L':
      return 'Aula de Laboratório'

    case 'S':
      return 'Seminário'

    case 'TC':
      return 'Teórica de Campo'

    case 'PL':
      return 'Aula Prática Laboratorial'

    case 'OT':
      return 'Aula de Orientação'

    default:
      return 'Aula'
  }
}

const getClassTypeClassName = (type: string) => {
  switch (type) {
    case 'T':
      return 'schedule-class-t'

    case 'P':
    case 'TP':
      return 'schedule-class-tp'

    case 'L':
    case 'S':
    case 'TC':
    case 'PL':
      return 'schedule-class-pl'

    case 'OT':
      return 'schedule-class-ot'

    default:
      return 'schedule-class-default'
  }
}

export {
  minHour,
  maxHour,
  lessonTypes,
  dayNames,
  monthNames,
  getDisplayDate,
  getSemester,
  getSchoolYear,
  convertWeekday,
  convertWeekdayLong,
  convertHour,
  timesCollide,
  getScheduleOptionDisplayText,
  getLessonBoxTime,
  getLessonBoxStyles,
  getLessonBoxName,
  getClassTypeClassName,
  getLessonTypeLongName,
}

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export const getDisplayDate = () => {
  const date = new Date()
  return `${dayNames[date.getDay()]}, ${date.getDate() + 1} ${monthNames[date.getMonth()]}`
}

export const getSemester = () => {
  //jan-jul --> 2º Semestre
  const date = new Date()
  const month = date.getMonth()

  return month >= 0 && month <= 6 ? '2ºS' : '1ºS'
}

export const getSchoolYear = () => {
  const date = new Date()
  const month = date.getMonth()
  const year = date.getFullYear()

  return month >= 0 && month <= 6
    ? `${year - 1}/${year.toString().slice(2, 4)}`
    : `${year}/${(year + 1).toString().slice(2, 4)}`
}

/*
export const ucs = [
  {
    id: 1,
    acronym: 'COMP',
    name: 'Compiladores',
    weekday: 'Sexta',
    time: '11:30-12:30',
    room: 'B112',
    teacher: 'TDRC',
    class: '3MIEIC01',
  },
  {
    id: 2,
    acronym: 'SDIS',
    name: 'Sistemas Distribuídos',
    weekday: 'Segunda',
    time: '14:30-16:30',
    room: 'B301',
    teacher: 'RGR',
    class: '3MIEIC04',
  },
  {
    id: 3,
    acronym: 'LBAW',
    name: 'Laboratório de Bases de Dados e Aplicações Web',
    weekday: 'Segunda',
    time: '09:00-12:00',
    room: 'B314',
    teacher: 'JCL',
    class: '3MIEIC01',
  },
  {
    id: 4,
    acronym: 'PPIN',
    name: 'Proficiência Pessoal e Interpessoal',
    weekday: 'Quinta',
    time: '10:30-12:30',
    room: 'B107',
    teacher: 'MFT',
    class: '3MIEIC05',
  },
  {
    id: 5,
    acronym: 'IART',
    name: 'Inteligência Artificial',
    weekday: 'Terça',
    time: '11:30-12:30',
    room: 'B105',
    teacher: 'HLC',
    class: '3MIEIC02',
  },
]
*/

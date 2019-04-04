import Request from '../../utils/request'

export const wordsClass = data => Request({
  url: '/api/wordsClass',
  method: 'POST',
  data,
})

export const getDetail = data => Request({
  url: '/api/detail',
  method: 'GET',
  data,
})

export const getSetting = data => Request({
  url: '/api/wx/setting',
  method: 'GET',
  data,
})
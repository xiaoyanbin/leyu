import Request from '../../utils/request'

export const getDetail = data => Request({
  url: '/api/detail',
  method: 'GET',
  data,
})

export const article = data => Request({
  url: '/api/article',
  method: 'GET',
  data,
})
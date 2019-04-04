import Request from '../../utils/request'

export const wordsClass = data => Request({
  url: '/api/wordsClass',
  method: 'POST',
  data,
})

export const articleCate = data => Request({
  url: '/api/articleCate',
  method: 'GET',
  data,
})
import Request from '../../utils/request'

export const getDetail = data => Request({
  url: '/api/detail',
  method: 'GET',
  data,
})

export const updateCollectnum = data => Request({
  url: '/api/article/updateCollectnum',
  method: 'GET',
  data,
})
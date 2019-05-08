import Request from '../../utils/request'

export const listarticle = data => Request({
  url: '/api/article/listarticle',
  method: 'GET',
  data,
})



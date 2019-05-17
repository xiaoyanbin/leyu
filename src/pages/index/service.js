import Request from '../../utils/request'

export const homepage = data => Request({
  url: '/homepage-v3',
  method: 'GET',
  data,
})

export const product = data => Request({
  url: '/product/filter',
  method: 'GET',
  data,
})

export const article = data => Request({
  url: '/api/article',
  method: 'GET',
  data,
})
export const poetrylist = data => Request({
  url: '/api/article',
  method: 'GET',
  data,
})

export const findCateIdMoreArticle = data => Request({
  url: '/api/article/findCateIdMoreArticle',
  method: 'GET',
  data,
})
export const getCode = data => Request({
  url: '/api/article/getCode',
  method: 'GET',
  data,
})


export const getSetting = data => Request({
  url: '/api/wx/setting',
  method: 'GET',
  data,
})
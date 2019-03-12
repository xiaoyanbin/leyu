import Request from '../../utils/request';

export const homepage = data => Request({
  url: '/homepage-v3',
  method: 'GET',
  data,
});

export const product = data => Request({
  url: '/product/filter',
  method: 'GET',
  data,
});

export const article = data => Request({
  url: '/api/article?pid=5c721e90d2660b78319b47f7',
  method: 'GET',
  data,
});
export const poetrylist = data => Request({
  url: '/api/article',
  method: 'GET',
  data,
});

export const baidu = data => Request({
  url: '/api/baidu',
  method: 'POST',
  data,
});
export const focus = data => Request({
  url: '/api/focus',
  method: 'POST',
  data,
});
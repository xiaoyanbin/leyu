import Request from '../../utils/request';

export const wordsClass = data => Request({
  url: '/api/wordsClass',
  method: 'POST',
  data,
});

export const article = data => Request({
  url: '/api/article',
  method: 'GET',
  data,
});
import Request from '../../utils/request';

export const words = data => Request({
  url: '/api/words/words',
  method: 'GET',
  data,
});
export const index = data => Request({
  url: '/api/words/index',
  method: 'GET',
  data,
});
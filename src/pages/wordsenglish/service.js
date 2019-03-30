import Request from '../../utils/request';

export const getDetail = data => Request({
  url: '/api/detail',
  method: 'GET',
  data,
});

export const getSetting = data => Request({
  url: '/api/wx/setting',
  method: 'GET',
  data,
});

export const words = data => Request({
  url: '/api/words/words',
  method: 'GET',
  data,
});
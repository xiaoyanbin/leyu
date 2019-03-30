import Request from '../../utils/request';

export const words = data => Request({
  url: '/api/words/words',
  method: 'GET',
  data,
});

export const getSetting = data => Request({
  url: '/api/wx/setting',
  method: 'GET',
  data,
});
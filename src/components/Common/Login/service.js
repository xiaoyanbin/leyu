import Request from '../../../utils/request';

export const wxlogin = data => Request({
  url: '/api/user/login',
  method: 'GET',
  data,
});
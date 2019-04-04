import Request from '../../utils/request'

export const doRegister = data => Request({
  url: '/api/user/doRegister',
  method: 'POST',
  data,
})

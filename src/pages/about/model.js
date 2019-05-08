import * as details from './service'

export default {
  namespace: 'detail',
  state: {
    id:'5c401e1396dda611ec7316ba',
    detail: [],

  },
  effects: {
    * detail(_, {call, put, select}) {
      const { id } = yield select(state => state.detail)
      console.log(id)
      const { status, data } = yield call(details.getDetail, {
        id:id
      })
      
      if (status === 'ok') {
        yield put({ type: 'save',payload: {
          detail: data.list,
        } })
      }
    }
  },
  
  reducers: {
    save(state, { payload }) {
      return {...state, ...payload}
    },
  },
}

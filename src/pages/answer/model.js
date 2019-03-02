import * as answer from './service';

export default {
  namespace: 'answer',
  state: {
    list:[],
  },
  effects: {
    load(_, {call, put}) {
      const { list } = state;
      console.log(list)

    }
  },
  
  reducers: {
    save(state, { payload }) {
      return {...state, ...payload};
    },
  },
};

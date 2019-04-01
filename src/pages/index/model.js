import * as homeApi from './service';
import dva from '../../utils/dva';
export default {
  namespace: 'home',
  state: {
    banner: [],
    brands: [],
    products_list: [],
    page: 1,
    list:[],
    poetryList:[],
    pid:'',
  },
  effects: {
    * load(_, {call, put}) {
      const { status, data } = yield call(homeApi.homepage, {});
      
      if (status === 'ok') {
        yield put({ type: 'save',payload: {
          banner: data.banner,
          brands: data.brands
        } });
      }
    },
    * product(_, {call, put, select}) {
      const { page, products_list } = yield select(state => state.home);
      const { status, data } = yield call(homeApi.product, {
        page,
        mode: 1,
        type: 0,
        filter: 'sort:recomm|c:330602',
      });
      if (status === 'ok') {
        yield put({ type: 'save',payload: {
          products_list: page > 1 ? [...products_list,...data.rows] : data.rows,
        } });
      }
    },
    * poetrylist(_, {call, put, select}) {
       
      const { pid } = yield select(state => state.home);  
      const { status, data } = yield call(homeApi.poetrylist, {pid:pid
      });
      if (status === 'ok') {
        yield put({ type: 'save',payload: {
          poetryList: data.list,
        } });
      }
    },
    * article(_, {call, put, select}) {
      const { status, data } = yield call(homeApi.article, {
      });
      
      if (status === 'ok') {
        yield put({ type: 'save',payload: {
          list: data.list,
        } });
      }
    },
    * focus(_, {call, put, select}) {
      const { status, data } = yield call(homeApi.focus, {
      });
      if (status === 'ok') {
        yield put({ type: 'save',payload: {
          banner: data,
        } });
      }
    }
  },
  
  reducers: {
    // save(state, { payload }) {
    //   return {...state, ...payload};
    // },
    save(state, { payload: data }) {
      return { ...state, ...data };
    },
  },
};

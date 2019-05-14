import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import dva from './utils/dva'
import Index from './pages/index'
import models from './models'
import configStore from './store'

//import 'taro-ui/dist/style/index.scss' 
import './styles/base.scss'


// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();
//const store = configStore()

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/collect/index',
      'pages/list/index',
      'pages/user/index',
      'pages/detail/index',
      'pages/about/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      backgroundTextStyle: 'dark',
      enablePullDownRefresh: true,
    },
    
    tabBar: {
      "color": "#a6a6a6",
      "selectedColor":"#030303",
      list: [{
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './images/tab/1_1.png',
        selectedIconPath: './images/tab/1.png'
      },{
        pagePath: 'pages/about/index',
        text: '关于',
        iconPath: './images/tab/2_1.png',
        selectedIconPath: './images/tab/2.png'
      },{
        pagePath: 'pages/user/index',
        text: '我的',
        iconPath: './images/tab/3_1.png',
        selectedIconPath: './images/tab/3.png'
      }],
      backgroundColor: '#fff',
      borderStyle: 'white'
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

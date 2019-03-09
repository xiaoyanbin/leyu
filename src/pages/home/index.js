import Taro, { Component } from '@tarojs/taro'
import { View, Button,Form,Input, Text,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import MySwiper from '../../components/MySwiper'
import GoodsList from '../../components/GoodsList'
import Top from '../../components/Top'
import './index.scss'

@connect(({ home ,detail}) => ({
  ...home,
  ...detail,
}))
class home extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
      info:[],
    }
  }
  handleClick (value) {
    this.setState({
      current: value
    })
  }
  gotoDetail (e) {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${e.currentTarget.dataset.id}`,
    })
  }
  toUrl () {
    Taro.navigateTo({
      url: `/pages/plist/index?pid=5bcee18b3263442e3419080e`,
    })
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentWillUnmount () {
        
  }
  componentDidShow () { 
  }
  componentDidMount = () => {
    this.props.dispatch({
      type: 'home/article',
    });
    this.props.dispatch({
      type: 'home/focus',
    });


  }
  toEnglish (a) {
    console.log(a,111)
    return 
    Taro.navigateTo({
      url: `/pages/english/index`,
    })
  }
  componentDidHide () { }
  render () {
    const { banner,list } = this.props;
    return (
      <View className="home-page">
      <MySwiper banner={banner} home />
      <Top />
      <View className="index_text" onClick={this.toEnglish.bind(this)}>答题</View>
      <GoodsList list={list} loading="" ontoEnglish={this.toEnglish}/>
      </View>
    )
  }
}

export default home

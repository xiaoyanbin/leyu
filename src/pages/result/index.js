import Taro, { Component } from '@tarojs/taro'
import { View, Button,Image,Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as baiduApi from './service'
import { webUrl } from '../../config'
import './index.scss'
@connect(({ home ,detail}) => ({
  ...home,
}))

class result extends Component {
  config = {
    navigationBarTitleText: '完成'
  }
  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
      answerList:[],
    }
  }
  toUrl (data) {
    Taro.navigateTo({
      url: data,
    })
  }
  toIndex () {
    Taro.navigateTo({
      url: `/pages/home/index`,
    })
  }
  componentWillReceiveProps (nextProps) {
  }
  componentWillUnmount () {
  }

  componentDidShow () { 

  }
  componentDidMount = () => {
    // this.setState({
    //   articleId: this.$router.params.id,
    // })
    
    // Taro.setStorage({
    //   key: 'answerlist',
    //   data: 123456  
    // }) 
    try {
      const res = wx.getStorageSync('answerList') || localStorage.getItem('answerList')
      this.setState({
        answerList: res
      })
    } catch (e) {
       var b =JSON.parse(localStorage.getItem('answerList'))
        this.setState({
          answerList: b.data
        },()=>{
          console.log(this.state.answerList)
        })
      
      // Do something when catch error
    }
  

  //   Taro.getStorageInfo()
  //    .then(res => console.log(res.keys))
  }
  componentDidHide () { }
  render () {
    const { current,answerList } = this.state;
    return (
      <View className="home-page">

          <View className="complete">
           <View className="complete_tit">完成了</View>
           <View className="complete_img on">
             <View className="ioncimg ionc1"></View>
           </View>

            <View className="complete_text">
            
                <View className="span">正确率:{answerList.right} /{answerList.num}</View>
                
            </View> 
            <View className="chaoyu">超越:{answerList.do}%的对手 </View>
            <View className="complete_time">用时: {answerList.time}s</View>
           <View className="complete_btn" onClick={this.toUrl.bind(this,answerList.toUrl)} >回到答题页</View>
           <View className="complete_btn" onClick={this.toIndex.bind(this)}>回到首页</View>
          </View>
      </View>
    )
  }
}

export default result

import Taro, { Component } from '@tarojs/taro'
import { View, Button,Image,Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as wordsApi from './service'
import { AtSlider } from 'taro-ui'
import './index.scss'
@connect(({ home}) => ({
  ...home,
}))

class answerlist extends Component {
  config = {
    navigationBarTitleText: '数算选择'
  }
  constructor() {
    super(...arguments)
    this.state = {
      pid: 0,
      list:[],
      typeName:'',
      value:30,
      num:20,
      difficulty:2,
      qNum:10,
    }

  }
  async getwords (query) {
    //获取文章详情
    console.log(query)
    const res = await wordsApi.index(query)
    if (res.status == 'ok') {
      this.setState({
          list: res.data,
     },()=>{
        //this.getpoetry()
      })
    }
  }  
  goDetail(d){
    Taro.navigateTo({
        url: `/pages/word/index?book=${d.book}&book_level=${d.book_level}&count=${d.count}`,
    })
    
  }
  getClipboard(){
      Taro.getClipboardData({
        success(res) {
          console.log(res.data) // data
        }
      })
  }
  onChange(event){
      this.setState({
         difficulty: event.value,
      })
  }
  onChangeNum(event){
    // difficulty
      this.setState({
          num: event.value,
      })
   }
   onChangeqNum(event){
      this.setState({
          qNum: event.value,
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
    let query =  this.$router.params
    console.log(query)
    query.book ? query.book : query.book ='《小学英语》'
    this.getwords(query)

  }
  componentDidHide () { }
  render () {
    const { list,pid,value, num,difficulty,qNum} = this.state
    return (
      <View className='home-page'>
         {/* <View className='slider'>
            <View className='slider_left'>
              数值：
            </View>
            <View className='slider_mid'>
            <AtSlider step={1} value={num} min={3} onChange={this.onChangeNum.bind(this)} onChanging={this.onChangeNum.bind(this)}></AtSlider>
            </View>
            <View className='slider_right'>
              {num}
            </View>
            <View className='slider_left'>
              难度：
            </View>
            <View className='slider_mid'>
            <AtSlider step={1} value={difficulty} min={1}  max={3} onChange={this.onChange.bind(this)} onChanging={this.onChange.bind(this)}></AtSlider>
            </View>
            <View className='slider_right'>
              {difficulty}
            </View>
            <View className='slider_left'>
              题数：
            </View>
            <View className='slider_mid'>
            <AtSlider step={1} value={qNum} min={5} max={30} onChange={this.onChangeqNum.bind(this)} onChanging={this.onChangeqNum.bind(this)}  ></AtSlider>
            </View>
            <View className='slider_right'>
              {qNum} 
            </View>
         </View> */}
     
     
        <View className='catelist'>
          {list.map((item,index) => (
            <View key={index} className='list' onClick={this.goDetail.bind(this,item)} >{item.book_level} <View className='count'>({item.count})</View></View>
          ))} 
        </View>
      </View>
    )
  }
}

export default answerlist

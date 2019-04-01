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
    super(...arguments);
    this.state = {
      pid: 0,
      list:[],
      typeName:'',
      value:30,
      num:20,
      difficulty:2,
      qNum:10,
      checkpoint:[],
      book_level:'',
    }

  }
  async getwords (query) {
    //获取文章详情
    const res = await wordsApi.words(query);
    if (res.status == 'ok') {
      this.setState({
          list: res.data,
     },()=>{
        //this.getpoetry()
      })
    }
  }  
  goDetail(d,m){
    const { book,book_level } = this.state

    Taro.navigateTo({
        url: `/pages/${m}/index?book=${book}&book_level=${book_level}&setoff=${d.setoff}`,
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
      let count = this.$router.params.count
      let num =  Math.ceil(parseInt(count)/20)
      let checkpoint = [];
      for(let i =0;i<num;i++){
        checkpoint.push({customs:`第${i+1}关`,setoff:i*20})
      }
      console.log(checkpoint,num)
      this.setState({
        book: this.$router.params.book,
        count: this.$router.params.count,
        book_level: this.$router.params.book_level,
        checkpoint: checkpoint,
      },()=>{
        
      })
   // this.getwords()

  };
  componentDidHide () { }
  render () {
    const { checkpoint } = this.state;
    return (
      <View className="home-page">
        <View className="catelist">
          {checkpoint.map((item,index) => (
            <View key={index} className="list" >{item.customs} <View className="count"  onClick={this.goDetail.bind(this,item,'wordcard')}>(练习)</View> <View className="count"  onClick={this.goDetail.bind(this,item,'wordsenglish')}>(测试)</View></View>
          ))} 
        </View>
      </View>
    )
  }
}

export default answerlist

import Taro, { Component } from '@tarojs/taro'
import { View, Button,Image,Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'
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
      list:[{'title':'加法运算','type':'plus'},{'title':'减法运算','type':'minus'},{'title':'加减运算','type':'mp'},{'title':'乘法运算','type':'ride'},{'title':'除法运算','type':'except'},{'title':'乘除运算','type':'re'},{'title':'综合运算','type':'mpre'}],
      typeName:'',
      value:30,
      num:20,
      difficulty:2,
      qNum:10,
    }

  }
  async getArticleCate (cateId) {
    //获取文章详情
    const res = await articleApi.article({
      pid: cateId
    });
    if (res.status == 'ok') {
      this.setState({
          list: res.data.list,
     },()=>{
        //this.getpoetry()
      })
    }
  }  
  goDetail(d){
    const { num, qNum, difficulty } = this.state
    Taro.navigateTo({
        url: `/pages/answer/index?num=${num}&difficulty=${difficulty}&qNum=${qNum}&type=${d}`,
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
    this.setState({
      pid: this.$router.params.pid,
      typeName: this.$router.params.typeName,
    })
   // this.getArticleCate(this.$router.params.pid)

  };
  componentDidHide () { }
  render () {
    const { list,pid,value, num,difficulty,qNum} = this.state;
    return (
      <View className='home-page'>
         <View className='slider'>
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
         </View>
        <View className='catelist'>
          {list.map((item,index) => (
            <View key={index} className='list' onClick={this.goDetail.bind(this,item.type)} >{num}以内{item.title}{qNum} 题练习</View>
          ))} 
        </View>
      </View>
    )
  }
}

export default answerlist

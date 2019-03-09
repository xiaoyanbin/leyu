import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Swiper, SwiperItem, MovableArea, MovableView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as detailApi from './service'
import { webUrl } from '../../config'
import './index.scss'
const innerAudioContext = Taro.createInnerAudioContext()
const RecorderManager = Taro.getRecorderManager()
@connect(({ home ,detail}) => ({
  ...home,
}))

class Card extends Component {
  config = {
    navigationBarTitleText: '卡片'
  }
  constructor() {
    super(...arguments);
    this.state = {
      articleId: '',
      detail:[],
      dataList:[],
      tempFilePath:'',
      home:true,
      card:{}
    }

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
      articleId: this.$router.params.id || '5c7775bbd2660b78319b47fd',
    },()=>{
      this.getArticleInfo(this.state.articleId)
    })
    

  };
  componentDidHide () { }
  async getArticleInfo (articleId) {
    //获取文章详情
    const res = await detailApi.getDetail({
      id: articleId,
    });
    var column = this.state.column;
    if (res.status == 'ok') {
      const data = JSON.parse(res.data.list.description)
      this.setState({
          detail: res.data.list,
          dataList: data,
          card:data[0]
      },()=>{
        this.init()
      })
    }
  }  
  init(){
         this.onPlayAudio(this.state.card.audio)
  }
  onPlayAudio(data) {
    console.log(data)
    innerAudioContext.src=data
    innerAudioContext.loop=false
    innerAudioContext.obeyMuteSwitch =false
    innerAudioContext.onPlay((res)=>{
         
    })
    innerAudioContext.onEnded((res)=>{
       
    }) 
    innerAudioContext.play()
  }
  onStartRecorder(){
      const options = {
        duration: 10000,//指定录音的时长，单位 ms
        sampleRate: 16000,//采样率
        numberOfChannels: 1,//录音通道数
        encodeBitRate: 96000,//编码码率
        format: 'mp3',//音频格式，有效值 aac/mp3
        frameSize: 50,//指定帧大小，单位 KB
      }
      RecorderManager.start(options)
      RecorderManager.onStart(()=>{
          console.log(111)
      })
      RecorderManager.onResume((res)=>{
            console.log(res,222)
      })
      RecorderManager.onPause((res)=>{
        console.log(333)
      })
      RecorderManager.onStop((res)=>{
            this.setState({tempFilePath : res.tempFilePath})
      })
      RecorderManager.onError((res)=>{
        console.log(res,444)
      })
  }
  onPauseRecorder(){
    RecorderManager.pause()
    RecorderManager.onPause((res)=>{
      console.log(3)
    })  
    RecorderManager.onStop((res)=>{
      this.setState({tempFilePath : res.tempFilePath},()=>{
           this.playAudio(this.state.tempFilePath) 
      })
    })
  }
  onStopRecorder(){
    RecorderManager.stop()

  } 
  onResumeRecorder(){
     RecorderManager.resume()
  }
  onScrolltoupper(){
       console.log(111)
  }
  onScroll(){
  }
  onUpData(item){
     this.setState({
       card:item
     },()=>{
      this.onPlayAudio(item.audio)
     })
  }
  render () {
    const { dataList,detail} = this.state;
    return (
      <View className="card-page">
      <ScrollView
            className='scrollview'
            scrollY
            scrollWithAnimation
            scrollLeft="0"
            style='height: 100%; width:120px'
            lowerThreshold='20'
            upperThreshold='20'
            onScrolltoupper={this.onScrolltoupper}
            onScroll={this.onScroll}>
              { dataList.map((item, index) => (
                <View className={"card-li " +(card.title==item.title ? 'nav' : '')} key={index}>
                  <Image  onClick={this.onUpData.bind(this,item)}  mode="widthFix" src={item.imgUrl}></Image>     
                  <View>{item.title}</View>
                </View>
             ))}
        </ScrollView>
        <View className="card-right" onClick={this.onPlayAudio.bind(this,card.audio)} >
            <Image   mode="widthFix" src={card.imgUrl}></Image>     
            <View className="card-right-text"> <View className="con_img"></View>  {card.title}</View>
        </View>
       

      </View>
    )
  }
}

export default Card

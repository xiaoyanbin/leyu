import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Swiper, SwiperItem, MovableArea, MovableView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as detailApi from './service'
import { webUrl } from '../../config'
import { AtToast , AtCountdown,AtProgress } from "taro-ui"
import './index.scss'
const innerAudioContext = Taro.createInnerAudioContext()
const RecorderManager = Taro.getRecorderManager()


@connect(({ home ,detail}) => ({
  ...home,
}))

class Movable extends Component {
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
      card:{"title":" "},
      playtext:{"text":"录音","status":1},
      isPlay:true,
      isOpened:false,
      text:'',
      duration:500,
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
    innerAudioContext.src=data
    innerAudioContext.loop=false
    innerAudioContext.obeyMuteSwitch =false
    innerAudioContext.onPlay((res)=>{
       this.setState({
        isplay:true
       })
    })
    innerAudioContext.onEnded((res)=>{
       this.setState({
        isplay:false
       })  
    }) 
    innerAudioContext.play()
  }
  onRecorder(data){
         if(data==1){
           this.setState({
            playtext:{"text":"暂停","status":2}
           })
           this.onStartRecorder()
         } else if(data==2){
            this.setState({
              playtext:{"text":"录音","status":1}
            })
            this.onStopRecorder()
         }
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
        console.log(335)
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
    RecorderManager.onStop((res)=>{
      console.log(336)
          this.setState({tempFilePath : res.tempFilePath})
    })
  } 
  onResumeRecorder(){
     RecorderManager.resume()
  }
  onScrolltoupper(){
       console.log(111)
  }
  onScroll(){
  }
  close(){
    this.setState({
      isOpened:false,
      text:'',
      duration:500,
    })
  }
  onPlayRecorder(data){
      if(!data){
        this.setState({
          isOpened:true,
          text:'请您先录音',
          duration:500,
        })
        return
      }
      this.onPlayAudio(data)
  }
  onUpData(item){
     this.setState({
       card:item
     },()=>{
      this.onPlayAudio(item.audio)
     })
  }
  render () {
    const { dataList,detail,playtext,tempFilePath,isplay,card} = this.state;
    return (
      <View className="card-page">

      <MovableArea className="card-page">

      <MovableView className="card-right" >
        <View className="card-right-img"> 
            <Image  onClick={this.onPlayAudio.bind(this,card.audio)} mode="widthFix" src={card.imgUrl}></Image>    
           </View>
            <View className="card-right-text"> 
        
              <View className={"con_img " +(isplay ? 'play' : '')} onClick={this.onPlayAudio.bind(this,card.audio)}></View>
              {card.title}
            </View>
       </MovableView>
       
      { dataList.map((item, index) => (
                <MovableView direction='all' className={"card-li " +(card.title==item.title ? 'nav' : '')} key={index}>
                  <Image  onClick={this.onUpData.bind(this,item)}  mode="widthFix" src={item.imgUrl}></Image>  
                  <View>{item.title}</View>   
                </MovableView>
             ))}
        
      </MovableArea>

    

            

       

      </View>
    )
  }
}

export default Movable

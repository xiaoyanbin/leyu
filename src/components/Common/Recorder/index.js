import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image,Audio } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.scss';
const innerAudioContext = Taro.createInnerAudioContext()
const RecorderManager = Taro.getRecorderManager()

class Recorder extends Component {
  static propTypes ={
    coderData: PropTypes.object, 
  }
  static defaultProps = {
    coderData: {}, 
  };
  constructor() {
    super(...arguments)
    this.state = {
      card:{"title":" "},
      playtext:{"text":"录音","status":1},
      isPlay:true,
      tempFilePath:'',
    }
  }  
  componentWillReceiveProps(e){

  }
  componentDidMount(){
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
        isplay:false,
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
  onStopRecorder(){
    RecorderManager.stop()
    RecorderManager.onStop((res)=>{
          this.setState({tempFilePath : res.tempFilePath},()=>{
            this.onPlayAudio(this.state.tempFilePath) 
       })
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
  render() {
    const { coderData } = this.props;
    const { playtext} = this.state;
    return (
    <View>
      <View className={"con_lu " +(playtext.status==2 ? 'navs' : '')}  onClick={this.onRecorder.bind(this,playtext.status)}></View>
      {playtext.text}
      </View> 
    );
  }
}

export default Recorder;

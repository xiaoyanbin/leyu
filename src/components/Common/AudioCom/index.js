import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image,Audio } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.scss';

  const innerAudioContext = Taro.createInnerAudioContext()
  const RecorderManager = Taro.getRecorderManager()



class AudioCom extends Component {
  static propTypes ={
    questionOther: PropTypes.object, 
  }

  static defaultProps = {
    questionOther: {}, 
  };
  constructor() {
    super(...arguments)
    this.state = {
       isplay:false
    }
  }  
  componentWillReceiveProps(e){
     const { questionOther } = this.props
     if(questionOther!==e.questionOther){
        this.onAudioPlay(e.questionOther.audio)
     }
  }
  componentDidMount(){
  }

  onAudioPlay(data){
      try {
        innerAudioContext.src=data
        innerAudioContext.loop=false
        innerAudioContext.obeyMuteSwitch =false
        innerAudioContext.onPlay((res)=>{   
          this.setState({isplay:true})
        })
        innerAudioContext.onEnded((res)=>{ 
          console.log(222) 
          this.setState({isplay:false})
        }) 
        innerAudioContext.play()  
      } catch (error) {
        
      }


  }
  render() {
    const { questionOther } = this.props;
    const { isplay} = this.state;
    return (
    <View>
      {process.env.TARO_ENV === 'weapp' && <View className={"con_img " +(isplay ? 'play' : '')} onClick={this.onAudioPlay.bind(this,questionOther.audio)}></View>  }
      {process.env.TARO_ENV !== 'weapp' ? <Audio src={questionOther.audio} 
             controls={true} 
             autoplay={true} 
             loop={false} 
             muted={false} 
             initialTime='30'
              id='audio'/> : '' }

      </View> 
    );
  }
}

export default AudioCom;

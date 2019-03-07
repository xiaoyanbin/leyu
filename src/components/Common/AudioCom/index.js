import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image,Audio } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.scss';

class AudioCom extends Component {
  static propTypes ={
    questionOther: PropTypes.object, 
    onPlayAudio: PropTypes.func,
  }

  static defaultProps = {

  };
  nextQuestion (e) {
        //  this.nextQuestion()
  }

  render() {
    const { questionOther,onPlayAudio} = this.props;
    return (
    <View>
      {process.env.TARO_ENV === 'weapp' && <View className="con_img" onClick={onPlayAudio.bind(this,questionOther.audio)}></View>  }
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

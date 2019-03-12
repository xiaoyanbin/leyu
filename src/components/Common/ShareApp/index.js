import Taro, { Component } from '@tarojs/taro';
import { View,Button } from '@tarojs/components';
import PropTypes from 'prop-types';
import { AtIcon} from "taro-ui"
import './index.scss';

class ShareApp extends Component {
  static propTypes ={
    shareTitle: PropTypes.string, 
    shareUrl: PropTypes.string,
  }
  onShareAppMessage (res) {
    if (res.from === 'button') {
      return {
        title: res.target.dataset.title,
        path: res.target.dataset.url
      }
    }

  }
  static defaultProps = {

  };
  nextQuestion (e) {
        //  this.nextQuestion()
  }
  toUrl(e){
    Taro.navigateTo({
      url: e,
    })
  }
  render() {
    const { shareTitle,shareUrl} = this.props;
    return (
      <View className="footers">
      <View className="c-li"> 
      <Button className="share" onClick={this.toUrl.bind(this,"/pages/home/index")}>
      <AtIcon value='menu' size='20' color='#50bd3f'></AtIcon>
      <View>首页</View> 
      </Button>
      </View>
      <View className="c-li">
      <Button open-type='share' className="share" data-title={shareTitle} data-url={shareUrl}>
      <AtIcon value='share-2' size='20' color='#50bd3f'></AtIcon>
      <View>分享</View>
      </Button> 
      </View>  
      </View>
    );
  }
}

export default ShareApp;

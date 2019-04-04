import Taro, { Component } from '@tarojs/taro';
import { View,Button } from '@tarojs/components';
import PropTypes from 'prop-types';

import { AtIcon} from 'taro-ui'
import './index.scss';

class ShareRight extends Component {
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
      <View className='right'>
      <Button open-type='share' className='share1' data-title={shareTitle} data-url={shareUrl}>
      </Button>   
      </View>
    );
  }
}

export default ShareRight;

import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image,Button } from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

class BtnShare extends Component {
  static propTypes ={
    shareTitle: PropTypes.string,
    shareUrl:PropTypes.string,
    onDraw:PropTypes.func,
    draw:PropTypes.object,
  }

  static defaultProps = {
    shareTitle: '乐愚传播',
    shareUrl:'/pages/index/index',
  }
  onShareAppMessage (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: res.target.dataset.title,
      path: res.target.dataset.url
    }
  }
  onList(){
    
    this.props.ontoEnglish(123)
  }
  onclose(){
      this.props.onShareFun()
  }
  onDraws(d){
    this.props.onDraw(d)
    
  }
  render() {
    const {shareTitle, shareUrl,draw } = this.props
    return (
      <View className="share_top" onClick={this.onclose.bind(this)}>
        <View className="share_ionc">
          <View className="share_ionc_l" onClick={this.onDraws.bind(this,draw)}>
              <View className="ionc_l"></View>
              <View className="text">生成分享海报</View>
          </View>
          <View className="share_ionc_l" >
          <Button open-type='share' data-title={shareTitle} data-url={shareUrl}>
              <View  className="ionc_r" > &nbsp;&nbsp;</View>
              <View className="text">分享微信好友</View> 
          </Button>
     </View>
        </View>
      </View>
    )
  }
}

export default BtnShare

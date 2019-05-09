import Taro, { Component } from '@tarojs/taro'
import { View , Video } from '@tarojs/components'
import './index.scss'

class InImg extends Component {
  config = {
    navigationBarTitleText: ''
  }
  constructor() {
    super(...arguments)
  }

  componentDidMount = () =>   {

  }
  render () {
    const { img, link } = this.props
    return ( 
      <View>
   {link &&<Video className = 'video_info'
          src={link}
          controls={true}
          autoplay={false}
          poster={img}
          initialTime='0'
          loop={false}
          muted={false}
    /> }</View>
    )
  }
}

export default InImg
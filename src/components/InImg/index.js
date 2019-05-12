import Taro, { Component } from '@tarojs/taro'
import { View , Video } from '@tarojs/components'
import './index.scss'

class InImg extends Component {
  config = {
    navigationBarTitleText: ''
  }
  constructor() {
    super(...arguments)
    this.state={
      links:'',
    }
  }
  componentWillReceiveProps(e){
    const { link } = this.props

    if(link!==e.link){
        this.setState({
          links:e.link,
        },()=>{
        })
    }
  }
  componentDidMount = () =>   {

  }
  render () {
    const { img, link } = this.props
    const { links } = this.state
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
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
  onPlay(){
    const videoContext = Taro.createVideoContext('video')    
  }
  onEnded(){

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
          onPlay={this.onPlay}
          onEnded={this.onEnded}
    /> }</View>
    )
  }
}

export default InImg
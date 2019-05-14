import Taro, { Component } from '@tarojs/taro'
import { View , Video } from '@tarojs/components'
import './index.scss'
class SharePoster extends Component {
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
  componentDidMount = () => {

  }
  onPlay(){
  }
  onEnded(){

  }
  onClose(){

  }
  onSaveImage(){

  }
  render () {
    const { tempFilePath } = this.props
    const { links } = this.state
    return ( 
       <View className='photo' onClick={this.onClose.bind(this)} >
            <Image className='photo_img' src={tempFilePath}/> 
            <View className='photo_btn'>
                <View className='btn l' onClick={this.onSaveImage.bind(this,tempFilePath)}> 保存海报</View> 
                <View className='btn r'> 关闭</View>
            </View>
       </View>
    )
  }
}

export default SharePoster
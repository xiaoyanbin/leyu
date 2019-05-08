import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image,Button } from '@tarojs/components'
import PropTypes from 'prop-types'
import Collect from '../../components/Collect'
import './index.scss'

class Share extends Component {
  static propTypes ={
    list: PropTypes.object,
    ontoEnglish:PropTypes.func,
    pid:PropTypes.string,
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
  static defaultProps = {
    list: {},
  }
  
  gotoDetail (e,f) {
    Taro.navigateTo({
      url: `/pages/list/index?pid=${e}&name=${f}`,
    })
  }
  onList(){
    
    this.props.ontoEnglish(123)
  }
  onShare(){
    
  }
  render() {
    const { list, loading,pid } = this.props
    return (
      <View className='share-list-container'>
      <View className="left">
        <View className="title">{list.title} </View>  
        <View className="text">{list.description}/{list.keywords}</View>  
      </View>  
      <Collect record={ list } onShare={this.onShare} />
            {/* <Button open-type='share' className='share' data-title={list.title} data-url={'/pages/detail/index?id='+list.id+'&pid='+pid}>分享</Button>
        */}
    
      </View>
    )
  }
}

export default Share

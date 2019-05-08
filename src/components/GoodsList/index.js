import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

class GoodsList extends Component {
  static propTypes ={
    list: PropTypes.array,
    ontoEnglish:PropTypes.func,
  }

  static defaultProps = {
    list: [],
  }

  gotoDetail (e,f) {
    Taro.navigateTo({
      url: `/pages/list/index?pid=${e}`,
    })
  }
  onList(){
    
    this.props.ontoEnglish(123)
  }
  render() {
    const { list, loading } = this.props
    return (
      <View className='goods-list-container'>
      <View className='index_text'>精品分类</View>
        {
        list.length > 0 ? (
          <View className='goods-ul'>
            {
              list.map((item, index) => (
                <View key={item.id} className='goods-li' onClick={this.gotoDetail.bind(this,item.id,item.name)}>
                  <View className='pos'>
                    <View className='image-container'>
                      <Image  src={item.url ? item.url : ''} alt='' />
                    </View>
                  </View>
                </View>
              ))
            }
          </View>
        ) : (
          <View />
        )
      }
      {loading && (
        <View className='loadMoreGif'>
          <View className='zan-loading'></View>
          <View className='text'>加载中...</View>
        </View>
      )}
      </View>
    )
  }
}

export default GoodsList

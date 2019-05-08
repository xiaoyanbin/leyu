import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import { imgUrl } from '../../config';
import './index.scss'

class MinList extends Component {
  static propTypes ={
    list: PropTypes.array,
    ontoEnglish:PropTypes.func,
    title:PropTypes.string,
    pid:PropTypes.string,
    res:PropTypes.object,
  }

  static defaultProps = {
    list: [],
  }

  gotoDetail (e,pid) {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${e}&pid=${pid}`,
    })
  }
  onList(){
    
    this.props.ontoEnglish(123)
  }
  render() {
    const { list, loading,title,res } = this.props
    return (
      <View className='min-list-container'>
      {/* <View className='index_text' >{ title }</View> */}
        {
        list.length > 0 ? (
          <View className='goods-ul'>
            {
              list.map((item, index) => (
                <View key={index} className='goods-li' onClick={this.gotoDetail.bind(this,item._id,item.cate_id)}>
                  <View className='pos'>
                    <View className='image-container'>
                      <Image  src={item.article_img ? imgUrl+item.article_img : ''} alt='' />
                    {/* <View className="time">05:20</View> */}
                    </View>
                  </View>
                  <View className="list_right">
                    <View className='title'>{item.title} </View>
                    <View className='text'># {item.description}/ {item.keywords}</View>
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

export default MinList

import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.scss';

class GoodsList extends Component {
  static propTypes ={
    list: PropTypes.array,
    ontoEnglish:PropTypes.func,
  }

  static defaultProps = {
    list: [],
  };

  gotoDetail (e) {
    Taro.navigateTo({
      url: `/pages/radio/index?id=${e}`,
    })
  }

  render() {
    const { list, loading } = this.props;
    return (
      <View className='goods-list-container'>
        {
        list.length > 0 ? (
          <View className='goods-ul'>
            {
              list.map((item, index) => (
                <View key={item._id} className='goods-li' onClick={this.gotoDetail.bind(this,item._id)}>
                  <View className='pos'>
                    <View className='image-container'>
                      <Image  src={item.article_img ? `https://weixue.minsusuan.com${item.article_img}_400x400.jpg` : ''} alt='' />
                    </View>
                  </View>
                  <Text className='title'>{item.title}</Text>
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
    );
  }
}

export default GoodsList;

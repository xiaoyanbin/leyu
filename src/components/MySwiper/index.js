import Taro, { Component } from '@tarojs/taro'
import { Swiper, SwiperItem, Image,View } from '@tarojs/components'
import { webUrl,imgUrl } from '../../config'
import PropTypes from 'prop-types'

import './index.scss'

export default class MySwiper extends Component {
  static propTypes = {
    banner: PropTypes.array,
    home: PropTypes.bool,
  }

  static defaultProps = {
    banner: [],
    home: false
  }
  gotoDetail (e) {
    Taro.navigateTo({
      url: e,
    })
  }
  render() {
    const { banner, home } = this.props
    return (
    
      <Swiper
        className={!home ? 'swiper-container' : 'swiper'}
        circular
        indicatorDots
        indicatorColor='rgba(38,38,38,0.2)'
        indicatorActiveColor='rgba(38,38,38,1)'
        autoplay>
        { banner.map((item, index) => (
          <SwiperItem key={index}>
            <View className='swiper_div'>
             <Image onClick={this.gotoDetail.bind(this,item.link)} mode='widthFix' src={`${imgUrl+item.article_img}`}></Image>
            </View>
          </SwiperItem>
        ))}
      </Swiper>
      
    )
  }
}


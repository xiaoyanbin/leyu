import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

class MapText extends Component {
  static propTypes ={
    list: PropTypes.array,
  }

  static defaultProps = {
    list: [],
  }
  render() {
    const { list } = this.props
    return (
          <View className='poetry-ul'>
            {
              list.map((item, ind) => (
                 <View className={'poetry-li ' +(item.play ?'sele':'')}>{item.val} </View>
              ))
            }
          </View>
    )
  }
}

export default MapText

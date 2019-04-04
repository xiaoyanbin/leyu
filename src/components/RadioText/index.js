import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

class RadioText extends Component {
  static propTypes ={
    question: PropTypes.array,
    title:PropTypes.string,
    answerList:PropTypes.array,
    onQuestion:PropTypes.func,
    itemIndex:PropTypes.number,
  }

  static defaultProps = {

  }
  nextQuestion (e) {
        //  this.nextQuestion()
  }
  render() {
    const { title, question,answerList,itemIndex,onQuestion} = this.props
    return (
    <View className='content'>
        <View className='title'>
              单选题
        </View>
        <View className='con'>
        {title}
        </View>
        <View className='con_list'>
        {question.map((item,index) => (
        <View key={index} className={'con_li ' +(answerList[itemIndex].val==item.value ? 'nav' : '')} onClick={onQuestion.bind(this,item)} >
            <View className='letter'> {item.value}</View>{item.title}
        </View>
        ))}
        </View> 
      </View> 
    )
  }
}

export default RadioText

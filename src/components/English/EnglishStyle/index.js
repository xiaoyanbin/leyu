import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import AudioCom from '../../../components/Common/AudioCom'
import PropTypes from 'prop-types';

import './index.scss';

class EnglishStyle extends Component {
  static propTypes ={
    question: PropTypes.array,
    title:PropTypes.string,
    answerList:PropTypes.array,
    itemIndex:PropTypes.number,
    questionOther:PropTypes.object,
    rightAnswer:PropTypes.string,
    onQuestion:PropTypes.func,
    
  }

  static defaultProps = {

  };
  nextQuestion (e) {
        //  this.nextQuestion()
  }
  render() {
    const { title, question,answerList,questionOther,itemIndex,rightAnswer,onQuestion,onPlayAudio} = this.props;
    return (
    <View className="content">
        <View className="con">
                  <AudioCom questionOther={questionOther}  />
                  <View className="big_img"><Image  src= {questionOther.imgUrl}></Image></View>      
        </View>
        <View className="con_list">
              {question.map((item,index) => (
                <View key={index} className={"text_li " +(answerList[itemIndex].val==item.value&&rightAnswer!=answerList[itemIndex].val ? 'err ' : ' ')+(rightAnswer == item.value&&answerList[itemIndex].val ? 'right' :'')} onClick={onQuestion.bind(this,item)} >
                    <View className={rightAnswer == item.value&&answerList[itemIndex].val ? 'img_right' : ''} ></View>
                    <View className={answerList[itemIndex].val==item.value&&rightAnswer!=answerList[itemIndex].val ? 'img_err' : ''} ></View>
                     <View className={"letter"}> {item.value}</View><View>{item.title} </View>
               
                </View>
              ))}
        </View>  
      </View> 
    );
  }
}

export default EnglishStyle;

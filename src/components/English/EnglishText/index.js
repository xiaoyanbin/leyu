import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import AudioCom from '../../../components/Common/AudioCom'
import PropTypes from 'prop-types';
import './index.scss';
class EnglishText extends Component {
  static propTypes ={
    question: PropTypes.array,
    title:PropTypes.string,
    answerList:PropTypes.array,
    itemIndex:PropTypes.number,
    questionOther:PropTypes.object,
    rightAnswer:PropTypes.string,
    onQuestion:PropTypes.func,
    siteSwitch: PropTypes.string,
    
  }

  static defaultProps = {
         questionOther:{},
  };
  nextQuestion (e) {
        //  this.nextQuestion()
  }
  render() {
    const { title, question,siteSwitch,answerList,questionOther,itemIndex,rightAnswer,onQuestion,onPlayAudio} = this.props;
    return (
    <View className="content">
        <View className="con">
        {siteSwitch=="1" ? <AudioCom questionOther={questionOther}  /> : questionOther.title}   
        {/* <View onClick={onPlayAudio.bind(this,questionOther.audio)} className="con_img">
         </View>         */}
        </View>
        <View className="con_list">
              {question.map((item,index) => (
                <View key={index} className={"img_li " +(answerList[itemIndex].val==item.value&&rightAnswer!=answerList[itemIndex].val ? 'err ' : ' ')+(rightAnswer == item.value&&answerList[itemIndex].val ? 'right' :'')} onClick={onQuestion.bind(this,item)} >
                    <View className={rightAnswer == item.value&&answerList[itemIndex].val ? 'img_right' : ''} ></View>
                    <View className={answerList[itemIndex].val==item.value&&rightAnswer!=answerList[itemIndex].val ? 'img_err' : ''} ></View>
                    <Image src={item.imgUrl}></Image> 
                </View>
              ))}
        </View>  

      </View> 
    );
  }
}

export default EnglishText;

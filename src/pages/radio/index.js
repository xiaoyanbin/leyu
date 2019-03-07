import Taro, { Component } from '@tarojs/taro'
import { View, Button,Image,Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtToast , AtCountdown,AtProgress } from "taro-ui"
import * as detailApi from './service'
import RadioText from '../../components/RadioText'
import './index.scss'
@connect(({ home}) => ({
  ...home,
}))

class radio extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor() {
    super(...arguments);
    this.state = {
      pid: 0,
      current: '',
      isOpened:false,
      text:'',
      duration:500,
      seconds:15,
      itemIndex:0,        //当前题索引 
      percent:15, 
      title:'',
      dataList:[],
      dataJson:'',
      rightAnswer:'',
      question:[],
      questionNum:10,
      isRight:0,
      answerList:[],
      thisTime:0,
      rightNum:0,
      timer:null,
      detail:{},
      analysis:'',
      isanaly:false,
      card: false,
    }

  }
  isAnalysis(){
      const { isanaly } =this.state
      const an = isanaly
      this.setState({
        isanaly: !an
      })
  }
  isCard(){
    const { card } =this.state
    const an = card
    this.setState({
      card: !card
    })
} 
  async getArticleInfo (articleId) {
    //获取文章详情
    const res = await detailApi.getDetail({
      id: articleId
    });

    var column = this.state.column;
    if (res.status == 'ok') {
      const data = JSON.parse(res.data.list.description)
      this.setState({
          detail: res.data.list,
          dataList:data.data,
      },()=>{
        console.log(this.state.dataList)
        this.init(data)
      })
    }
  }  
  goDetail(data){
      Taro.navigateTo({
        url: `/pages/poetrylist/index?pid=${data}`,
      })
    
  }
  onTimeUp(){
    //this.nextQuestion({"val":""})
  }
  close(){
    this.setState({
      isOpened:false,
      text:'',
      duration:'500',
    })
  }
  init(data){
    this.listQuestion(data);

  }
  listQuestion(data){
      const { itemIndex, questionNum, dataList} = this.state
      const datas = dataList;
      //初始化答案列表
      const answerList =[]
      for(var i=0;i<datas.length;i++){
        answerList.push({"num":i,"val":""});
      }  
      this.setState({
        answerList:answerList,
        questionNum:datas.length,
      },() =>{
        this.addQuestion([...this.state.dataList][itemIndex])
      })


  }
  addQuestion(data){
    const { answerList,itemIndex } = this.state
        this.setState({
          dataJson:data,
          rightAnswer:data.question.answer,
          title:data.question.title,
          question:data.question.list,
          title:data.question.title,
          analysis:data.question.analysis,
          
        //  current:[...this.state.answerList][itemIndex].val,
        })
    }  
    //下一题
    nextQuestion(val){            
      const { current,title, rightAnswer,dataList,seconds,questionNum,answerList} = this.state;

       
      this.setState({
        current:val.value,
        isanaly:false,
      })

      if(val.value == rightAnswer){
        this.setState({
          isRight:1,
        })
      }else{
        this.setState({
          isRight:2,
        })
      }

      const itemIndex = this.state.itemIndex

      const sec = seconds===15 ? '15': 15

      const data = dataList
      if(itemIndex<data.length-1){
          var newAnswerList = answerList
          newAnswerList[itemIndex].val = val.value
          this.setState({
            itemIndex: itemIndex+1,
            percent:(itemIndex+1)*parseInt(100/data.length),
            seconds:sec,
            answerList:newAnswerList,
          },()=>{
            this.addQuestion([...dataList][this.state.itemIndex])
          })

      } else if(itemIndex==data.length-1){
        var newAnswerList = answerList
        newAnswerList[itemIndex].val = val.value
        this.setState({
          percent:100,
          isOpened:true,
          text:'答题完成',
          duration:'3000',
          answerList:newAnswerList,
        },()=>{
          this.doComplete()
        })

      } else{

      }

    }
    accuracyRate(right,question,time){
      return ((0.6*(right/question)+(right/question)*0.4*((question/time) < 1 ? (question/time) : 0.9 )).toFixed(4)*100).toFixed(2)
    }
    doComplete(){
      const { dataList,answerList,questionNum,rightNum,thisTime } = this.state
      const answer = answerList
      const data = dataList 
      var right =0
      data.forEach((d,index) => {
            data[index].question.right = answer[index].val
            if(data[index].question.answer==answer[index].val){
              right++
            }
      })
      
      
      const question = parseInt(questionNum)
      const time = thisTime
      
      const dos = this.accuracyRate(right,question,time)
      const rel ={"data":data,"num":questionNum,"right":right,"time":thisTime,"do":dos,"toUrl":"/pages/poetrylist/index?pid=5c721e90d2660b78319b47f7&typeName=radio"};
      // data.num = this.state.questionNum
      // data.right = this.state.rightNum

      this.setState({
        dataList:data,
      },() => {
        Taro.setStorage({
              key: 'answerList',
              data: rel  
        }) 
        Taro.navigateTo({
          url: `/pages/result/index`,
        })
      })

    }
    radioQuestion(data){
        this.setState({
          itemIndex:data.num,
        },()=>{
          this.addQuestion([...this.state.dataList][data.num])
        })
        

    }
    downQuestion(data){
      const { itemIndex, answerList } = this.state
      const list = answerList

      if(itemIndex<list.length){
          this.setState({
            itemIndex:data+1,
          },()=>{
            this.addQuestion([...this.state.dataList][this.state.itemIndex])
          })
      }
    }
    upQuestion(data){
      const { itemIndex } = this.state
      if(itemIndex>0){
          this.setState({
            itemIndex:data-1,
          },()=>{
            this.addQuestion([...this.state.dataList][this.state.itemIndex])
          })
      }

    }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentWillUnmount () {
    if(this.state.timer!= null) {
      clearInterval(this.state.timer)
    }
  }

  componentDidShow () { 

  }
  componentDidMount = () => {
    this.setState({
      id: this.$router.params.id,
    })
    this.getArticleInfo(this.$router.params.id)
    var time = this.state.thisTime
    this.state.timer=setInterval(() =>{
      this.setState({
        thisTime: time++,
      })
    },1000)
  // this.init();

  };
  componentDidHide () { }
  render () {
    const { question ,answerList, card,detail,isanaly, analysis,percent,seconds,current,itemIndex, isOpened, text, duration,title,thisTime} = this.state;
    return (
      <View className="container">
            {/* <AtProgress percent={percent} /> */}
            <View className="header">
              <View className="header_left">
                  <View className="title">{detail.title} </View>
                  <View className="time"> 
                  <View className="ionc1"></View>{thisTime}s </View>
              </View>
              <View className="header_right">
              <View className="answer_card"  onClick={this.isCard.bind(this)}>答题卡</View>
                    <View className="right">{itemIndex}</View> /{answerList.length}
              </View>
           </View>

           <View className="content">
              <RadioText question={question} title={title}  answerList={answerList} itemIndex={itemIndex} onQuestion={this.nextQuestion.bind(this)}/>
              
                
                {/* <View className="title">
                       单选题
               </View>
               <View className="con">
                      {title}
               </View>
               <View className="con_list">
               {question.map((item,index) => (
                 <View key={index} className={"con_li " +(answerList[itemIndex].val==item.value ? 'nav' : '')} onClick={this.nextQuestion.bind(this,item)} >
                     <View className="letter"> {item.value}</View>{item.title}
                 </View>
               ))}
              </View>    */}
              <View className="analysis" onClick={this.isAnalysis.bind(this)} >
                     答案解析>
              </View>     
              <View className={"anal " +(isanaly ? 'navs' : '')}>
                     {analysis}
              </View>             
           </View>
           <View className="bottoms">
                <View className="btn" onClick={this.upQuestion.bind(this,itemIndex)}>上一题</View>
                <View className="btn red" onClick={this.downQuestion.bind(this,itemIndex)}>下一题</View>
           </View>
           <View className={"card " +(card ? 'pro' : '')} >
              {answerList.map((item,index) => (
                <View key={index} className={"card_li " +(item.val ? 'nav' : '')} onClick={this.radioQuestion.bind(this,item)} >{index+1}</View>
              ))}
          </View>    
        <AtToast isOpened={isOpened} text={text} duration={duration} onClose={this.close.bind(this)}></AtToast>
      </View>
    )
  }
}

export default radio

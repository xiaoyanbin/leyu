import Taro, { Component } from '@tarojs/taro'
import { View, Button,Image,Audio } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtToast , AtCountdown,AtProgress } from "taro-ui"
import * as detailApi from './service'
import './index.scss'
const innerAudioContext = Taro.createInnerAudioContext()
@connect(({ home}) => ({
  ...home,
}))

class English extends Component {
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
      questionOther:'',
      dataList:[],
      dataJson:'',
      rightAnswer:'',
      question:[],
      title:'',
      questionNum:10,
      isRight:0,
      answerList:[{"val":""}],
      thisTime:0,
      rightNum:0,
      timer:null,
      detail:{},
      analysis:'',
      isanaly:false,
      card: false,
      status:true,
      isAudio:true,
    }

  }
  rendoms(min,max){
    return Math.floor(Math.random()*(max-min+1))+min
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
      const configure = [{"con":"title","itemList":"imgUrl"},{"con":"imgUrl","itemList":"title"}] 
     
      const one = new Array();
      const tow = new Array();
      const Three = new Array();
      //  data.data.forEach((item,i)=>{
      //       one[i] = item
      //       one[i].con ="title"
      //       one[i].itemList ="imgUrl"
      //       tow[i] = item
      //       tow[i].con ="imgUrl"
      //       tow[i].itemList ="title"
      //  })
     
      const result = [...data.data,...data.data]

      this.setState({
          detail: res.data.list,
          dataList: result,
      },()=>{
        this.init()
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
  init(){
    this.listQuestion();

  }
  listQuestion(){
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
          questionOther:data.question,
          analysis:data.question.analysis,
          
        //  current:[...this.state.answerList][itemIndex].val,
        },()=>{
           this.playAudio(data.question.audio)
        })
    }  
    //下一题
    nextQuestion(val){            
      const { current,title, rightAnswer,dataList,seconds,questionNum,answerList,status} = this.state;
       
      if(!status){
         return
      }
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
           // itemIndex: itemIndex+1,
            percent:(itemIndex+1)*parseInt(100/data.length),
            seconds:sec,
            answerList:newAnswerList,
            status:false,
          },()=>{
            setTimeout(() => {
              //this.addQuestion([...dataList][this.state.itemIndex]) 
              this.downQuestion(itemIndex)
            }, 500);
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
      const rel ={"data":data,"num":questionNum,"right":right,"time":thisTime,"do":dos,"toUrl":"/pages/poetrylist/index?pid=5c777570d2660b78319b47fc&typeName=english"};
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
    funError(e){
      console.log(111,e)
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
            status:true,
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
  playAudio(data){
      innerAudioContext.src=data
      innerAudioContext.loop=false
      innerAudioContext.obeyMuteSwitch =false
      innerAudioContext.onPlay((res)=>{
         
      })
      innerAudioContext.onPlay((res)=>{

      }) 
      innerAudioContext.onEnded((res)=>{
        
      }) 
      innerAudioContext.play()
  }
  componentDidMount = () => {
    this.setState({
      id: this.$router.params.id || '5c7775bbd2660b78319b47fd',
    },()=>{
      this.getArticleInfo(this.state.id)
    })


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
    const { question ,answerList, card,detail,isanaly, analysis,percent,seconds,current,questionOther,itemIndex, isOpened, text, duration,title,thisTime,rightAnswer} = this.state;
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
                    <View className="right">{itemIndex+1}</View> /{answerList.length}
              </View>
           </View>

           <View className="content">
              <View className="con">
                   <View  onClick={this.playAudio.bind(this,questionOther.audio)} className={(itemIndex<5 ? "block " : "none ")}>{questionOther.title}</View>  
                  <View onClick={this.playAudio.bind(this,questionOther.audio)} className="con_img">
                  
                  </View>
                  {/* <Audio src={questionOther.audio} controls={true} autoplay={true} loop={false} muted={false} initialTime='30' id='audio' onError={this.funError.bind(this)}/>
                     */}
                     
               
                  <View className={"big_img " +(itemIndex>=5 ? "block" : "none")} ><Image  src= {questionOther.imgUrl}></Image></View>

              </View>

              <View className="con_list">
              {question.map((item,index) => (
                <View key={index} className={(itemIndex<5 ? "img_li " : "text_li ") +(answerList[itemIndex].val==item.value&&rightAnswer!=answerList[itemIndex].val ? 'err ' : ' ')+(rightAnswer == item.value&&answerList[itemIndex].val ? 'right' :'')} onClick={this.nextQuestion.bind(this,item)} >
                    <View className={rightAnswer == item.value&&answerList[itemIndex].val ? 'img_right' : ''} ></View>
                    <View className={answerList[itemIndex].val==item.value&&rightAnswer!=answerList[itemIndex].val ? 'img_err' : ''} ></View>
                     <Image className={(itemIndex<5 ? "block " : "none ")} src={item.imgUrl}></Image>
                     
                        <View className={"letter " +(itemIndex>=5 ? "block " : "none ")}> {item.value}</View><View className={(itemIndex>=5 ? "block " : "none ")}>{item.title}</View>
                     

                </View>
              ))}
             {/* {question.map((item,index) => (
                <View key={index} className={"text_li " +(answerList[itemIndex].val==item.value&&rightAnswer!=answerList[itemIndex].val ? 'err ' : ' ')+(rightAnswer == item.value&&answerList[itemIndex].val ? 'right' :'')} onClick={this.nextQuestion.bind(this,item)} >
                    <View className={rightAnswer == item.value&&answerList[itemIndex].val ? 'img_right' : ''} ></View>
                    <View className={answerList[itemIndex].val==item.value&&rightAnswer!=answerList[itemIndex].val ? 'img_err' : ''} ></View>
                    <View className="letter"> {item.value}</View>{item.title}
                </View>
              ))} */}
              </View>  
              {/* <View className="analysis" onClick={this.isAnalysis.bind(this)} >
                     答案解析>
              </View>     
              <View className={"anal " +(isanaly ? 'navs' : '')}>
                     {analysis}
              </View>              */}
           </View>
            {/* <View className={"hid " +(answerList[itemIndex].val!=="" ? 'block' : '')}>
                <View className="bottoms">
                      <View className="btn red" onClick={this.downQuestion.bind(this,itemIndex)}>下一题</View>
                </View>
            </View> */}
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

export default English

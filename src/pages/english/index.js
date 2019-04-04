import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtToast  } from 'taro-ui'
import EnglishText from '../../components/English/EnglishText'
import EnglishStyle from '../../components/English/EnglishStyle'
import * as detailApi from './service'

import './index.scss'
@connect(({ home}) => ({
  ...home,
}))

class English extends Component {
  config = {
    navigationBarTitleText: '单词练习'
  }
  constructor() {
    super(...arguments)
    this.state = {
      pid: 0,
      current: '',
      isOpened:false,
      text:'',
      duration:500,
      seconds:15,
      itemIndex:0,        //当前题索引 
      percent:15, 
      questionOther:{},
      dataList:[],
      dataJson:'',
      rightAnswer:'',
      question:[],
      title:'',
      questionNum:10,
      isRight:0,
      answerList:[{'val':''}],
      thisTime:0,
      rightNum:0,
      timer:null,
      detail:{},
      analysis:'',
      isanaly:false,
      card: false,
      status:true,
      isAudio:true,
      val:[],
      tempFilePath:'',
      siteSwitch:'0',
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
async getSetting (){
  //获取文章详情
  const res = await detailApi.getSetting()
  console.log(res.site_switch)
  if (res.status=='ok') {
    this.setState({
      siteSwitch: res.data.site_switch,
    })

  }
}
  async getArticleInfo (articleId) {
    //获取文章详情
    
    const res = await detailApi.getDetail({
      id: articleId,
    })

    if (res.status == 'ok') {
      const data = JSON.parse(res.data.list.description)

      let val =this.mackQuestion(data)
      let result = [...val,...val]
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
    //this.nextQuestion({'val':''})
  }
  close(){
    this.setState({
      isOpened:false,
      text:'',
      duration:'500',
    })
  }
  init(){
    this.listQuestion()

  }
  listQuestion(){
      const { itemIndex,  dataList} = this.state
      const datas = dataList
      //初始化答案列表
      const answerList =[]
      for(var i=0;i<datas.length;i++){
        answerList.push({'num':i,'val':''})
      }  
      this.setState({
        answerList:answerList,
        questionNum:datas.length,
      },() =>{
        this.addQuestion([...this.state.dataList][itemIndex])
      })


  }
  addQuestion(data){
        this.setState({
          dataJson:data,
          rightAnswer:data.question.answer,
          title:data.question.title,
          question:data.question.list,
          questionOther:data.question,
          analysis:data.question.analysis,
          
        //  current:[...this.state.answerList][itemIndex].val,
        },()=>{
          // this.playAudio(data.question.audio)
        })
    }  
    //下一题
    nextQuestion(val){            
      const { rightAnswer, dataList, seconds, answerList, status} = this.state
       
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
             // this.downQuestion(itemIndex)
            }, 500)
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
      return ((0.8*(right/question)+(right/question)*0.2*((question/time) < 1 ? (question/time) : 0.9 )).toFixed(4)*100).toFixed(2)
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
      const rel ={'data':data,'num':questionNum,'right':right,'time':thisTime,'do':dos,'toUrl':'/pages/poetrylist/index?pid=5c777570d2660b78319b47fc&typeName=english'}
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
     
      this.setState({
        isanaly: false
      })
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
    mackQuestion(val){
        var data = new Array()
        val.forEach((item,i) =>{
                data.push({'question':this.mackRadio(val,val.length,i)})
        })
        return data
    }

    mackRadio(data,length,rand){
       
      // var  data = data.sort(function(){
      //       return Math.random()>0.5
      //   })

        let letter = ['A','B','C','D']
        letter = JSON.parse(JSON.stringify(letter))
        const b = {}
        b.title = data[rand].title
        b.imgUrl = data[rand].imgUrl
        b.chinese = data[rand].chinese
        b.audio =  data[rand].audio
        b.splits = data[rand].splits
        b.analysis = data[rand].analysis
        let rands = this.rendoms(0,length-4)
        let part = data.slice(rands,rands+4)
        part = JSON.parse(JSON.stringify(part))
        part.map((item,ins)=>{
            item.value = letter[ins] 
        })
        let isv =part.findIndex((item,i)=> item.title==b.title)
        if(isv!==-1){
            b.answer = letter[isv]
        } else{
            let nn = this.rendoms(0,3)
            data[rand].value = letter[nn]
            b.answer = letter[nn]
            part.splice(nn,1,data[rand])
        }
        b.list = part
        return b
  }
  componentDidMount = () => {
    this.setState({
      id: this.$router.params.id || '5c7775bbd2660b78319b47fd',
    },()=>{       
      this.getArticleInfo(this.state.id)
    })
    this.getSetting()

    var time = this.state.thisTime
    this.state.timer=setInterval(() =>{
      this.setState({
        thisTime: time++,
      })
    },1000)
  // this.init()

  }
  componentDidHide () { }
  render () {
    const { question ,siteSwitch,answerList, card,detail,isanaly,questionNum, questionOther,itemIndex, isOpened, text, duration,title,thisTime,rightAnswer} = this.state
    return (
      <View className='container'>
            {/* <AtProgress percent={percent} /> */}
            <View className='header'>
              <View className='header_left'>
                  <View className='title'>{detail.title} </View>
                  <View className='time'> 
                  <View className='ionc1'></View>{thisTime}s </View>
              </View>
              <View className='header_right'>
              <View className='answer_card'  onClick={this.isCard.bind(this)}>答题卡</View>
                    <View className='right' >{itemIndex+1}</View> /{answerList.length}
              </View>
           </View>
          
           <View className='content'>
            { itemIndex<(questionNum/2) &&  <EnglishText question={question} title={title} questionOther={questionOther}  answerList={answerList} itemIndex={itemIndex} 
           rightAnswer={rightAnswer}
           siteSwitch={siteSwitch}
           onQuestion={this.nextQuestion.bind(this)}
           /> }

         { itemIndex>=(questionNum/2) && <EnglishStyle  question={question} 
                        title={title} 
                        questionOther={questionOther}  
                        answerList={answerList}
                        itemIndex={itemIndex} 
                        siteSwitch={siteSwitch}
                        rightAnswer={rightAnswer}
                        onQuestion={this.nextQuestion.bind(this)}
                        />}

 
          <View className={'anal ' +(isanaly ? 'navs' : '')}>
                   <View>  {questionOther.title}</View> 
                   <View>  {questionOther.chinese}</View> 
                   <View> {questionOther.analysis}</View> 
          </View>              

           </View>
           <View className={'hid ' +(answerList[itemIndex].val!=='' ? 'block' : '')}>
                <View className='bottoms'>
                     <View className='btn' onClick={this.isAnalysis.bind(this)}>提示</View>
                      <View className='btn red' onClick={this.downQuestion.bind(this,itemIndex)}>下一题</View>
                </View>
           </View>
           <View className={'card ' +(card ? 'pro' : '')} >
              {answerList.map((item,index) => (
                <View key={index} className={'card_li ' +(item.val ? 'nav' : '')} onClick={this.radioQuestion.bind(this,item)} >{index+1}</View>
              ))}
          </View>    
        <AtToast isOpened={isOpened} text={text} duration={duration} onClose={this.close.bind(this)}></AtToast>
      </View>
    )
  }
}

export default English

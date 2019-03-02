import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtToast , AtCountdown,AtProgress } from "taro-ui"
import './index.scss'
@connect(({ home }) => ({
  ...home,
}))

class Answer extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor() {
    super(...arguments);
    this.state = {
      current: '',
      itemIndex:0,                          //当前题索引
      indexCurrent:0,                       //当前空
      error:0,                              //错题数
      fontwidth:2,  
      bar:[],
      nexts:"下一题",
      type:true,
      dataList:[],
      dataJson:'',
      rightAnswer:'',
      question:[],
      expect:'',
      val:'',
      isOpened:false,
      text:'',
      duration:'500',
      seconds:20,
      percent:0,
      questionNum:10,
      isRight:0,
      answerList:[],
      thisTime:0,
      rightNum:0,
      timer:null,

    }

  }
  init(data){
    const { itemIndex } = this.state;
    //this.addQuestion();
    //questionNum 在这定义
    this.listQuestion(data);


  }
  onTimeUp () {
        this.nextQuestion(1)
  }
  onTimeDown(){

  }
  close(){
    this.setState({
      isOpened:false,
      text:'',
      duration:'500',
    })
  }
  addQuestion(data){
      this.setState({
        dataJson:data,
        rightAnswer:data.question[0].answer,
        expect:data.question[0].expect,
        question:data.question,
        current:'',
        val:data.question[0].type,
      },() => {
      })
  }  
  putQuestion(data){
    const {current } = this.state
    let b =  current
    let datas = b.concat(data)
    this.setState({
      current: datas
    })
  }
  listQuestion(data){
        const { itemIndex, questionNum} = this.state
        
        const dataList =[]
        if(data.type=="plus"){
           for(var i=0;i<data.qNum;i++){
            dataList.push(this.plusQuestion(data.min,data.max,data.difficulty));
          }        
        }else if(data.type=="minus"){
           for(var i=0;i<data.qNum;i++){
            dataList.push(this.minusQuestion(data.min,data.max,data.difficulty));
          }   
        }else if(data.type=="ride"){
           for(var i=0;i<data.qNum;i++){
            dataList.push(this.rideQuestion(data.min,data.max,data.difficulty));
          }  
        }else if(data.type=="except"){
            for(var i=0;i<data.qNum;i++){
            dataList.push(this.exceptQuestion(data.min,data.max,data.difficulty));
          }  
        }else if(data.type=="mp"){
           for(var i=0;i<data.qNum;i++){
            dataList.push(this.mpQuestion(data.min,data.max,data.difficulty));
          }  
        }else if(data.type=="re"){
           for(var i=0;i<data.qNum;i++){
            dataList.push(this.reQuestion(data.min,data.max,data.difficulty));
          }  
        }else if(data.type=="mpre"){
          for(var i=0;i<data.qNum;i++){
               if(Math.random()>0.5){
                    dataList.push(this.mpQuestion(data.min,data.max,data.difficulty));
               }else{
                    dataList.push(this.reQuestion(data.min,data.max,data.difficulty));
               } 
          }  
        }
        this.setState({
          dataList: dataList,
          questionNum:data.qNum,
        },()=>{
             this.addQuestion([...this.state.dataList][itemIndex])
        })
  }
  plusQuestion(min,max,n){
        const a = this.rendoms(min,max);
        const b = this.rendoms(min,max-a);
        const c = a+b;
        return this.HandleData(a,b,c,'+',n);
  }
  minusQuestion(min,max,n){
    const a = this.rendoms(min,max/2);
    const b = this.rendoms(min,max-a);
    const c = a+b;
    return this.HandleData(c,b,a,'-',n);
  }

  mpQuestion(min,max,n){
    const a = this.rendoms(min,max/2);
    const b = this.rendoms(min,max-a);
    const c = a+b; 
    const data = (Math.random()>0.5) ? this.HandleData(c,b,a,'-',n) : this.HandleData(a,b,c,'+',n);
    return data;
  }
  reQuestion(min,max,n){
    const a = this.rendoms(min,max/2);
    const b = this.rendoms(min+1,max);
    const c = a*b;
    const data = (Math.random()>0.5) ? this.HandleData(a,b,c,'x',n) : this.HandleData(c,b,a,'÷',n);
    return data;
  }
  rideQuestion(min,max,n){
    const a = this.rendoms(min,max/2);
    const b = this.rendoms(min+1,max);
    const c = a*b;
    return this.HandleData(a,b,c,'x',n);
  }
  exceptQuestion(min,max,n){
            // Math.floor(12.9999) //下退 catcon 
        // Math.ceil(12.1) // 上进
        // Math.round(12.5)//四舍5入
        // Math.round(exam * 10) / 10; //保留一位小数
        // Math.floor(Math.random()*10)
        // 1 比大小 2.+- x 3.123 5 x v
    const a = this.rendoms(min+1,max/2);
    const b = this.rendoms(min,max);
    const c = a*b;
    return this.HandleData(c,b,a,'÷',n);
  }
  HandleData(a,b,c,rule,n=0){
    const x = [
      {"type":"e","answer":c,"expect":"3"},
      {"type":"a","answer":a,"expect":"3"},
      {"type":"c","answer":b,"expect":"3"},
      {"type":"c","answer":b,"expect":"3"},
      {"type":"b","answer":rule,"expect":"2"},
      {"type":"d","answer":"=","expect":"1"},
    ];  //显示空的位置
    var f = x[1]
    const q = Object.assign({"a":a,"b":rule,"c":b,"d":"=","e":c},f);
    const datas = {"question":[q]};  
    return datas;
  }
  rendoms(min,max){
     return Math.floor(Math.random()*(max-min+1))+min
  }

  //下一题
  nextQuestion(val){            
    const { current, rightAnswer,dataList,seconds,questionNum,answerList,rightNum} = this.state;

    if(current===""&&val!=1){
          this.setState({
            isOpened:true,
            text:'请填入答案',
          })
        return;
    }
    const num = rightNum
    if(current == rightAnswer){
      this.setState({
        isRight:1,
        rightNum:num+1,
      },()=>{
        setTimeout(() => {
          this.setState({
            isRight:0,
          })
        },500)
      })
    }else{
      this.setState({
        isRight:2,
      },()=>{
        setTimeout(() => {
          this.setState({
            isRight:0,
          })
        },500)
      })
    }
    
    const itemIndex = this.state.itemIndex

    const sec = seconds===15 ? '15': 15
    const data = dataList
    if(itemIndex<data.length-1){
        var newAnswerList = answerList
        newAnswerList.push(current)
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
      newAnswerList.push(current)
      this.setState({
        itemIndex: itemIndex+1,
        percent:100,
        isOpened:true,
        text:'答题完成',
        duration:'3000',
        answerList:newAnswerList,
      },()=>{
        this.doComplete()
      })

    } else{
      // this.setState({
      //   text:'hahah',
      //   duration:'3000',
      // })
    }

  }
  accuracyRate(right,question,time){
    return ((0.6*(right/question)+(right/question)*0.4*((question/time) < 1 ? (question/time) : 0.9 )).toFixed(4)*100).toFixed(2)
  }
  doComplete(){
    const { dataList,answerList,questionNum,rightNum,thisTime } = this.state
    const answer = answerList
    const data = dataList 
    data.map((d,index) => {
          data[index].question[0].right = answer[index]
    })
     
    const right = rightNum
    const question = parseInt(questionNum)
    const time = thisTime
    
    const dos = this.accuracyRate(right,question,time)
    const rel ={"data":data,"num":questionNum,"right":rightNum,"time":thisTime,"do":dos,"toUrl":"/pages/answerlist/index"};
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

  //删除上一空
  handleRemove (event) {           
    this.setState({
      current:'',
    })
  }
  //答案是否正确
  checkRight(data) {	          
		if(!data) return false;
	          var rightAnswer = data.rightAnswer;
	          var userAnswer = data.userAnswer.join('|')
	           // rightAnswer.some(function(item,index){
	           //         return item==userAnswer;
	           //  })
	          return rightAnswer.split(';').indexOf(userAnswer) > -1;
	}
  componentWillReceiveProps (nextProps) {
  }
  componentWillUnmount () {
    if(this.state.timer!= null) {
      clearInterval(this.state.timer);
    }
    this.setState({
      dataJson:{},
      rightAnswer:'',
      expect:"3",
      question:[],
      current:'',
      val:'',
    })
  }
  componentDidShow () { 
  }
  componentDidMount = () => {
    // this.setState({
    //   num: this.$router.params.num,
    //   difficulty: this.$router.params.difficulty,
    //   qNum: this.$router.params.qNum,
    // })
    
    // const { thisTime } =this.state
     var time = this.state.thisTime
    this.state.timer=setInterval(() =>{
      this.setState({
        thisTime: time++,
      })
    },1000)

    this.setState({
      dataJson:{},
      rightAnswer:'',
      expect:"3",
      question:[],
      current:'',
      val:'',
    },() => {
    })


    var min =0;
    var num = this.$router.params.num;
    if(this.$router.params.difficulty=='3'){
          min = parseInt(num/2);
    }else if(this.$router.params.difficulty=='2'){
          min = 0;
    }else{
          num = parseInt(num/2);
    }
//     this.init({
//       type:"plus",
//       min: parseInt(0),
//       max: parseInt(10),
//       difficulty: parseInt(1),
//       qNum: parseInt(5),
//  })

    this.init({
         type:this.$router.params.type,
         min: parseInt(min),
         max: parseInt(num),
         difficulty: parseInt(this.$router.params.difficulty),
         qNum: parseInt(this.$router.params.qNum),
    })

  };
  componentDidHide () { }
  render () {
    const { nexts,question,rightAnswer,current,val,duration,isOpened,text,seconds,percent,isRight,expect,thisTime } = this.state;
    return (
      <View className="home-page">
      <AtProgress percent={percent} />

      <AtCountdown className="countdown"
        format={{ hours: ':', minutes: ':', seconds: '' }}
        seconds={seconds}
        color='#33ccff'
        isHidePercent={true}
        onTimeUp={this.onTimeUp.bind(this)}
      />
      <View className="isright-style">
             <View className={isRight==1 ? 'right-on' : isRight==2 ? 'err-on':''}></View>
      </View>
          <View className="content">
              {
                question.map((item, index) => (
                  <View key={index} className="goods-li">
                     <View className={'lis ' +(item.type==='a' ? 'nav':'')}>{item.type==='a' ? current:item.a}</View> 
                     <View className={'lis ' +(item.type==='b' ? 'nav':'')}>{item.type==='b' ? current:item.b}</View>
                     <View className={'lis ' +(item.type==='c' ? 'nav':'')}>{item.type==='c' ? current:item.c}</View>
                     <View className={'lis ' +(item.type==='d' ? 'nav':'')}>{item.type==='d' ? current:item.d}</View>
                     <View className={'lis ' +(item.type==='e' ? 'nav':'')}>{item.type==='e' ? current:item.e}</View>
                  </View>
                ))
              }
          </View>

          {/* <View className={'add-subtract ' +(expect==='1' ? 'navs':'')}>
              <View className="add-btn btns"  onClick={this.nextQuestion.bind(this)}>{nexts}</View>
              <View className="add-btn btn-a" onClick={this.putQuestion.bind(this,'>')}>'>'</View>
              <View className="add-btn btn-a" onClick={this.putQuestion.bind(this,'<')}>1</View>
              <View className="add-btn btn-a" onClick={this.putQuestion.bind(this,'=')}>=</View>
              <View className="add-btn btn-a" onClick={this.handleRemove.bind(this)}>C</View>
          </View> */}
          {/* <View className={'add-subtract ' +(expect==='2' ? 'navs':'')}>
              <View className="add-btn btns" onClick={this.nextQuestion.bind(this)}>{nexts}</View>
              <View className="add-btn btn-a" onClick={this.putQuestion.bind(this,'+')}>+</View>
              <View className="add-btn btn-a" onClick={this.putQuestion.bind(this,'-')}>- </View>
              <View className="add-btn btn-a" onClick={this.putQuestion.bind(this,'x')}>x</View>
              <View className="add-btn btn-a" onClick={this.putQuestion.bind(this,'÷')}>÷</View>
              <View className="add-btn btn-a" onClick={this.handleRemove.bind(this)}>C</View>
          </View> */}
          <View className={'add-subtract ' +(expect==='3' ? 'navs':'')}>
              <View className="add-btn btns"  onClick={this.nextQuestion.bind(this)}>{nexts}</View>  
              <View className="num-btn btn-a" onClick={this.putQuestion.bind(this,1)}>1</View>
              <View className="num-btn btn-a" onClick={this.putQuestion.bind(this,2)}>2</View>
              <View className="num-btn btn-a" onClick={this.putQuestion.bind(this,3)}>3</View>
              <View className="num-btn btn-a" onClick={this.putQuestion.bind(this,4)}>4</View>
              <View className="num-btn btn-a" onClick={this.putQuestion.bind(this,5)}>5</View>
              <View className="num-btn btn-a" onClick={this.putQuestion.bind(this,6)}>6</View>
              <View className="num-btn btn-a" onClick={this.putQuestion.bind(this,7)}>7</View>
              <View className="num-btn btn-a" onClick={this.putQuestion.bind(this,8)}>8</View>
              <View className="num-btn btn-a" onClick={this.putQuestion.bind(this,9)}>9</View>
              <View className="num-btn btn-a" onClick={this.putQuestion.bind(this,0)}>0</View>
              <View className="num-btn btn-a" onClick={this.putQuestion.bind(this,".")}>.</View>
              <View className="num-btn btn-a" onClick={this.handleRemove.bind(this)}>C</View>
          </View>
          <AtToast isOpened={isOpened} text={text} duration={duration} onClose={this.close.bind(this)}></AtToast>
      </View>
    )
  }
}

export default Answer

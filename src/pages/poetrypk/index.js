import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import MapText from '../../components/MapText'
import * as detailApi from './service'
import ShareApp from '../../components/Common/ShareApp'
import WxJssdk from '../../components/Common/WxJssdk'
import { AtIcon, AtTabBar, AtModal, AtModalHeader, AtModalContent, AtModalAction} from "taro-ui"
import './index.scss'
@connect(({ detail }) => ({
  ...detail,
}))
class Poetrypk extends Component {
  config = {
    navigationBarTitleText: '飞花令'
  }
  onShareAppMessage (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: res.target.dataset.title,
      path: res.target.dataset.url
    }
  }
  constructor() {
    super(...arguments);
    this.state = {
      current:0,
      articleId: '',
      detail: {},
      value:'',
      poetry:"",
      poetrydata:[],
      poetrycopy:[],
      poetryshow:[],
      index:0,
      tips:false,
      thisTime:0,
      itemIndex:0,
      count:1,
      timer:null,
      keywords:[],
      Ckeywords:[],
      answerList:[{"value":"","num":0},{"value":"","num":1},{"value":"","num":2},{"value":"","num":3},{"value":"","num":4}],
      newPoetry:"",
      textNum:5,
      isOpened:false,
      AtModalText:'',
      AtModalTitle:'',
      AtModalBtn:'确定',
      title:'',
      isTrue:1,
      dataList:[],
      curIndex:0,
      content:'',
      url:'',
      cpNewPoetry:'',
    }

  }
  componentWillUnmount () {
    if(this.state.timer!= null) {
      clearInterval(this.state.timer)
    }
  }

  componentDidMount = () =>   {

    let curIndex =  parseInt(this.$router.params.curIndex) || 0
    this.setState({
      articleId: this.$router.params.id || '5c864ae22203b61b1e0e3f6e',
      curIndex: curIndex,
    },()=>{
      this.getArticleInfo(this.state.articleId)
    }) 
    var time = this.state.thisTime
    this.state.timer=setInterval(() =>{
      this.setState({
        thisTime: time++,
      })
    },1000)
  }
  ontipsShow(data){
    const { tips } =this.state
    const t = tips
    this.setState({
     tips: !t,
   },()=>{
     setTimeout(()=>{
       this.setState({
         tips: false,
       })
     },3000)
   }) 

  }
  getpoetry(data){
      var _this =this;
      //拆分古诗
      const { textNum,answerList } = this.state 
      const keywords = data
      const dd =  JSON.parse(JSON.stringify(data))
      
      var Ckeywords = new Array();
      let curindex = 1;
      // dd.forEach((item,index)=>{
      //     if(dd[index].indexOf("春")!==-1){
      //       curindex = index
      //     }
      // })
      keywords.forEach((item,index)=>{
        keywords[index] =item.split("")
      })
      console.log(keywords,curindex)
      let a = 5
      let ee = 6
      if(dd[0].length==5){
           a =4
           ee = 4
        this.setState({
          textNum:4,
          answerList: [{"value":"","num":0},{"value":"","num":1},{"value":"","num":2},{"value":"","num":3},{"value":"","num":4}]
        })
      }else{
          this.setState({
            textNum:5,
            answerList: [{"value":"","num":0},{"value":"","num":1},{"value":"","num":2},{"value":"","num":3},{"value":"","num":4},{"value":"","num":5},{"value":"","num":6}]
          })
      }
      //var listVal = answerList

      data[curindex-1].forEach((d,i)=>{
       
        Ckeywords.push({"play":false,"val":d,"num":i})
       // listVal[i].value = d
      }) 
     
      // this.setState({
      //   answerList: listVal
      // })    

      data[curindex].forEach((d,i)=>{
        if(i<a){
          Ckeywords.push({"play":false,"val":d,"num":i+7})
        } 
      })  

     // let  ee = JSON.parse(JSON.stringify(Ckeywords)
      const h = [...Ckeywords].sort(() => Math.random() - 0.5)
      this.setState({
        poetrydata: h,
        keywords:keywords,
        Ckeywords:Ckeywords,
        newPoetry:dd[curindex-1],
        cpNewPoetry:dd[curindex-1].substr(0,ee),
        title:"《"+dd[curindex]+"》的上一句是什么?",
        index: h.findIndex(data => data.play===false),
      },() =>{
        
      })
       
  }
  getData(indexs){
    const { keywords,detail,dataList,curIndex } = this.state
    let dataLists = dataList
    if(!dataLists[indexs]){
        this.doComplete()
        return
    }
    let Cdetail =  dataLists[indexs].content
    Cdetail  = Cdetail.replace(/，/g,"-").replace(/。/g,"-").replace(/【/g,"").replace(/】/g,"").replace(/ /g,"").replace(/[\n\r]/g,"").replace(/[\;\r]/g,"").split("-")
    if(Cdetail[0].length!==5&&Cdetail[0].length!==7){
         this.getData(indexs+1)
         this.setState({
           curIndex:indexs+1
         })
         return
    }
    this.setState({
      content:dataLists[indexs].content,
      keywords:Cdetail
    },()=>{
          this.getpoetry(Cdetail)
    })

  }
  async getArticleInfo (articleId) {
    //获取文章详情
    const res = await detailApi.getDetail({
      id: articleId
    });
    if (res.status == 'ok') {
      let  dataList = JSON.parse(res.data.list.description)

      this.setState({
          detail: res.data.list,
          dataList: dataList.data,
          poetry: res.data.list.description.replace(/，/g,"").replace(/。/g,"").replace(/[\n\r]/g,""), 
      },()=>{
        this.getData(this.state.curIndex)
      })
    }
  } 
  onPutPoetry(val){
    const { answerList,Ckeywords,newPoetry,poetrydata,detail,content } = this.state
    if(val.play){
      return
    }
    let  answer = answerList
    let  poetry = poetrydata
    let cc = answer.findIndex((item,i) => {
       return item.value===""
    })
    answer[cc].value = val.val
    answer[cc].number = val.num
    let num = poetry.findIndex((item,i) => {
      return item.num===val.num
    })
    poetry[num].play =true;

    this.setState({
      answerList:answer,
      poetrydata:poetry,
    },()=>{
        let c = answer.some((item,i) => item.value=="")
        if(!c){
          let aa =""
          answerList.forEach((item,i)=>{     
               aa+= item.value
          })   
          if(aa==newPoetry){
                this.setState({
                  isOpened:true,
                  AtModalText:content,
                  AtModalTitle: '答对了',
                  AtModalBtn:'下一关',
                  isTrue:2,
                })
               

          }else{
            this.setState({
              isOpened:true,
              AtModalText:'不对哦，你可以寻求好友帮助哦！或者取消重新填写',
              AtModalTitle:'提示',
              AtModalBtn:'确定',
              isTrue:1,
            })
              console.log("再想想",Ckeywords)
          }
           
        }
    })
  }
  accuracyRate(right,question,time){
    return ((0.8+0.2*((question*3/time) < 1 ? (question/time) : 0.9 )).toFixed(4)*100).toFixed(2)
  }
  doComplete(){
    const { dataList,answerList,questionNum,rightNum,thisTime } = this.state
   
    const data = dataList 
    let right = data.length
    const question = parseInt(dataList.length)
    const time = thisTime   
    const dos = this.accuracyRate(right,question,time)
    const rel ={"data":data,"num":question,"right":right,"time":thisTime,"do":dos,"toUrl":"/pages/home/index"};
    // data.num = this.state.questionNum
    // data.right = this.state.rightNum

    this.setState({
      curIndex:0,
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
  onDelPoetry(val){
        const { answerList,poetrydata } = this.state
        let  poetry = poetrydata
        let  answer = answerList
        let num = val.num
        let nums = poetry.findIndex((item,i) => {
           return item.num===val.number
        })
        answer[num].value = ""
        poetry[nums].play =false  
        this.setState({
          answerList:answer,
          poetrydata:poetry,
        },()=>{

        })

  }
  handleClose(){
    console.log(111)
    this.setState({
      isOpened:false
    })
  }
  onHandleCancel(){
     
     this.onIsClose()

  }
  onIsClose(){
    this.setState({
      isOpened:false,
      AtModalText:'',
      AtModalTitle:'',
    })
  }
  onHandleConfirm(){
   const { isTrue } = this.state
    this.onIsClose()

    if(isTrue===1){
       
    }else{
      console.log(222)
       this.nextQuestion()
    }

  }
  handleClick(e){
    console.log(e)
    this.setState({
       current:e
    })
  }
  nextQuestion(){
    const { curIndex,dataList } =this.state
    let index = curIndex+1
    let data = dataList
    if(index>data.length){
       console.log("完成了")
       this.doComplete()
       return
    }

    this.setState({
      curIndex:index,
    },()=>{
      console.log(111,index)
      this.getData(index)
    })

  }
  toUrl(e){
    Taro.navigateTo({
      url: e,
    })
  }
  render () {
    const {articleId, dataList,curIndex,cpNewPoetry,title,detail,poetrydata,isOpened,answerList,textNum,tips,thisTime,itemIndex,count,AtModalText,AtModalTitle,AtModalBtn,isTrue} = this.state;
    return (
      <View className="container">
       <View className={isOpened ? 'block' : 'none'}>
            <AtModal isOpened >
      <AtModalHeader>{AtModalTitle}</AtModalHeader>
      <AtModalContent>
        {AtModalText}
        
      </AtModalContent>
      <AtModalAction> <Button onClick={this.onHandleCancel.bind(this)}>取消</Button> 
      <Button className={isTrue==2 ? 'block':'none'} onClick={this.onHandleConfirm.bind(this)}>{AtModalBtn}</Button> 
      <Button className={isTrue==1 ? 'block':'none'} open-type='share' data-title={title} data-url={'/pages/poetrypk/index?id='+articleId+'&curIndex='+curIndex}>{AtModalBtn}</Button>
      </AtModalAction>
    </AtModal>
</View>
  {process.env.TARO_ENV === 'h5' ? <WxJssdk title={detail.title} desc={detail.keywords} imgUrl={detail.article_img}/> :''}


 <ShareApp shareTitle={title} shareUrl={'/pages/poetrypk/index?id='+articleId+'&curIndex='+curIndex}/>
 
      <View className="header">
        <View className="header_left">
            <View className="title">{detail.title}</View>
            <View className="time"> 
            <View className="ionc1"></View>{thisTime}s </View>
        </View>
        <View className="header_right">
              <View className="right">{curIndex+1}</View> /{dataList.length}
        </View>
      </View>

<View className="content">
        <View className="con">{title}</View>
        <View className="poetry_list">
                {answerList.map((item,inde) => (
                  <View key={inde} className="answer_li" onClick={this.onDelPoetry.bind(this,item)}> {item.value}</View>
                ))}  
        </View>

        <View className={"answer_list "+(textNum==5 ? 'w630':'w500')} >
        {poetrydata.map((item,inde) => (
           <View key={inde} className="ans_li" onClick={this.onPutPoetry.bind(this,item)}>
            <View className={(item.play ?"sel":"")}>
              {item.val}
            </View>
            </View>
        ))}
        </View>  

        <View className="analysis" onClick={this.ontipsShow.bind(this)}>
               答案提示> 
        </View>     
        <View className={"anal " +(tips ? 'navs' : '')}>
        {cpNewPoetry}
        </View>   
     </View>


</View>
    
    )
  }
}

export default Poetrypk

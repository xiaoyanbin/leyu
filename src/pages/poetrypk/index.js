import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import MapText from '../../components/MapText'
import * as detailApi from './service';
import './index.scss'
@connect(({ detail }) => ({
  ...detail,
}))
class poetry extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor() {
    super(...arguments);
    this.state = {
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
      answerList:[{"value":"","num":0},{"value":"","num":1},{"value":"","num":2},{"value":"","num":3},{"value":"","num":4},{"value":"","num":5},{"value":"","num":6}],
      newPoetry:"",
    }

  }
  componentWillUnmount () {
  }
  componentDidMount = () =>   {
    this.setState({
      articleId: this.$router.params.id,
    })
    
    this.getArticleInfo(this.$router.params.id)

  }
  tipsShow(data){
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
      
      const keywords = data
      const dd =  JSON.parse(JSON.stringify(data))
      
      var Ckeywords = new Array();

      keywords.forEach((item,index)=>{
        keywords[index] =item.split("")
      })
      
      data[0].forEach((d,i)=>{
        Ckeywords.push({"play":false,"val":d,"num":i})
      }) 
      data[1].forEach((d,i)=>{
        if(i<5){
          Ckeywords.push({"play":false,"val":d,"num":i+7})
        }
        
      })  
     // let  ee = JSON.parse(JSON.stringify(Ckeywords)
      const h = [...Ckeywords].sort(() => Math.random() - 0.5)
      this.setState({
        poetrydata: h,
        keywords:keywords,
        Ckeywords:Ckeywords,
        newPoetry:dd[0],
        index: h.findIndex(data => data.play===false),
      },() =>{
        
      })
       
  }
  getData(){
    const { keywords,detail } = this.state
    const Cdetail = detail

    this.setState({
      keywords:Cdetail.keywords.split("-")
    },()=>{
          this.getpoetry(Cdetail.keywords.split("-"))
    })

  }
  async getArticleInfo (articleId) {
    //获取文章详情
    const res = await detailApi.getDetail({
      id: articleId
    });
    if (res.status == 'ok') {
      this.setState({
          detail: res.data.list,
          poetry: res.data.list.description.replace(/，/g,"").replace(/。/g,"").replace(/[\n\r]/g,""), 
      },()=>{
        this.getData()
      })
    }
  } 
  onPutPoetry(val){
    const { answerList,Ckeywords,newPoetry,poetrydata } = this.state
    if(val.play){
      return
    }
    let  answer = answerList
    let  poetry = poetrydata
    let cc = answer.findIndex((item,i) => {
       return item.value===""
    })
    answer[cc].value = val.val
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
                console.log("下一关")
          }else{
              console.log("再想想",Ckeywords)
          }
           
        }
    })
  }
  onDelPoetry(val){
        const { answerList } = this.state
        console.log(val)
        let  answer = answerList
        let num = val.num
        answer[num] = {"value":"","num":0}
        this.setState({answerList:answer},()=>{
          console.log(this.state.answerList)
        })
  }
  render () {
    const { detail,poetrydata,answerList,poetrycopy,tips,thisTime,itemIndex,count,index,poetry,keywords} = this.state;
    return (
      <View className="container">
      <View className="header">
        <View className="header_left">
            <View className="title">{detail.title}</View>
            <View className="time"> 
            <View className="ionc1"></View>{thisTime}s </View>
        </View>
        <View className="header_right">
              <View className="right">{itemIndex+1}</View> /{count}
        </View>
      </View>

<View className="content">
       
        <View className="poetry_list at-row">
        {answerList.map((item,inde) => (
           <View key={inde} className="lists" onClick={this.onDelPoetry.bind(this,item)}> {item.value}</View>
        ))}
                {keywords.map((item,y) => (
                  <View class="keywords-ul" key={y}>
                    <MapText list={item} index={index}/>
                  </View>
                ))}
        </View>
        <View className="poetry_answer at-row">
        {poetrydata.map((item,inde) => (
           <View key={inde} className="lists" onClick={this.onPutPoetry.bind(this,item)}>
            <View className={(item.play ?"sel":"")}>
            {item.val}
            </View>
            </View>
        ))}
        </View>  
        <View className="analysis" onClick={this.tipsShow.bind(this)}>
               答案解析>
        </View>     
        <View className={"anal " +(tips ? 'navs' : '')}>
            {detail.description}
        </View>             
     </View>


</View>
    
    )
  }
}

export default poetry

import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as detailApi from './service';
import './index.scss'
@connect(({ detail }) => ({
  ...detail,
}))
class idiom extends Component {
  config = {
    navigationBarTitleText: '成语'
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
      portryT:[],
      tips:false,
      column:1,
      difficulty:0.5,
      itemIndex:0,
      count:5,
      thisTime:0,
      timer:null,
    }

  }
  componentWillUnmount () {
    if(this.state.timer!= null) {
      clearInterval(this.state.timer)
    }
  }
  componentDidMount = () =>   {
    this.setState({
      articleId: this.$router.params.id,
    })
    var time = this.state.thisTime
    this.state.timer=setInterval(() =>{
      this.setState({
        thisTime: time++,
      })
    },1000)
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
      const { detail } = this.state
      var _this =this;
      const description = detail.description.replace(/-/g,"").replace(/，/g,"")
      //拆分古诗 difficulty数值越大越简单
      var difficulty = this.state.difficulty;
      const b = this.state.poetry; 
      const c = b.split("");
      const d = new Array();
      var  num =0;
      c.forEach((data,i) =>{
          var a ={};
          if(Math.random()>difficulty){
            num++
            a.play = false;
          } else {
            a.play = true;
          }    
          a.index = i;
          a.val = data;
          d.push(a)
      })
      
      if(d.every((data,i) =>data.play==true)){
          console.log(1)
          d[0].play=false;
      }
      if(d.every((data,i) => data.play ==false)){
        console.log(2)
          d[0].play=true;
      }
      var j = new Array();
      description.substring(0,(18-num)).split("").forEach((data,i) =>{
         j.push({'play':false,'index':i+4,"val":data})
      })
      const h = [...d,...j].sort(() => Math.random() - 0.5)
      this.setState({
        poetrydata: h,
        poetrycopy: d,
        index: d.findIndex(data => data.play===false),
      },() =>{
        
      })
       
  }
  rendoms(min,max){
    return Math.floor(Math.random()*(max-min+1))+min
  }
  async getArticleInfo (articleId) {
    //获取文章详情
    const res = await detailApi.getDetail({
      id: articleId
    });

    var column = this.state.column;
    if (res.status == 'ok') {
      const data = res.data.list.description.replace(/-/g,"").replace(/，/g,"")
      const len = this.rendoms(1,data.length/4-(column-1))
      const poetry = data.substring(len*4,len*4+4*(column))
      //const portryT = this.splitData(poetry)

      this.setState({
          detail: res.data.list,
          poetry: poetry, 
      },()=>{
        this.getpoetry()
      })
    }
  }  
  splitData(d){
      const leng = d.length/4
      const data =[]; 
      for(var i=0;i<leng;i++){
         data.push(d.substring(i,i+4)) 
      }
      return  data
  }
  editpoetry(value){
    const {index,poetrycopy} = this.state;
    console.log(value)

    this.setState({
      index:value.index,
    })
  }
  putpoetry(value){
         const {index,poetrycopy} = this.state;
         if(this.state.poetrycopy[index].val==value.val){
              const d = [...this.state.poetrycopy];
              d[index].play = true;
              this.setState({
                poetrycopy:d,
              },() =>{
                const x= index
                const y =poetrycopy.findIndex(data=> data.play===false)
                if(y==-1){
                   this.nextQuestion()
                   return
                }
                this.setState({
                   index:y,
                })
              })
         }
         
  }
  nextQuestion(){  
        const {itemIndex, detail,count} = this.state
        var index = itemIndex
        var data =  detail
        var poetry =this.getData(data) 
        const cou = count
        if(index<cou-1){
          this.setState({
            itemIndex: index+1,
            poetry:poetry,
          },() =>{
            this.getpoetry()
          })
        } else {
          this.doComplete()
        }

  } 
  accuracyRate(right,question,time){
     return ((0.6*(right/question)+(right/question)*0.4*((question/time) < 1 ? (question/time) : 0.9 )).toFixed(4)*100).toFixed(2)
  }
  doComplete(){
    const { thisTime,count } =this.state
    const time = thisTime
    const right = count
    const question =count  
    const data =''
    const dos = this.accuracyRate(right,question,time)
    const rel ={"data":data,"num":right,"right":right,"time":thisTime,"do":dos,"toUrl":"/pages/poetrylist/index?pid=5c6b7815de24016a19796c7d&typeName=idiom"};
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
  getData(detail){
    var   column = this.state.column;
    const data = detail.description.replace(/-/g,"").replace(/，/g,"")
    const len = this.rendoms(1,data.length/4-(column-1))
    const poetry = data.substring(len*4,len*4+4*(column))
    return  poetry

  }
  render () {
    const { detail,poetrydata,poetrycopy,poetry,index,tips,itemIndex,thisTime,count} = this.state;
    return (


       
      <View className="container">
            <View className="header">
              <View className="header_left">
                  <View className="title">{detail.title} </View>
                  <View className="time"> 
                  <View className="ionc1"></View>{thisTime}s </View>
              </View>
              <View className="header_right">
                    <View className="right">{itemIndex+1}</View> /{count}
              </View>
            </View>

      <View className="content">
              <View className="poetry_list at-row">
              {poetrycopy.map((item,ind) => (
                <View key={ind} className={"poetry " +(item.play ?"select":"") +(index==ind ?" four":"" )}  onClick={this.editpoetry.bind(this,item)} >{item.val}</View>
              ))}
              </View>
              <View className="poetry_answer at-row">
              {poetrydata.map((item,inde) => (
                 <View key={inde} className={"lists " +(item.play ?"sel":"")} onClick={this.putpoetry.bind(this,item)}> {item.val}</View>
              ))}
              </View>  
              <View className="analysis" onClick={this.tipsShow.bind(this)}>
                     答案解析>
              </View>     
              <View className={"anal " +(tips ? 'navs' : '')}>
                  {poetry}
              </View>             
           </View>
    </View>
    
    )
  }
}

export default idiom

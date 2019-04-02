import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import MapText from '../../components/MapText'
import * as detailApi from './service'
import WxJssdk from '../../components/Common/WxJssdk'
import { AtIcon, AtToast,AtTabBar, AtModal, AtModalHeader, AtModalContent, AtModalAction} from "taro-ui"
import './index.scss'
@connect(({ detail }) => ({
  ...detail,
}))
class Treasure extends Component {
  config = {
    navigationBarTitleText: '夺宝'
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
      weather: [],
      setup: '',
      init: '', 
      maps: [], 
      today: "晴",
      isOpened:false,
      text:'',
      AtModals:{"isOpened": false,"title":"","text":"","btn":""},
      isChoice:'',
      item:{},
      dataItem:{type:0},
      AtModalInit:{"isOpened": false,"title":"","text":"","btn":""},
    }

  }
  componentWillUnmount () {
    if(this.state.timer!= null) {
      clearInterval(this.state.timer)
    }
  }

  componentDidMount = () =>   {
     
     this.getArticleInfo(this.state.articleId)
    
  }
  async getArticleInfo (articleId) {
    let  list = {"init":{"food":30,"compass":2,"tent":1,"gemstone":0,"water":30,"money":1000,"weight":1000},"weather":[
      {"name":"晴","date":"1","isTime":true},
      {"name":"晴","date":"2","isTime":false},
      {"name":"高温","date":"3","isTime":false},
      {"name":"晴","date":"4","isTime":false},
      {"name":"晴","date":"5","isTime":false},
      {"name":"高温","date":"6","isTime":false},
      {"name":"沙尘暴","date":"7","isTime":false},
      {"name":"晴","date":"8","isTime":false},
      {"name":"高温+沙尘暴","date":"9","isTime":false},
      {"name":"晴","date":"10","isTime":false},
      {"name":"晴","date":"12","isTime":false},
      {"name":"晴","date":"13","isTime":false},
      {"name":"晴","date":"14","isTime":false},
      {"name":"晴","date":"15","isTime":false},
      {"name":"沙尘暴","date":"16","isTime":false},
      {"name":"晴","date":"17","isTime":false},
      {"name":"晴","date":"18","isTime":false},
      {"name":"晴","date":"19","isTime":false},
      {"name":"晴","date":"20","isTime":false},
      {"name":"晴","date":"21","isTime":false},
      {"name":"晴","date":"22","isTime":false}],"setup":[{"water":1,"foot":1,"weight":70},{"water":3,"foot":1,"weight":160},{"water":2,"foot":5,"weight":150},{"water":4,"foot":5,"weight":250}]}
    list.maps = [
      {"id":1,"name":"晴","title":"龙堂","type":6,"isGo":false,"go":false,"sign":""},
      {"id":2,"name":"晴","title":"沙漠","type":5,"isGo":false,"go":false,"sign":""},
      {"id":3,"name":"晴","title":"沙漠","type":4,"isGo":false,"go":false,"sign":""},
      {"id":4,"name":"晴","title":"沙漠","type":3,"isGo":false,"go":false,"sign":""},
      {"id":5,"name":"晴","title":"沙漠","type":2,"isGo":false,"go":false,"sign":""},
      {"id":6,"name":"晴","title":"沙漠","type":5,"isGo":false,"go":false,"sign":""},
      {"id":7,"name":"晴","title":"沙漠","type":4,"isGo":false,"go":false,"sign":""},
      {"id":8,"name":"晴","title":"绿洲","type":3,"isGo":false,"go":false,"sign":""},
      {"id":9,"name":"晴","title":"沙漠","type":2,"isGo":false,"go":false,"sign":""},
      {"id":10,"name":"晴","title":"沙漠","type":1,"isGo":false,"go":false,"sign":""},
      {"id":11,"name":"晴","title":"沙漠","type":4,"isGo":false,"go":false,"sign":""},
      {"id":12,"name":"晴","title":"沙漠","type":3,"isGo":false,"go":false,"sign":""},
      {"id":13,"name":"晴","title":"沙漠","type":2,"isGo":false,"go":false,"sign":""},
      {"id":14,"name":"晴","title":"沙漠","type":1,"isGo":false,"go":false,"sign":""},
      {"id":"x","name":"晴","title":"莫城","type":0,"isGo":false,"go":false,"sign":""}]
    this.setState({
        weather: list.weather,
        setup: list.setup,
        init: list.init, 
        maps: list.maps, 
        isGo:'x',   // 当前所在步
        isTime:0,  //当前时间
    },()=>{

    })

  } 
  isShow(){
    this.setState({
      isOpened:false,
      text:'',
    })
  }
  isOver (data){

       if(data.water < 0 || data.food < 0){
         return true
       }
       return false
  }
  isDate (){
    const  {  isTime,weather } = this.state
    let Cweather = weather
    if(isTime>Cweather.length){
      return true
    }
    return false
  }
  isOpen(item){
    const  { dataItem } = this.state
    let CdataItem = dataItem
    if(CdataItem.type==item.type || CdataItem.type==item.type+1 || CdataItem.type==item.type-1){
      return false
    }else {
      return true
    }
  }
  onNext (item) {
       const  { init,  today } = this.state

       let Ctoday =  today
       let Cinit = init
      
       if(this.isOpen(item)){
          this.setState({
              isOpened:true,
              text:"不能直接到达这一步",
          },()=>{
              setTimeout(()=>{
                this.setState({
                  isOpened:false,
                  text:''
                })
              },3000)
          })
          return 
       }

       if(item.id=="x"&& Cinit.gemstone!==0){

          let  AtModal = {"isOpened": true,"title":"通关了","text":`恭喜你获得宝石：${Cinit.gemstone}`,"btn":"确定"}
          this.setState({AtModals:AtModal})
          return 
       }
       if(this.isOver(Cinit)){    //能量不足已经结束
        let  AtModal = {"isOpened": true,"title":"游戏结束","text":`食物或水不足,游戏结束`,"btn":"确定"}
        this.setState({AtModals:AtModal})
         return
       }
       if(this.isDate()){    // 是否正常返回
         let  AtModal = {"isOpened": true,"title":"游戏结束","text":`时间已到,未能正常返回,游戏结束`,"btn":"确定"}
         this.setState({AtModals:AtModal})
         return
       }
       //主要此数据判断是否使用道具前插入
       this.setState({
        dataItem:item
       })
       if(item.name=="绿洲"){
         this.oasis(item)
         return
       } 

       if(this.onUser(Ctoday)){    //是否需要使用道具
          let  AtModal = {"isOpened": true,"title":Ctoday+"天气","text":`${Ctoday}天气，请选择使用的道具`,"btn":"确定"}
          this.onHandleShow(AtModal,item)
          return
       }

       this.onDateNext({type:1,"id":item.id})

  }
  oasis(item){
    const { dataItem } = this.state
    
  }
  onDateNext(item){
    const  { init, maps, isTime, weather, today } = this.state
    let map =  maps 
    let time = isTime
    let index = map.findIndex((v,i) => item.id == v.id)
    map[index].isGo = true
    map[index].sign = map[index].sign + ' '+ (time+1)
    this.onWeather({"type":item.type,"id":item.id})         //根据天气扣相应的物品
    this.onNextTime(isTime)            //跳转到对应的天气
   
   // 标记当天的节点
    this.setState({
       maps : map,
       isGo : item.id,
    })
  }
  onNextTime (time) {  //下一天
    const  { isTime ,weather } = this.state
    var time = isTime
    let Cweather = weather
    let length  = Cweather.length
   
     if(length<=time){
         let  AtModal = {"isOpened": true,"title":"游戏结束","text":`最后一天没有返回莫城，游戏结束`,"btn":"确定"}
         this.setState({AtModals:AtModal})
         return
     }

    Cweather[time].isTime = true
   // Cweather[time].isTime = true
    this.setState({
      isTime: time + 1,
      weather:Cweather,
      today:Cweather[time].name,

    })

  } 
  onUser (value){     // 是否使用指南针或帐篷
    if(value == "沙尘暴"){
        console.log("沙尘暴")
        return true
    } else if (value == "高温+沙尘暴") {
        return true
    }

    return false
  }
  onWeather (data) {   //根据天气消耗物资
      const  { init } = this.state
      var  inits = init
      if(data.type ==1){   //晴天 或使用帐篷
        inits.food = inits.food-1;
        inits.water = inits.water-1;
      } else if (data.type == 2){  //高温
        inits.food = inits.food-1;
        inits.water = inits.water-3;
      } else if (data.type == 3){  //沙尘暴
        inits.food = inits.food-2;
        inits.water = inits.water-5;
      } else if (data.type == 4){  //高温+沙尘暴
        inits.food = inits.food-4;
        inits.water = inits.water-5;
      }
      if(data.id==1){
        inits.gemstone = inits.gemstone+50;
      }
      if(inits.water<0 && inits.food<0){
          
          
          return
      }

      this.setState({
        init: inits
      })

  }
  onHandleCancel(){
      let  AtModal = {"isOpened": false,"title":"","text":"","btn":""}
      this.setState({AtModals:AtModal})
  }
  onHandleShow(AtModal,item){

    this.setState({isChoice:'',AtModals:AtModal,item:item})
  } 
  onHandleConfirm(){  // c处理使用指南针或帐篷
     const { isChoice,init,today,dataItem } = this.state
     let CisChoice = isChoice
     let Cinit = init
     let Ctoday = today
     let Citem = dataItem

     var type = ''
     if(CisChoice=="tent"){
        Cinit.tent = Cinit.tent-0.5
        type = 1
     }else if(CisChoice=="compass"){
        Cinit.compass = Cinit.compass-1 
        if(Ctoday=="沙尘暴"){
          type = 4
        }else if(Ctoday=="高温+沙尘暴"){
          type = 5
        }
     }else{
       this.onHandleCancel()
       return
     }
     this.setState({
      init:Cinit
     },()=>{
       this.onHandleCancel()
       this.onDateNext({"type":type,"id":Citem.id})
     })
     
  }
  onChoice(data){  
      this.setState({
          isChoice:data
      })
  }
  render () {
    const { maps, weather,setup, init,isTime,isGo,isOpened,text,isOpeneds,AtModals,isChoice,AtModalInit} = this.state;
    return (
      <View className="container">
      <AtToast isOpened={isOpened}  text={text} ></AtToast>
            
      <View className={'none' + (AtModals.isOpened ? ' block' : '')}>
                <AtModal isOpened >
          <AtModalHeader>{AtModals.title}</AtModalHeader>
          <AtModalContent>
            {AtModals.text}
            <View>
             <View className={isChoice=="tent" ? 'nav': ''} onClick={this.onChoice.bind(this,'tent')}> 帐篷：{init.tent}</View>
             <View  className={isChoice=="compass" ? 'nav': ''} onClick={this.onChoice.bind(this,'compass')}> 指南针：{init.compass}</View>
            </View>
          </AtModalContent>
          <AtModalAction> 
            <Button onClick={this.onHandleCancel.bind(this)}>取消</Button> 
            <Button  onClick={this.onHandleConfirm.bind(this)}>{AtModals.btn}</Button> 
         </AtModalAction>
        </AtModal>
    </View>

    <View className={AtModalInit.isOpened ? 'block' : 'none'}>
                <AtModal isOpened >
          <AtModalHeader>{AtModalInit.title}</AtModalHeader>
          <AtModalContent>
            {AtModalInit.text}

            <View className={isChoice=="tent" ? 'nav': ''} onClick={this.onChoice.bind(this,'tent')}> 帐篷：{init.tent}</View> 
            <View  className={isChoice=="compass" ? 'nav': ''} onClick={this.onChoice.bind(this,'compass')}> 指南针：{init.compass}</View>
          </AtModalContent>
          <AtModalAction> 
            <Button onClick={this.onHandleCancel.bind(this)}>取消</Button> 
            <Button  onClick={this.onHandleConfirm.bind(this)}>{AtModalInit.btn}</Button> 
         </AtModalAction>
        </AtModal>
    </View>


      <View className="head"> 
      <View>水： {init.water} 食物：{init.food} 指南针：{init.compass}帐篷：{init.tent} 宝石：{init.gemstone}</View> 
      <View> 钱：{init.money} 重量：{init.weight} <View className='n navs'>  </View> 行走路径  <View className='n nav'>  </View> 当前位置 </View>
      </View>
      <View className="content">

            <View className="answer_list w630" >
              {maps.map((item,i) => (
                <View key={i}  className={"ans_li " +  (item.id==8 ? 'lz ' : '') +  (item.id==1 ? 'lt ' : '') + (item.isGo==true ? 'navs ' : '')+ (isGo ==item.id ? 'nav ' : '')}  onClick={this.onNext.bind(this,item)}>
                  <View>
                    {item.title} 
                  </View>
                  <View> {item.sign}</View>
                  </View>
              ))}
            </View>
            <View className="weather" >
             {weather.map((item,i) => (
                <View key={i} className={"black " + (isTime==item.date ? 'nav' : '')} >
                    <View>{item.date}</View>
                    <View>{item.name}</View>
                    
                  </View>
            ))}
            </View>

     </View>


</View>
    
    )
  }
}

export default Treasure

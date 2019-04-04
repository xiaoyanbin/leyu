import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import MapText from '../../components/MapText'
import * as detailApi from './service'
import WxJssdk from '../../components/Common/WxJssdk'
import { AtIcon, AtToast,AtTabBar, AtModal, AtModalHeader, AtModalContent, AtModalAction} from 'taro-ui'
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
      init: '', 
      maps: [], 
      today: '晴',
      isOpened:false,
      isStart:{'status':false,'text':'开始'},
      text:'',
      AtModals:{'isOpened': false,'title':'','type':'','text':'','btn':''},
      isChoice:'',
      item:{},
      dataItem:{type:0},
      tip:{'status':false,'text':'您有1000元最多可以携带1000磅物资,绿洲可以免费补水，村庄可以用水换食物,正常行程一天消耗1份水和1分食物,你需要从莫城--龙堂（带回更多的宝石）--莫城，在龙堂一天可采集50磅宝石'},
      isTime:0
    }

  }
  componentWillUnmount () {
    if(this.state.timer!= null) {
      clearInterval(this.state.timer)
    }
  }

  componentDidMount = () =>   {
     this.getArticleInfo()

  }
  getArticleInfo (articleId) {
     var gemstone  =  parseInt(localStorage.getItem('gemstone')) || 0
     var doNum  =  parseInt(localStorage.getItem('doNum')) || 0


    let  list = {'init':{'food':20,'compass':0,'tent':0,'gemstone':gemstone,'water':10,'money':600,'weight':700,'do':doNum},'weather':[
      {'name':'晴','date':'1','isTime':true},
      {'name':'沙尘暴','date':'2','isTime':false},
      {'name':'高温','date':'3','isTime':false},
      {'name':'晴','date':'4','isTime':false},
      {'name':'晴','date':'5','isTime':false},
      {'name':'高温','date':'6','isTime':false},
      {'name':'沙尘暴','date':'7','isTime':false},
      {'name':'晴','date':'8','isTime':false},
      {'name':'高温+沙尘暴','date':'9','isTime':false},
      {'name':'晴','date':'10','isTime':false},
      {'name':'晴','date':'11','isTime':false},
      {'name':'晴','date':'12','isTime':false},
      {'name':'晴','date':'13','isTime':false},
      {'name':'晴','date':'14','isTime':false},
      {'name':'晴','date':'15','isTime':false},
      {'name':'沙尘暴','date':'16','isTime':false},
      {'name':'晴','date':'17','isTime':false},
      {'name':'晴','date':'18','isTime':false},
      {'name':'晴','date':'19','isTime':false},
      {'name':'晴','date':'20','isTime':false},
      {'name':'晴','date':'21','isTime':false},
      {'name':'晴','date':'22','isTime':false}]}
    list.maps = [
      {'id':1,'name':'晴','title':'龙堂','type':7,'isGo':false,'go':false,'sign':''},
      {'id':2,'name':'晴','title':'沙漠','type':6,'isGo':false,'go':false,'sign':''},
      {'id':3,'name':'晴','title':'沙漠','type':5,'isGo':false,'go':false,'sign':''},
      {'id':4,'name':'晴','title':'沙漠','type':4,'isGo':false,'go':false,'sign':''},
      {'id':5,'name':'晴','title':'沙漠','type':3,'isGo':false,'go':false,'sign':''},
      {'id':6,'name':'晴','title':'沙漠','type':6,'isGo':false,'go':false,'sign':''},
      {'id':7,'name':'晴','title':'沙漠','type':5,'isGo':false,'go':false,'sign':''},
      {'id':8,'name':'晴','title':'绿洲','type':4,'isGo':false,'go':false,'sign':''},
      {'id':9,'name':'晴','title':'沙漠','type':3,'isGo':false,'go':false,'sign':''},
      {'id':10,'name':'晴','title':'沙漠','type':2,'isGo':false,'go':false,'sign':''},
      {'id':11,'name':'晴','title':'沙漠','type':5,'isGo':false,'go':false,'sign':''},
      {'id':12,'name':'晴','title':'沙漠','type':4,'isGo':false,'go':false,'sign':''},
      {'id':13,'name':'晴','title':'沙漠','type':3,'isGo':false,'go':false,'sign':''},
      {'id':14,'name':'晴','title':'沙漠','type':2,'isGo':false,'go':false,'sign':''},
      {'id':15,'name':'晴','title':'沙漠','type':1,'isGo':false,'go':false,'sign':''},
      {'id':16,'name':'晴','title':'村庄','type':4,'isGo':false,'go':false,'sign':''},
      {'id':17,'name':'晴','title':'沙漠','type':3,'isGo':false,'go':false,'sign':''},
      {'id':18,'name':'晴','title':'沙漠','type':2,'isGo':false,'go':false,'sign':''},
      {'id':19,'name':'晴','title':'沙漠','type':1,'isGo':false,'go':false,'sign':''},
      {'id':'x','name':'晴','title':'莫城','type':0,'isGo':false,'go':false,'sign':''}]
    this.setState({
        weather: list.weather,
        init: list.init, 
        maps: list.maps, 
        isGo:'x',   // 当前所在步
        isTime:0,  //当前时间
        item:{},
        dataItem:{type:0},
        AtModals:{'isOpened': false,'title':'','type':'','text':'','btn':''},
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
       const  { init,  today, dataItem,isStart } = this.state
       let Ctoday =  today
       let Cinit = init
       let CisStart = isStart
       if(!CisStart.status){
        this.setState({
          isOpened:true,
          text:'请点击开始按钮开始',
      },()=>{
          setTimeout(()=>{
            this.setState({
              isOpened:false,
              text:''
            })
          },2000)
      })
      return 
       }
       if(this.isOpen(item)){
          this.setState({
              isOpened:true,
              text:'不能直接到达这一步',
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

       if(item.id=='x'&& Cinit.gemstone!==0){

          let  AtModal = {'isOpened': true,'title':'通关了','text':`恭喜你获得宝石：${Cinit.gemstone}`,'type':'do','btn':'确定'}
          this.setState({AtModals:AtModal,isChoice:'do'})
          return 
       }
       if(this.isOver(Cinit)){    //能量不足已经结束
        let  AtModal = {'isOpened': true,'title':'游戏结束','text':`食物或水不足,游戏结束`,'btn':'确定'}
        this.setState({AtModals:AtModal})
         return
       }
       if(this.isDate()){    // 是否正常返回
         let  AtModal = {'isOpened': true,'title':'游戏结束','text':`时间已到,未能正常返回,游戏结束`,'btn':'确定'}
         this.setState({AtModals:AtModal})
         return
       }
       //主要此数据判断是否使用道具前插入
       this.setState({
        dataItem:item
       })
       if(item.title=='绿洲'){
         this.oasis(item)
         return
       } 
       if(item.title=='村庄'){
        this.village(item)
        return
      } 
       if(this.onUser(Ctoday)){    //是否需要使用道具
          let water = 4
          if(Ctoday=='沙尘暴'){
              water = 2
          }
          let  AtModal = {'isOpened': true,'title':Ctoday+'天气','type':'wupin','water':water,'text':`${Ctoday}天气，请选择使用的道具`,'btn':'确定'}
          this.onHandleShow(AtModal,item)
          return
       }
       var type = 1
       if(Ctoday=='高温'){
          type = 2
       }

       this.onDateNext({type:type,'id':item.id})

  }
  village(item){  //进入绿洲
    const { dataItem,today } = this.state
    let  Ctoday = today
    let  AtModal = {'isOpened': true,'title':'村庄','type':'village','text':`您到村庄了，可以用两份水换一份食物`,'btn':'确定'}
    this.setState({isChoice:'village'})
    this.onHandleShow(AtModal,item)
  }
  oasis(item){  //进入绿洲
    const { dataItem,today } = this.state
    let  Ctoday = today
    let  AtModal = {'isOpened': true,'title':'绿洲补水','type':'oasis','text':`您到绿洲了，可以免费补足水`,'btn':'确定'}
    this.setState({isChoice:'oasis'})
    this.onHandleShow(AtModal,item)
  }
  onDateNext(item){
    const  { init, maps, isTime, weather, today } = this.state
    let map =  maps 
    let time = isTime
    let index = map.findIndex((v,i) => item.id == v.id)
    map[index].isGo = true
    map[index].sign = map[index].sign + ' '+ (time+1)
    this.onWeather({'type':item.type,'id':item.id})         //根据天气扣相应的物品
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
         let  AtModal = {'isOpened': true,'title':'游戏结束','text':`最后一天没有返回莫城，游戏结束`,'btn':'确定'}
         this.setState({AtModals:AtModal})
         return
     }

    Cweather[time].isTime = true
   // Cweather[time].isTime = true
    this.setState({
      isTime: time + 1,
      weather:Cweather,
      today:Cweather[time+1].name,
    },()=>{
    })

  } 
  onUser (value){     // 是否使用指南针或帐篷
    if(value == '沙尘暴'){
        return true
    } else if (value == '高温+沙尘暴') {
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
        inits.weight =  inits.weight - 60
      } else if (data.type == 2){  //高温
        inits.food = inits.food-1;
        inits.water = inits.water-3;
        inits.weight =  inits.weight - 160
      } else if (data.type == 3){  //沙尘暴
        inits.food = inits.food-5;
        inits.water = inits.water-2;
        inits.weight =  inits.weight - 150
      } else if (data.type == 4){  //高温+沙尘暴
        inits.food = inits.food-5;
        inits.water = inits.water-4;
        inits.weight =  inits.weight - 250
      } else if (data.type == 5){  //绿洲
        inits.food = inits.food-1;
        inits.weight =  inits.weight - 10
      } else if (data.type == 6){  //绿洲
        inits.food = inits.food - 5;
        inits.weight =  inits.weight - 5
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
      let  AtModal = {'isOpened': false,'title':'','type':'','text':'','btn':''}
      this.setState({AtModals:AtModal})
  }
  onHandleShow(AtModal,item){

    this.setState({AtModals:AtModal,item:item})
  } 
  onHandleConfirm(){  // c处理使用指南针或帐篷
     const { isChoice,init,today,dataItem,isTime } = this.state
     let CisChoice = isChoice
     let Cinit = init
     let Ctoday = today
     let Citem = dataItem
     let CisTime = isTime
     var type = ''

     if(CisChoice=='tent'){
        Cinit.tent = Cinit.tent-0.5
        if(Cinit.tent%1 === 0){
          Cinit.weight =  Cinit.weight - 60
        }
        type = 1
     }else if(CisChoice=='compass'){
        Cinit.compass = Cinit.compass-1 
        Cinit.weight =  Cinit.weight - 10
        if(Ctoday=='沙尘暴'){
          type = 3
        }else if(Ctoday=='高温+沙尘暴'){
          type = 4
        }
      }else if(CisChoice=='oasis'){
          type = 5
      }else if(CisChoice=='village'){
          type = 1   
      }else if(CisChoice=='none'){
          type = 6  
          this.setState({
            isTime:CisTime + 2
          })
      }else if(CisChoice=='do'){
        console.log(333)
        this.complete()
        this.onHandleCancel()
        return
      }else{
        console.log(223)
       this.onHandleCancel()
       return
      }

     this.setState({
      init:Cinit,
      isChoice:'',
     },()=>{
       this.onHandleCancel()
       this.onDateNext({'type':type,'id':Citem.id})
     })
     
  }
  complete(){
    const { init } = this.state
    var Cinit = init   
    localStorage.setItem('gemstone',Cinit.gemstone)
    localStorage.setItem('doNum',Cinit.do+1)
    console.log(localStorage.getItem('doNum'))
    this.setState({
      isStart:{'status':false,'text':'开始'},
    })
    this.getArticleInfo()
  }
  onChoice(data){  
      this.setState({
          isChoice:data
      })
  }
  onAddFood(num){
    const { init } = this.state
    let Cinit = init
   
    
    if(Cinit.water<2){
        this.setState({
          isOpened:true,
          text:'没有足够的水换取食物',
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
    if(num==1){
      Cinit.water = Cinit.water -2
      Cinit.food =   Cinit.food + 1
      Cinit.weight =  Cinit.weight - 90

    }
    this.setState({
       init:Cinit
    })

  }
  onAddWater(num){
       const { init } = this.state
       let Cinit = init
       if((Cinit.weight+50)>1000){
        this.setState({
          isOpened:true,
          text:'最多只能带1000磅的物品',
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
       Cinit.water =   Cinit.water + num
       if(num==1){
         Cinit.weight =  Cinit.weight + 50
       }else{
         Cinit.weight =  Cinit.weight - 50
       }
       this.setState({
          init:Cinit
       })

  }
  onAddEquipment(type,num){
     const { init } = this.state
     let Cinit = init;
     let price = {'water':20,'food':10,'compass':100,'tent':400}
     let weight = {'water':50,'food':10,'compass':10,'tent':60}
     
        if((Cinit.money - price[type])<0 && num==1){
            this.setState({
              isOpened:true,
              text:'没有足够的钱购买',
            },()=>{
                setTimeout(()=>{
                  this.setState({ isOpened:false,text:''})
                },3000)
            })
            return
        }else if(Cinit.weight + weight[type] >1000 && num==1){
          this.setState({
            isOpened:true,
            text:'重量已达到最大值',
          },()=>{
              setTimeout(()=>{
                this.setState({
                  isOpened:false,
                  text:''
                })
              },3000)
          })

         return
        }else if(Cinit[type]<=0 && num ==-1){

            return
        }else if(num==1){
          Cinit[type] = Cinit[type] + num
          Cinit.money = Cinit.money - price[type]
          Cinit.weight = Cinit.weight + weight[type]
        }else if(num==-1){
          Cinit[type] = Cinit[type] + num
          Cinit.money = Cinit.money + price[type]
          Cinit.weight = Cinit.weight - weight[type]        
        }

     this.setState({
       init:Cinit
     })
     
  }
  onStart(){
    const { isStart } = this.state
    let CisStart = isStart

    this.setState({
       isStart:{status:true,text:'重新开始'},
    })
    this.getArticleInfo()
    let  AtModal = {'isOpened': true,'title':'购买物资','type':'equipment','text':'','btn':'确定'}
    this.setState({AtModals:AtModal})
    
  }
  gotoDetail (e) {
    Taro.navigateTo({
      url: e,
    })
  }
  render () {
    const { maps, weather, init,isTime,isGo,isOpened,text,isOpeneds,AtModals,isChoice, isStart} = this.state;
    return (
      <View className='container'>
      <AtToast isOpened={isOpened}  text={text} ></AtToast>
            
      <View className={'none' + (AtModals.isOpened ? ' block' : '')}>
                <AtModal isOpened >
          <AtModalHeader>{AtModals.title}</AtModalHeader>
          <AtModalContent>
            {AtModals.text}
            {AtModals.type=='wupin' &&
            <View>
             <View className={isChoice=='tent' ? 'nav': ''} onClick={this.onChoice.bind(this,'tent')}> A:<View className='ioc_c ioc_tent'></View>{init.tent}使用消耗水：1 食物1</View> 
             <View  className={isChoice=='compass' ? 'nav': ''} onClick={this.onChoice.bind(this,'compass')}>B: <View className='ioc_c ioc_compass'> </View>{init.compass}使用消耗水：{AtModals.water} 食物5 </View>
             <View  className={isChoice=='none' ? 'nav': ''} onClick={this.onChoice.bind(this,'none')}> C: 没有道具了（将迷失三天）</View>  
            </View> }
           {AtModals.type=='oasis' && <View className='oasis'>
               <View className='oasis_init'><View className='ioc_c ioc_water'></View> {init.water} <View className='ioc_c ioc_food'> </View> {init.food} <View className='ioc_c ioc_weight'> </View>{init.weight} </View>
               <View className='oasis_li'><View className='ioc_c ioc_water'> </View> <View  className='oasis_add' onClick={this.onAddWater.bind(this,-1)}> - </View> {init.water} <View className='oasis_add' onClick={this.onAddWater.bind(this,1)}> + </View> </View>
           </View>  }
           {AtModals.type=='village' && <View className='oasis'>
               <View className='oasis_init'><View className='ioc_c ioc_water'> </View> {init.water} <View className='ioc_c ioc_food'> </View> {init.food} <View className='ioc_c ioc_weight'> </View>{init.weight} </View>
               <View className='oasis_li'> <View className='ioc_c ioc_food'> </View> {init.food}  <View  className='oasis_add' onClick={this.onAddFood.bind(this,1)}> + </View>  </View>
           </View>  }
           {AtModals.type=='equipment' && <View className='oasis'>
               <View className='oasis_init'>
               <View className='ioc_c ioc_water'> </View> {init.water} <View className='ioc_c ioc_food'> </View> {init.food} <View className='ioc_c ioc_compass'> </View> <View className='ioc_text'>{init.compass}</View> <View className='ioc_c ioc_tent'></View>{init.tent}<View>
               <View className='ioc_c ioc_weight'> </View>{init.weight} <View className='ioc_c ioc_money'> </View>{init.money}</View></View>
               <View className='oasis_li'> <View className='ioc_c ioc_water'></View><View  className='oasis_add' onClick={this.onAddEquipment.bind(this,'water',-1)}> - </View><View className='ioc_text'>{init.water}</View><View  className='oasis_add' onClick={this.onAddEquipment.bind(this,'water',1)}> + </View>  单价 20 重 50</View>
               <View className='oasis_li'> <View className='ioc_c ioc_food'></View><View  className='oasis_add' onClick={this.onAddEquipment.bind(this,'food',-1)}> - </View><View className='ioc_text'>{init.food}</View><View  className='oasis_add' onClick={this.onAddEquipment.bind(this,'food',1)}> + </View> 单价 10 重 10</View> 
               <View className='oasis_li'> <View className='ioc_c ioc_compass'> </View><View  className='oasis_add' onClick={this.onAddEquipment.bind(this,'compass',-1)}> - </View><View className='ioc_text'>{init.compass}</View><View  className='oasis_add' onClick={this.onAddEquipment.bind(this,'compass',1)}> + </View>单价 100 重 10</View>
               <View className='oasis_li'> <View className='ioc_c ioc_tent'></View><View  className='oasis_add' onClick={this.onAddEquipment.bind(this,'tent',-1)}> - </View><View className='ioc_text'>{init.tent}</View><View  className='oasis_add' onClick={this.onAddEquipment.bind(this,'tent',1)}> + </View>单价 400 重 60</View>
           </View>  }
           
          </AtModalContent>
          <AtModalAction> 
            <Button onClick={this.onHandleCancel.bind(this)}>取消</Button> 
            <Button  onClick={this.onHandleConfirm.bind(this)}>{AtModals.btn}</Button> 
         </AtModalAction>
        </AtModal>
    </View>
      <View className='head'> 
      <View><View className='ioc_c ioc_water'> </View>  {init.water} <View className='ioc_c ioc_food'> </View>{init.food} <View className='ioc_c ioc_compass'> </View>{init.compass}<View className='ioc_c ioc_tent'></View>{init.tent} <View className='ioc_c ioc_gemstone'></View>{init.gemstone}<View className='ioc_c ioc_do'></View> {init.do} </View> 
      <View> <View className='ioc_c ioc_money'> </View>{init.money} <View className='ioc_c ioc_weight'> </View>{init.weight} <View className='n navs'>  </View> 行走路径  <View className='n nav'>  </View> 当前位置 </View>
      </View>
      <View className='content'>
            <View className='answer_list w630' >
              {maps.map((item,i) => (
                <View key={i}  className={'ans_li ' + (item.title=='村庄' ? 'cz ' : '') + (item.title=='绿洲' ? 'lz ' : '') +  (item.title=='龙堂' ? 'lt ' : '') + (item.isGo==true ? 'navs ' : '')+ (isGo ==item.id ? 'nav ' : '')}  onClick={this.onNext.bind(this,item)}>
                  <View>
                    {item.title}
                  </View>
                  <View> &nbsp; </View>
                  <View> {item.sign}</View>
                  </View>
              ))}
            </View>
            <View className='play'>
                <View className='play_start' onClick={this.onStart.bind(this)}> {isStart.text} </View>
                <View className='play_end' onClick={this.gotoDetail.bind(this,'/pages/home/index')}> 退出 </View>
            </View>
            <View className='weather' >
             {weather.map((item,i) => (
                <View key={i} className={'black ' + (isTime==item.date ? 'nav' : '')} >
                    <View>{item.date}</View>
                    {/* <View>{item.name}</View> */}
                    <View className={'ioc_c ioc_qing ' +((item.name=='高温') ? 'ioc_gao': '') +((item.name=='沙尘暴') ? 'ioc_shachen': '') +((item.name=='高温+沙尘暴') ? 'ioc_shacheng': '')}> </View>
                  </View>
            ))}
            </View>

     </View>


</View>
    
    )
  }
}

export default Treasure

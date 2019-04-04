import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Swiper, SwiperItem, MovableArea, MovableView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as detailApi from './service'
import { webUrl } from '../../config'
import { AtToast , AtCountdown,AtProgress } from 'taro-ui'
import AudioCom from '../../components/Common/AudioCom'
import Recorder from '../../components/Common/Recorder'
import './index.scss'
@connect(({ home ,detail}) => ({
  ...home,
}))

class Card extends Component {
  config = {
    navigationBarTitleText: '卡片'
  }
  constructor() {
    super(...arguments);
    this.state = {
      articleId: '',
      detail:[],
      dataList:[],
      tempFilePath:'',
      home:true,
      card:{'title':' '},
      playtext:{'text':'录音','status':1},
      isPlay:true,
      isOpened:false,
      text:'',
      duration:500,
      siteSwitch:0,
    }

  }
  componentWillReceiveProps (nextProps) {
     console.log(this.props, nextProps)
  }
  componentWillUnmount () {
        
  }

  componentDidShow () { 
  }
  componentDidMount = () => {
    this.getSetting ()
    this.setState({
      articleId: this.$router.params.id || '5c7775bbd2660b78319b47fd',
    },()=>{
      this.getArticleInfo(this.state.articleId)
    })
  };
  componentDidHide () { }
  async getSetting (){
    //获取文章详情
    const res = await detailApi.getSetting();
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
    });
    if (res.status == 'ok') {
      const data = JSON.parse(res.data.list.description)
      this.setState({
          detail: res.data.list,
          dataList: data,
          card:data[0]
      },()=>{
        this.init()
      })
    }
  }  
  init(){

  }
  onScrolltoupper(){
       console.log(111)
  }
  onScroll(){
  }
  close(){
    this.setState({
      isOpened:false,
      text:'',
      duration:500,
    })
  }
  onUpData(item){
     this.setState({
       card:item
     },()=>{
     })
  }
  render () {
    const { dataList,siteSwitch,detail,playtext,tempFilePath,isplay,card,isOpened,text,duration} = this.state;
    return (
      <View className='card-page'>
      <ScrollView
            className='scrollview'
            scrollY
            scrollWithAnimation
            scrollLeft='0'
            style='height: 650px; width:120px'
            lowerThreshold='20'
            upperThreshold='20'
            onScrolltoupper={this.onScrolltoupper}
            onScroll={this.onScroll}>
              { dataList.map((item, index) => (
                <View className={'card-li ' +(card.title==item.title ? 'nav' : '')} key={index}>
                  <Image  onClick={this.onUpData.bind(this,item)}  mode='widthFix' src={item.imgUrl}></Image>     
                  <View>{item.title}</View>
                </View>
             ))}
           
        </ScrollView>
        <View className='card-right' >
          <AtToast isOpened={isOpened} text={text} duration={duration} onClose={this.close.bind(this)}></AtToast>
          <View className='card-right-img'> 
            <Image mode='widthFix' src={card.imgUrl}></Image>    
           </View>
           {card.title}
           {siteSwitch=='1' && <View className='card-right-text'> 
              <View className='btn'>
                  <AudioCom questionOther={card}   />
               重读
              </View>
              <View className='btn'>
                  <Recorder coderData={playtext} />
              </View>
            </View> }
        </View>
       

      </View>
    )
  }
}

export default Card

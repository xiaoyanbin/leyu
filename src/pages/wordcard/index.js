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
    super(...arguments)
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
      book:'',
      setoff:0,
      itemIndex:0,
      play:false,
      playTexts:'自动',
      book_level:'',
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
    this.getSetting ()

    this.setState({
      book: this.$router.params.book,
      setoff: this.$router.params.setoff,
      book_level:this.$router.params.book_level,
    },()=>{
      this.getBookInfo({where:this.$router.params.book,book_level:this.$router.params.book_level,offset:this.$router.params.setoff})
    })

  }
  componentDidHide () { }
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
  async getBookInfo (d) {
    //获取文章详情
    d.where = decodeURIComponent(this.$router.params.book)
    d.book_level = decodeURIComponent(this.$router.params.book_level)
    console.log(d,1111)
    const res = await detailApi.words(d)
    if (res.status == 'ok') {
        console.log(res.data) 
        let data = res.data
        data.forEach((d,i) =>{
                data[i].audio = `https://wx.minsusuan.com/english/xiaoxue/beijing/1/${d.english}.mp3`
        })
     console.log(data)
      this.setState({
          detail: data,
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
  doComplete(){
   const {book,setoff,book_level} = this.state
    Taro.navigateTo({
      url: `/pages/word/index?book=${book}&book_level=${book_level}&setoff=${setoff}`,
    })
  }
  autoPlay(){
    const { itemIndex, play,dataList} =this.state
    let isPlay = play
    let index = itemIndex
    this.setState({
      play:!isPlay,
    },()=>{
       if(this.state.play){
          this.setState({
              playTexts:'停止',
          })
          this.state.timer=setInterval(() =>{
            this.onUpData()
          },2500)
       }else{
          this.onStopWord()

       }

    })



  }
  onStopWord(){
    if(this.state.timer!= null) {
       clearInterval(this.state.timer)
       this.setState({
          playTexts:'自动',
      })
    }
  }
  onNextWord(index){
    const { dataList } =this.state
    let indexs = index || this.state.itemIndex
    let data = dataList
    let length =dataList.length
    if(index<length){

    }else{
      indexs = 0
    }
    console.log(indexs)
    this.setState({
      card:dataList[indexs],
      itemIndex:indexs
    },()=>{

    })
  }
  onUpData(){
     const { itemIndex } =this.state
     let index = itemIndex
     this.onNextWord(index+1)
  }
  render () {
    const { dataList,siteSwitch,playtext,playTexts,itemIndex,tempFilePath,isplay,card,isOpened,text,duration} = this.state
    return (
      <View className='card-page'>

        <View className='card-right' >
          <AtToast isOpened={isOpened} text={text} duration={duration} onClose={this.close.bind(this)}></AtToast>
          {card.book}
          {siteSwitch=='1' && <View className='card-right-text'> 
              <View className='btn'>
                  <AudioCom questionOther={card}   />
               重读
              </View>
              <View className='btn'>
                  <Recorder coderData={playtext} />
              </View>
            </View> }
           <View> {card.english}</View>
           <View> {card.britishAccent}</View>
           <View> {card.chinese}</View>
        </View>
       
          <View className='bottoms'>
                  <View className='btn' onClick={this.autoPlay.bind(this,itemIndex)}>{playTexts}</View>
                  <View className='btn red' onClick={this.onUpData.bind(this,itemIndex)}>下一题</View>
          </View>
      </View>
    )
  }
}

export default Card

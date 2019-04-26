import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import MapText from '../../components/MapText'
import * as detailApi from './service'
import WxJssdk from '../../components/Common/WxJssdk'
import './index.scss'

let wx = {}
try {
   wx = require('weixin-js-sdk')
} catch (error) {
  
}

@connect(({ detail }) => ({
  ...detail,
}))
class poetry extends Component {
  config = {
    navigationBarTitleText: '古诗'
  }
  constructor() {
    super(...arguments)
    this.state = {
      articleId: '',
      detail: {},
      value:'',
      poetry:'',
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
      resultStr:'123'
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
  scanQRCode(){
    Taro.scanCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode","barCode"]}).then((res)=>{
          let result = res.result; // 当needResult 为 1 时，扫码返回的结果
          this.setState({
            resultStr:result
          })
      })
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
     
      var _this =this
      //拆分古诗
      

      const keywords = data
      var Ckeywords = new Array()
      keywords.forEach((item,index)=>{
        keywords[index] =item.split('')
      })


      keywords.forEach((item,index)=>{
           item.forEach((d,i)=>{
              var play = false 
              if(Math.random()>0.5){
                  play =false
              } else {
                 play = true
                 Ckeywords.push({'play':false,'val':d,'index':index+'-'+i})
              }
              keywords[index][i] ={'play':play,'val':d,'index':index+'-'+i}
           })
      })
      // var copyKkeywords
      // Ckeywords.forEach((data,i)=>{
           
      // })
      console.log(Ckeywords)

          

      const h = [...Ckeywords].sort(() => Math.random() - 0.5)
      this.setState({
        poetrydata: h,
        keywords:keywords,
        Ckeywords:Ckeywords,
        index: h.findIndex(data => data.play===false),
      },() =>{
        
      })
       
  }
  getData(){
    const { detail } = this.state
    const Cdetail = detail

    this.setState({
      keywords:Cdetail.keywords.split('-')
    },()=>{
          this.getpoetry(Cdetail.keywords.split('-'))
    })

  }
  async getArticleInfo (articleId) {
    //获取文章详情
    const res = await detailApi.getDetail({
      id: articleId
    })
    if (res.status == 'ok') {
      this.setState({
          detail: res.data.list,
          poetry: res.data.list.description.replace(/，/g,'').replace(/。/g,'').replace(/[\n\r]/g,''), 
      },()=>{
        this.getData()
      })
    }
  } 
  editpoetry(value){
    const {index,poetrycopy} = this.state
    console.log(value)

    this.setState({
      index:value.index,
    })
  } 
  putpoetry(value){
          const {keywords} = this.state

          var key =  keywords
          var listindex = this.state.index
          var Ckeywords = this.state.Ckeywords

          if(Ckeywords[this.state.index].val ==value.val){
              key.forEach((item,i)=>{ 
                item.forEach((d,ind)=>{
                      if(d.val == value.val){
                        key[i][ind].play = false
                      }
                })
              }) 
              Ckeywords[this.state.index].play = true
              this.setState({
                keywords:key,
                index:listindex+1,
                Ckeywords:Ckeywords,
              },()=>{
                console.log(this.state.index)
              })
          }else{
              console.log('选择错误')
          }



  }
  render () {
    const { detail,poetrydata,poetrycopy,tips,thisTime,itemIndex,count,index,poetry,keywords,resultStr} = this.state
    return (
      <View className='container'>
      <View className='header'>
        <View className='header_left'>
            <View className='title'>{detail.title}</View>
            <View className='time'> 
            <View className='ionc1'></View>{thisTime}s </View>
        </View>
        <View className='header_right'>
              <View className='right'>{itemIndex+1}</View> /{count}
        </View>
      </View>

<View className='content'>
{process.env.TARO_ENV === 'h5' ? <WxJssdk title={detail.title}  desc={detail.keywords} imgUrl={detail.article_img}/> :''}
     {/* <View onClick={this.scanQRCode.bind(this)}>微信扫码{resultStr}</View> */}
    
        <View className='poetry_list at-row'>
                {keywords.map((item,y) => (
                  <View class='keywords-ul' key={y}>
                    <MapText list={item} index={index}/>
                  </View>
                ))}
        </View>
        <View className='poetry_answer at-row'>
        {poetrydata.map((item,inde) => (
           <View key={inde} className={'lists ' +(item.play ?'sel':'')} onClick={this.putpoetry.bind(this,item)}> {item.val}</View>
        ))}
        </View>  
        <View className='analysis' onClick={this.tipsShow.bind(this)}>
               答案解析>
        </View>     
        <View className={'anal ' +(tips ? 'navs' : '')}>
            {detail.description}
        </View>             
     </View>


</View>
    
    )
  }
}

export default poetry

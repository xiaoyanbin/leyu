import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types'
import * as WxJssdkApi from './service'
let wx = {}
try {
   wx = require('weixin-js-sdk')
} catch (error) {
  
}


import './index.scss'

class WxJssdk extends Component {
  static propTypes ={
    title: PropTypes.string, 
    desc: PropTypes.string, 
    imgUrl: PropTypes.string, 
  }
  static defaultProps = {
  }
  constructor() {
    super(...arguments)
    this.state = {
       isplay:false
    }
  }  
  componentWillReceiveProps(e){
    const { title,desc, imgUrl} = this.props
    if(title!== e.title){
      this.getInfo(e)
    }
  }
  componentWillUnmount() {

  }
  componentWillmount() {

  }
  componentDidMount(){
    
  }
  onShareAppMessage(title){
    console.log(111)

  }
  async getInfo(data)   {
    if(!Taro.ENV_TYPE.WEB) return
    let url = location.href.split('#')[0]
    let imgUrl = data.imgUrl ? 'https://weixue.minsusuan.com' + data.imgUrl + '_180x180.jpg' : 'https://wx.minsusuan.com/img/share.jpg'
    const res = await WxJssdkApi.wxjssdk({
      url: url,
      data:imgUrl,
    }) 
    if (res.status == 'ok') {
        //  debug: true, // 开启调试模式,
      wx.config({
        appId: res.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.nonceStr, // 必填，生成签名的随机串
        signature: res.signature,// 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','getBrandWCPayRequest','WeixinJSBridgeReady','chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })
      wx.ready(function() {
          wx.onMenuShareAppMessage({ 
                title: data.title, // 分享标题
                desc: data.desc, // 分享描述
                link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', 
                success: function () {
                  // 设置成功
                    console.log(222)
                }
          })
          wx.onMenuShareTimeline({
                title: data.title, // 分享标题
                link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function () {
                // 用户点击了分享后执行的回调函数
                  console.log(123)
                }
          })
      })
    }
  }  
  render() {
    const { title,desc,imgUrl, } = this.props
    return (
       <View>
                {/* className={'menuShareAppMessage'} onClick={this.onShareAppMessage.bind(this,title)}分享 */}
       </View> 
    )
  }
}

export default WxJssdk

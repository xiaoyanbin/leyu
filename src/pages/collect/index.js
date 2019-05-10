import Taro, { Component } from '@tarojs/taro'
import { View ,Image} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as articleApi from './service'
import IndexList from '../../components/IndexList'
import BtnShare from '../../components/BtnShare'
import { videoUrl,imgUrl } from '../../config'
import Bill from '../../components/Bill'
//import Poster from '../../components/Common/Poster'

import './index.scss'
import { arrayOfDeffered } from 'redux-saga/utils'

@connect(({ home ,detail}) => ({
  ...home,
  ...detail,
}))
class Collect extends Component {
  config = {
    navigationBarTitleText: '乐愚传播'
  }
  constructor() {
    super(...arguments)
    this.state = {
      current: 0,
      info:[],
      page:1,
      poetryList:[],
      answerList:[],
      list:[],
      res:{},
      isShare:false,
      draw:{},
    }
  }
  handleClick (value) {
    this.setState({
      current: value
    })
  }
  gotoDetail (e) {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${e.currentTarget.dataset.id}`,
    })
  }
  toUrl () {
    Taro.navigateTo({
      url: `/pages/plist/index?pid=5bcee18b3263442e3419080e`,
    })
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentWillUnmount () {
  }
  componentDidShow () { 
    
  }
  componentDidMount () {
    let dataList = Taro.getStorageSync('dataList') || []
    let data = []
    dataList.forEach((d,i) => {
      data[i] = {}
      data[i]._id = d
    })
    
    this.getArticleCate(JSON.stringify(data),1)
  }
  async getArticleCate (cateId,page) {
    //获取文章详情
      const { list } = this.state
      const res = await articleApi.listarticle({
        pid: cateId,
        page:page,
      })
      if (res.status == 'ok' && res.data.length) {
            let result = res.data
         
            result.forEach((d,i)=>{
                    result[i].isCollect =true
            }) 
            if(page==1){
              this.setState({
                list: result,
              },()=>{
              })
            }else{
              let val = list.concat(result)
              this.setState({
                list: val,
              })   
            }

      } else{
          console.log('没有更多数据了')
      }
  }   
  toEnglish (id,pid) {

    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}&pid=${pid}`,
    })
  }
  componentDidHide () { }
  onShareFun(data){
    if(data){
        this.setState({
          shareTitle:data.title,
          shareUrl: `/pages/detail/index?id=${data._id}&pid=${data.cate_id}`,
          draw:data,
        })
      }
      const { isShare } =this.state
      let share = isShare
      this.setState({
        isShare:!share,
      })
  }
  onSave(){
    this.save()
   }
   onDraw(d){
    console.log(d) 
    //imgUrl+d.article_img
    this.drawTitle({img:imgUrl+d.article_img,desc:'视觉动态/'+d.keywords,name:d.title})
    Taro.showLoading({
      title: 'loading'
    }).then(res => console.log(res))
   }
   save() {  
    const that = this
    wx.canvasToTempFilePath({ // 调用小程序API对canvas转换成图
      x: 0, // 开始截取的X轴
      y: 0, // 开始截取的Y轴
      width: 375, // 开始截取宽度
      height: 557,  // 开始截取高度
      destWidth: 375,  // 截取后图片的宽度（避免图片过于模糊，建议2倍于截取宽度）
      destHeight: 557, // 截取后图片的高度（避免图片过于模糊，建议2倍于截取宽度）
      canvasId: 'poster', // 截取的canvas对象
      success: function (res) { // 转换成功生成临时链接并调用保存方法
        that.saveImage(res.tempFilePath)
      },
      fail: function (res) {
        console.log(res)
        console.log('绘制临时路径失败')
      }
    },this)
  }
  // 绘画Canvas-分享图标题
  drawTitle(datas: any) {
    var width =375
    var height = 557
    var size = 1
    const cvsCtx = Taro.createCanvasContext('poster', this) // 获取到指定的canvas标签
    const grd = cvsCtx.createLinearGradient(0, 0, 0, height); // 进行绘制背景
    grd.addColorStop(0, '#fff'); // 绘制渐变背景色
    grd.addColorStop(1, '#fff'); // 绘制渐变背景色
    cvsCtx.fillStyle = grd; // 赋值给到canvas
    cvsCtx.fillRect(0, 0, width, height); // 绘制canvas大小的举行
    cvsCtx.font = 'normal bold 15px sans-serif' // 设置绘制文字样式lighter
    this.ImageInfo('https://wx.minsusuan.com/leyu/hb.jpg').then(res => { // 绘制网络图片
       // 获取画布
        const cvsCtx = Taro.createCanvasContext('poster', this) // 重新定位canvas对象，双重保险
        // 绘制背景底图
        cvsCtx.drawImage(res.path, 0, 0, width, height)
        let title = datas.name
        cvsCtx.setFontSize(18*size)
        cvsCtx.setFillStyle('#292929')
        var d = cvsCtx.measureText(datas.name)
        var dd = parseInt(width/2-d.width/2)
        cvsCtx.fillText(title, dd, 249*size, d)
        cvsCtx.font = 'normal lighter 11px sans-serif'
        cvsCtx.setFontSize(11*size)
        cvsCtx.setFillStyle('#9c9c9c')
        var c = cvsCtx.measureText(datas.desc)
        var cc = parseInt(width/2-c.width/2)
        cvsCtx.fillText(datas.desc, cc, 272*size, c)
        cvsCtx.draw(true) // 进行绘画
    })  
    this.ImageInfo(datas.img).then(res => { // 绘制网络图片
        const context = Taro.createCanvasContext('poster', this) // 重新定位canvas对象，双重保险

        context.drawImage(res.path, 16, 27, 343, 194)
        context.draw(true) // 进行绘画
        setTimeout(()=>{
          this.save()
          Taro.hideLoading()
        },500)

    })
    cvsCtx.draw(true)
   
  }
  ImageInfo(path) {
    return new Promise((resolve, reject) => { // 采用异步Promise保证先获取到图片信息才进行渲染避免报错
      Taro.getImageInfo(
        {
          src: path,
          success: function (res) {
            resolve(res)
          },
          fail: function (res) {
            reject(res)
          }
        }
      )
    })
  }
  // 保存图片
  saveImage(imgSrc: any) {
    Taro.getSetting({
      success() {
        Taro.authorize({
          scope: 'scope.writePhotosAlbum', // 保存图片固定写法
          success() {
            // 图片保存到本地
            Taro.saveImageToPhotosAlbum({
              filePath: imgSrc, // 放入canvas生成的临时链接
              success() {
                Taro.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
          },
          fail() {
            Taro.showToast({
              title: '您点击了拒绝微信保存图片，再次保存图片需要您进行截屏哦',
              icon: 'none',
              duration: 3000
            })
          }
        })
      }
    })
  }
  render () {
    const { banner } = this.props
    const { poetryList,answerList,list,res ,isShare,draw,shareTitle, shareUrl} = this.state
    return (
      <View className='home-page'>
        {/* <Bill/> */}
        {/* <Poster/> */}
        <Canvas className='poster' canvasId='poster' style='width:375px;height:557px;'></Canvas>
        <IndexList list={ list } res={res} title={'我的收藏'}   loading='' onShareFun={this.onShareFun} ontoEnglish={this.toEnglish}/>
       {isShare &&<BtnShare draw={ draw } shareTitle ={ shareTitle } onDraw={this.onDraw} onShareFun={this.onShareFun} shareUrl={ shareUrl }/> }
       
      </View>
    )
  }
}

export default Collect

import Taro, { Component } from '@tarojs/taro'
import { View,Canvas } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as articleApi from './service'
import MySwiper from '../../components/MySwiper'
import GoodsList from '../../components/GoodsList'
import IndexList from '../../components/IndexList'
import ShareBtn from '../../components/BtnShare'
import { publicUrl ,imgUrl} from '../../config'
import './index.scss'

@connect(({ home ,detail}) => ({
  ...home,
  ...detail,
}))
class Index extends Component {
  config = {
    navigationBarTitleText: '乐愚传播'
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
    super(...arguments)
    this.state = {
      current: 0,
      info:[],
      page:1,
      poetryList:[],
      cateList:[{'id':'5ccffe50a9c9c854cc758926','url':publicUrl+'/leyu/2.png','name':'动态视觉'},{'id':'5ccffe64a9c9c854cc758927','url':publicUrl+'/leyu/3.png','name':'TVC'},{'id':'5ccffe92a9c9c854cc758928','url':publicUrl+'/leyu/4.png','name':'产品宣传'},{'id':'5ccffec0a9c9c854cc758929','url':publicUrl+'/leyu/5.png','name':'原创影视'}],
      answerList:[],
      res:{},
      isShare:false,
      shareTitle:'',
      shareUrl:'',
      pid:'',
      page:1,
      list:[],
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
  componentWillMount (){
      let id = this.$router.params.id
      let pid = this.$router.params.pid
      if(pid){
        Taro.navigateTo({
          url: `/pages/detail/index?id=${id}&pid=${pid}`,
        })
      }
  } 
  componentDidShow () { 

  }
  componentDidMount = () => {
      
   // 

    this.getArticleCate('5ca1f4820363bd0218de37bd',1)
    this.setState({
      pid:'5ccffe50a9c9c854cc758926'
    },()=>{
      this.getArticle('5ccffe50a9c9c854cc758926',1)
    })

    this.Article('5ccfff40a9c9c854cc75892b',1)
  }
  onPullDownRefresh(){
    this.setState({
      pid:'5ccffe50a9c9c854cc758926'
    },()=>{
      this.getArticle('5ccffe50a9c9c854cc758926',1)
    })
    setTimeout(()=>{
      Taro.stopPullDownRefresh()
    },200)
  
  }
  onReachBottom(){
    this.nextPage()
  }
  nextPage(){
    const { pid,page } = this.state
    this.getArticle(pid,page)
  }
  async getArticleCate (cateId,page) {
      const res = await articleApi.article({
        pid: cateId,
        page:page,
      })
      if (res.status == 'ok') {
              this.setState({
                poetryList: res.data.list,
               // page: page+1,
              })
           
      } else{
          console.log('没有更多数据了')
      }
  } 
  async Article (cateId,page) {
    const res = await articleApi.article({
      pid: cateId,
      page:page,
    })
    if (res.status == 'ok') {
            this.setState({
              banner: res.data.list,
            })
         
    } else{
        console.log('没有更多数据了')
    }
  }  
  async getArticle (cateId,page) {
      const { list,pid } = this.state
      const res = await articleApi.article({
        pid: cateId,
        page:page,
        pageSize:5,
      })

      if (res.status == 'ok' && res.data.list.length) {
                  let dataList = Taro.getStorageSync('dataList') || []
                  let result = res.data.list
                  result.forEach((d,i)=>{
                    result[i].cate_name =  res.data.res.title
                  }) 
                  if(dataList.length>0){
                      result.forEach((d,i)=>{
                        if(dataList.indexOf(d._id)!=-1){
                          result[i].isCollect =true
                        } else {
                          result[i].isCollect =false
                        } 
                      }) 
                  }
                  console.log(result)

                if(page==1&&pid=='5ccffe50a9c9c854cc758926'){
                  this.setState({
                    list: result,
                    page: page+1,
                    res: res.data.res,
                  })
                }else{
                  let val = list.concat(result)
                  this.setState({
                    list: val,
                    page: page+1,
                    res: res.data.res,
                  })   
                }

            } else{
                const { cateList,pid } = this.state
                let cate = cateList

                let index = cate.findIndex((d,i) =>pid == d.id)
                if(index!=-1&&index<3){
                  this.setState({
                    pid:cate[index+1].id,
                    page:1,
                  },()=>{
                     this.nextPage()
                  })
                }

                console.log('没有更多数据了')
            }
  } 
  toEnglish (a,pid) {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${a}&pid=${pid}`,
    })
  }
  componentDidHide () { }
  onShareFun(data){
    if(data){
        this.setState({
          shareTitle:data.title,
          shareUrl: `/pages/index/index?id=${data._id}&pid=${data.cate_id}`,
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
    this.drawTitle({img:imgUrl+d.article_img,desc:d.cate_name+'/'+d.keywords,name:d.title})
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
    const { list,cateList,banner,res,isShare,shareTitle,shareUrl } = this.state
    return (
      <View className='home-page'>
      <View className='swiper_con'>
        <MySwiper banner={banner} home />
      </View>
        <GoodsList list={cateList} loading='' ontoEnglish={this.toEnglish}/>
        <IndexList list={list} res ={res} show={true} title={''} loading='' onShareFun={this.onShareFun}  ontoEnglish={this.toEnglish}/>
        {isShare &&<ShareBtn draw={ draw }  shareTitle ={ shareTitle } shareUrl={ shareUrl } onDraw={this.onDraw} onShareFun={this.onShareFun} /> }

       <Canvas className='poster' canvasId='poster' style='width:375px;height:557px;'></Canvas>




      </View>
    )
  }
}

export default Index

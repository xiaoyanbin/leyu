import Taro, { Component } from '@tarojs/taro'
import { View , Video ,Button,Canvas,Image} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as detailApi from './service'
import MinList from '../../components/MinList'
import { videoUrl,imgUrl } from '../../config'
import Share from '../../components/Share'
import ShareBtn from '../../components/BtnShare'
import InImg from '../../components/InImg'
import './index.scss'
class Detail extends Component {
  config = {
    navigationBarTitleText: '详情'
  }
  onShareAppMessage (resd) {
    if (resd.from === 'button') {
      return {
        title: resd.target.dataset.title,
        path: resd.target.dataset.url
      }
    }
  }
  constructor() {
    super(...arguments)
    this.state = {
      articleId: '',
      details: {'listdata':[]},
      cateList:[],
      id:'',
      pid:'',
      collect:false,
      res:{},
      isShare:false,
      shareTitle:'',
      shareUrl:'',
      dataList:[],
      draw:{},
    }

  }


  componentDidMount = () =>   {
    let dataList = Taro.getStorageSync('dataList') || [] 
    this.setState({
      id: this.$router.params.id,
      pid:this.$router.params.pid,
      dataList:dataList,
    },()=>{       
      this.getArticleInfo(this.state.id)
    })
    
  }
  async getArticleInfo(articleId) {
    const { dataList }  = this.state
    const res = await detailApi.getDetail({
      id: articleId
    })
    if (res.status == 'ok') {
          let d = res.data.list
              d.img = imgUrl + res.data.list.article_img
              d.cate_name =  res.data.res.title
              
                  
              if(dataList.indexOf(d._id)==-1){
                d.isCollect =false
              }  else {
                d.isCollect =true
              }
              let listdata = d.listdata
              if(listdata){
                 d.listdata =  JSON.parse(listdata)
              }else{
                 d.listdata =[]
              }

      this.setState({
          details: d,
      },()=>{
        this.getArticle(this.state.pid,1,res.data.list.description)
      })
    }
  }  
  async getArticle (cateId,page,des) {
    const res = await detailApi.article({
      pid: cateId,
      page:page,
    })
    if (res.status == 'ok') {
            let data = res.data.list;
            let datas = data.filter((data,i)=> data.description==des) 

            this.setState({
              answerList: datas,
              res:res.data.res,
             // page: page+1,
            })
    } else{
        console.log('没有更多数据了')
    }
  } 
  onCollect(){
      const { collect } = this.state
      let collects = collect;
      
  }
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
    let that = this
    cvsCtx.draw(true)
    Promise.all([this.ImageInfo('https://weixue.minsusuan.com/public/admin/upload/20190507/hb.jpg'), this.ImageInfo(datas.img)]).then((values) => {
          const cvsCtx = Taro.createCanvasContext('poster', this) // 重新定位canvas对象，双重保险
          // 绘制背景底图
          cvsCtx.drawImage(values[0].path, 0, 0, width, height)
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
          cvsCtx.draw(true)
          //绘制图片
          cvsCtx.drawImage(values[1].path, 16, 27, 343, 194)
          cvsCtx.draw(true) // 进行绘画
          setTimeout(()=>{
            that.save()
            Taro.hideLoading()
          },1200)
    });
   
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
    const { answerList , details,pid,res,isShare,shareTitle, shareUrl} = this.state
    return ( 
    <View className='home-page'>
   <InImg link={videoUrl+details.link} img={details.img} />   
      
    {details && <Share detail ={details} pid={pid} onShareFun={this.onShareFun}/> }
   <View className='box_img'>
   {details.listdata.map((item, index) => (
                <View key={item.img} className='detail_img' >
                <Image src={imgUrl+item.img} style={{height:item.height+'px'}} />
                </View>
              ))
      }
   </View>

     <MinList list={answerList} title={''} res={res}  loading=''  ontoEnglish={this.toEnglish}/>
     {isShare &&<ShareBtn draw={ draw } shareTitle ={ shareTitle } onDraw={this.onDraw} shareUrl={ shareUrl } onShareFun={this.onShareFun} /> }
       <Canvas className='poster' canvasId='poster' style='width:375px;height:557px;'></Canvas>
    </View>
    )
  }
}

export default Detail

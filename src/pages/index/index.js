import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as articleApi from './service'
import MySwiper from '../../components/MySwiper'
import GoodsList from '../../components/GoodsList'
import IndexList from '../../components/IndexList'
import ShareBtn from '../../components/BtnShare'
import { publicUrl } from '../../config'
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
  onShareFun(data){
    if(data){
      this.setState({
        shareTitle:data.title,
        shareUrl: `/pages/detail/index?id=${data._id}&pid=${data.cate_id}`
      })
    }

    const { isShare } =this.state
    let share = isShare
    this.setState({
      isShare:!share,
    })
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentWillUnmount () {
        
  }
  componentDidShow () { 

  }
  componentDidMount = () => {


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
                  if(dataList.length>0){
                      result.forEach((d,i)=>{
                        if(dataList.indexOf(d._id)!=-1){
                          result[i].isCollect =true
                        } else {
                          result[i].isCollect =false
                        } 
                      }) 
                  }

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
  render () {
    const { list,cateList,banner,res,isShare,shareTitle,shareUrl } = this.state
    return (
      <View className='home-page'>
      <View className='swiper_con'>
        <MySwiper banner={banner} home />
      </View>
        <GoodsList list={cateList} loading='' ontoEnglish={this.toEnglish}/>
        <IndexList list={list} res ={res} show={true} title={''} loading='' onShareFun={this.onShareFun}  ontoEnglish={this.toEnglish}/>
        {isShare &&<ShareBtn  shareTitle ={ shareTitle } shareUrl={ shareUrl } onShareFun={this.onShareFun} /> }
      </View>
    )
  }
}

export default Index

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as articleApi from './service'
import MySwiper from '../../components/MySwiper'
import GoodsList from '../../components/GoodsList'
import IndexList from '../../components/IndexList'
import { videoUrl,imgUrl,publicUrl } from '../../config'
import MinList from '../../components/MinList'
import './index.scss'

@connect(({ home ,detail}) => ({
  ...home,
  ...detail,
}))
class Index extends Component {
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
      cateList:[{'id':'5ccffe50a9c9c854cc758926','url':publicUrl+'/leyu/2.png','name':'动态视觉'},{'id':'5ccffe64a9c9c854cc758927','url':publicUrl+'/leyu/3.png','name':'TVC'},{'id':'5ccffe92a9c9c854cc758928','url':publicUrl+'/leyu/4.png','name':'产品宣传'},{'id':'5ccffec0a9c9c854cc758929','url':publicUrl+'/leyu/5.png','name':'原创影视'}],
      answerList:[],
      res:{},
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
  componentDidMount = () => {
    this.props.dispatch({
      type: 'home/article',
    })
    this.props.dispatch({
      type: 'home/focus',
    })
    this.getArticleCate('5ca1f4820363bd0218de37bd',1)
    this.getArticle('5cd12400a9c9c854cc758931',1)
    this.Article('5ccfff40a9c9c854cc75892b',1)
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
      const res = await articleApi.article({
        pid: cateId,
        page:page,
      })
      if (res.status == 'ok') {
              this.setState({
                answerList: res.data.list,
                res: res.data.res,
               // page: page+1,
              })
           
      } else{
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
    const { list } = this.props
    const { answerList,cateList,banner,res } = this.state
    return (
      <View className='home-page'>
      <View className='swiper_con'>
        <MySwiper banner={banner} home />
      </View>
        <GoodsList list={cateList} loading='' ontoEnglish={this.toEnglish}/>
        <IndexList list={answerList} res ={res} title={''} loading='' ontoEnglish={this.toEnglish}/>
      </View>
    )
  }
}

export default Index

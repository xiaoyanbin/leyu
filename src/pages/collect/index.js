import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as articleApi from './service'
import IndexList from '../../components/IndexList'
import './index.scss'
import { arrayOfDeffered } from 'redux-saga/utils';

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
    console.log(dataList)
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
  render () {
    const { banner } = this.props
    const { poetryList,answerList,list,res } = this.state
    return (
      <View className='home-page'>
        <IndexList list={ list } res={res} title={'我的收藏'}  loading='' ontoEnglish={this.toEnglish}/>
      </View>
    )
  }
}

export default Collect

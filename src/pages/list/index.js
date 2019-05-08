import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as articleApi from './service'
import GoodsList from '../../components/GoodsList'
import IndexList from '../../components/IndexList'
import MinList from '../../components/MinList'
import './index.scss'

@connect(({ home ,detail}) => ({
  ...home,
  ...detail,
}))
class List extends Component {
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
      pid:'',
      name:'',
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
    this.setState({'pid':this.$router.params.pid,'name':this.$router.params.name},()=>{
      this.getArticleCate(this.state.pid,1)
    })
     

  }
  async getArticleCate (cateId,page) {
    //获取文章详情
      const { list } = this.state
      const res = await articleApi.article({
        pid: cateId,
        page:page,
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


            if(page==1){
              this.setState({
                list: result,
                page: page+1,
                res: res.data.res,
              },()=>{
                   


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
    const { poetryList,answerList,list,name,pid,res } = this.state
    return (
      <View className='home-page'>
        <IndexList list={ list } res={res} title ={res.title} pid={pid}  loading='' ontoEnglish={this.toEnglish}/>
      </View>
    )
  }
}

export default List

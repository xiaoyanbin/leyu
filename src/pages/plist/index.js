import Taro, { Component } from '@tarojs/taro'
import { View, Button,Image,Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as cateApi from './service'
import './index.scss'
@connect(({ home}) => ({
  ...home,
}))

class Words extends Component {
  config = {
    navigationBarTitleText: '列表'
  }
  constructor() {
    super(...arguments)
    this.state = {
      pid: 0,
      list:[],
      typeName:'',
    }

  }
  async getArticleCate (cateId) {
    //获取文章详情
    console.log(cateId)
    const res = await cateApi.articleCate({
      pid: cateId
    })
    if (res.status == 'ok') {
      this.setState({
          list: res.data,
     },()=>{
        //this.getpoetry()
      })
    }
  }  
  goDetail(data){
     const { typeName } =this.state
      Taro.navigateTo({
        url: `/pages/poetrylist/index?pid=${data}&typeName=${typeName}`,
      })
    
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentDidMount = () => {
    this.setState({
      pid: this.$router.params.pid,
      typeName:this.$router.params.typeName,
    })
    this.getArticleCate(this.$router.params.pid)

  }
  componentDidHide () { }
  render () {
    const { list } = this.state
    return (
      <View className='home-page'>
        <View className='catelist'>
          {list.map((item,index) => (
            <View key={index} className='list' onClick={this.goDetail.bind(this,item._id)} >{item.title}</View>
          ))}
        </View>
      </View>
    )
  }
}

export default Words

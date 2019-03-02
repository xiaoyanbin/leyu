import Taro, { Component } from '@tarojs/taro'
import { View, Button,Image,Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as cateApi from './service'
import { webUrl } from '../../config'
import './index.scss'
@connect(({ home}) => ({
  ...home,
}))

class Words extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor() {
    super(...arguments);
    this.state = {
      pid: 0,
      list:[],
    }

  }
  async getArticleCate (cateId) {
    //获取文章详情
    console.log(cateId)
    const res = await cateApi.articleCate({
      pid: cateId
    });
    if (res.status == 'ok') {
      this.setState({
          list: res.data,
     },()=>{
        //this.getpoetry()
      })
    }
  }  
  goDetail(data){
      Taro.navigateTo({
        url: `/pages/poetrylist/index?pid=${data}`,
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
    this.setState({
      pid: this.$router.params.pid,
    })
    this.getArticleCate(this.$router.params.pid)

  };
  componentDidHide () { }
  render () {
    const { list,pid } = this.state;
    return (
      <View className="home-page">
        <View className="catelist">
          {list.map((item,index) => (
            <View key={index} className="list" onClick={this.goDetail.bind(this,item._id)} >{item.title}</View>
          ))}
        </View>
      </View>
    )
  }
}

export default Words

import Taro, { Component } from '@tarojs/taro'
import { View, Button,Image,Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as articleApi from './service'
import { webUrl } from '../../config'
import './index.scss'
@connect(({ home}) => ({
  ...home,
}))

class poetrylist extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor() {
    super(...arguments);
    this.state = {
      pid: 0,
      list:[],
      typeName:'',
    }

  }
  async getArticleCate (cateId) {
    //获取文章详情
    console.log(cateId)
    const res = await articleApi.article({
      pid: cateId
    });
    if (res.status == 'ok') {
      this.setState({
          list: res.data.list,
     },()=>{
        //this.getpoetry()
      })
    }
  }  
  goDetail(data){
    const { typeName } = this.state
    if(typeName=='idiom'){
      Taro.navigateTo({
        url: `/pages/idiom/index?id=${data}`,
      })
    } else if(typeName=='radio'){
      Taro.navigateTo({
        url: `/pages/radio/index?id=${data}`,
      })
    } else if(typeName=='english'){
      Taro.navigateTo({
        url: `/pages/english/index?id=${data}`,
      })
    } else{
      Taro.navigateTo({
        url: `/pages/poetry/index?id=${data}`,
      })
    }

    
  }
  getClipboard(){
      Taro.getClipboardData({
        success(res) {
          console.log(res.data) // data
        }
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
      typeName: this.$router.params.typeName,
    })
    this.getArticleCate(this.$router.params.pid)
    // this.setState({
    //   pid: '5c721e90d2660b78319b47f7',
    //   typeName: 'radio',
    // })
    // this.getArticleCate('5c721e90d2660b78319b47f7')

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

export default poetrylist

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
      page:1,
    }

  }
  nextPage(){
      const { pid,page } = this.state
      this.getArticleCate(pid,page)
  }
  async getArticleCate (cateId,page) {
    //获取文章详情
      const { list } = this.state
      const res = await articleApi.article({
        pid: cateId,
        page:page,
      });
      if (res.status == 'ok' && res.data.list.length) {
            if(page==1){
              this.setState({
                list: res.data.list,
                page: page+1,
              })
            }else{
              let val = list.concat(res.data.list)
              this.setState({
                list: val,
                page: page+1,
              })   
            }

      } else{
          console.log("没有更多数据了")
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
    this.getArticleCate(this.$router.params.pid,1)
    // this.setState({
    //   pid: '5c721e90d2660b78319b47f7',
    //   typeName: 'radio',
    // })
    // this.getArticleCate('5c721e90d2660b78319b47f7')

  };
  onPullDownRefresh(){
    this.getArticleCate(this.$router.params.pid,1)
    setTimeout(()=>{
      Taro.stopPullDownRefresh()
    },200)
  
  }
  onReachBottom(){
    this.nextPage()
  }
  componentDidHide () { }
  render () {
    const { list,pid } = this.state;
    return (
      <View className="home-page" >
        <View className="catelist"  >
          {list.map((item,index) => (
            <View key={index} className="list" onClick={this.goDetail.bind(this,item._id)} >{item.title}</View>
          ))}
        </View>
      </View>
    )
  }
}

export default poetrylist

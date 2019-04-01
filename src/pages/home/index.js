import Taro, { Component } from '@tarojs/taro'
import { View, Button,Form,Input, Text,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as articleApi from './service';
import MySwiper from '../../components/MySwiper'
import GoodsList from '../../components/GoodsList'
import ListModule from '../../components/Common/ListModule'
import Top from '../../components/Top'
import './index.scss'

@connect(({ home ,detail}) => ({
  ...home,
  ...detail,
}))
class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
      info:[],
      page:1,
      poetryList:[],
      answerList:[],
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
    });
    this.props.dispatch({
      type: 'home/focus',
    });
    // this.props.dispatch({
    //   type: 'home/poetrylist',
    //   payload: { pid:this.props.pid },
    // });
    this.getArticleCate('5ca1f4820363bd0218de37bd',1)
    this.getArticle('5ca1d91c0363bd0218de37bb',1)
  }
  async getArticleCate (cateId,page) {
      const res = await articleApi.article({
        pid: cateId,
        page:page,
      });
      if (res.status == 'ok') {
              this.setState({
                poetryList: res.data.list,
               // page: page+1,
              })
           
      } else{
          console.log("没有更多数据了")
      }
  }  
  async getArticle (cateId,page) {
      const res = await articleApi.article({
        pid: cateId,
        page:page,
      });
      if (res.status == 'ok') {
              this.setState({
                answerList: res.data.list,
               // page: page+1,
              })
           
      } else{
          console.log("没有更多数据了")
      }
  } 
  toEnglish (a) {
    console.log(a,111)
    return 
    Taro.navigateTo({
      url: `/pages/english/index`,
    })
  }
  componentDidHide () { }
  render () {
    const { banner,list } = this.props;
    const { poetryList,answerList } = this.state;
    return (
      <View className="home-page">
      <MySwiper banner={banner} home />
      <Top pid ="5ca1d6b00363bd0218de37b4"/>
      
      <ListModule dataList={ poetryList } titleName="诗词大会" listUrl="poetrypk"/>

      <View className="index_text" onClick={this.toEnglish.bind(this)}>答题</View>
      <GoodsList list={answerList} loading="" ontoEnglish={this.toEnglish}/>
      </View>
    )
  }
}

export default Index

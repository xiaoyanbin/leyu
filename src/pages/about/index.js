import Taro, { Component } from '@tarojs/taro'
import { View , Video ,Button} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as detailApi from './service'
import './index.scss'
import { videoUrl,imgUrl } from '../../config'

class About extends Component {
  config = {
    navigationBarTitleText: '关于'
  }
  onShareAppMessage (res) {
    if (res.from === 'button') {
      return {
        title: res.target.dataset.title,
        path: res.target.dataset.url
      }
    }
  }
  constructor() {
    super(...arguments)
    this.state = {
      articleId: '',
      details: [],
      cateList:[],
      id:'',
      pid:'',
    }

  }


  componentDidMount = () =>   {
    this.setState({
      id: this.$router.params.id,
      pid:this.$router.params.pid || '5ccfff22a9c9c854cc75892a',
    },()=>{       
    //  this.getArticleInfo(this.state.id)
      this.getArticle(this.state.pid,1)
    })
    
  }
  async getArticleInfo(articleId) {
    const res = await detailApi.getDetail({
      id: articleId
    })
    if (res.status == 'ok') {
      this.setState({
          details: res.data.list,
      })
    }
  }  
  async getArticle (cateId,page) {
    const res = await detailApi.article({
      pid: cateId,
      page:page,
    })
    if (res.status == 'ok') {
            this.setState({
              answerList: res.data.list[0],
             // page: page+1,
            })
    } else{
        console.log('没有更多数据了')
    }
} 
  render () {
    const { answerList , details,pid} = this.state
    return ( 
    <View className='home-gy'>
      {answerList.article_img &&<Image className='img_top' src={imgUrl+answerList.article_img}/> }
    </View>
    )
  }
}

export default About

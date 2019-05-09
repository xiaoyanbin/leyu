import Taro, { Component } from '@tarojs/taro'
import { View , Video ,Button} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as detailApi from './service'
import './index.scss'
import MinList from '../../components/MinList'
import Share from '../../components/Share'

class Detail extends Component {
  config = {
    navigationBarTitleText: '详情'
  }
  onShareAppMessage (resd) {
    if (resd.from === 'button') {
      return {
        title: resd.target.dataset.title,
        path: resd.target.dataset.url
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
      collect:false,
      res:{},
    }

  }


  componentDidMount = () =>   {
    this.setState({
      id: this.$router.params.id,
      pid:this.$router.params.pid,
    },()=>{       
      this.getArticleInfo(this.state.id)
     
    })
    
  }
  async getArticleInfo(articleId) {
    const res = await detailApi.getDetail({
      id: articleId
    })
    if (res.status == 'ok') {
          let d = res.data.list
              d.img = `https://weixue.minsusuan.com${res.data.list.article_img}`
          
              let dataList = Taro.getStorageSync('dataList') || [] 
                  
              if(dataList.indexOf(d._id)==-1){
                d.isCollect =false
              }  else {
                d.isCollect =true
              }
              


      this.setState({
          details: d,
      },()=>{
        this.getArticle(this.state.pid,1,res.data.list.description)
      })
    }
  }  
  async getArticle (cateId,page,des) {
    const res = await detailApi.article({
      pid: cateId,
      page:page,
    })
    if (res.status == 'ok') {
            let data = res.data.list;
            let datas = data.filter((data,i)=> data.description==des) 

            this.setState({
              answerList: datas,
              res:res.data.res,
             // page: page+1,
            })
    } else{
        console.log('没有更多数据了')
    }
  } 
  onCollect(){
      const { collect } = this.state
      let collects = collect;
      
  }
  render () {
    const { answerList , details,pid,res} = this.state
    return ( 
    <View className='home-page'>
    <Video className = 'video_info'
          src='http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
          controls={true}
          autoplay={false}
          poster={details.img}
          initialTime='0'
          loop={false}
          muted={false}
        />
       
     <Share detail = {details} pid={pid}/>
     <MinList list={answerList} title={''} res={res}  loading='' ontoEnglish={this.toEnglish}/>
    </View>
    )
  }
}

export default Detail

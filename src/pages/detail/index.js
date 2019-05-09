import Taro, { Component } from '@tarojs/taro'
import { View , Video ,Button} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as detailApi from './service'
import MinList from '../../components/MinList'
import { videoUrl,imgUrl } from '../../config'
import Share from '../../components/Share'
import ShareBtn from '../../components/BtnShare'
import InImg from '../../components/InImg'
import './index.scss'
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
      details: {},
      cateList:[],
      id:'',
      pid:'',
      collect:false,
      res:{},
      isShare:false,
      shareTitle:'',
      shareUrl:'',
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
  onShareFun(data){
    console.log(data,1234)
    if(data){
      this.setState({
        shareTitle:data.title,
        shareUrl: `/pages/detail/index?id=${data._id}&pid=${data.cate_id}`
      })
    }
    const { isShare } =this.state
    let share = isShare
    this.setState({
      isShare:!share,
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
    const { answerList , details,pid,res,isShare,shareTitle, shareUrl} = this.state
    return ( 
    <View className='home-page'>
     <InImg link={videoUrl+details.link} img={details.img} />  

    {details && <Share detail = {details} pid={pid} onShareFun={this.onShareFun}/> }
     <MinList list={answerList} title={''} res={res}  loading=''  ontoEnglish={this.toEnglish}/>
     {isShare &&<ShareBtn  shareTitle ={ shareTitle } shareUrl={ shareUrl } onShareFun={this.onShareFun} /> }
    </View>
    )
  }
}

export default Detail

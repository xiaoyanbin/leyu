import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as detailApi from './service'
import './index.scss'
import Websocket from '../../utils/websocket'
@connect(({ detail }) => ({
  ...detail,
}))
class Detail extends Component {
  config = {
    navigationBarTitleText: '详情'
  }
  constructor() {
    super(...arguments)
    this.state = {
      articleId: '',
      detail: {},
      cateList:[],
      description:[],
      value:'',
      bug:'bug',
      gushi:'锄禾日当午',
      gushidata:[],
      gushicopy:[],
      gushishow:[],
      index:0,
    }

  }


  componentDidMount = () =>   {
    this.setState({
      articleId: this.$router.params.id,
    })

  
    var ws = new Websocket({
      url:'ws://echo.websocket.org/',//自定义  wss协议
      onMessage:(r)=>{
         this.onMessage(r)
      }
    })
    this.ws = ws  
    this.getgushi()
    this.getArticleInfo(this.$router.params.id)
    
  }
  onMessage(e){
      this.setState({
        bug: e.data,
     })
  }
  getgushi(data){
      const b = this.state.gushi 
      const c = b.split('')
      const d = new Array()
      c.forEach((data,i) =>{
          d.push({play:false,val:data})
      })
      const h = b.split('').sort(() => Math.random() - 0.5)
      console.log(h)
      this.setState({
        gushidata: h,
        gushicopy: d,
      },() =>{
        console.log(this.state.gushidata,this.state.gushicopy) 
      })
       
  }
  async getArticleInfo(articleId) {
    const res = await detailApi.getDetail({
      id: articleId
    })
    if (res.status == 'ok') {
      var datas ={data:[]}
      try {
         datas = JSON.parse(res.data.list.description)
      } catch (error) {
         datas = {data:[]}
      }
      this.setState({
          detail: res.data.list,
          cateList:res.data.cateList,
          description:datas.data,
      })

    }
  }  
  gotoDetails(e){

     if(this.ws.ready){
        this.ws.send(JSON.stringify({'a':0}))
     }

  }
  gotoDetail = (e) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${e.currentTarget.dataset.id}`,
    })
  }
  handleChange (value){
      this.setState({
          value
      })
  }
  putgushi(value){
         const {index} = this.state
         if(this.state.gushicopy[index].val==value){
              const d = [...this.state.gushicopy]
              d[index].play = true
              this.setState({
                gushicopy:d,
              },() =>{
                const x= index
                const y =x+1
                this.setState({
                   index:y,
                })
                console.log(this.state.gushicopy) 
              })
         }
         
  }
  render () {
    const { cateList, detail, bug, gushidata, gushicopy} = this.state
   // const datas = JSON.parse(detail.description)
   // const { detail } = this.props
    return (
     
    <View className='home-page'>
        <View className='at-article'>
            <View>{detail.title}</View>
            <View  onClick={this.getgushi.bind(this)}>
              {detail.add_time}&nbsp&nbsp&nbsp这是作者
        </View>
        <View>
            <View >{detail.description}</View>
            <View > {detail.content} </View>
        </View>

    </View>

    <View>
        { cateList.map((item, index) => (
            <View className='nav-item' onClick={this.gotoDetails.bind(this)} key={index}>
               <View>{item.title}</View>
            </View>
          ))}
    </View>
    <View>{bug} </View>

    <View className='gushicopy'>
      {gushicopy.map((item,index) => (
        <View  className={'kuang ' +(item.play ?'select':'')} >{item.val}</View>
      ))}
    </View>
      
    <View  className='gushidata'>
      {gushidata.map((item,index) => (
        <View className='lists' onClick={this.putgushi.bind(this,item)} key={index}> {item}</View>
      ))}</View>
    </View>
    )
  }
}

export default Detail

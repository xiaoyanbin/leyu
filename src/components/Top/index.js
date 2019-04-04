import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'
import * as TopApi from './service'
class Top extends Component {
  static propTypes ={
      pid:PropTypes.pid
  }

  static defaultProps = {
    pid:'',
  }
  constructor() {
    super(...arguments)
    this.state = {
       list:[],
       list2:[],
    }
  }  
  async getArticleCate (cateId) {
    //获取文章详情
    console.log(cateId)
    const res = await TopApi.articleCate({
      pid: cateId
    })
    if (res.status == 'ok') {
      this.setState({
          list: res.data.slice(0,3),
          list2: res.data.slice(3,6),
     },()=>{
         console.log(this.state.list)
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
    this.getArticleCate(this.props.pid)
  }
  toUrl (data) {
    Taro.navigateTo({
      url: data,
    })
  }
  render() {
    const { loading } = this.props
    const { list,list2 } = this.state
    return (
      <View>
       <View className='top'>
          {list.map((item,index) => (
            <View key={index} className={'ionc1'}> 
                <View className={'ionc_img col'+(index+1)} onClick={this.toUrl.bind(this,item.link)}> 
                    <Image src={'https://weixue.minsusuan.com'+item.cate_img}></Image>
                </View>
                <View className='fonts'> {item.title}</View>
           </View>   
        ))}

       </View>
       <View className='top'>
          {list2.map((item,index) => (
            <View key={index} className={'ionc1'}> 
                <View className={'ionc_img col'+(index+4)} onClick={this.toUrl.bind(this,item.link)}> 
                    <Image src={'https://weixue.minsusuan.com'+item.cate_img}></Image>
                </View>
                <View className='fonts'> {item.title}</View>
           </View>   
        ))}

       </View>
      </View> 
    )
  }
}

export default Top

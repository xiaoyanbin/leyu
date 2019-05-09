import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import * as Api from './service'
import './index.scss'

class Collect extends Component {
  static propTypes ={
    record: PropTypes.object,
    onShare:PropTypes.func,

  }

  static defaultProps = {
    record:{'isCollect':false}
  }
  constructor() {
    super(...arguments)
    this.state = {
       isCollect:false,
       collectnum:null,
    }
  }  
  componentDidMount(){
    const { record } = this.props
    this.setState({
      isCollect:record.isCollect,
      collectnum:record.collectnum,
    })
  }
  componentWillReceiveProps(e){
    const { record } = this.props
    if(record!==e.record){
        this.setState({
          isCollect:e.record.isCollect,
          collectnum:e.record.collectnum,
        })
    }
  }
  onShares (e) {
      this.props.onShare(e)
  }
  onCollect(a){
  //   Taro.setStorage({ key: 'user_id', data: 'value' })
  //  .then(res => console.log(res))
  //  Taro.setStorageSync('user_id', 'abcdef')

    const user_id = Taro.getStorageSync('user_id')
  
    if(!user_id){
      Taro.showToast({title:"请先到(我的)页面登录",icon:"none"})
      return
    }
     

    if(!this.state.isCollect){
      this.getCollectnum(a._id,1)
    }else{
      this.getCollectnum(a._id,0)
    }



    
  }
  async getCollectnum(id,num)   {
    const res = await Api.updateCollectnum({
      id: id,
      num:num,
    }) 

    let  isTrue = num==1 ? true : false
    if (res.status == 'ok'){
      this.setState({
        collectnum:res.data,
        isCollect:isTrue,
      })
      this.dataList()
    }
  } 
  dataList(){
    const { record } = this.props
    let dataList = Taro.getStorageSync('dataList') || []
    let index = dataList.findIndex((d,i) => d == record._id)
     if(index==-1){
       dataList.push(record._id)
       Taro.setStorageSync('dataList', dataList)
     }else{
       dataList.splice(index,1)
       Taro.setStorageSync('dataList', dataList)
     }

   // Taro.setStorageSync('user_id', 'abcdef')
  }
  render() {
    const { isCollect, collectnum } = this.state
    const { record } = this.props
    return (
            <View className="right">
                
                <View onClick={this.onCollect.bind(this,record)} className={"right_l " +(isCollect ? 'nav' : '')}>
                </View>  
                 <View className='num'>{collectnum}</View>    
                <View className="right_r" onClick={this.onShares.bind(this,record)}></View>

            </View> 
            )
  }
}

export default Collect

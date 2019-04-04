import Taro, { Component } from '@tarojs/taro'
import { View, Button,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as userApi from './service'
import { webUrl } from '../../config'
import { AtAvatar } from 'taro-ui'
import './index.scss'
import touxiang from '../../images/icon/mr-touxiang.png'
import Login from '../../components/Common/Login'
@connect(({ home ,detail}) => ({
  ...home,
}))

class Baidu extends Component {
  config = {
    navigationBarTitleText: '用户中心'
  }
  
  onShareAppMessage (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    console.log(res.target.dataset.title,111)
    return {
      title: res.target.dataset.title,
      path: res.target.dataset.url
    }
  }
  constructor() {
    super(...arguments)
    this.state = {
      current: 0,
      info:[],
      imgUrl:touxiang,
      userInfo:{'nickName':'未登录','avatarUrl':touxiang,'country':''},
      imgShow:'../../public/admin/upload/20190213/1550047826846.jpg_400x400.jpg',
      uri:webUrl+'/api/doAdd',
      phone:'',
      share:{title:'用户中心',url:'/pages/user/index'}
    }

  }
  async doRegister (userInfo) {
    //获取文章详情
    const res = await userApi.doRegister({
      user: userInfo
    })
    console.log(res)

    if (res.status == 'ok') {
      this.setState({
        userInfo : res.data.user_info,
        userId:value.user_id,
     },()=>{
        //this.getpoetry()
      })
    }
  }  
  componentDidMount = () => {
    console.log(Taro.getEnv(),111)
    try {
      const value = wx.getStorageSync('userInfo')

      if (value) {
         this.setState({
          userInfo: value.user_info,
          userId:value.user_id,
         },()=>{

         })
      }
    } catch (error) {
      
    }
    console.log(this.route,this.options)
  //  this.drawTitle({'desc':'hahah','rise_info':{'rise_percent':1}})


  }
  changeUser(data){
       this.setState({
          userInfo:data
       })
  }
  getUserInfo = (userInfo) => {
      if(userInfo.detail.userInfo){   //同意
         // this.props.setBasicInfo(userInfo.detail.userInfo) //将用户信息存入redux  
        //  this.doRegister(userInfo.detail)
          Taro.setStorage({key:'userInfo',data:userInfo.detail.userInfo}).then(rst => {  //将用户信息存入缓存中
              this.changeUser(userInfo.detail.userInfo)
              Taro.navigateBack()
          })
      } else{ //拒绝,保持当前页面，直到同意 
        console.log(222)
      }
  }
  componentDidHide () { }
  render () {
    const { info,imgUrl ,phone,userInfo,share } = this.state
    const tabList = [{ title: '文章列表' }]
    return (

      <View className='home-page'>

   
      <View className='face'>
      <AtAvatar className='face_img' image={userInfo.avatarUrl} ></AtAvatar>
      <View className='nick_name'>{userInfo.nickName}</View> 
      <Text>申请获取你的公开信息（昵称、头像等）</Text> 
      {/* <Button className='user_info' open-type='getUserInfo' onGetUserInfo={this.getUserInfo} > 点击登录 </Button> */}
      <Login />
      </View>

      

   </View>

    )
  }
}

export default Baidu

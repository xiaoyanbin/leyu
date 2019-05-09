import Taro, { Component } from '@tarojs/taro'
import { View,Text,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Login from '../../components/Common/Login'
import touxiang from '../../images/tab/tx.png'
import './index.scss'

@connect(({ home }) => ({
  ...home,
}))

class User extends Component {
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
      info:[],
      imgUrl:touxiang,
      userInfo:{'nickName':'登录','avatarUrl':touxiang},
      share:{title:'用户中心',url:'/pages/user/index'}
      
    }
  } 
  componentDidMount() {
    try {
      let user = Taro.getStorageSync('userInfo') || {'nickName':'登录','avatarUrl':touxiang}
      this.setState({
        userInfo:user
      })
    } catch (error) {
      
    }

  }
  toUrl(e) {

    Taro.navigateTo({
      url: e,
    })
  }
  changeUser(data){
       this.setState({
          userInfo:data
       })
  }
  getUserInfo(userInfo)  {
      
    
      if(userInfo.detail.userInfo){   //同意
          Taro.setStorageSync('userInfo',userInfo.detail.userInfo)
          
          let user = Taro.getStorageSync('userInfo')
          Taro.setStorageSync('user_id',user.avatarUrl)
          this.setState({userInfo: user})

      } else{ 
        console.log(222)
      }
  }
  componentDidHide () { }
  render () {
    const { userInfo,imgUrl } = this.state
    return (
      <View className='home-page'>
       <View className='user_top'>
          <View className='user_div'>
            <View className='user_face'>
            <Image src={userInfo.avatarUrl} />
            </View>
            <View className='user_text'>
             <Button className='user_info' open-type='getUserInfo' onGetUserInfo={this.getUserInfo} > {userInfo.nickName} </Button>
            </View>
          </View>
       </View>
        <View className='content'>
          <View onClick={this.toUrl.bind(this,'/pages/collect/index')}>我的收藏</View> 
          <View>联系咨询</View> 
        </View>
      </View>
    )
  }
}

export default User

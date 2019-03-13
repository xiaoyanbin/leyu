import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image,Audio } from '@tarojs/components';
import PropTypes from 'prop-types';
import * as loginApi from './service'
import './index.scss';

class Login extends Component {
  static propTypes ={

  }

  static defaultProps = {
    questionOther: {}, 
  };
  constructor() {
    super(...arguments)
    this.state = {
       isplay:false
    }
  }  
  componentWillReceiveProps(e){

  }
  componentDidMount(){
  }
  async getInfo(data)   {
    const res = await loginApi.wxlogin({
      code: data.code,
      userInfo:data.userInfo,
    }); 
    if (res.status == 'ok') {

      Taro.setStorage({key:'userInfo',data:res.data }).then(rst => {  //将用户信息存入缓存中

       })
       Taro.setStorage({key:'user_id',data:res.data.user_id }).then(rst => {  //将用户信息存入缓存中
       })   
    }
  }  
  getUserInfo = (userInfo) => {
    let _this = this

    if(userInfo.detail.userInfo){   //同意
        wx.login({
          success(res) {
            if (res.code) {
              _this.getInfo({code:res.code,userInfo:userInfo.detail.userInfo})
              console.log("成功")
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })

    } else{ //拒绝,保持当前页面，直到同意 
        console.log(222)
    }
  }
  render() {
    const { isplay } = this.state;
    return (
       <View>
         <Button className="user_info" open-type='getUserInfo' onGetUserInfo={this.getUserInfo} > 点击登录 </Button>

      </View> 
    );
  }
}

export default Login;

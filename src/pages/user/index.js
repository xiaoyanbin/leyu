import Taro, { Component } from '@tarojs/taro'
import { View, Button,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as baiduApi from './service'
import { webUrl } from '../../config'
import { AtAvatar } from 'taro-ui'
import './index.scss'
import touxiang from '../../images/icon/mr-touxiang.png'


@connect(({ home ,detail}) => ({
  ...home,
}))

class Baidu extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
      info:[],
      imgUrl:touxiang,
      imgShow:'../../public/admin/upload/20190213/1550047826846.jpg_400x400.jpg',
      uri:webUrl+'/api/doAdd',
      phone:'',
    }

  }
  async getImageInfo(typename,paths,options) {
    console.log(222,paths)
    const res = await baiduApi.baidu({
      typename: typename,
      paths:paths,
      options:options
    });
    if(res){
      const result = res.result.filter(data => data.score>0.45)
      if(result.length){
          this.setState({
            info: result
          })
      }else{
        this.setState({
          info: [{"score":0,"name":"没有数据"}]
        })
      }

    }

  }  
  getImageUrl(){
      this.getImageInfo("plantDetect",this.state.imgShow,{});
  }
  uploadFile(tempFilePaths){
      var _this =this; 
      if(Taro.getEnv()=="WEB"){
          _this.upload(tempFilePaths[0], webUrl+'/api/doAdd');

      }else{
          Taro.uploadFile({
            url: webUrl+'/api/doAdd', // 仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              user: 'test'
            },
            success(res) {
              const data = JSON.parse(res.data);
             
             
              _this.setState({
                imgUrl: webUrl+data.file,
                imgShow:"../.."+data.file
              },()=>{
              //  _this.getImageUrl();
              })
              // do something
            }
          })
      }

  }
  chooseImage (){
    var _this =this; 
    Taro.chooseImage({
      count: 1, // 默认9
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        _this.uploadFile(tempFilePaths);

      }
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
    console.log(Taro.getEnv(),111)

  }
  getGeo (e) {
    const ak = 'RmKXCpjKlwyFUVVXSCXcLF4KUsOimuuy'
    let url = 'http://api.map.baidu.com/geocoder/v2/'
    if (e.target.value) {
      wx.getLocation({
        success: geo => {
          wx.request({
            url,
            data: {
              ak,
              location: `${geo.latitude},${geo.longitude}`,
              output: 'json'
            },
            success: res => {
              console.log(res)
              if (res.data.status === 0) {
                this.location = res.data.result.addressComponent.city
              } else {
                this.location = '未知地点'
                // console.log('出错了')
              }
            }
          })
        }
      })
    } else {
      this.location = ''
    }
  }
  getPhone (e) {
    console.log(111)
    if (e.target.value) {
      console.log(111)
      const phoneInfo = wx.getSystemInfoSync()
      this.phone = phoneInfo.model
      console.log(phoneInfo)
    } else {
      // 没选中
      this.phone = ''
    }
  }
  getUserInfo = (userInfo) => {
      console.log('userinfo',userInfo)
      if(userInfo.detail.userInfo){   //同意
         // this.props.setBasicInfo(userInfo.detail.userInfo) //将用户信息存入redux
          Taro.setStorage({key:'userInfo',data:userInfo.detail.userInfo}).then(rst => {  //将用户信息存入缓存中

              Taro.navigateBack()
          })
      } else{ //拒绝,保持当前页面，直到同意 
        console.log(222)
      }
  }
  componentDidHide () { }
  render () {
    const { info,imgUrl ,phone } = this.state;
    const tabList = [{ title: "文章列表" }]
    return (

      <View className="home-page">
      <View className="face">
      <AtAvatar className="face_img" image={imgUrl} circle={true}></AtAvatar>
       <View class="btn"  onClick={this.chooseImage.bind(this)}>上传</View> 
      </View>
        {phone}
      <View>
        <Text>申请获取你的公开信息（昵称、头像等）</Text> 
        <Button open-type='getUserInfo' onGetUserInfo={this.getUserInfo} > 微信授权 </Button>
      </View>
      <View>
      <button open-type='share' class="btn">转发给好友</button>
      </View>
           
       <View onClick={this.getPhone.bind(this)}>
       1212

       { info.map((item, index) => (
         <View key={index}>
               <View> {item.name}</View>
         </View>
       ))}

       </View>
      </View>

    )
  }
}

export default Baidu

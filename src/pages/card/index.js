import Taro, { Component } from '@tarojs/taro'
import { View, Button,Image,Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as baiduApi from './service'
import { webUrl } from '../../config'
import './index.scss'
import add_img from '../../images/icon/add_img.jpg'
import img1 from '../../images/icon/new.png'
import img2 from '../../images/icon/nochose.png'
import img3 from '../../images/icon/selecte-icon.png'
@connect(({ home ,detail}) => ({
  ...home,
}))

class Words extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
      info:[],
      imgUrl:add_img,
      imgShow:'../../public/admin/upload/20190213/1550047826846.jpg_400x400.jpg',
      uri:webUrl+'/api/doAdd',
      infoText:'上传图片展示结果',
      articleId:'',
      keywords:'accurateBasic',
      landmark:'',
    }

  }
  upLoadImg (name, url) {

    const form = new FormData(); //formData 对象
    var _this =this;
    var  oReq = new XMLHttpRequest();
      //  oReq.append("files", name);
        oReq.open("POST", url, true);
        oReq.onload = function(data){
           if (oReq.status == 200){
                _this.img = JSON.parse(data.currentTarget.response);
                console.log(_this.img);
             } else {
              console.log(data)
            }
        };
        oReq.send(JSON.stringify({"data":{'filePath': name}}));
  }
  async detail(id){
    const res = await baiduApi.getDetail({
       id:id
    });
    if(res){
      console.log(res);
      this.setState({
        keywords: res.data.list.keywords,
        infoText: res.data.list.title,
       })

      
    }
  }
  async getImageInfo(typename,paths,options) {
    const res = await baiduApi.wordsClass({
      typename: typename,
      paths:paths,
      options:options
    });
    if(res){
        console.log(res)
    }

  }  
  uploadFile(tempFilePaths){
      var _this =this; 
      if(Taro.getEnv()=="WEB"){
          
          _this.upLoadImg(tempFilePaths[0], webUrl+'/api/doAdd');
         
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
                imgUrl: webUrl + data.file + "_400x400.jpg",
                imgShow:"../.." + data.file + "_400x400.jpg"
              },()=>{
                setTimeout(() => {
                  _this.getImageInfo(_this.state.keywords,_this.state.imgShow,{});
                }, 500);
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
    this.setState({
      articleId: this.$router.params.id,
    })
    //this.detail(this.$router.params.id)

  };
  componentDidHide () { }
  render () {
    const { info,imgUrl,infoText,landmark } = this.state;
    return (
      <View className="home-page">
      <View className="imgclass" onClick={this.chooseImage.bind(this)}>
          <Image src={imgUrl}></Image>
      </View>
      <View className="content_a">
         <View className="img1">
          <Image src={img1}></Image>
        </View>
        <View className="img1">
          <Image src={img2}></Image>
        </View>
        <View className="img1">
          <Image src={img3}></Image>
        </View>
      </View>
      <View className="info_show">{infoText}</View>
       <View className="list_img">
        {landmark}
       { info.map((item, index) => (
         <View key={index}>
               <View className="kno_list">
               
              {item.baike_info && <View className="kno_img">
                <Image src={item.baike_info.image_url}></Image>
              </View> }
                <View class="title"> {item.name} </View>
                <View className="kno_des">{item.baike_info.description}</View>
               </View>
         </View>
       ))}
      </View>
      </View>
    )
  }
}

export default Words

import Taro, { Component } from '@tarojs/taro'
import { View, Button,Image,Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as baiduApi from './service'
import { webUrl } from '../../config'
import { AtTextarea } from 'taro-ui'
import './index.scss'
@connect(({ home ,detail}) => ({
  ...home,
}))

class Words extends Component {
  config = {
    navigationBarTitleText: '转文字'
  }
  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
      info:[],
      imgUrl:'',
      imgShow:'../../public/admin/upload/20190213/1550047826846.jpg_400x400.jpg',
      uri:webUrl+'/api/doAdd',
      infoText:'选择含文字图片',
      articleId:'',
      keywords:'generalBasic',
      landmark:'',
      wordsResult:[],
      value:'',
      height:300,
      dataList:[],
    }

  }
  upLoadImg (name, url) {

    const form = new FormData(); //formData 对象
    var _this =this;
    var  oReq = new XMLHttpRequest();
      //  oReq.append('files', name);
        oReq.open('POST', url, true);
        oReq.onload = function(data){
           if (oReq.status == 200){
                _this.img = JSON.parse(data.currentTarget.response);
                console.log(_this.img);
             } else {
              console.log(data)
            }
        };
        oReq.send(JSON.stringify({'data':{'filePath': name}}));
  }
  async detail(id){
    const res = await baiduApi.getDetail({
       id:id
    });
    if(res){
      this.setState({
        keywords: res.data.list.keywords,
        infoText: res.data.list.title,
       })

      
    }
  }
  async getImageInfo(typename,paths,options,dataPath) {
    const res = await baiduApi.wordsClass({
      typename: typename,
      paths:paths,
      options:options
    });
    if(res){
        const data = res.words_result
        var v = [];
        var h = 400;
        data.forEach((d,index)=>{
                  v.push(d.words+' \n ')
                  h = index*35
        })
             
        this.setState({
          wordsResult: res.words_result,
          value:v.join(''),
          height:h<700 ? h :700
        })
       // this.historical({'img':dataPath,'value':v.join('')});
    }

  }  
  
  historical(data){
      const { dataList } = this.state
   
      this.setState({
        dataList : [...dataList].push(data)
      },() => {
         console.log(this.state.dataList)
      })
      //  var value = Taro.getStorageSync('dataList') || [];
      //     if(!Array.isArray(Taro.getStorageSync('dataList'))){
      //       value =[];
      //     }
          
      //   if(data){
      //         var val = value.push(data);
      //         Taro.setStorage({
      //           key: 'dataList',
      //           data: val
      //         })  
      //         this.setState({
      //           dataList : val
      //         })
      //  }
  }
  uploadFile(tempFilePaths){
      var _this =this; 
      if(Taro.getEnv()=='WEB'){
          
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
                imgUrl: webUrl + data.file,
                imgShow:'../..' + data.file
              },()=>{
                  _this.getImageInfo(_this.state.keywords,_this.state.imgShow,{},_this.state.imgUrl);
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
  setClipboard(){
    const { value } = this.state;
    Taro.setClipboardData({
      data: value,
      success(res) {
        Taro.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }
  handleChange (event) {
    this.setState({
      value: event.target.value
    })
    console.log(event.target.value)
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

  }
  componentDidHide () { }
  render () {
    const { info,imgUrl,infoText,landmark } = this.state;
    return (
      <View className='home-page'>
      <View className='title'>
        图片上的文字识别
      </View>
      <View className='updata' onClick={this.chooseImage.bind(this)}>
        上传图片
      </View>
        <View className='text'>
        
        <AtTextarea
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
          height={this.state.height}
          maxLength={2000}
          placeholder='上传图片后显示结果...'
        />
        </View>
        <View className='bottom' onClick={this.setClipboard.bind(this)}>
              复制文本
        </View>
        {/* <View className='catelist'>
          {dataList.map((item,index) => (
            <View className='view'  onClick={this.goDetail.bind(this,item._id)} >
               <Image src={item.img}></Image>  {index}{item.img}
            </View>
          ))}
        </View> */}
      </View>
    )
  }
}

export default Words

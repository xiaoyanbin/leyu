import Taro, { Component } from '@tarojs/taro';
import { View, Button, ScrollView,Image } from '@tarojs/components';
import PropTypes from 'prop-types';

import './index.scss';

class ListModule extends Component {
  static propTypes ={
    dataList: PropTypes.array, 
    titleName: PropTypes.string,
    listUrl:PropTypes.string,
  }
  static defaultProps = {

  }
  componentDidMount = () => {
        
  } 
  nextQuestion (e) {
        //  this.nextQuestion()
  }
  toUrl (name,e) {
    console.log(name,e)
    Taro.navigateTo({
      url: `/pages/${name}/index?id=${e}`,
    })
  }
  onScrolltoupper(){

  }
  onScroll(){

  }
  render() {
    const { dataList,titleName,listUrl} = this.props;
    return (
      <View className='list_module'>
           <View className='title_text'>诗词 <View className='title_right'>更多></View></View>
           <View className='module_ul'>
           <ScrollView
            scrollX
            scrollWithAnimation
            style='width:100%'
            scrollLeft='0'
            lowerThreshold='20'
            upperThreshold='20'
            onScrolltoupper={this.onScrolltoupper}
            onScroll={this.onScroll}>
            <View style='width:180%' className='module_ul'>
              { dataList.map((item, index) => (
                <View className={'module_li col'+index} key={index} onClick={this.toUrl.bind(this,listUrl,item._id)}>
                  {!item.article_img && <View className='text'>{item.title}</View> }
                  <Image  src={item.article_img ? `https://weixue.minsusuan.com${item.article_img}_400x400.jpg` : ''}></Image>     
                </View>
             ))}
             </View>
             
        </ScrollView>
      </View>
  
      </View>
    );
  }
}

export default ListModule;

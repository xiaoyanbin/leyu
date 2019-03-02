import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.scss';
import ionc1 from '../../images/icon/ionc1.png'
import ionc2 from '../../images/icon/ionc2.png'
import ionc3 from '../../images/icon/ionc3.png'
import ionc4 from '../../images/icon/ionc4.png'
class Top extends Component {
  static propTypes ={
  }

  static defaultProps = {
    list: [],
  };

  toUrl () {
    Taro.navigateTo({
      url: "/pages/plist/index?pid=5bcee18b3263442e3419080e",
    })
  }
  toList () {
    Taro.navigateTo({
      url: "/pages/poetrylist/index?pid=5c6b7815de24016a19796c7d&typeName=idiom",
    })
  }
  toAnswer (data) {
    Taro.navigateTo({
      url: data,
    })
  }

  render() {
    const { list, loading } = this.props;
    return (
          <View className="top">
          <View className="ionc1"> 
              <View className="ionc_img col1" onClick={this.toUrl.bind(this)}> 
                  <Image src={ionc1}> </Image>
              </View>
              <View className="fonts"> 古诗</View>
          </View>
          <View className="ionc1"> 
              <View className="ionc_img col2" onClick={this.toList.bind(this)}> 
                  <Image src={ionc2}> </Image>
              </View>
              <View className="fonts" > 成语</View>
          </View>
          <View className="ionc1"> 
              <View className="ionc_img col3" onClick={this.toAnswer.bind(this,"/pages/answerlist/index")}> 
                  <Image src={ionc3}> </Image>
              </View>
              <View className="fonts">速算</View>
          </View>
          <View className="ionc1"> 
              <View className="ionc_img col4" onClick={this.toAnswer.bind(this,"/pages/poetrylist/index?pid=5c721e90d2660b78319b47f7&typeName=radio")}> 
                  <Image src={ionc4}> </Image>
              </View>
              <View className="fonts">答题</View>
          </View>
      </View>
    );
  }
}

export default Top;

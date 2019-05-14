import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image,Button } from '@tarojs/components'
import PropTypes from 'prop-types'
import Collect from '../../components/Collect'
import './index.scss'

class Share extends Component {
  static propTypes ={
    detail: PropTypes.object,
    ontoEnglish:PropTypes.func,
    pid:PropTypes.string,
  }
  static defaultProps = {
    detail:{}
  }
  constructor() {
    super(...arguments)
    this.state = {
      details:{},

    }
  } 
  gotoDetail (e,f) {
    Taro.navigateTo({
      url: `/pages/list/index?pid=${e}&name=${f}`,
    })
  }
  componentDidMount(){
   
  }
  onList(){
    
    this.props.ontoEnglish(123)
  }
  onShare(d){
    this.props.onShareFun(d)
  }
  componentWillReceiveProps(e){
    const { detail } = this.props

    if(detail!==e.detail){
        this.setState({
          details:e.detail,
        },()=>{
        })
    }
  }
  render() {
    const { detail } = this.props
    const { details } = this.state
    return (
      <View className='share-list-container'>
        <View className="left">
          <View className="title">{detail.title} </View>  
          <View className="text">{detail.description} {detail.description && '/'} {detail.keywords}</View>  
        </View>  
        <Collect record={ details } onShare={this.onShare} />
      </View>
    )
  }
}

export default Share

import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import Collect from '../../components/Collect'
import InImg from '../../components/InImg'
import { videoUrl,imgUrl } from '../../config'
import './index.scss'

class IndexList extends Component {
  static propTypes ={
    list: PropTypes.array,
    ontoEnglish:PropTypes.func,
    res:PropTypes.object,
  }

  static defaultProps = {
    list: [],
  }
  constructor() {
    super(...arguments)
    this.state = {
         share:123
    }
  }  
  gotoDetail (e,pid) {
      this.props.ontoEnglish(e,pid)
  }
  onList(){
    
    this.props.ontoEnglish(123)
  }
  onCollect(){
    const { collect } = this.state
    let collects = collect;
      // this.setState({
      //    share:456
      //  })
  }
  onShare(d){
       this.props.onShareFun(d)
  }
  render() {
    const { share } = this.state
    const { list, loading,res,title ,show} = this.props
    return (
      <View className='list-container'>
      {title ? <View className='index_text'>{ title }</View> : <View className='index_n'>&nbsp;</View> }
        {
        list.length > 0 ? (
          <View className='goods-ul'>
            {
              list.map((item, index) => (
                <View key={item._id} className='goods-li' >
                  <View className='pos'>
                      {show ? <View className='image-container'>
                          <InImg img={imgUrl+item.article_img} link={videoUrl+item.link} />
                          </View> :
                            <View className='image-container' onClick={this.gotoDetail.bind(this,item._id,item.cate_id)}>
                                <Image  src={item.article_img ? imgUrl+item.article_img : ''} alt='' />
                                <View className="time">{item.keywords}</View>
                            </View>}
                  </View> 
                  <View className="left" onClick={this.gotoDetail.bind(this,item._id,res._id)}>
                      <View className='title'>{item.title}  </View>
                      <View className='text'>{res.title} {res.title &&'/'} #{item.description}</View>
                  </View>

                  {show &&<Collect record={ item } onShare={this.onShare} />}
                </View>
              ))
            }
          </View>
        ) : (
          <View />
        )
      }
      {loading && (
        <View className='loadMoreGif'>
          <View className='zan-loading'></View>
          <View className='text'>加载中...</View>
        </View>
      )}
      </View>
    )
  }
}

export default IndexList

import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import Collect from '../../components/Collect'
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
    console.log(collects)
      // this.setState({
      //    share:456
      //  })
  }
  onShare(d){
    this.props.ontoEnglish(d)
    console.log(d,123)
      //this.onCollect()

      // const { share } = this.state
      // let shares = share
      // this.setState({
      //   share:!shares
      // })
  }
  render() {
    const { share } = this.state
    const { list, loading,res,title } = this.props
    return (
      <View className='list-container'>
      {title && <View className='index_text'>{ title }</View>}
        {
        list.length > 0 ? (
          <View className='goods-ul'>
            {
              list.map((item, index) => (
                <View key={item._id} className='goods-li' >
                  <View className='pos'>
                    <View className='image-container' onClick={this.gotoDetail.bind(this,item._id,item.cate_id)}>
                      <Image  src={item.article_img ? imgUrl+item.article_img : ''} alt='' />
                    <View className="time">{item.keywords}</View>
                    </View>
                  </View>
                  <View className="left" onClick={this.gotoDetail.bind(this,item._id,res._id)}>
                      <View className='title'>{item.title}  </View>
                      <View className='text'>{res.title} / #{item.description}</View>
                  </View>
                  <Collect record={ item } onShare={this.onShare} />
                  {/* <View className="right">
                      <View className="right_r">
                      </View>
                      <View className="right_l nav">
                      200
                      </View>
                  </View>  */}
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

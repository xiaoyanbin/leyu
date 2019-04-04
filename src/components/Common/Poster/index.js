import Taro, { Component } from '@tarojs/taro'
import { View,Button } from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

class Poster extends Component {
  static propTypes ={
    shareTitle: PropTypes.string, 
    shareUrl: PropTypes.string,
  }
  static defaultProps = {

  }
  componentDidMount = () => {
    this.drawTitle({'desc':'hahah','rise_info':{'rise_percent':1}})


  }
  nextQuestion (e) {
        //  this.nextQuestion()
  }
  // 获得canvas图片信息
  ImageInfo(path: any) {
    return new Promise((resolve, reject) => { // 采用异步Promise保证先获取到图片信息才进行渲染避免报错
      Taro.getImageInfo(
        {
          src: path,
          success: function (res) {
            resolve(res)
          },
          fail: function (res) {
            reject(res)
          }
        }
      )
    })
  }

  // 保存图片
  saveImage(imgSrc: any) {
    Taro.getSetting({
      success() {
        Taro.authorize({
          scope: 'scope.writePhotosAlbum', // 保存图片固定写法
          success() {
            // 图片保存到本地
            Taro.saveImageToPhotosAlbum({
              filePath: imgSrc, // 放入canvas生成的临时链接
              success() {
                Taro.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
          },
          fail() {
            Taro.showToast({
              title: '您点击了拒绝微信保存图片，再次保存图片需要您进行截屏哦',
              icon: 'none',
              duration: 3000
            })
          }
        })
      }
    })
  }

  // 点击保存图片生成微信临时模板文件path
  save() {
    const that = this
    setTimeout(() => {
      Taro.canvasToTempFilePath({ // 调用小程序API对canvas转换成图
        x: 0, // 开始截取的X轴
        y: 0, // 开始截取的Y轴
        width: 355, // 开始截取宽度
        height: 635,  // 开始截取高度
        destWidth: 1065,  // 截取后图片的宽度（避免图片过于模糊，建议2倍于截取宽度）
        destHeight: 1905, // 截取后图片的高度（避免图片过于模糊，建议2倍于截取宽度）
        canvasId: 'poster', // 截取的canvas对象
        success: function (res) { // 转换成功生成临时链接并调用保存方法
          that.saveImage(res.tempFilePath)
        },
        fail: function (res) {
          console.log('绘制临时路径失败')
        }
      })
    }, 100) // 延时100做为点击缓冲，可以不用
  }
  // 绘画Canvas-分享图标题
  drawTitle(datas: any) {
    const cvsCtx = Taro.createCanvasContext('poster', this) // 获取到指定的canvas标签
    const grd = cvsCtx.createLinearGradient(0, 0, 0, 635); // 进行绘制背景
    grd.addColorStop(0, '#FDFCF9'); // 绘制渐变背景色
    grd.addColorStop(1, '#FCF4D4'); // 绘制渐变背景色
    cvsCtx.fillStyle = grd; // 赋值给到canvas
    cvsCtx.fillRect(0, 0, 355, 635); // 绘制canvas大小的举行
    let text = datas.desc;  // 这是要绘制的文本
    const chr = text.split(''); // 这个方法是将一个字符串分割成字符串数组
    let temp: any = ''; //  截取文字赋值
    let row: any = []; // 把截取后的段落汇合成数组
    cvsCtx.font = 'normal lighter 15px sans-serif' // 设置绘制文字样式
    cvsCtx.setFillStyle('#941D11') // 设置绘制文字颜色
    for (let a = 0; a < chr.length; a++) { // 进行循环遍历看是否超出canvas文字所在宽度
      if (cvsCtx.measureText(temp).width < 350) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失
        row.push(temp);
        temp = '';
      }
    }
    row.push(temp);
    if (row.length > 4) { // 如果文字段落大于4行
      const rowCut = row.slice(0, 5); // 截取最后一行进行省略号处理
      const rowPart = rowCut[4]; 
      let test: any = '';
      let empty: any = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (cvsCtx.measureText(test).width < 320) {
          test += rowPart[a];
        }
        else {
          break;
        }
      }
      empty.push(test);

      const group = empty[0] + '...' // 这里只显示5行，超出的用...表示
      rowCut.splice(4, 1, group);
      row = rowCut;
    }
    let i = 0  // 此处计算文本最终所占高度方便后面元素定位
    for (let b = 0; b < row.length; b++) {
      cvsCtx.fillText(row[b], 11, 80 + b * 25, 333);
      i = 80 + b * 25
    }
    this.state.canvasTextHeight = i
    cvsCtx.setFontSize(21) // 文字样式
    cvsCtx.setFillStyle('#FB4949') // 文字样式
    cvsCtx.fillText(`${datas.rise_info.rise_percent}%`, 160, 41, 70) // 文字样式
    this.ImageInfo('https://wx.minsusuan.com/img/vido.png').then(res => { // 绘制网络图片
      // 获取画布
      const cvsCtx = Taro.createCanvasContext('poster', this) // 重新定位canvas对象，双重保险
      // 绘制背景底图
      cvsCtx.drawImage(res.path, 0, 15, 149.5, 36)
      let title = datas.name
      cvsCtx.setFontSize(18)
      cvsCtx.setFillStyle('#FFFFFF')
      cvsCtx.fillText(title, 8, 39, 214)
      cvsCtx.draw(true) // 进行绘画
    })
    let redNum = Number(datas.rise_info.rise_num)
    let greenNum = Number(datas.rise_info.drop_num)
    let total = redNum + greenNum
    cvsCtx.setFillStyle('red')
    cvsCtx.fillRect(57, i + 25, (redNum / total) * 237, 16)
    cvsCtx.setFillStyle('#00CC66')
    cvsCtx.fillRect(57 + (redNum / total) * 237, i + 25, (greenNum / total) * 237, 16)
    cvsCtx.setFontSize(17)
    cvsCtx.setFillStyle('#FB4949')
    cvsCtx.fillText(`涨 ${redNum}只`, 55, i + 68, 100)
    cvsCtx.setFontSize(17)
    cvsCtx.setFillStyle('#00CC66')
    cvsCtx.fillText(`跌 ${greenNum}只`, 240, i + 68, 100)
    cvsCtx.font = 'normal lighter 12px sans-serif'
    cvsCtx.setFillStyle('#941D11')
    cvsCtx.fillText('主力净流入', 12, i + 136, 120)
    cvsCtx.fillText('3日涨幅', 106, i + 136, 120)
    cvsCtx.fillText('5日涨幅', 201, i + 136, 120)
    cvsCtx.setTextAlign('left')
    cvsCtx.fillText('10日涨幅', 292, i + 136, 49)
    this.ImageInfo('https://wx.minsusuan.com/img/vido.png').then(res => {
      // 获取画布
      const cvsCtx = Taro.createCanvasContext('poster', this)
      // 绘制背景底图
      cvsCtx.drawImage(res.path, 65, i + 168, 227, 4)
      cvsCtx.draw(true)
    })
    cvsCtx.font = 'normal bold 15px sans-serif';
    if (datas.rise_info.main_net_purchase > 0) {
      cvsCtx.setFillStyle('#FB4949')
    } else {
      cvsCtx.setFillStyle('#00CC66')
    }
    cvsCtx.fillText(`${datas.rise_info.main_net_purchase > 9999 || datas.rise_info.main_net_purchase < -9999 ? `${(datas.rise_info.main_net_purchase / 10000).toFixed(2)}亿` : `${datas.rise_info.main_net_purchase}万`}`, 12, i + 114, 120)
    if (datas.rise_info.rise_percent_of_3_day > 0) {
      cvsCtx.setFillStyle('#FB4949')
    } else {
      cvsCtx.setFillStyle('#00CC66')
    }
    cvsCtx.fillText(`${datas.rise_info.rise_percent_of_3_day}%`, 104, i + 114, 120)
    if (datas.rise_info.rise_percent_of_5_day > 0) {
      cvsCtx.setFillStyle('#FB4949')
    } else {
      cvsCtx.setFillStyle('#00CC66')
    }
    cvsCtx.fillText(`${datas.rise_info.rise_percent_of_5_day}%`, 199, i + 114, 120)
    if (datas.rise_info.rise_percent_of_10_day > 0) {
      cvsCtx.setFillStyle('#FB4949')
    } else {
      cvsCtx.setFillStyle('#00CC66')
    }
    cvsCtx.setTextAlign('left')
    cvsCtx.fillText(`${datas.rise_info.rise_percent_of_10_day}%`, 290, i + 114, 49)

    cvsCtx.draw(true)
    this.state.drawTitleData = datas
  }

  // 绘画Canvas-分享图列表
  drawList(datas: any) {
    let i = this.state.canvasTextHeight
    const cvsCtx = Taro.createCanvasContext('poster', this)
    cvsCtx.font = 'normal lighter 12px sans-serif'
    cvsCtx.setFillStyle('#941D11')
    cvsCtx.fillText('成份股', 13, i + 208, 120)
    cvsCtx.fillText('现价', 90, i + 208, 120)
    cvsCtx.fillText('涨跌幅', 139, i + 208, 120)
    cvsCtx.fillText('主力净流入', 203, i + 208, 120)
    cvsCtx.fillText('主力净买%', 281, i + 208, 120)

    for (let b = 0; b < 3; b++) {
      cvsCtx.font = 'normal bold 15px sans-serif';
      cvsCtx.setFillStyle('#FB4949')
      cvsCtx.fillText(datas[b].name, 13, i + 242 + b * 38, 120)
      if (datas[b].new_price > 0) {
        cvsCtx.setFillStyle('#FB4949')
      } else {
        cvsCtx.setFillStyle('#00CC66')
      }
      cvsCtx.fillText(datas[b].new_price, 91, i + 242 + b * 38, 120)
      if (datas[b].rise_percent > 0) {
        cvsCtx.setFillStyle('#FB4949')
      } else {
        cvsCtx.setFillStyle('#00CC66')
      }
      cvsCtx.fillText(`${datas[b].rise_percent}%`, 139, i + 242 + b * 38, 120)
      if (datas[b].main_net_purchase > 0) {
        cvsCtx.setFillStyle('#FB4949')
      } else {
        cvsCtx.setFillStyle('#00CC66')
      }
      cvsCtx.fillText(`${datas[b].main_net_purchase > 9999 || datas[b].main_net_purchase < -9999 ? `${(datas[b].main_net_purchase / 10000).toFixed(2)}亿` : `${datas[b].main_net_purchase}万`}`, 208, i + 242 + b * 38, 120)
      if (datas[b].main_net_purchase_strength > 0) {
        cvsCtx.setFillStyle('#FB4949')
      } else {
        cvsCtx.setFillStyle('#00CC66')
      }
      cvsCtx.fillText(`${datas[b].main_net_purchase_strength}%`, 285, i + 242 + b * 38, 120)
    }
    let cps = 0
    //二维码链接
    this.ImageInfo(`https://wx.minsusuan.com/img/vido.png`).then(data => {
      cvsCtx.drawImage(data.path, 10, i + 360, 60, 60)
      cvsCtx.draw(true)
    })
    cvsCtx.font = 'normal lighter 12px sans-serif'
    cvsCtx.setFillStyle('#941D11')
  }
  render() {
    const { shareTitle,shareUrl} = this.props;
    return (
    <View>
        <Canvas className='poster' canvasId='poster' style='width:355px;height:635px;'></Canvas>
    </View> 
    );
  }
}

export default Poster;

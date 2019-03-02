import Taro from '@tarojs/taro'

var websocket = function(ops){
    let _this = this;
    _this.task = {};
    _this.ready = false;
    Taro.connectSocket({
    url: ops.url,
    success: function () {
        console.log('connect success')
    }
    }).then(task => {
        task.onOpen(function () {
            console.log('onOpen')
            _this.task = task;
            _this.ready = true;
        })
        task.onMessage(function (msg) {
            ops.onMessage(msg)
           // console.log('onMessage: ', msg)
        })
        task.onError(function () {
            console.log('onError')
        })
        task.onClose(function (e) {
            console.log('onClose: ', e)
        })
    });
    this.send = function(object){
       // console.log( _this.task )
        _this.task.send( {data:object} );
    }
}
export default websocket

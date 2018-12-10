// page/live/push/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pusher:"",
    host:app.globalData.host,
    udptcode:app.globalData.udptcode,
    udptname:app.globalData.udptname,
    uname: app.globalData.uname,
    openid: app.globalData.openid,
    focus: false,
    playing: false,
    frontCamera: true,
    cameraContext: {},
    pushUrl: "",
    showHDTips: false, //显示清晰度弹窗
    mode: "HD",
    muted: false,
    enableCamera: true,
    orientation: "vertical",
    beauty: 6.3,
    whiteness: 3.0,
    backgroundMute: false,
    hide: false,
    debug: false,
    playUrl: "",
    title:"",
    notice: [],//websocket 通信列表
    socketOpen:false  //判断websocket通信是否建立
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.validateUser();//验证用户
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
    this.setData({
      pusher: wx.createLivePusherContext("pusher")
    });
    wx.request({
      url: that.data.host + "live.do",
      method: "post",
      data: {
        method: "start",
        openid:that.data.openid,
        uname:that.data.uname,
        dptname:that.data.udptname,
        dptcode:that.data.udptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data=res.data[0];
        that.setData({
          title:data.title,
          playUrl:data.liveurl
        });
        //调整页面标题名称
        wx.setNavigationBarTitle({ title: data.title });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：live_getList," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    //建立websocket连接
    wx.connectSocket({
      url: app.globalData.wss
    });
    
    //监听WebSocket动作
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
      that.setData({
        socketOpen: false
      });
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      that.setData({
        socketOpen: true
      });
    });
    wx.onSocketClose(function (res) {
      that.setData({
        socketOpen: false
      });
    });
    wx.onSocketMessage(function (res) {
      //读取所有已知信息
      var _notice = that.data.notice;
      var myDate = new Date();//获取系统当前时间
      var time = myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
      _notice.unshift({
        ntime: time, title: res.data, type: 0
      });
      //如果通信列表大于10条，开始删除数据
      if (_notice.length>=10){
        _notice.pop();
      }
      that.setData({
        socketOpen: true,
        notice: _notice
      });
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  statechange: function (e) {
    var that=this;
    var notice=this.data.notice;
    var code = e.detail.code;
    var info="";
    //增加新的消息
    switch(code){
      case 1001: info ="已经连接推流服务器";break;
      case 1002: info = "已经与服务器握手完毕,开始推流"; break;
      case 1003: info = "打开摄像头成功"; break;
      case -1301: info = "打开摄像头失败"; break;
      case -1302: info = "打开麦克风失败"; break;
      case -1303: info = "视频编码失败"; break;
      case -1307: info = "网络断连，且经多次重连抢救无效，更多重试请自行重启推流"; break;
      case 1101: info = "网络状况不佳：上行带宽太小，上传数据受阻"; break;
      case 1102: info = "网络断连, 已启动自动重连"; break;
      case 3002: info = "RTMP服务器连接失败"; break;
      case 3003: info = "RTMP服务器握手失败"; break;
      case 3004: info = "RTMP服务器主动断开，请检查推流地址的合法性或防盗链有效期"; break;
      case 3005: info = "RTMP 读/写失败"; break;
      default:info="";
    }
    if(info!=""){
      var myDate = new Date();//获取系统当前时间
      var time = myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
      notice.unshift({
        ntime: time,title: info, type: 1
      });
      that.setData({
        notice: notice
      })
    }
  },

  error: function (e) {
    console.log("error:" + e);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //关闭直播
    var that = this;
    var pusher = that.data.pusher;
    pusher.stop();
    wx.request({
      url: that.data.host + "live.do",
      method: "post",
      data: {
        method: "stop",
        openid: that.data.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：live_stop," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    //关闭通信连接
    wx.closeSocket();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //关闭直播
    var that = this;
    var pusher = that.data.pusher;
    pusher.stop();
    wx.request({
      url: that.data.host + "live.do",
      method: "post",
      data: {
        method: "stop",
        openid: that.data.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：live_stop," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    //关闭通信连接
    wx.closeSocket();
  },

  onBeautyClick: function () {
    if (this.data.beauty != 0) {
      this.data.beauty = 0;
      this.data.whiteness = 0;
    } else {
      this.data.beauty = 6.3;
      this.data.whiteness = 3.0;
    }
    this.setData({
      beauty: this.data.beauty,
      whiteness: this.data.whiteness
    })
  },

  onPushClick: function () {
    this.setData({
      playing: !this.data.playing,
    })
    if (this.data.playing) {
      this.data.pusher.start();
    } else {
      this.data.pusher.stop();
    }
  },

  onSwitchCameraClick: function () {
    this.data.frontCamera = !this.data.frontCamera;
    this.setData({
      frontCamera: this.data.frontCamera
    })
    this.data.pusher.switchCamera();
  },

  onMuteClick: function () {
    this.setData({
      muted: !this.data.muted
    })
  },

  onEnableCameraClick: function () {
    this.setData({
      enableCamera: !this.data.enableCamera
    })
    if (this.data.playing) {
      this.data.pusher.stop();
      setTimeout(() => {
        this.data.pusher.start();
      }, 500)
    }
  },

  onOrientationClick: function () {
    if (this.data.orientation == "vertical") {
      this.data.orientation = "horizontal";
    } else {
      this.data.orientation = "vertical";
    }
    this.setData({
      orientation: this.data.orientation
    })
  },
})
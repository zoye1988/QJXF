// page/live/play/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    play:"",
    playurl:"",
    notice: [],//websocket 通信列表
    socketOpen: false,  //判断websocket通信是否建立
    title:"",//输入的信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setData({
      play: wx.createLivePlayerContext("livePlayer", this),
    })
    var lid = options.lid;//读取传递的ID参数
    var host = app.globalData.host;
    app.validateUser();//验证用户
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
    wx.request({
      url: host + "live.do",
      method: "post",
      data: {
        method: "play",
        lid:lid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var live=res.data[0];
        console.log(live.playurl);
        that.setData({
          playurl:live.playurl
        });
        that.data.play.play();
        //调整页面标题名称
        wx.setNavigationBarTitle({ title: live.title });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：live_PLAY," + res.errMsg,
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
      //发送到服务器
      var uname = app.globalData.uname;
      var socketOpen = that.data.socketOpen;
      if (socketOpen == true) {
        wx.sendSocketMessage({
          data: uname + "进入直播间"
        })
      }
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
      if (_notice.length >= 10) {
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    this.data.play.stop();
    //发送到服务器
    var uname = app.globalData.uname;
    var socketOpen = that.data.socketOpen;
    if (socketOpen == true) {
      wx.sendSocketMessage({
        data: uname + "离开直播间"
      })
    }
    //关闭通信连接
    wx.closeSocket();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that=this;
    this.data.play.stop();
    //发送到服务器
    var uname = app.globalData.uname;
    var socketOpen = that.data.socketOpen;
    if (socketOpen == true) {
      wx.sendSocketMessage({
        data: uname + "离开直播间"
      })
    }
    //关闭通信连接
    wx.closeSocket();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  statechange: function (e) {
    var that = this;
    var notice = this.data.notice;
    var code = e.detail.code;
    var info = "";
    //增加新的消息
    switch (code) {
      case 2001: info = "已经连接推流服务器"; break;
      case 2002: info = "已经连接服务器,开始拉流"; break;
      case 2004: info = "视频播放开始"; break;
      case 2005: info = "视频播放进度"; break;
      case 2006: info = "视频播放结束"; break;
      case 2007: info = "视频播放Loading"; break;
      case -2301: info = "网络断连，且经多次重连抢救无效，更多重试请自行重启播放"; break;
      case -2302: info = "获取加速拉流地址失败"; break;
      case 2103: info = "网络断连, 已启动自动重连"; break;
      case 2104: info = "网络来包不稳：可能是下行带宽不足，或由于主播端出流不均匀"; break;
      case 2105: info = "当前视频播放出现卡顿"; break;
      case 2107: info = "当前视频帧不连续，可能丢帧"; break;
      case 3002: info = "RTMP服务器连接失败"; break;
      case 3003: info = "RTMP服务器握手失败"; break;
      case 3005: info = "RTMP 读/写失败"; break;
      default: info = "";
    }
    if (info != "") {
      var myDate = new Date();//获取系统当前时间
      var time = myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
      notice.unshift({
        ntime: time, title: info, type: 1
      });
      that.setData({
        notice: notice
      })
    }
    console.log("code=" + code + ",info=" + info);
  },
  //信息输入
  checkKeyWord:function(e){
    var that = this;
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    if (_title.length == 0) {
      wx.showToast({
        title: "输入不能为空",
        icon: "none",
        duration: 2000
      });
    } else {
      that.setData({
        title: ""
      });
      //发送到服务器
      var uname = app.globalData.uname;
      var socketOpen = that.data.socketOpen;
      if (socketOpen == true) {
        wx.sendSocketMessage({
          data: uname + ":" + _title
        })
      }
    }
  },
  insertWord:function(e){
    var that = this;
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    if (_title.length == 0) {
      wx.showToast({
        title: "输入不能为空",
        icon: "none",
        duration: 2000
      });
    } else {
      that.setData({
        title: _title
      });
    }
  },
  submitKeyWord:function(){
    var that = this;
    var _title = that.data.title;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    if (_title.length == 0) {
      wx.showToast({
        title: "输入不能为空",
        icon: "none",
        duration: 2000
      });
    }else{
      that.setData({
        title: ""
      });
      //发送到服务器
      var uname=app.globalData.uname;
      var socketOpen = that.data.socketOpen;
      if (socketOpen == true) {
        wx.sendSocketMessage({
          data: uname+":"+_title
        })
      }
    }
  }
})
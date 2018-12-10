// page/live/index/index.js
var app = getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    Live: [],//{lid:0,dptname:'文山州公安消防支队',dptcode:2,begintime:'2018-02-12 08:00:21',livestatus:1,liveurl:'openid',deadline:'2018-02-13 08:00:21'}
    DefaultLimit:7,//功能限制访问权限级别
    loadShow: false///加载图标显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    var host = app.globalData.host;
    wx.request({
      url: host + "live.do",
      method: "post",
      data: {
        method: "list",
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var Live = that.data.Live;
        var _Live = res.data;
        that.setData({
          Live: _Live
        });
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  //开启直播
  pushClick:function(){
    var that = this;
    var host = app.globalData.host;
    var openid=app.globalData.openid;
    //检查系统是否存在断线的直播
    wx.request({
      url: host + "live.do",
      method: "post",
      data: {
        method: "check",
        openid:openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _Live = res.data;
        if(_Live.length>=5){
          wx.showModal({
            title: "直播提示",
            content: "现场直播频道超过最大限额",
            showCancel: false,
            confirmText: "确定"
          })
        }else{
          wx.navigateTo({
            url: '../push/index',
          })
        }
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
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    var host = app.globalData.host;
    
    //清空所有数据
    that.setData({
      Live: [],
    });
    wx.request({
      url: host + "live.do",
      method: "post",
      data: {
        method: "list",
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var Live = that.data.Live;
        var _Live = res.data;
        that.setData({
          Live: _Live
        });
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
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.showToast({
          title: "刷新成功",
          image: "../../../image/ok2.png",
          duration: 2000
        })
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})
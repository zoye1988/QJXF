// index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
    downloadurl: "",
    _openid: "",
    _eid: "",
    event: {
      eid: 1,
      title: "",
      person: "",
      time: "2000-09-01",
      content: "",
      author: "",
      openid: "",
      DefaultLimit: 7//功能限制访问权限级别
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取ID
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    var eid = options.eid;
    var that = this;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    that.setData({
      downloadurl: downloadurl,
      _eid: eid,
      _openid: app.globalData.openid
    });
    wx.request({
      url: host + "events.do",
      method: "post",
      data: {
        method: "getEventsDetail",
        eid: eid,
        downloadurl: downloadurl
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _event = res.data.event;
        if (_event.eid == "" || _event.eid == null || _event.eid == "null") {
          //提示数据已经丢失
          wx.showModal({
            title: "系统提示",
            content: "数据丢失或删除",
            showCancel: false,
            confirmText: "确定",
            success: function (res) {
              if (res.confirm) {
                //返回首页
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
        that.setData({
          event: {
            eid: _event.eid,
            title: _event.title,
            time: _event.time,
            content: _event.content,
            openid: _event.openid,
            author: _event.author
          },
          imageList: _event.imgs
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：NOTE_Detail," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    //调用监听截屏操作
    wx.onUserCaptureScreen(function (res) {
      //监控到用户截屏，登记信息
      app.globalData.title = "截屏：工作要闻";
      app.globalData.url = "/page/events/detail/index?id=" + that.data.event.eid;
      app.ShareAction();
    })
  },

  //删除操作
  deleteNote: function () {
    var that = this;
    var host = app.globalData.host;
    var eid = that.data._eid;
    wx.showModal({
      title: '提示',
      content: '确定删除记录',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: host + "events.do",
            method: "post",
            data: {
              method: "delEvents",
              eid: eid
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var result = res.data.result;
              if (result === 1) {
                wx.showToast({
                  icon: "success",
                  title: "删除成功",
                  duration: 1000,
                  success: function (res) {
                    //跳转
                    wx.redirectTo({
                      url: "../index/index"
                    })
                  }
                })
              }
            },
            fail: function (res) {
              wx.showModal({
                title: "数据异常",
                content: "请检查网络或重启程序,错误代码：EVENTS_Delete," + res.errMsg,
                showCancel: false,
                confirmText: "确定"
              })
            }
          });
        } else if (res.cancel) {
        }
      }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    app.globalData.title = "工作要闻";
    app.globalData.url = "/page/events/detail/index?id=" + this.data.event.eid;
    app.ShareAction();
  },
  previewImage: function (e) {
    var that = this;
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: that.data.imageList
    })
  }
})
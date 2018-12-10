// index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
    code:"note",
    downloadurl: "",
    _openid:"",
    _nid:"",
    note:{
      nid:1,
      title:"",
      person:"",
      time:"2000-09-01",
      content:"",
      author:"",
      openid:"",
      DefaultLimit: 8//功能限制访问权限级别
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取ID
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    var nid = options.nid;
    var code = options.code;
    var that = this;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    that.setData({
      downloadurl: downloadurl,
      code:code,
      _nid:nid,
      _openid: app.globalData.openid
    });
    wx.request({
      url: host + "notice.do",
      method: "post",
      data: {
        method: "getNoteDetail",
        code:code,
        nid: nid,
        dptcode: app.globalData.udptcode,
        downloadurl: downloadurl
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _note = res.data.note;
        if (_note.nid == "" || _note.nid == null || _note.nid == "null") {
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
          note: {
            nid: _note.nid ,
            title: _note.title,
            time: _note.time,
            content: _note.content,
            openid:_note.openid,
            author:_note.author
          },
          imageList: _note.imgs
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
    wx.onUserCaptureScreen(function (res) {
      app.globalData.title = "截屏:任务通知";
      app.globalData.url = "/page/plan/show/index?nid=" + that.data.note.nid;
      app.ShareAction();
    })
  },

  //删除操作
  deleteNote:function(){
    var that = this;
    var host = app.globalData.host;
    var nid=that.data._nid;
    var code=that.data.code;
    wx.showModal({
      title: '提示',
      content: '确定删除记录',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: host + "notice.do",
            method: "post",
            data: {
              method: "delNote",
              code: code,
              nid: nid
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
                content: "请检查网络或重启程序,错误代码：NOTE_Delete," + res.errMsg,
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
    app.globalData.title = "任务通知";
    app.globalData.url = "/page/plan/show/index?nid="+this.data.note.nid;
    app.ShareAction();
  },
  previewImage: function (e) {
    var that=this;
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: that.data.imageList
    })
  }
})
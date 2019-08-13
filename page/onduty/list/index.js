// page/onduty/list/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:"",
    forces:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var host = app.globalData.host;//默认系统地址
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    that.setData({
      date: year + "-" + month + "-" + day
    });
    wx.request({
      url: host + "onduty.do",
      method: "post",
      data: {
        method: "getAllDuty",
        dptcode:app.globalData.udptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var forces=res.data;
        that.setData({
          forces:forces
        })
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：WORK_GETBRIEF," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      },
      complete: function (res) {

      }
    });
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
   * 昨日情况
   */
  lastDuty:function(){
    var that=this;
    var host = app.globalData.host;//默认系统地址
    var date = new Date();
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    that.setData({
      date: year + "-" + month + "-" + day
    });
    wx.request({
      url: host + "onduty.do",
      method: "post",
      data: {
        method: "getAllDutyLast",
        dptcode: app.globalData.udptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var forces = res.data;
        that.setData({
          forces: forces
        })
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：WORK_GETBRIEF," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      },
      complete: function (res) {

      }
    });
  }
})
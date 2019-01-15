// page/rank/group/list/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: 0,
    training: {
      tid: 0,
      title: "",
      brief: "",
      score: 0,
      records: []
    },
    records: [],
    page: 0,
    pagesize: 10,
    tid:0,
    score:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var tid = options.tid;
    var score = options.score;
    var types=options.types;
    var host = app.globalData.host;
    wx.request({
      url: host + "record.do",
      method: "post",
      data: {
        method: "getBest",
        score: score,
        tid: tid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        that.setData({
          training: res.data.training,
          tid:tid,
          score:score
        });
      },
      fail: function(res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：duty_GETRECORDSLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    //获取记录列表
    wx.request({
      url: host + "record.do",
      method: "post",
      data: {
        method: "getRank",
        score: score,
        tid: tid,
        types:types,
        page: that.data.records.length,
        pagesize: that.data.pagesize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        that.setData({
          records: res.data
        });
      },
      fail: function(res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：duty_GETRECORDSLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    var tid = that.data.tid;
    var score = that.data.score;
    var host = app.globalData.host;
    //获取记录列表
    wx.request({
      url: host + "record.do",
      method: "post",
      data: {
        method: "getRank",
        score: score,
        tid: tid,
        page: that.data.records.length,
        pagesize: that.data.pagesize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      success: function(res) {
        var _records = res.data;
        var records = that.data.records;
        for (var bt in _records) {
          records.push(_records[bt]);
        }
        that.setData({
          records: records
        });
      },
      fail: function(res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：duty_GETRECORDSLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  showRules: function() {
    this.setData({
      show: 1
    })
  },
  closeRules: function() {
    this.setData({
      show: 0
    })
  }
})
// page/rank/group/index/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dptcode:2,
    openid:"",
    tid:0,
    score:0,
    page: 0,
    pagesize: 10,
    training:{
      tid:0,
      title:"ceshi",
      dptname:"",
      dptcode:2,
      uname:"",
      openid:"",
      totals:0,
      best:""
    },
    months:[],
    records:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var tid = options.tid;
    var score = options.score;
    var dptcode=options.dptcode;
    var openid=options.openid;
    var host = app.globalData.host;
    //获得最佳记录
    wx.request({
      url: host + "record.do",
      method: "post",
      data: {
        method: "getDetailBest",
        score: score,
        tid: tid,
        dptcode:dptcode,
        openid:openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          training: res.data.training,
          tid: tid,
          score: score,
          dptcode: dptcode,
          openid: openid
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：duty_GETRECORDSLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    //获得近期月份记录
    wx.request({
      url: host + "record.do",
      method: "post",
      data: {
        method: "getMonthRecord",
        score: score,
        tid: tid,
        dptcode: dptcode,
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          months: res.data,
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：duty_GETRECORDSLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    //获取本月所有训练记录
    wx.request({
      url: host + "record.do",
      method: "post",
      data: {
        method: "getDetailRank",
        score: score,
        tid: tid,
        dptcode: dptcode,
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          records: res.data.records
        });
      },
      fail: function (res) {
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
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  delRecord:function(e){
    var rid = e.target.dataset.rid;
    var that = this;
    var host = app.globalData.host;
    wx.showModal({
      title: '提示',
      content: '确定删除此条记录',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: host + "record.do",
            method: "post",
            data: {
              method: "delRecord",
              rid:rid
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              //找到此条数据，显示隐藏
              var records = that.data.records;
              var _records = [];
              for (var bt in records) {
                if (records[bt].rid != rid) {
                  _records.push(records[bt]);
                }
              }
              that.setData({
                records: _records
              });
            },
            fail: function (res) {
              wx.showModal({
                title: "数据异常",
                content: "请检查网络或重启程序,错误代码：duty_GETRECORDSLIST," + res.errMsg,
                showCancel: false,
                confirmText: "确定"
              })
            }
          });
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
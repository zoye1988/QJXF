// page/rank/group/list/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:0,
    training:{
      tid: 0,
      title: "",
      brief: "",
      score: 0,
      records:[]
    },
    records:[
      {
        dptname:"马龙中队",
        total:7,
        record:"02'34\"13"
      },
      {
        dptname: "沾益中队",
        total: 12,
        record: "02'34\"13"
      },
      {
        dptname: "马龙中队",
        total: 2,
        record: "02'34\"13"
      },
      {
        dptname: "富源中队",
        total: 7,
        record: "02'34\"13"
      },
      {
        dptname: "会泽中队",
        total: 7,
        record: "02'34\"13"
      },
      {
        dptname: "师宗中队",
        total: 4,
        record: "02'34\"13"
      },
      {
        dptname: "师宗中队",
        total: 4,
        record: "02'34\"13"
      },
      {
        dptname: "师宗中队",
        total: 4,
        record: "02'34\"13"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var tid=options.tid;
    var score=options.score;
    var host = app.globalData.host;
    wx.request({
      url: host + "record.do",
      method: "post",
      data: {
        method: "getBest",
        score: score,
        tid:tid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          training: res.data.training
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
    //获取记录列表
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
  
  },

  showRules:function(){
    this.setData({
      show:1
    })
  },
  closeRules:function(){
    this.setData({
      show: 0
    })
  }
})
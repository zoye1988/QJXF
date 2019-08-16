// page/car/check/list/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dptcode:2,
    carlist:[],
    today:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户的dptcode
    var _dptcode=options.dptcode;
    var dptcode = 2;
    if(_dptcode==null || _dptcode=="")
      dptcode = app.globalData.udptcode;
    else
      dptcode=_dptcode;
    var that=this;
    
    var host = app.globalData.host;
    //获取当日的日期
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    if(month<10)
      month="0"+month;
    var day=date.getDate();
    if(day<10)
      day="0"+day;
    this.setData({
      today: year + "-" + month + "-" + day
    })
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "getCheckList",
        dptcode: dptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          carlist:res.data
        });
      },
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onPullDownRefresh: function () {
    
    var that = this;
    var dptcode=that.data.dptcode;
    var host = app.globalData.host;
    //获取当日的日期
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10)
      month = "0" + month;
    var day = date.getDate();
    if (day < 10)
      day = "0" + day;
    this.setData({
      today: year + "-" + month + "-" + day
    })
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "getCheckList",
        dptcode: dptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          carlist: res.data
        });
      },
    });

    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.showToast({
          title: "刷新成功",
          image: "/image/ok2.png",
          duration: 2000
        })
      }
    });
  },
})
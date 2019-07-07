// page/roster/list/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    downloadurl:"",
    fireman:0,//指战员数量
    amatuer:0,//合同制
    onDuty:0,
    offDuty:0,
    total:0,
    dptcode:2,
    dptname:"支队机关",
    rosters:[
      {
        img:"1.jpg",
        uname:"阮杰",
        jobname:"二级消防士",
        job:5,
        duty:"在位"
      },
      {
        img: "2.jpg",
        uname: "尹修波",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
      {
        img: "3.jpg",
        uname: "阮杰",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
      {
        img: "4.jpg",
        uname: "张嘉强",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
      {
        img: "5.jpg",
        uname: "张嘉强",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
      {
        img: "6.jpg",
        uname: "张嘉强",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
      {
        img: "7.jpg",
        uname: "张嘉强",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
      {
        img: "8.jpg",
        uname: "张嘉强",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
      {
        img: "9.jpg",
        uname: "张嘉强",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var downloadurl = app.globalData.downloadurl;
    that.setData({
      downloadurl: downloadurl
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

  }
})
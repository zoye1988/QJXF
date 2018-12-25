// page/rank/data/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uname:"",
    openid:"",
    dptname:"",
    dptcode:2,
    index: 0,
    array: ['火灾扑救', '抢险救援', '社会救助', '执勤保卫', '其他灾害'],
    training:[],//全部训练项目的总和
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      uname:app.globalData.uname,
      dptname:app.globalData.udptname
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
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
  
  }
})
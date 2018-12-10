// index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultHeight: 0,
    latitude: 23.37237237696649,
    longitude: 104.22358652386472,
    markers: [{
      latitude: 23.37237237696649,
      longitude: 104.22358652386472,
      iconPath: '../../../image/location.png'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.validateUser();//验证用户
    this.setData({
      latitude:options.lat,
      longitude:options.lng,
      markers:[{
        latitude: options.lat,
        longitude: options.lng,
				iconPath: '../../../image/map/'+options.type+'.png',
        width: 30,
        height: 30,
        callout:{
          content:options.title,
          color:'#888',
          fontSize:15,
          borderRadius:10,
          bgColor:'#dcdcdc',
          padding:5,
          display:'ALWAYS'
        }
      }]
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
    app.globalData.title = "地图展示";
    app.globalData.url = "/page/map/show/index";
    app.ShareAction();
  }
})
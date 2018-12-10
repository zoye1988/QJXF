// index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chemical:{
      cid:1,
      title:'',
      formula:'',
      quality:'',
      warning:'',
      danger:"",
      fire:'',
      progress:'',
      rescue:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.validateUser();//验证用户
    var host = app.globalData.host;
    var cid = options.cid;//读取传递的CID参数
    //读取单位数据
    wx.request({
      url: host + "chemical.do",
      method: "post",
      data: {
        method: "getChemicalDetail",
        cid: cid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _chemical = res.data.chemical;
        that.setData({
          chemical: _chemical
        });
        //将navrigaterBar名称修改
        wx.setNavigationBarTitle({
          title: _chemical.title
        })
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Chemical_Detail," + res.errMsg,
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
  onShareAppMessage: function () {
    app.globalData.title = "危化品";
    app.globalData.url = "/page/chemical/detail/index?id=" + this.data.chemical.cid;
    app.ShareAction();
  },
})
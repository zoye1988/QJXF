// page/union/detail/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types:"",
    title:"",
    address:"",
    tel:"",
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //app.validateUser();//验证用户
    var host = app.globalData.host;
    var _types=options.types;
    var types="";
    if(_types=="0"){
      types="专职消防队";
    } else if (_types == 1){
      types = "社会联动单位";
    }else{
      types = "微型消防站";
    }
    /*
      获取数据列表note
     */
    wx.request({
      url: host + "unions.do",
      method: "post",
      data: {
        method: "getUnion",
        uid:options.id 
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var unions = res.data.unions;
        that.setData({
          title: unions.title,
          address: unions.address,
          tel: unions.tel,
          types:types,
          id:options.id
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Unions_GETUNIONS," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  callTel: function () {
    wx.makePhoneCall({
      phoneNumber: "'" + this.data.tel + "'" //仅为示例，并非真实的电话号码
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    app.globalData.title = "联动单位";
    app.globalData.url = "/page/union/detail/index?id="+this.data.id;
    app.ShareAction();
  },
})
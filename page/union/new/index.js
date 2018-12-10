var app = getApp();
var util = require('../../../util/util.js')
var formatLocation = util.formatLocation;
// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['专职消防队', '社会联动单位', '微型消防站'],
    index: 0,
    hasLocation: false,
    title:"",
    tel:"",
    lng: 104.23315664562986,
    lat: 23.39703070770126,
    address:""
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  titleChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      title: _title
    });
  },
  telChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\Z0-9]/g, '');
    this.setData({
      tel: _title
    });
  },
  submitUnion:function(){
    var that = this;
    var host = app.globalData.host;
    var title = that.data.title;
    var tel = that.data.tel;
    var address=that.data.address;
    var lng=that.data.lng;
    var lat=that.data.lat;
    if (title === "" || tel === "" || address==="" || lng==="" || lat==="") {
      wx.showModal({
        title: "验证提示",
        content: "填写数据存在遗漏项，请检查",
        showCancel: false,
        confirmText: "确定"
      })
    } else {
      wx.showLoading({
        title: '数据上传中',
        mask: true,
        image: "../../../image/load.gif"
      })
      //将输入插入服务器
      wx.request({
        url: host + "unions.do",
        method: "post",
        data: {
          method: "addUnion",
          title: title,
          utype: that.data.index,
          address: that.data.address,
          tel: that.data.tel,
          lng:that.data.lng,
          lat:that.data.lat,
          dptcode: app.globalData.udptcode,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data.result;
          if (result == 1) {
            wx.hideLoading();
            wx.showToast({
              icon: "success",
              title: "联动单位录入成功",
              duration: 1000
            })
            //清除表格
            that.clearTable();
          } else {
            wx.showModal({
              title: "操作异常",
              content: "请检查网络或重启程序,错误代码：Union_ADDUNION," + res.errMsg,
              showCancel: false,
              confirmText: "确定"
            })
          }
        },
        fail: function (res) {
          wx.showModal({
            title: "数据异常",
            content: "请检查网络或重启程序,错误代码：Union_ADDUNION," + res.errMsg,
            showCancel: false,
            confirmText: "确定"
          })
        }
      });
    }
  },
  //清空表格数据
  clearTable: function () {
    this.setData({
      title: "",
      tel: "",
      address:"",
      index:0
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //app.validateUser();//验证用户
  },
  /**
   * 获取地址
   */
  chooseLocation: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          hasLocation: true,
          location: formatLocation(res.longitude, res.latitude),
          lng: res.longitude,//读取地址数据
          lat: res.latitude,//读取地址数据
          locationAddress: res.address,
          address: res.address
        })
      }
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
  
  }
})
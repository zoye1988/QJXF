var app = getApp();
// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chemicals:[],
    loadShow: true,///加载图标显示
    page: 0,
    pagesize: 10,
    keyword: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.validateUser();//验证用户
    //读取用户节本数据
    var host = app.globalData.host;
    //读取默认单位数据
    wx.request({
      url: host + "chemical.do",
      method: "post",
      data: {
        method: "getChemicalList",
        page: that.data.chemicals.length,
        pagesize: that.data.pagesize,
        keyword: that.data.keyword
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var chemicals = that.data.chemicals;
        var temp = res.data;
        for (var bt in temp) {
          chemicals.push({ cid: temp[bt].cid, title: temp[bt].title, formula: temp[bt].formula, quality: temp[bt].quality, warning: temp[bt].warning});
        }
        that.setData({
          chemicals: chemicals,
          loadShow: false///加载图标显示
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Chemical_GETLIST," + res.errMsg,
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
   * 页面上拉触底事件的处理函数onReachBottom
   */
  onReachBottom: function () {
    console.log("onBottom");
    var that = this;
    var host = app.globalData.host;
    this.setData({
      loadShow: true//隐藏底部加载图标
    });
    wx.request({
      url: host + "chemical.do",
      data: {
        method: "getChemicalList",
        page: that.data.chemicals.length,
        pagesize: that.data.pagesize,
        keyword: that.data.keyword
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var chemicals = that.data.chemicals;
        var temp = res.data;
        if (temp.length == 0) {
          //判断获取参数等于0，提示数据已经到底
          wx.showToast({
            title: "数据已经到底",
            image: "../../../image/warning.png",
            duration: 2000
          })
        }else{
          for (var bt in temp) {
            chemicals.push({ cid: temp[bt].cid, title: temp[bt].title, formula: temp[bt].formula, quality: temp[bt].quality, warning: temp[bt].warning });
          }
        }
        that.setData({
          chemicals: chemicals,
          loadShow: false///加载图标显示
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Chemical_GETLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  /**
   * 检索关键字
   */
  keyChange: function (e) {
    var _keyword = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _keyword = _keyword.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      keyword: _keyword
    });
  },
  searchAction: function () {
    var that = this;
    var host = app.globalData.host;
    that.setData({
      chemicals: [],//清空单位列表
      loadShow: true//隐藏底部加载图标
    });
    console.log("keyword=" + that.data.keyword);
    //读取数据
    wx.request({
      url: host + "chemical.do",
      method: "post",
      data: {
        method: "getChemicalList",
        page: that.data.chemicals.length,
        pagesize: that.data.pagesize,
        keyword: that.data.keyword
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var chemicals = that.data.chemicals;
        var temp = res.data;
        if (temp.length == 0) {
          //判断获取参数等于0，提示数据已经到底

        }
        else {
          for (var bt in temp) {
            chemicals.push({ cid: temp[bt].cid, title: temp[bt].title, formula: temp[bt].formula, quality: temp[bt].quality, warning: temp[bt].warning });
          }
        }
        that.setData({
          chemicals: chemicals,
          loadShow: false
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Chemical_SEARCHLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  }
})
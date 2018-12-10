var app = getApp();
// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xfs: [],
    loadShow: true,///加载图标显示
    page: 1,
    pagesize: 10,
    keyword: "",
    DefaultLimit: 9//功能限制访问权限级别
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.validateUser();//验证用户
    //读取用户节本数据
    var udptcode = app.globalData.udptcode;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    this.setData({
      loadShow: true//隐藏底部加载图标
    });
    //读取默认单位数据
    wx.request({
      url: host + "xfs.do",
      method: "post",
      data: {
        method: "getXfsList",
        dptcode: udptcode,
        page: that.data.xfs.length,
        pagesize: that.data.pagesize,
        keyword: that.data.keyword
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var xfslist = that.data.xfs;
        var temp = res.data;
        for (var bt in temp) {
          xfslist.push({ xid: temp[bt].xid, title: temp[bt].title, address: temp[bt].address, xstatus: temp[bt].xstatus, image: downloadurl + temp[bt].imagestring });
        }
        that.setData({
          xfs: xfslist,
          loadShow: false//隐藏底部加载图标
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取XFS_GETLIST," + res.errMsg,
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
    //加载数据
    var that = this;
    //读取用户节本数据
    var udptcode = app.globalData.udptcode;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    this.setData({
      loadShow: true//隐藏底部加载图标
    });
    //读取默认单位数据
    wx.request({
      url: host + "xfs.do",
      method: "post",
      data: {
        method: "getXfsList",
        dptcode: udptcode,
        page: that.data.xfs.length,
        pagesize: that.data.pagesize,
        keyword: that.data.keyword
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var xfslist = that.data.xfs;
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
            xfslist.push({ xid: temp[bt].xid, title: temp[bt].title, address: temp[bt].address, xstatus: temp[bt].xstatus, image: downloadurl + temp[bt].imagestring });
          }
        }
        that.setData({
          xfs: xfslist,
          loadShow: false//隐藏底部加载图标
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取XFS_GETLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  searchAction:function(){
    //加载数据
    var that = this;
    //读取用户节本数据
    var udptcode = app.globalData.udptcode;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    this.setData({
      xfs:[],//清空数据
      loadShow: true//隐藏底部加载图标
    });
    //读取默认单位数据
    wx.request({
      url: host + "xfs.do",
      method: "post",
      data: {
        method: "getXfsList",
        dptcode: udptcode,
        page: that.data.xfs.length,
        pagesize: that.data.pagesize,
        keyword: that.data.keyword
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var xfslist = that.data.xfs;
        var temp = res.data;
        if (temp.length == 0) {
          //判断获取参数等于0，提示数据已经到底
         
        } else {
          for (var bt in temp) {
            xfslist.push({ xid: temp[bt].xid, title: temp[bt].title, address: temp[bt].address, xstatus: temp[bt].xstatus, image: downloadurl + temp[bt].imagestring });
          }
        }
        that.setData({
          xfs: xfslist,
          loadShow: false//隐藏底部加载图标
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取XFS_SEARCHLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  keyChange: function (e) {
    var _keyword = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _keyword = _keyword.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      keyword: _keyword,
      bindex: 0//清空搜索类别
    });
  }
})
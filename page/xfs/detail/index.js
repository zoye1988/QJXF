var util = require('../../../util/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xfs: {
      xid: "1",
      title: "文山市东风路消防栓01",
      address: "环北区新华路10号",
      xstatus: 1,
      diameter: 60,
      pressure: 1.5,
      types: 0,
      imagestring: "temp.png",//默认本地图片数据
      lng: 104.23315664562986,
      lat: 23.39703070770126,
      dptname: '北京消防局'
    },
    xfsCheck: [],
    downloadurl:app.globalData.downloadurl
    //{ xcid: "1", checkdate: "2017-08-11 08:20:20", cresult: true }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.validateUser();//验证用户
    var xid = options.id;//读取传递的参数
    var that = this;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;//数据下载地址
    //读取单位数据
    wx.request({
      url: host + "xfs.do",
      method: "post",
      data: {
        method: "getXfsDetail",
        xid: xid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _xfs = res.data.xfs;
        if (_xfs.xid == "" || _xfs.xid == null || _xfs.xid == "null") {
          //提示数据已经丢失
          wx.showModal({
            title: "系统提示",
            content: "数据丢失或删除",
            showCancel: false,
            confirmText: "确定",
            success: function (res) {
              if (res.confirm) {
                //返回首页
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
        
        that.setData({
          xfs: _xfs
        });
        //将navrigaterBar名称修改
        wx.setNavigationBarTitle({
          title: _xfs.title
        })
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：XFS_DETAIL," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    //读取消防栓检查数据
    wx.request({
      url: host + "xfs.do",
      method: "post",
      data: {
        method: "getXfsCheckList",
        xid: xid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _xfsCheck = res.data;
        var xfsCheck = that.data.xfsCheck;
        for (var xc in _xfsCheck) {
          xfsCheck.push({ xcid: _xfsCheck[xc].xcid, xcdatetime: _xfsCheck[xc].xcdatetime, xcstatus: _xfsCheck[xc].xstatus });
        }
        that.setData({
          xfsCheck: xfsCheck
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：XFS_CHECKLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    //调用监听截屏操作
    wx.onUserCaptureScreen(function (res) {
      //监控到用户截屏，登记信息
      app.globalData.title = "截屏：消防栓";
      app.globalData.url = "/page/xfs/detail/index?id=" + that.data.xfs.xid;
      app.ShareAction();
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
    app.globalData.title = "消防栓";
    app.globalData.url = "/page/xfs/detail/index?id=" + this.data.xfs.xid;
    app.ShareAction();
  },
  //地图显示消防栓
  navimap: function (e) {
    wx.navigateTo({ url: "../../map/show/index?lat=" + e.target.dataset.lat + "&&lng=" + e.target.dataset.lng + "&&title=" + e.target.dataset.title + "&&type=" + e.target.dataset.type });
  },
  //新增检查记录
  actionSheetTap: function (e) {
    var that = this;
    var host = app.globalData.host;
    var xcstatus = 0;
    wx.showActionSheet({
      itemList: ['运行正常', '故障维修'],
      success: function (e) {
        var list = that.data.xfsCheck;
        if (list.length == 8) {
          list.pop();
        }
        if (e.tapIndex == 0)
          xcstatus = 0;
        else if (e.tapIndex == 1)
          xcstatus = 1;
        //服务器端更新数据
        wx.request({
          url: host + "xfs.do",
          method: "post",
          data: {
            method: "addXfsCheck",
            xid: that.data.xfs.xid,
            xcstatus: xcstatus,
            uname: app.globalData.uname,
            dptcode: app.globalData.udptcode,
            dptname: app.globalData.udptname
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            list.unshift({ xcid: 10, xcdatetime: res.data.xcdatetime, xstatus: res.data.xstatus });
            that.setData({
              xfsCheck: list
            });
          },
          fail: function (res) {
            wx.showModal({
              title: "数据异常",
              content: "请检查网络或重启程序,错误代码：XFS_ADDXFSCHECK," + res.errMsg,
              showCancel: false,
              confirmText: "确定"
            })
          }
        });
        
      }
    })
  }
})
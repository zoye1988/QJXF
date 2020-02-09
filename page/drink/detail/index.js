// page/car/detail/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alcohol: "",
    job: "",
    leader: "",
    leaderid: "",
    openid: "",
    aid: 0,
    DefaultLimit: 8//功能限制访问权限级别
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    this.refresh(id, that);
  },

  refresh: function (id, that) {
    that.setData({
      aid: id,
      openid: app.globalData.openid
    })
    app.validateUser();//验证用户
    app.checkVisitJob(that.data.DefaultLimit);//验证用户访问权限
    var host = app.globalData.host;//默认系统地址
    /***
     * 查询是否有已经提交的用车申请
     */
    var job = app.globalData.job;
    that.setData({
      job: app.globalData.job
    })
    wx.request({
      url: host + "alcohol.do",
      method: "post",
      data: {
        method: "getAlcoholDetail",
        aid: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var alcohol = res.data.alcohol;
        var jobcode = alcohol.jobcode;
        var openid = alcohol.openid;
        var job = app.globalData.job;
        var temp = 0;
        if (alcohol.isView == 0) {
          temp = 1;
        }
        if (alcohol.isView == 1 && jobcode == job) {
          temp = 1;
        }
        if (alcohol.isView == 1 && openid == app.globalData.openid) {
          temp = 1;
        }
        if (temp == 0) {
          wx.showModal({
            title: "系统提示",
            content: "您无权参看此页面",
            showCancel: false,
            confirmText: "确定"
          });
        }
        else {
          if (alcohol.aid != 0) {
            that.setData({
              alcohol: alcohol
            });
          } else {
            wx.showModal({
              title: "系统提示",
              content: "数据丢失或者删除",
              showCancel: false,
              confirmText: "确定"
            })
          }
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：WORK_GETBRIEF," + res.errMsg,
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    app.globalData.title = "饮酒审批";
    app.globalData.url = "/page/drink/detail/index?id=" + this.data.aid;
    app.ShareAction();
  },

  /**
   审批通过
   */
  carPassBtn: function (e) {
    var that = this;
    var aid = e.target.dataset.cid;
    var host = app.globalData.host;
    //更新车辆状态
    //确定车辆外出
    wx.request({
      url: host + "alcohol.do",
      method: "post",
      data: {
        method: "CheckAlcohol",
        aid: aid,
        leader: app.globalData.uname,
        leaderid: app.globalData.openid,
        code: 3
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data.result;
        if (result == 0) {
          wx.showModal({
            title: "操作异常",
            content: "请检查网络或重启程序,错误代码：ALCOHOL_CONFIRMLICENSE",
            showCancel: false,
            confirmText: "确定"
          })
        } else {
          wx.showToast({
            title: "已成功提交意见",
            icon: "success",
            duration: 2000
          });
          that.refresh(aid, that);
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：ALCOHO_CONFIRMLICENSE," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  /**
   * 取消审批
   */
  carDelayBtn: function (e) {
    var that = this;
    var aid = e.target.dataset.cid;
    var host = app.globalData.host;
    wx.showModal({
      title: "审批提示",
      content: "驳回饮酒审批?",
      showCancel: true,
      confirmText: "确定",
      cancelText: "取消",
      cancelColor: "#d81e06",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: host + "alcohol.do",
            method: "post",
            data: {
              method: "CheckAlcohol",
              aid: aid,
              leader: app.globalData.uname,
              leaderid: app.globalData.openid,
              code: 2
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var result = res.data.result;
              if (result == 0) {
                wx.showModal({
                  title: "操作异常",
                  content: "请检查网络或重启程序,错误代码：AlCOHOL_CONFIRMLICENSE",
                  showCancel: false,
                  confirmText: "确定"
                })
              } else {
                wx.showToast({
                  title: "完成饮酒审批",
                  icon: "success",
                  duration: 2000
                });
                that.refresh(aid, that);
              }
            },
            fail: function (res) {
              wx.showModal({
                title: "数据异常",
                content: "请检查网络或重启程序,错误代码：AlCOHOL_CONFIRMLICENSE," + res.errMsg,
                showCancel: false,
                confirmText: "确定"
              })
            }
          });
        } else if (res.cancel) {

        }
      }
    })
  }
})
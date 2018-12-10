// page/car/detail/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    driver: "",
    carid: "WJ云",
    reason: "",
    usetime: "",
    cstatus: "",
    job: 0,
    index: 0,//审批等级选择
    jobtitle: "",
    jobcode:0,
    leader: "",
    backtime:"",
    cid:0,
    DefaultLimit: 7//功能限制访问权限级别
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id=options.id;
    this.setData({
      cid:id
    })
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    var host = app.globalData.host;//默认系统地址
    /***
     * 查询是否有已经提交的用车申请
     */
    var job = app.globalData.job;
    that.setData({
      job: app.globalData.job
    })
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "getCarInfo",
        id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data.result;
        var car = res.data.car;
        if (result > 0) {
          that.setData({
            driver: car.driver,
            carid: car.carid,
            reason: car.reason,
            usetime: car.usetime,
            jobtitle: car.jobtitle,
            cstatus: car.cstatus,
            leader: car.leader,
            backtime: car.backtime,
            jobcode:car.jobcode
          });
        }else{
          wx.showModal({
            title: "系统提示",
            content: "数据丢失或者删除",
            showCancel: false,
            confirmText: "确定"
          })
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
    app.globalData.title = "派车记录";
    app.globalData.url = "/page/car/detail/index?id=" + this.data.cid;
    app.ShareAction();
  },
  /**
   审批通过
   */
  carPassBtn: function (e) {
    var that = this;
    var cid = e.target.dataset.cid;
    var host = app.globalData.host;
    wx.showModal({
      title: "审批提示",
      content: "同意车辆外出?",
      showCancel: true,
      confirmText: "确定",
      cancelText: "取消",
      cancelColor: "#d81e06",
      success: function (res) {
        if (res.confirm) {
          //确定车辆外出
          wx.request({
            url: host + "car.do",
            method: "post",
            data: {
              method: "leaderCarLicense",
              leaderid: app.globalData.openid,
              leader: app.globalData.uname,
              cid: cid,
              cstatus: 3
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var result = res.data.result;
              if (result == 0) {
                wx.showModal({
                  title: "操作异常",
                  content: "请检查网络或重启程序,错误代码：CAR_CONFIRMLICENSE",
                  showCancel: false,
                  confirmText: "确定"
                })
              } else {
                wx.showToast({
                  title: "完成车辆审批",
                  icon: "success",
                  duration: 2000
                });
                that.refresh();
              }
            },
            fail: function (res) {
              wx.showModal({
                title: "数据异常",
                content: "请检查网络或重启程序,错误代码：CAR_CONFIRMLICENSE," + res.errMsg,
                showCancel: false,
                confirmText: "确定"
              })
            }
          });

        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * 取消审批
   */
  carDelayBtn: function (e) {
    var that = this;
    var cid = e.target.dataset.cid;
    var host = app.globalData.host;
    wx.showModal({
      title: "审批提示",
      content: "取消车辆外出?",
      showCancel: true,
      confirmText: "确定",
      cancelText: "取消",
      cancelColor: "#d81e06",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: host + "car.do",
            method: "post",
            data: {
              method: "leaderCarLicense",
              leaderid: app.globalData.openid,
              leader: app.globalData.uname,
              cid: cid,
              cstatus: 2
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var result = res.data.result;
              if (result == 0) {
                wx.showModal({
                  title: "操作异常",
                  content: "请检查网络或重启程序,错误代码：CAR_CONFIRMLICENSE",
                  showCancel: false,
                  confirmText: "确定"
                })
              } else {
                wx.showToast({
                  title: "完成车辆审批",
                  icon: "success",
                  duration: 2000
                });
                that.refresh();
              }
            },
            fail: function (res) {
              wx.showModal({
                title: "数据异常",
                content: "请检查网络或重启程序,错误代码：CAR_CONFIRMLICENSE," + res.errMsg,
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
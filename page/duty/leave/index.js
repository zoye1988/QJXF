// page/duty/leave/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Leave:{
      lid:0,
      dutype:0,
      actioncheckin:"0000-00-00 00:00:00",
      actioncheckout:"0000-00-00 00:00:00",
      actionreason:"",
      leader:"",
      job:0,
      dutystatus:0,
      dptname:"",
      dptcode:2,
      openid:"",
      uname:"",
      jobtitle:""
    },
    DefaultLimit: 7,//功能限制访问权限级别
    job:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    var lid = options.lid;//读取传递的ID参数
    that.getLeave(lid);
  },

  getLeave:function(lid){
    var that=this;
    var host = app.globalData.host;
    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "getLeave",
        lid: lid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _leave = res.data[0];
        if (_leave.lid == "" || _leave.lid == null || _leave.lid == "null") {
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
          Leave: _leave,
          job: app.globalData.job
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取duty_Detail," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  //返回上级
  backBtn: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
    * 拒绝审批
    */
  dutyDelayBtn: function () {
    var that = this;
    var host = app.globalData.host;
    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "delayDuty",
        lid:that.data.Leave.lid,
        leader: app.globalData.uname
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data.result;
        if (result == 1) {
          wx.showToast({
            title: "审批操作成功",
            icon: "success",
            duration: 2000
          })
          //更新数据
          that.getLeave(that.data.Leave.lid);
        } else {
          wx.showModal({
            title: "数据异常",
            content: "请检查网络或重启程序,错误代码：读取duty_Delay," + res.errMsg,
            showCancel: false,
            confirmText: "确定"
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "网络异常",
          content: "请检查网络或重启程序",
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  /**
   * 用户点击右上角分享
   */

  /**
 * 同意审批
 */
  dutyPassBtn: function () {
    var that = this;
    var host = app.globalData.host;
    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "passDuty",
        lid: that.data.Leave.lid,
        leader: app.globalData.uname,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data.result;
        if (result == 1) {
          wx.showToast({
            title: "审批操作成功",
            icon: "success",
            duration: 2000
          })
          //更新数据
          that.getLeave(that.data.Leave.lid);
        } else {
          wx.showModal({
            title: "数据异常",
            content: "请检查网络或重启程序,错误代码：读取duty_Delay," + res.errMsg,
            showCancel: false,
            confirmText: "确定"
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "网络异常",
          content: "请检查网络或重启程序",
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },

  onShareAppMessage: function () {
    app.globalData.title = "请假加班申请";
    app.globalData.url = "/page/duty/leave/index?lid=" + this.data.Leave.lid;
    app.ShareAction();
  }
})
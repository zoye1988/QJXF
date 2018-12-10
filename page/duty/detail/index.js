// page/duty/detail/index.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Duty:{
      did:0,
      dutytime:"",
      morningcheckin:"",
      morningcheckout:"",
      afternooncheckin:"",
      afternooncheckout:"",
      workcheck:"",
      dutype:0,
      actioncheckin:"",
      actioncheckout:"",
      actionreason:"",
      leader:"",
      leadercode:0,//指定审批权限
      dutystatus:0,
      dptname:"",
      dptcode:2,
      openid:"",
      uname:"",
      jobtitle:"未审核人员"
    },
    job:0,
    DefaultLimit: 7//功能限制访问权限级别
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    var host = app.globalData.host;
    var udptcode = app.globalData.udptcode;
    var did = options.did;//读取传递的ID参数
    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "getDuty",
        did: did,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _duty = res.data[0];
        if (_duty.did == "" || _duty.did == null || _duty.did == "null") {
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
          Duty: _duty,
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
  //返回上级
  backBtn:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 同意审批
   */
  dutyPassBtn:function(){
    var that=this;
    var openid = that.data.Duty.openid;
    var dutytime = that.data.Duty.dutytime;
    var host = app.globalData.host;
    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "passDuty",
        openid: openid,
        dutytime: dutytime,
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
          wx.request({
            url: host + "duty.do",
            method: "post",
            data: {
              method: "getDuty",
              did: that.data.Duty.did,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var _duty = res.data[0];
              if (_duty.did == "" || _duty.did == null || _duty.did == "null") {
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
                Duty: _duty,
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
   * 拒绝审批
   */
  dutyDelayBtn:function(){
    var that = this;
    var host = app.globalData.host;
    var openid = that.data.Duty.openid;
    var dutytime=that.data.Duty.dutytime;
    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "delayDuty",
        openid: openid,
        dutytime:dutytime,
        leader: app.globalData.uname
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result=res.data.result;
        if(result==1){
          wx.showToast({
            title: "审批操作成功",
            icon: "success",
            duration: 2000
          })
          //更新数据
          wx.request({
            url: host + "duty.do",
            method: "post",
            data: {
              method: "getDuty",
              did: that.data.Duty.did,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var _duty = res.data[0];
              if (_duty.did == "" || _duty.did == null || _duty.did == "null") {
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
                Duty: _duty,
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
        }else{
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
  }

})
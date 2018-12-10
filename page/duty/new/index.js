// page/duty/new/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lid:0,
    uname:app.globalData.uname,
    dptname:app.globalData.udptname,
    dptcode:app.globalData.udptcode,
    openid:app.globalData.openid,
    jobtitle:app.globalData.jobtitle,
    job:app.globalData.job,
    dutype:0,
    begindate:"0000-00-00",
    enddate:"0000-00-00",
    begintime:"00:00",
    endtime:"23:59",
    actionreason:"",
    actioncheckin:"",
    actioncheckout:"",
    leader:"",
    dutystatus:0,
    array: [],
    arrayID: [],
    jindex:0,
    lindex:0,
    _job:0,
    leaveArray: ['请选择', '事假', '休假', '病假', '产(护理)假', '婚假', '加班'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.validateUser();//验证用户
    var host = app.globalData.host;//默认系统地址
    this.getLeaveRecord(host);
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "getJobList",
        job: that.data.job
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var array = [];
        var arrayID = [];
        var temp = res.data;
        for (var bt in temp) {
          array.push(temp[bt].jtitle);
          arrayID.push(temp[bt].jobcode);
        }
        that.setData({
          array: array,
          arrayID: arrayID
        });
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
  getLeaveRecord:function(host){
    var that=this;
    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "getLeaveRecode",
        openid: that.data.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var leaves = res.data[0];
        that.setData({
          lid: leaves.lid,
          dutype: leaves.dutype,
          actioncheckin: leaves.actioncheckin,
          actioncheckout: leaves.actioncheckout,
          actionreason: leaves.actionreason,
          leader: leaves.leader,
          _job: leaves.job,
          dutystatus: leaves.dutystatus,
          begindate: leaves.dutytime,
          enddate: leaves.dutytime
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
   * 请假类别选择
   */
  leaveChange: function (e) {
    this.setData({
      dutype: e.detail.value
    })
  },
  jobChange: function (e) {
    this.setData({
      jindex: e.detail.value
    })
  },
  /**
   * 开始日期
   */
  beginDateChange: function (e) {
    this.setData({
      begindate: e.detail.value
    })
  },
  endDateChange: function (e) {
    this.setData({
      enddate: e.detail.value
    })
  },
  beginTimeChange: function (e) {
    this.setData({
      begintime: e.detail.value
    })
  },
  endTimeChange: function (e) {
    this.setData({
      endtime: e.detail.value
    })
  },
  reasonChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      actionreason: _title
    });
  },
  /**
   * 提交申请
   */
  submitLeave: function () {
    var that = this;
    var actionreason = that.data.actionreason;
    var dutype = that.data.dutype;
    //比对日期和时间
    if (actionreason == "" || actionreason == null) {
      wx.showModal({
        title: "数据检查",
        content: "申请原因不能为空",
        showCancel: false,
        confirmText: "确定"
      })
      return;
    }
    //申请类别
    if (dutype == 0) {
      wx.showModal({
        title: "数据检查",
        content: "请选择申请类别",
        showCancel: false,
        confirmText: "确定"
      })
      return;
    }
    //比较时间
    var d1 = that.data.begindate + " " + that.data.begintime;
    var d2 = that.data.enddate + " " + that.data.endtime;
    if ((new Date(d1.replace(/-/g, "\/"))) >= (new Date(d2.replace(/-/g, "\/")))) {
      wx.showModal({
        title: "数据检查",
        content: "结束时间必须大于开始时间",
        showCancel: false,
        confirmText: "确定"
      })
      return;
    }
    var host = app.globalData.host;//默认系统地址
    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "newAction",
        openid: that.data.openid,
        uname: that.data.uname,
        dptcode: that.data.dptcode,//员工所属的单位
        dptname: that.data.dptname,
        jobtitle: that.data.jobtitle,
        dutype: that.data.dutype,//请假类别
        actionreason: that.data.actionreason,
        actioncheckin: d1,
        actioncheckout: d2,
        job: that.data.arrayID[that.data.jindex],
        dutystatus: 3//审批中
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data.result;
        if (result == 1) {
          wx.showToast({
            title: "申请提交成功",
            icon: "success",
            duration: 2000
          })
          //更新数据
          that.getLeaveRecord(host)
        } else {
          wx.showModal({
            title: "数据异常",
            content: "请检查网络或重启程序,错误代码：读取duty_SUBMITlEAVE," + res.errMsg,
            showCancel: false,
            confirmText: "确定"
          })
        }

      },
      fail: function (res) {
        wx.showModal({
          title: "连接异常",
          content: "网络超时，请检查网络连接",
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  /**
   * 取消申请
   * 
   */
  cancelLeave: function () {
    var that = this;
    var host = app.globalData.host;//默认系统地址
    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "cancelAction",
        lid:that.data.lid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data.result;
        if (result == 1) {
          wx.showToast({
            title: "申请取消成功",
            icon: "success",
            duration: 2000
          })
          //更新数据
          that.getLeaveRecord(host);

        } else {
          wx.showModal({
            title: "数据异常",
            content: "请检查网络或重启程序,错误代码：读取duty_CANCELlEAVE," + res.errMsg,
            showCancel: false,
            confirmText: "确定"
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "连接异常",
          content: "网络超时，请检查网络连接",
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  resetLeave:function(){
    this.setData({
      lid:0,
      actionreason:"",
      dutype:0,
      jindex:0
    });
  }
})
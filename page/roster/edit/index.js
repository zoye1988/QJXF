// page/roster/edit/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    downloadurl: app.globalData.downloadurl,
    uid: 1,
    uname: "",
    jobname: "",
    dptname: "",
    sexy: 0,
    nations: "",
    hometown: "",
    politics: 0,
    joindate: "2019-11-09",
    brithday: "2019-11-09",
    tel: "0",
    dutystatus: 0,
    img: "nohead.png",
    sex:["男","女"],
    plist: ["群众", "共青团员", "共产党员","其他党员"],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var uid=options.uid;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "editRoster",
        uid: uid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var person = res.data.user;
        that.setData({
          uid: person.uid,
          uname: person.uname,
          jobname: person.jobname,
          dptname: person.dptname,
          sexy: person.sexy,
          nations: person.nations,
          hometown: person.hometown,
          politics: person.politics,
          joindate: person.joindate,
          brithday: person.brithday,
          tel: person.tel,
          dutystatus: person.dutystatus,
          img: person.img,
          downloadurl: downloadurl,
        });

      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取USER_GETLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },

  jobnameChange:function(e){
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      jobname: _title
    });
  },
  nationsChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    this.setData({
      nations: _title
    });
  },
  hometownChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    this.setData({
      hometown: _title
    });
  },
  sexyChange: function (e) {
    this.setData({
      sexy: e.detail.value
    })
  },
  politicsChange: function (e) {
    this.setData({
      politics: e.detail.value
    })
  },
  joinDateChange: function (e) {
    this.setData({
      joindate: e.detail.value
    })
  },
  brithdayChange: function (e) {
    this.setData({
      brithday: e.detail.value
    })
  },
  telChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      tel: _title
    });
  },
  submitRoater:function(){
    var that=this;
    var nations=that.data.nations;
    var hometown=that.data.hometown;
    var tel=that.data.tel;
    if(nations.length==0){
      wx.showModal({
        title: "数据检查",
        content: "民族不能为空",
        showCancel: false,
        confirmText: "确定"
      })
      return;
    }
    if (hometown.length == 0) {
      wx.showModal({
        title: "数据检查",
        content: "籍贯不能为空",
        showCancel: false,
        confirmText: "确定"
      })
      return;
    }
    if (tel.length == 0) {
      wx.showModal({
        title: "数据检查",
        content: "联系方式不能为空",
        showCancel: false,
        confirmText: "确定"
      })
      return;
    }
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "updateRoster",
        uid: that.data.uid,
        jobname: that.data.jobname,
        sexy: that.data.sexy,
        nations: that.data.nations,
        hometown: that.data.hometown,
        politics: that.data.politics,
        joindate: that.data.joindate,
        brithday: that.data.brithday,
        tel: that.data.tel,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result=res.data.result;
        if(result==1){
          wx.showToast({
            title: "申请提交成功",
            icon: "success",
            duration: 2000
          })
        }else {
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
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取USER_GETLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });

  }
})
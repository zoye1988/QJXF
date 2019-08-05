// page/roster/detail/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    downloadurl: app.globalData.downloadurl,
    host:"",
    DefaultLimit: 7,//功能限制访问权限级别,中队成员以上访问
    person:[],
    currentTab:0,
    bitems: ["在岗","不在岗"],
    bitemsval: [0,1],
    temperson:{
      uid:0,
      img:"nohead.jpg"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var uid = options.uid;
    var dptcode=options.dptcode;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    //读取本级所有人员的信息，然后逐个挑选。
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "rosterDetail",
        dptcode:dptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _person=res.data;
        //循环查找UID指定的数据
        var currentTab=0;
        for (var i=0; i <_person.length;i++){
          if(_person[i].uid==uid){
            currentTab=i;
          }
        }
        that.setData({
          person: _person,
          downloadurl: downloadurl,
          currentTab: currentTab
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
  //移除
  removeBtn:function(e){
    var uname = e.target.dataset.uname;
    var uid=e.target.dataset.uid;
    var host = app.globalData.host;
    wx.showModal({
      title: '提示',
      content: '确定删除'+uname+"?",
      success: function (res) {
        if (res.confirm) {
          //将人员调整为未授权人员
          wx.request({
            url: host + "user.do",
            method: "post",
            data: {
              method: "removeUser",
              uid: uid
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var result=res.data.result;
              if(result==1){
                wx.showToast({
                  title: "成功移除用户",
                  icon: "success",
                  duration: 2000
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
      }
    });
  },
  statusChange: function (e) {
    var uid = e.target.dataset.uid;
    var index=e.detail.value
    //调整本地数据中的数据
    var person=this.data.person;
    for(var i=0;i<person.length;i++){
      if(person[i].uid==uid){
        person[i].dutystatus = index;
      }
    }
    //服务器端调整
    var host = app.globalData.host;
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "updateDutyStatus",
        uid: uid,
        dutystatus: index
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data.result;
        if (result == 1) {
          wx.showToast({
            title: "状态调整成功",
            icon: "success",
            duration: 2000
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
    this.setData({
      person: person
    });
  },
  editDuty:function(e){
    var uid = e.target.dataset.uid;
    wx.navigateTo({
      url: '../edit/index?uid='+uid,
    })
  }
})
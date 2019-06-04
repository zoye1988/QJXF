// page/illegal/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uname: "", //用户名称
    openid: "",
    uimg: "",
    isPost:0
  },
  //授权获取用户基本信息
  onGotUserInfo: function(e) {
    var that=this;
    var userInfo = e.detail.userInfo;
    that.setData({
      uname: "待审核用户",
      uimg: userInfo.avatarUrl
    });
    wx.setStorageSync("uname", "待审核用户");
    wx.setStorageSync("uimg", userInfo.avatarUrl);
    that.login();
  },
  login:function(){
    var that = this; //test
    var host = app.globalData.host; //默认系统地址
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: host + "user.do",
            method: "post",
            data: {
              method: "getOpenid",
              code: res.code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var openid = res.data.openid;
              if (openid == "" || openid == null || openid == "null") {
                wx.showModal({
                  title: "系统提示",
                  content: "读取用户信息失败，请重启程序",
                  showCancel: false,
                  confirmText: "确定"
                })
              } else {
                that.setData({
                  openid: openid,
                  isPost:1
                })
                
                wx.setStorageSync("openid", openid);
                wx.setStorageSync("isPost", 1);
                that.checkAuth();
              }
            },
            fail: function (res) {
              wx.showModal({
                title: "操作异常",
                content: "请检查网络或重启程序,",
                showCancel: false,
                confirmText: "确定"
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var  that=this;
    that.setData({
        isPost: wx.getStorageSync("isPost")
    });
    if(that.data.isPost!=0){
      that.setData({
        openid: wx.getStorageSync("openid"),
        uname: wx.getStorageSync("uname"),
        uimg: wx.getStorageSync("uimg")
      })
      that.checkAuth(); //发送审核核实请求
    }
    
  },
  //检查用户身份
  checkAuth: function() {
    var that = this; //test
    var host = app.globalData.host; //默认系统地址
    var uname = this.data.uname;
    var openid = this.data.openid;
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "checkAuth",
        uname: uname,
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var result = res.data.result;
        var user = res.data.user;
        if (result == 1) {
          wx.showModal({
            title: "系统提示",
            content: "申请已经提交，请耐心等待验证",
            showCancel: false,
            confirmText: "确定"
          })
        } else {
          //如果查询到用户已经被审核通过，cookie存入数据
          if (user.ustatus == 1) {
            wx.setStorageSync("openid", openid);
            wx.setStorageSync("uname", user.uname);
            wx.setStorageSync("uimg", that.data.uimg);
            wx.setStorageSync("udptcode", user.dptcode);
            wx.setStorageSync("udptname", user.dptname);
            wx.setStorageSync("job", user.job);
            wx.setStorageSync("jobtitle", user.jobtitle);
            wx.setStorageSync("ustatus", user.ustatus);
            wx.setStorageSync("user_sercertcode", user.sercertcode);
            wx.setStorageSync("lastlogindate", user.lastlogindate);
            wx.setStorageSync("accidentdate", '2000-10-01 09:00:00');
            wx.setStorageSync("taskdate", '2000-10-01 09:00:00');
            wx.setStorageSync("worknotedate", '2000-10-01 09:00:00');
            wx.setStorageSync("eventdate", '2000-10-01 09:00:00');
            wx.setStorageSync("homedate", '2000-10-01 09:00:00');
            //第一次读取数据
            app.globalData.openid = wx.getStorageSync("openid");
            app.globalData.uname = wx.getStorageSync("uname");
            app.globalData.udptcode = wx.getStorageSync("udptcode");
            app.globalData.udptname = wx.getStorageSync("udptname");
            app.globalData.job = wx.getStorageSync("job");
            app.globalData.jobtitle = wx.getStorageSync("jobtitle");
            app.globalData.uimg = wx.getStorageSync("uimg");
            app.globalData.ustatus = wx.getStorageSync("ustatus");
            app.globalData.user_sercertcode = wx.getStorageSync("user_sercertcode");
            app.globalData.lastlogindate = wx.getStorageSync("lastlogindate");
            app.globalData.worknotedate = wx.getStorageSync("worknotedate");
            app.globalData.accidentdate = wx.getStorageSync("accidentdate");
            app.globalData.taskdate = wx.getStorageSync("taskdate");
            app.globalData.eventdate = wx.getStorageSync("eventdate");
            app.globalData.homedate = wx.getStorageSync("homedate");
            //跳转到首页
            wx.showModal({
              title: "系统提示",
              content: "管理员授权成功",
              showCancel: false,
              confirmText: "确定",
              success: function(res) {
                if (res.confirm) {
                  //返回首页
                  wx.reLaunch({
                    url: '/page/home/index',
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: "系统提示",
              content: "申请已经提交，请耐心等待验证",
              showCancel: false,
              confirmText: "确定",
              success: function (res) {
                
              }
            })
          }
        }
      },
      fail: function(res) {
        wx.showModal({
          title: "操作异常",
          content: "请检查网络或重启程序,",
          showCancel: false,
          confirmText: "确定"
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})
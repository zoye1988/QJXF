// page/illegal/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uname: "",//用户名称
    openid:"",
    uimg:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;//test
    var host = app.globalData.host;//默认系统地址
    //获取用户信息和openid
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo;
        that.setData({
          uname:userInfo.nickName,
          uimg: userInfo.avatarUrl
        });
      }
    });
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
              if(openid=="" || openid==null || openid=="null"){
                wx.showModal({
                  title: "系统提示",
                  content: "读取用户信息失败，请重启程序",
                  showCancel: false,
                  confirmText: "确定"
                })
              }else{
                that.setData({
                  openid: openid
                })
                that.checkAuth();//发送审核核实请求
              }
            },
            fail:function(res){
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
  //检查用户身份
  checkAuth:function(){
    var that = this;//test
    var host = app.globalData.host;//默认系统地址
    var uname=this.data.uname;
    var openid=this.data.openid;
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "checkAuth",
        uname:uname,
        openid:openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result=res.data.result;
        var user=res.data.user;
        if(result==1){
          wx.showToast({
            icon: "success",
            title: "已成功提交申请",
            duration: 1000
          })
        }else{
          //如果查询到用户已经被审核通过，cookie存入数据
          if(user.ustatus==1){
              wx.setStorageSync("openid", openid);
              wx.setStorageSync("uname", user.uname);
              wx.setStorageSync("uimg", that.data.uimg);
              wx.setStorageSync("udptcode", user.dptcode);
              wx.setStorageSync("udptname", user.dptname);
              wx.setStorageSync("job", user.job);
              wx.setStorageSync("jobtitle", user.jobtitle);
              wx.setStorageSync("ustatus",user.ustatus);
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
                success: function (res) {
                  if (res.confirm) {
                    //返回首页
                    wx.reLaunch({
                      url: '/page/home/index',
                    })
                  }
                }
              })
          }else{
            wx.showToast({
              icon: "loading",
              title: "等待管理员审核",
              duration: 1000
            })
          }
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

  }
})
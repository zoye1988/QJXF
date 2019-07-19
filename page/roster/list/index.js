// page/roster/list/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dptlist: [],//单位列表
    dptlistval: [0],
    bindex: 0,//默认选择类型
    downloadurl:"",
    fireman:0,//指战员数量
    amatuer:0,//合同制
    onDuty:0,
    offDuty:0,
    total:0,
    page: 1,
    pagesize: 16,
    dptcode:2,
    DefaultLimit: 7,//功能限制访问权限级别,中队成员以上访问
    dptname:"支队机关",
    dptcode:2,
    rosters:[
      {
        img:"1.jpg",
        uname:"阮杰",
        jobname:"二级消防士",
        job:5,
        duty:"在位"
      },
      {
        img: "2.jpg",
        uname: "尹修波",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
      {
        img: "3.jpg",
        uname: "阮杰",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
      {
        img: "4.jpg",
        uname: "张嘉强",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
      {
        img: "5.jpg",
        uname: "张嘉强",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
      {
        img: "6.jpg",
        uname: "张嘉强",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
      {
        img: "7.jpg",
        uname: "张嘉强",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
      {
        img: "8.jpg",
        uname: "张嘉强",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
      {
        img: "9.jpg",
        uname: "张嘉强",
        jobname: "二级消防士",
        job: 5,
        duty: "在位"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    that.setData({
      uname: app.globalData.uname,
      openid: app.globalData.openid
    });
    var job = app.globalData.job;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    that.setData({
      downloadurl: downloadurl,
      dptname:app.globalData.udptname,
      dptcode:app.globalData.udptcode
    });
    //读取所有单位的列表
    //获取单位列表
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "dptListLimit",
        dptcode:app.globalData.udptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _dptlist = that.data.dptlist;
        var _dptlistval = that.data.dptlistval;
        var temp = res.data;
        for (var bt in temp) {
          _dptlist.push(temp[bt].dname);
          _dptlistval.push(temp[bt].dcode);
        }
        that.setData({
          dptlist: _dptlist,
          dptlistval: _dptlistval
        });
      },
    });
    //读取本单位的人员信息
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "userlist",
        page: that.data.user.length,
        pagesize: that.data.pagesize,
        dptcode: that.data.dptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var user = that.data.user;
        var temp = res.data;
        that.setData({
          rosters: temp,
          loadShow: false//隐藏底部加载图标
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})
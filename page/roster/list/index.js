// page/roster/list/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dptlist: [],//单位列表
    dptlistval: [],
    bindex: 0,//默认选择类型
    downloadurl:"",
    fireman:0,//指战员数量
    amatuer:0,//合同制
    onDuty:0,
    offDuty:0,
    total:0,
    page: 1,
    pagesize: 20,
    dptcode:2,
    DefaultLimit: 7,//功能限制访问权限级别,中队成员以上访问
    dptname:"支队机关",
    dptcode:2,
    rosters:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var _dptcode=options.dptcode;
    var _dptname=options.dptname;
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    that.setData({
      uname: app.globalData.uname,
      openid: app.globalData.openid
    });
    var job = app.globalData.job;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    if(_dptcode==null || _dptcode==""){
      that.setData({
        downloadurl: downloadurl,
        dptname: app.globalData.udptname,
        dptcode: app.globalData.udptcode
      });
    }else{
      that.setData({
        downloadurl: downloadurl,
        dptname: _dptname,
        dptcode: _dptcode
      });
    }
    
    //读取所有单位的列表
    //获取单位列表
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "dptListLimit",
        dptcode:that.data.dptcode
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
    that.getRoster(this);
    //获取本级所有人员数量
    that.getRosterTotal(this);
  },

  //获取人员函数
  getRoster:function(that){
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "rosterlist",
        page: that.data.rosters.length,
        pagesize: that.data.pagesize,
        dptcode: that.data.dptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var rosters = that.data.rosters;
        var temp = res.data;
        for(var t in temp){
          rosters.push({
            uid:temp[t].uid,
            uname:temp[t].uname,
            dptname:temp[t].dptname,
            jobname:temp[t].jobname,
            dutystatus:temp[t].dutystatus,
            dptcode:temp[t].dptcode,
            img:temp[t].img
          });
        }
        that.setData({
          rosters: rosters,
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

  //获取全部人员统计数据
  getRosterTotal: function (that){
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "rosterTotal",
        dptcode: that.data.dptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          onDuty: res.data.onDutyCount,
          offDuty:res.data.offDutyCount,
          fireman:res.data.firemanCount,
          amatuer:res.data.amatuerCount
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
  bindPickerChange:function(e){
    var that = this;
    var host = app.globalData.host;
    that.setData({
      bindex: e.detail.value,
      dptcode: that.data.dptlistval[e.detail.value],
      dptname: that.data.dptlist[e.detail.value],
      //情况数据
      rosters:[],
      onDuty:0,
      offDuty:0,
      fireman:0,
      amatuer:0
    });
    //读取本单位的人员信息
    that.getRoster(this);
    //获取本级所有人员数量
    that.getRosterTotal(this);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this;
    that.getRoster(this);
  }
})
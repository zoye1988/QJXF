// page/rank/data/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uname:"",
    openid:"",
    dptname:"",
    dptcode:2,
    index: 0,
    array: [],
    training:[],//全部训练项目的总和
    user:[],
    score:0,
    title:"",
    tid:0,
    note:1,//提示用户没有找到用户
    min:0,//分
    sec:0,//秒
    mse:0,//毫秒
    sum:0//个数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var host = app.globalData.host;
    wx.request({
      url: host + "record.do",
      method: "post",
      data: {
        method: "getTraining",
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var training = res.data;
        var array=that.data.array;
        var score = 0,tid=0,title='';
        if (training.length!=0){
          score=training[0].score;
          tid = training[0].tid;
          title=training[0].title;
        }
        //将训练列表数据植入select中
        for (var bt in training){
          array.push(training[bt].title);
        }
        that.setData({
          training: training,
          uname: app.globalData.uname,
          openid: app.globalData.openid,
          dptname: app.globalData.udptname,
          dptcode: app.globalData.udptcode,
          array:array,
          score:score,
          tid:tid,
          title:title
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：duty_GETRECORDSLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });

  },
  bindPickerChange: function (e) {
    var that=this;
    var index = e.detail.value;
    var training=that.data.training;
    that.setData({
      index: index,
      tid:training[index].tid,
      title:training[index].title,
      score:training[index].score
    });
  },
  //检查用户数据
  unameCheck:function(e){
    var that = this;
    var host = app.globalData.host;
    var uname = e.detail.value;
    //查询后台
    var dptcode = app.globalData.udptcode;
    wx.request({
      url: host + "record.do",
      method: "post",
      data: {
        method: "getUser",
        uname:uname,
        dptcode:dptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var user=res.data;
        that.setData({
          user:user,
          note:user.length
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：duty_GETRECORDSLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },

  updateUsr: function (e){
    var that=this;
    that.setData({
      uname: e.currentTarget.dataset.uname,
      openid: e.currentTarget.dataset.openid,
      dptcode: e.currentTarget.dataset.dptcode,
      dptname: e.currentTarget.dataset.dptname,
      user:[]
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
  min:function(e){
    this.setData({
      min: e.detail.value
    });
  },
  sec:function(e){
    this.setData({
      sec: e.detail.value
    });
  },
  mse:function(e){
    this.setData({
      mse: e.detail.value
    });
  },
  sum:function(e){
    this.setData({
      sum: e.detail.value
    });
  },
  setRecord:function(){
    var that=this;
    var host = app.globalData.host; 
    var openid=that.data.openid;
    var uname=that.data.uname;
    var dptcode=that.data.dptcode;
    var dptname=that.data.dptname;
    var tid=that.data.tid;
    var temp=0;
    var score=that.data.score;
    if(score==0){
      temp = 6000*that.data.min+100*that.data.sec+1*that.data.mse;
    }else{
      temp=1*that.data.sum;
    }
    if(temp==0){
      wx.showToast({
        image: "../../../image/warning.png",
        title: "记录不能为0",
        duration: 2000
      })
      return;
    }
    wx.request({
      url: host + "record.do",
      method: "post",
      data: {
        method: "setRecord",
        uname: uname,
        openid: openid,
        dptcode: dptcode,
        dptname: dptname,
        tid: tid,
        record: temp
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data.result;
        if(result!=0){
          wx.showToast({
            title: "记录采集成功",
            duration: 2000
          });
        }else{
          wx.showToast({
            image: "../../../image/warning.png",
            title: "记录录入失败",
            duration: 2000
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：duty_GETRECORDSLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  }
})
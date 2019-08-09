// page/onduty/edit/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:"",
    val1:"",
    val2: "",
    val3: "",
    val4: "",
    val5: "",
    val6: "",
    val7: "",
    val8: "",
    val9: "",
    val10: "",
    val11: "",
    val12: "",
    val13: "",
    val14: "",
    duty:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var host = app.globalData.host;//默认系统地址
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    if(month<10){
      month="0"+month;
    }
    var day=date.getDate();
    if(day<10){
      day="0"+day;
    }
    that.setData({
      date:year+"-"+month+"-"+day
    })
    //获取检查列表
    var dptcode=app.globalData.udptcode;
    wx.request({
      url: host + "onduty.do",
      method: "post",
      data: {
        method: "getDutyList",
        //dptcode: dptcode
        dptcode: 430
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        var _duty=res.data;
        that.setData({
          duty:_duty
        });
        //将值班表填入
        for(var i=0;i<_duty.length;i++){
          var dutys=_duty[i].ondutys;
          for(var t=0;t<dutys.length;t++){
            var dname = "val"+dutys[t].indexs;
            that.setData({
             dname:dutys[t].dval
            })
          }
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：WORK_GETBRIEF," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      },
      complete: function (res) {

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
    
  }
})
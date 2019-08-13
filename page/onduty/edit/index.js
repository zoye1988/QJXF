// page/onduty/edit/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:"",
    dutys:[
      {
        dname:"带班领导",
        dval:"",
        indexs:3,
        types:1
      },
      {
        dname: "值班长",
        dval: "",
        indexs: 4,
        types: 1
      },
      {
        dname: "指挥长",
        dval: "",
        indexs: 5,
        types: 1
      },
      {
        dname: "专职值班",
        dval: "",
        indexs: 6,
        types: 1
      },
      {
        dname: "作战值班",
        dval: "",
        indexs: 7,
        types: 1
      },
      {
        dname: "政工值班",
        dval: "",
        indexs: 8,
        types: 1
      },
      {
        dname: "战保值班",
        dval: "",
        indexs: 9,
        types: 1
      },
      {
        dname: "火调值班",
        dval: "",
        indexs: 10,
        types: 1
      },
      {
        dname: "宣传值班",
        dval: "",
        indexs: 11,
        types: 1
      },
      {
        dname: "通信值班",
        dval: "",
        indexs: 12,
        types: 1
      },
      {
        dname: "大队领导",
        dval: "",
        indexs: 13,
        types: 2
      },
      {
        dname: "大队参谋",
        dval: "",
        indexs: 14,
        types: 2
      },
      {
        dname: "中队干部",
        dval: "",
        indexs: 15,
        types: 3
      },
      {
        dname: "中队助理",
        dval: "",
        indexs: 16,
        types: 3
      }
    ],
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
        dptcode: dptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _duty=res.data;
        var dutys=that.data.dutys;
        that.setData({
          duty:_duty
        });
        //console.log(_duty)
        //将值班表填入
        for(var i=0;i<_duty.length;i++){
          var ondutys=_duty[i].ondutys;
          for (var t = 0; t < ondutys.length;t++){
            for (var s = 0; s < dutys.length;s++){
              if(dutys[s].indexs==ondutys[t].indexs){
                dutys[s].dval = ondutys[t].dvals;
              }
            }
          }
        }
        that.setData({
          dutys: dutys
        });
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

  yesterdayDuty: function () {
    var that = this;
    var host = app.globalData.host;//默认系统地址
    //获取检查列表
    var dptcode = app.globalData.udptcode;
    wx.request({
      url: host + "onduty.do",
      method: "post",
      data: {
        method: "getYesterdayDutyList",
        dptcode: dptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _duty = res.data;
        var dutys = that.data.dutys;
        //console.log(_duty)
        //将值班表填入
        for (var i = 0; i < _duty.length; i++) {
          var ondutys = _duty[i].ondutys;
          for (var t = 0; t < ondutys.length; t++) {
            for (var s = 0; s < dutys.length; s++) {
              if (dutys[s].indexs == ondutys[t].indexs) {
                dutys[s].dval = ondutys[t].dvals;
              }
            }
          }
        }
        that.setData({
          dutys: dutys
        });
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
    
  },
  /**
   * 提交
   */
  submitDuty:function(){
    var that = this;
    var host = app.globalData.host;
    var duty=that.data.duty;
    var dutys=that.data.dutys;
    //分开提交
    for(var i=0;i<duty.length;i++){
      var indexs = "",dval = "";
      var tempduty=duty[i];
      for(var t=0;t<dutys.length;t++){
        if(dutys[t].types==tempduty.types){
          indexs += dutys[t].indexs+"@";
          dval+=dutys[t].dval+" @";
        }
      }
      //提交
      indexs=indexs.substring(0,indexs.length-1);
      dval = dval.substring(0, dval.length - 1);
      wx.request({
        url: host + "onduty.do",
        method: "post",
        data: {
          method: "newDutyList",
          dptcode: tempduty.dptcode,
          indexs:indexs,
          dval:dval,
          fireman:tempduty.fireman,
          amatuer: tempduty.amatuer,
          holiday: tempduty.holiday,
          dog: tempduty.dog,
          officalcar: tempduty.officalCar,
          firecar: tempduty.fireCar,
          repaircar: tempduty.repairCar
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
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
          wx.showToast({
            title: "操作成功",
            duration: 1000
          })
        }
      });
    }
  },
  changeDval:function(e){
    var that=this;
    var _title = e.detail.value;
    var indexs = e.currentTarget.dataset.indexs;
    var _dutys=that.data.dutys;
    _dutys[indexs - 3].dval = _title;
    that.setData({
      dutys: _dutys
    })
  },
  dogDuty:function(e){
    var that = this;
    var _title = e.detail.value;
    var dptcode = e.currentTarget.dataset.dptcode;
    var duty=that.data.duty;
    for(var i=0;i<duty.length;i++){
      if(dptcode==duty[i].dptcode){
        duty[i].dog = _title;
        break;
      }
    }
    that.setData({
      duty: duty
    })
  }
})
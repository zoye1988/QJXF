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
    duty:[
      {
        dptname:"支队机关",
        dptcode:2,
        types:1,
        dutylist:[

        ],
        fireman:20,
        amatuer:100,
        holiday:10,
        dog:10,
        officalcar:10,
        firecar:20,
        repaircar:10
      },
      {
        dptname: "麒麟大队",
        dptcode: 10,
        types: 2,
        dutylist: [

        ],
        fireman: 10,
        amatuer: 20,
        holiday: 30,
        dog: 10,
        officalcar: 10,
        firecar: 10,
        repaircar: 10
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
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
    //获取单位列表
    var dptcode=app.globalData.dptcode;

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
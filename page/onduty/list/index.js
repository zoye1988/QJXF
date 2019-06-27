// page/onduty/list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dutys:[
      {
        dptname:"支队机关",
        duty:[
          {
            name:"带班领导",
            val:"毕明"
          },
          {
            name: "值班长",
            val: "代红波"
          },
          {
            name: "指挥长",
            val: "陈乔"
          },
          {
            name: "专职值班",
            val: "段斌"
          },
          {
            name: "作战值班",
            val: "张昭华"
          },
        ],
        person:{
          fireman:10,
          amatuer:12,
          vacation:1,
          dog:1
        },
        car:{
          smallcar:5,
          bigcar:12,
          brokencar:1
        }
      },
      {
        dptname: "麒麟大队",
        duty: [
          {
            name: "大队领导",
            val: "赵琨"
          },
          {
            name: "大队参谋",
            val: "林瑾"
          },
        ],
        person: {
          fireman: 10,
          amatuer: 12,
          vacation: 1,
          dog: 1
        },
        car: {
          smallcar: 5,
          bigcar: 12,
          brokencar: 1
        }
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
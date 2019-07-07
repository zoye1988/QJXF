// page/roster/detail/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    person:[
      {
        downloadurl: "",
        uid:1,
        uname:"李双江",
        jobname:"二级消防士",
        dptname:"麒麟区消防中队",
        sex:"男",
        nation:"汉",
        hometown:"云南曲靖",
        politics:"党员",
        joindate:"2019-06-30",
        brithday:"1988-02-29",
        tel:"15288653843",
        dutystatus:"在位",
        pic:"1.jpg"
      },
      {
        uid: 2,
        uname: "李白",
        jobname: "二级消防士",
        dptname: "麒麟区消防中队",
        sex: "男",
        nation: "汉",
        hometown: "云南曲靖",
        politics: "党员",
        joindate: "2019-06-30",
        brithday: "1988-02-29",
        tel: "15288653843",
        dutystatus: "在位",
        pic: "2.jpg"
      },
      {
        uid: 3,
        uname: "杜甫",
        jobname: "二级消防士",
        dptname: "麒麟区消防中队",
        sex: "男",
        nation: "汉",
        hometown: "云南曲靖",
        politics: "党员",
        joindate: "2019-06-30",
        brithday: "1988-02-29",
        tel: "15288653843",
        dutystatus: "在位",
        pic: "3.jpg"
      },
      {
        uid: 4,
        uname: "李商隐",
        jobname: "二级消防士",
        dptname: "麒麟区消防中队",
        sex: "男",
        nation: "汉",
        hometown: "云南曲靖",
        politics: "党员",
        joindate: "2019-06-30",
        brithday: "1988-02-29",
        tel: "15288653843",
        dutystatus: "在位",
        pic: "4.jpg"
      },
    ],
    bitems: ["在位","休假","出差","培训"],
    bitemsval: [0],
    bindex: 0,//默认选择类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var downloadurl = app.globalData.downloadurl;
    that.setData({
      downloadurl: downloadurl
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
    wx.showModal({
      title: '提示',
      content: '确定删除'+uname+"?",
      success: function (res) {
        if (res.confirm) {

        }
      }
    });
  },
  bindPickerChange: function (e) {

  },
  editDuty:function(){
    wx.navigateTo({
      url: '../edit/index',
    })
  }
})
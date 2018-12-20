// page/rank/group/list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: 0,
    best: [
      {
        title: "男子3000M耐力跑",
        time: "2018-10-12",
        record: "02'34\"13",
        dptname: "特勤企业中队",
        uname:"李白"
      },
      {
        title: "男子3000M耐力跑",
        time: "2018-10-12",
        record: "02'34\"13",
        dptname: "沾益中队",
        uname: "李白"
      }
    ],
    records: [
      {
        dptname: "特勤中队",
        total: 7,
        record: "02'34\"13"
      },
      {
        dptname: "沾益中队",
        total: 12,
        record: "02'34\"13"
      },
      {
        dptname: "马龙中队",
        total: 2,
        record: "02'34\"13"
      },
      {
        dptname: "富源中队",
        total: 7,
        record: "02'34\"13"
      },
      {
        dptname: "会泽中队",
        total: 7,
        record: "02'34\"13"
      },
      {
        dptname: "师宗中队",
        total: 4,
        record: "02'34\"13"
      },
      {
        dptname: "师宗中队",
        total: 4,
        record: "02'34\"13"
      },
      {
        dptname: "师宗中队",
        total: 4,
        record: "02'34\"13"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "3000米越野障碍赛"
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  showRules: function () {
    this.setData({
      show: 1
    })
  },
  closeRules: function () {
    this.setData({
      show: 0
    })
  }
})
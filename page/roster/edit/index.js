// page/roster/edit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    person: {
      uid: 1,
      uname: "李双江",
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
      pic: "1.jpg"
    },
    sex:["男","女"],
    nation:["共产党员","共青团员","其他党员","群众"],
    sexIndex:0,
    nationIndex:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})
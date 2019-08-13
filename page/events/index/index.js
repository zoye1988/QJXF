//index.js  
//获取应用实例  
var app = getApp();
Page({
  data: {
    events: [],
    loadShow: false,///加载图标显示
    esize: 0,
    pagesize: 10,
    eventdate: "",
    DefaultLimit: 7//功能限制访问权限级别
  },
  onLoad: function () {
    var that = this;
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    var host = app.globalData.host;
    var udptcode = app.globalData.udptcode;
    var eventdate = wx.getStorageSync("eventdate")//获取最后查看accident栏目的时间
    /*
      获取数据列表note
     */
    wx.request({
      url: host + "notice.do",
      method: "post",
      data: {
        method: "getNoteList",
        dptcode: udptcode,
        taskdate: eventdate,
        pagesize: that.data.pagesize,
        page: that.data.events.length
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var events = that.data.events;
        var _events = res.data;
        that.setData({
          events: _events
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Events_GETEVENTLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });

    /**
     * 将用户浏览eventdate时间更新
     */
    var dt = new Date();
    var year = dt.getFullYear();
    var month = 1 + dt.getMonth();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    var day = dt.getDate();
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }
    var hour = dt.getHours();
    if (hour >= 0 && hour <= 9) {
      hour = "0" + hour;
    }
    var minite = dt.getMinutes();
    if (minite >= 0 && minite <= 9) {
      minite = "0" + minite;
    }
    var second = dt.getSeconds();
    if (second >= 0 && second <= 9) {
      second = "0" + second;
    }
    var dtime = year + "-" + month + "-" + day + " " + hour + ":" + minite + ":" + second;
    //写入cookie
    wx.setStorageSync("eventdate", dtime);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var host = app.globalData.host;
    var udptcode = app.globalData.udptcode;
    var eventdate = wx.getStorageSync("eventdate")//获取最后查看accident栏目的时间
    var that = this;
    this.setData({
      loadShow: true
    });
    /**
     * 读取plans
     */
    var list = that.data.events;
    wx.request({
      url: host + "notice.do",
      method: "post",
      data: {
        method: "getNoteList",
        dptcode: udptcode,
        taskdate: eventdate,
        page: that.data.events.length,
        pagesize: that.data.pagesize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var events = that.data.events;
        var _events = res.data;
        if (_events.length == 0) {
          //判断获取参数等于0，提示数据已经到底
          wx.showToast({
            title: "数据已经到底",
            image: "../../../image/warning.png",
            duration: 2000
          })
        } else {
          for (var bt in _events) {
            events.push(_events[bt]);
          }
          that.setData({
            events: events,
            loadShow: false
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：EVENTS_GETEVENTSLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      },
      complete: function (res) {
        that.setData({
          loadShow: false
        });
      }
    });
  },
})
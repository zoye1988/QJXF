var app = getApp();
// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    worknotes: [],
    loadShow: true,///加载图标显示
    page: 0,
    pagesize: 10,
    date:"",
    force:{
      fireman:0,
      amatuer:0,
      holiday:0,
      dog:0,
      officalcar:0,
      firecar:0,
      repaircar:0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.validateUser();//验证用户
    var that = this;
    var udptcode = app.globalData.udptcode;
    var host = app.globalData.host;
    //读取本单位日常工作数据
    wx.request({
      url: host + "worknote.do",
      data: {
        method: "getWorklistBriefNoImg",
        page: that.data.page,
        pagesize: that.data.pagesize,
        udptcode: udptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          worknotes: res.data,
          loadShow: false
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取Worknote_GETBRIEFNOIMG," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    //获取日期
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    that.setData({
      date: year + "-" + month + "-" + day
    });
    //读取总的执勤实力
    that.getDptDuty();
    this.setLastLoginDate();//更新登录时间
  },

  getDptDuty: function () {
    var that = this;
    var udptcode = app.globalData.udptcode;
    var host = app.globalData.host;
    wx.request({
      url: host + "onduty.do",
      data: {
        method: "getDptDuty",
        dptcode: udptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          force: res.data[0],
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取Worknote_GETBRIEFNOIMG," + res.errMsg,
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  //获取用户登录时间
  setLastLoginDate:function(){
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
    wx.setStorageSync("homedate", dtime);
    app.globalData.homedate=dtime;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      loadShow: true,//隐藏底部加载图标
    });
    var that = this;
    var udptcode = app.globalData.udptcode;
    var host = app.globalData.host;
    //读取单位分类列表
    wx.request({
      url: host + "worknote.do",
      data: {
        method: "getWorklistBriefNoImgNew",
        page: that.data.worknotes.length,
        udptcode: udptcode,
        lastlogindate: app.globalData.homedate
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _worknotes = that.data.worknotes;
        var title = "";
        var temp = res.data;
        if (temp.length == 0) {
          title="无最新数据";
        }else {
          title="更新"+temp.length+"条数据"
          for (var bt in temp) {
            _worknotes.unshift(temp[bt]);
          }
          that.setData({
            worknotes: _worknotes,
          });
        }
        wx.showToast({
          title: title,
          image: "../../image/ok2.png",
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取Worknote_GETBRIEFNOIMG," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      },
      complete: function (res) {
        that.setData({
          loadShow: false
        });
      }
    })
    wx.stopPullDownRefresh({
    });
    //读取总的执勤实力
    that.getDptDuty();
    this.setLastLoginDate();//更新登录时间
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var udptcode = app.globalData.udptcode;
    var host = app.globalData.host;
    //读取本单位日常工作数据
    wx.request({
      url: host + "worknote.do",
      data: {
        method: "getWorklistBriefNoImg",
        page: that.data.worknotes.length,
        pagesize: that.data.pagesize,
        udptcode: udptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _worknotes = that.data.worknotes;
        var temp = res.data;
        if (temp.length == 0) {
          wx.showToast({
            title: "数据已经到底",
            image: "../../image/warning.png",
            duration: 2000
          })
        } else {
          for (var bt in temp) {
            _worknotes.push(temp[bt]);
          }
          that.setData({
            worknotes: _worknotes,
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取Worknote_GETBRIEFNOIMG," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      },
      complete: function (res) {
        that.setData({
          loadShow: false
        });
      }
    })
  },

  
})
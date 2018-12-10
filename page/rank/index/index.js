//index.js  
//获取应用实例  
var app = getApp()
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    defaultHeight: 0,
    headerHeight: 30,
    // tab切换  
    currentTab: 0,
    Duty: [],//当日考勤{ uname: '李慕白', dutytime: '2018-01-23', dutype: 0, udptname: '文山州公安消防支队' }
    Leave: [],//当日请假
    loadShow: false,///加载图标显示
    tsize: 0,
    asize: 0,
    pagesize: 10,
    DefaultLimit: 7//功能限制访问权限级别
  },
  onLoad: function () {
    var that = this;
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    var host = app.globalData.host;
    var udptcode = app.globalData.udptcode;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight,
          defaultHeight: res.windowHeight
        });
      }
    });
    /*
      获取正常考勤和当日请假列表
     */
    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "dutylist",
        dptcode: udptcode,
        page: that.data.Duty.length,
        pagesize: that.data.pagesize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var Duty = that.data.Duty;
        var _Duty = res.data;
        for (var bt in _Duty) {
          Duty.push(_Duty[bt]);
        }
        that.setData({
          Duty: Duty
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：duty_GETDUTYLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });

    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "leavelist",
        dptcode: udptcode,
        page: that.data.Leave.length,
        pagesize: that.data.pagesize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var Leave = that.data.Leave;
        var _Leave = res.data;
        for (var bt in _Leave) {
          Leave.push(_Leave[bt]);
        }
        that.setData({
          Leave: Leave
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：duty_GETDUTYLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });

    //初始化Leave和Duty长度
    //初始化长度
    that.setData({
      tsize: that.data.Duty.length * 105,
      asize: that.data.Leave.length * 105,
    });
    if (that.data.tsize > that.data.defaultHeight) {
      that.setData({
        defaultHeight: that.data.tsize + that.data.headerHeight
      });
    }
  },
  onReady: function () {

  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });
    var current = e.detail.current;
    var size = 0;
    if (current == 0) {
      size = that.data.Duty.length;
    } else if (current == 1) {
      size = that.data.Leave.length;
    }
    size = size * 105 + that.data.headerHeight;
    if (size < that.data.winHeight) {
      size = that.data.winHeight;
    }
    this.setData({
      defaultHeight: size
    });
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      var current = e.target.dataset.current;
      var size = 0;
      if (current == 0) {
        size = that.data.Duty.length;
      } else if (current == 1) {
        size = that.data.Leave.length;
      }
      size = size * 105 + that.data.headerHeight;
      if (size < that.data.winHeight) {
        size = that.data.winHeight;
      }
      this.setData({
        defaultHeight: size
      });
    }
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    var that = this;
    //触底事件，仅涉及Duty
    var host = app.globalData.host;
    var udptcode = app.globalData.udptcode;
    var current = this.data.currentTab;
    if (current == 0) {
      var list = that.data.Duty;
      wx.request({
        url: host + "duty.do",
        method: "post",
        data: {
          method: "dutylist",
          dptcode: udptcode,
          page: that.data.Duty.length,
          pagesize: that.data.pagesize
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var Duty = that.data.Duty;
          var _Duty = res.data;
          if (_Duty.length == 0) {
            //判断获取参数等于0，提示数据已经到底
            wx.showToast({
              title: "数据已经到底",
              image: "../../../image/warning.png",
              duration: 2000
            })
          } else {
            for (var bt in _Duty) {
              Duty.push(_Duty[bt]);
            }
            that.setData({
              Duty: Duty,
              tsize: Duty.length * 105 + that.data.headerHeight,
              defaultHeight: Duty.length * 105 + that.data.headerHeight
            });
          }
        },
        fail: function (res) {
          wx.showModal({
            title: "数据异常",
            content: "请检查网络或重启程序,错误代码：duty_GETLIST," + res.errMsg,
            showCancel: false,
            confirmText: "确定"
          })
        }
      });
    } else {
      var list = that.data.Leave;
      wx.request({
        url: host + "duty.do",
        method: "post",
        data: {
          method: "leavelist",
          dptcode: udptcode,
          page: that.data.Leave.length,
          pagesize: that.data.pagesize
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var Leave = that.data.Leave;
          var _Leave = res.data;
          if (_Leave.length == 0) {
            //判断获取参数等于0，提示数据已经到底
            wx.showToast({
              title: "数据已经到底",
              image: "../../../image/warning.png",
              duration: 2000
            })
          } else {
            for (var bt in _Leave) {
              Leave.push(_Leave[bt]);
            }
            that.setData({
              Leave: Leave,
              asize: Leave.length * 105 + that.data.headerHeight,
              defaultHeight: Leave.length * 105 + that.data.headerHeight
            });
          }
        },
        fail: function (res) {
          wx.showModal({
            title: "数据异常",
            content: "请检查网络或重启程序,错误代码：duty_GETLIST," + res.errMsg,
            showCancel: false,
            confirmText: "确定"
          })
        }
      });
    }
  },
  /**
    上拉刷新获取今日accident
   */
  onPullDownRefresh: function () {
    var that = this;
    var host = app.globalData.host;
    var udptcode = app.globalData.udptcode;

    //清空所有数据
    that.setData({
      Duty: [],
      Leave: []
    });
    /*
      获取正常考勤和当日请假列表
     */
    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "dutylist",
        dptcode: udptcode,
        page: that.data.Duty.length,
        pagesize: that.data.pagesize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var Duty = that.data.Duty;
        var _Duty = res.data;
        for (var bt in _Duty) {
          Duty.push(_Duty[bt]);
        }
        that.setData({
          Duty: Duty
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：duty_GETDUTYLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });

    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "leavelist",
        dptcode: udptcode,
        page: that.data.Leave.length,
        pagesize: that.data.pagesize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var Leave = that.data.Leave;
        var _Leave = res.data;
        for (var bt in _Leave) {
          Leave.push(_Leave[bt]);
        }
        that.setData({
          Leave: Leave
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：duty_GETDUTYLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    //初始化Leave和Duty长度
    //初始化长度
    that.setData({
      tsize: that.data.Duty.length * 105,
      asize: that.data.Leave.length * 105,
    });
    var currentTab = that.data.currentTab;
    if (currentTab == 0) {
      if (that.data.tsize > that.data.defaultHeight) {
        that.setData({
          defaultHeight: that.data.tsize + that.data.headerHeight
        });
      }
    } else {
      if (that.data.asize > that.data.defaultHeight) {
        that.setData({
          defaultHeight: that.data.asize + that.data.headerHeight
        });
      }
    }
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.showToast({
          title: "刷新成功",
          image: "../../../image/ok2.png",
          duration: 2000
        })
      }
    });
  },
})
//index.js  
//获取应用实例  
var app = getApp();
Page({
  data: {
    /** 
        * 页面配置 
        */
    winHeight: 0,
    defaultHeight: 0,
    headerHeight: 30,
    // tab切换  
    currentTab: 0,
    note:[],
    weather:[],
    loadShow: false,///加载图标显示
    nsize:0,
    wsize:0,
    pagesize: 10,
    taskdate: "",
    DefaultLimit: 8//功能限制访问权限级别
  },
  onLoad: function () {
    var that = this;
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    var host = app.globalData.host;
    var udptcode = app.globalData.udptcode;
    var taskdate = wx.getStorageSync("taskdate")//获取最后查看accident栏目的时间
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
      获取数据列表note
     */
    wx.request({
      url: host + "notice.do",
      method: "post",
      data: {
        method: "getNoteList",
        dptcode: udptcode,
        taskdate: taskdate,
        pagesize:that.data.pagesize,
        page: that.data.note.length
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var note = that.data.note;
        var _note = res.data;
        that.setData({
          note: _note
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Notice_GETNOTELIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    /*
      获取数据列表weather
     */
    wx.request({
      url: host + "notice.do",
      method: "post",
      data: {
        method: "getWeatherList",
        dptcode: udptcode,
        taskdate: taskdate,
        pagesize: that.data.pagesize,
        page: that.data.weather.length
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var weather = that.data.weather;
        var _weather = res.data;
        that.setData({
          weather: _weather
        });
        //初始化长度
        that.setData({
          nsize: that.data.note.length * 85,
          wsize: that.data.weather.length * 85
        });
        if (that.data.psize > that.data.defaultHeight) {
          that.setData({
            defaultHeight: that.data.psize + that.data.headerHeight
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Notice_GETWEATHERLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });

    /**
     * 将用户浏览taskdate时间更新
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
    wx.setStorageSync("taskdate", dtime);
    
  },
  onPullDownRefresh: function () {
    var that = this;
    //app.validateUser();//验证用户
    var host = app.globalData.host;
    var udptcode = app.globalData.udptcode;
    var taskdate = wx.getStorageSync("taskdate")//获取最后查看accident栏目的时间
    /*
      获取数据列表note
     */
    wx.request({
      url: host + "notice.do",
      method: "post",
      data: {
        method: "getNoteList",
        dptcode: udptcode,
        taskdate: taskdate,
        pagesize: that.data.pagesize,
        page: 0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var note = that.data.note;
        var _note = res.data;
        that.setData({
          note: _note
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Notice_GETNOTELIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    /*
      获取数据列表weather
     */
    wx.request({
      url: host + "notice.do",
      method: "post",
      data: {
        method: "getWeatherList",
        dptcode: udptcode,
        taskdate: taskdate,
        pagesize: that.data.pagesize,
        page: 0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var weather = that.data.weather;
        var _weather = res.data;
        that.setData({
          weather: _weather
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Notice_GETWEATHERLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });

    /**
     * 将用户浏览taskdate时间更新
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
    wx.setStorageSync("taskdate", dtime);
    //初始化长度
    this.setData({
      nsize: this.data.note.length * 85,
      wsize: this.data.weather.length * 85
    });
    if (this.data.psize > this.data.defaultHeight) {
      this.setData({
        defaultHeight: this.data.psize + this.data.headerHeight
      });
    }
    //停止加载下拉图标
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.showToast({
          title: "刷新完成",
          image: "../../../image/ok2.png",
          duration: 2000
        })
      }
    });
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
      size = that.data.note.length;
    } else if (current == 1) {
      size = that.data.weather.length;
    }
    size = size * 85 + that.data.headerHeight;
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
        size = that.data.note.length;
      } else if (current == 1) {
        size = that.data.weather.length;
      }
      size = size * 85 + that.data.headerHeight;
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
    var current = this.data.currentTab;
    var host = app.globalData.host;
    var udptcode = app.globalData.udptcode;
    var taskdate = wx.getStorageSync("taskdate")//获取最后查看accident栏目的时间
    var that = this;
    this.setData({
      loadShow: true
    });
    /**
     * 读取plans
     */
    if (current == 0) {
      var list = that.data.note;
      wx.request({
        url: host + "notice.do",
        method: "post",
        data: {
          method: "getNoteList",
          dptcode: udptcode,
          taskdate: taskdate,
          page: that.data.note.length,
          pagesize: that.data.pagesize
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var note = that.data.note;
          var _note = res.data;
          if (_note.length == 0) {
            //判断获取参数等于0，提示数据已经到底
            wx.showToast({
              title: "数据已经到底",
              image: "../../../image/warning.png",
              duration: 2000
            })
          } else {
            for (var bt in _note) {
              note.push(_note[bt]);
            }
            that.setData({
              note: note,
              nsize: note.length * 85 + that.data.headerHeight,
              defaultHeight: note.length * 85 + that.data.headerHeight,
              loadShow: false
            });
          }
          
        },
        fail: function (res) {
          wx.showModal({
            title: "数据异常",
            content: "请检查网络或重启程序,错误代码：Accident_GETNOTELIST," + res.errMsg,
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
    }else if (current ==1) {
      var list = that.data.weather;
      wx.request({
        url: host + "notice.do",
        method: "post",
        data: {
          method: "getWeatherList",
          dptcode: udptcode,
          taskdate: taskdate,
          page: that.data.weather.length,
          pagesize: that.data.pagesize
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var weather = that.data.weather;
          var _weather = res.data;
          if (_weather.length == 0) {
            //判断获取参数等于0，提示数据已经到底
            wx.showToast({
              title: "数据已经到底",
              image: "../../../image/warning.png",
              duration: 2000
            })
          } else {
            for (var bt in _weather) {
              weather.push(_weather[bt]);
            }
            that.setData({
              weather: weather,
              wsize: weather.length * 85 + that.data.headerHeight,
              defaultHeight: weather.length * 85 + that.data.headerHeight,
              loadShow: false
            });
          }
          
        },
        fail: function (res) {
          wx.showModal({
            title: "数据异常",
            content: "请检查网络或重启程序,错误代码：Accident_GETWEATHERLIST," + res.errMsg,
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
    }
  }
})
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
    todayAcc:[],//今日警情
    Acc: [],//往日警情
    loadShow: false,///加载图标显示
    tsize:0,
    asize:0,
    pagesize: 10,
    accidentdate:"",
    DefaultLimit: 8//功能限制访问权限级别
    // 参数样本{ aid: 1, dptname: '文山一中队', atime: '2017-07-21 21:02:12', atype: '抢险救援', address: '文山市环北三路98号',isnew:1 },
  },
  onLoad: function () {
    var that = this;
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    var host = app.globalData.host;
    var udptcode = app.globalData.udptcode;
    var accdate = wx.getStorageSync("accidentdate")//获取最后查看accident栏目的时间
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
      获取ACC和TODAYACC列表
     */
    wx.request({
      url: host + "accident.do",
      method: "post",
      data: {
        method: "getTodayAccList",
        dptcode: udptcode,
        accdate:accdate
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var todayAcc = that.data.todayAcc;
        var _todayAcc = res.data;
        that.setData({
          todayAcc: _todayAcc
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Accident_GETTODAYACCLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    wx.request({
      url: host + "accident.do",
      method: "post",
      data: {
        method: "getAccList",
        dptcode: udptcode,
        page: that.data.Acc.length,
        pagesize:that.data.pagesize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var Acc = that.data.Acc;
        var _Acc = res.data;
        for (var bt in _Acc) {
          Acc.push(_Acc[bt]);
        }
        that.setData({
          Acc: Acc
        });
        //初始化Acc和todayAcc长度
        //初始化长度
        that.setData({
          tsize: that.data.todayAcc.length * 105,
          asize: that.data.Acc.length * 105,
        });
        if (that.data.tsize > that.data.defaultHeight) {
          that.setData({
            defaultHeight: that.data.tsize + that.data.headerHeight
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Accident_GETACCLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    /**
     * 将用户浏览accident时间更新
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
    var dtime=year+"-"+month+"-"+day+" "+hour+":"+minite+":"+second;
    //写入cookie
    wx.setStorageSync("accidentdate", dtime);

    
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
      size = that.data.todayAcc.length;
    } else if (current == 1) {
      size = that.data.Acc.length;
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
        size = that.data.todayAcc.length;
      } else if (current == 1) {
        size = that.data.Acc.length;
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
    var that=this;
    //触底事件，仅涉及Acc
    var host = app.globalData.host;
    var udptcode = app.globalData.udptcode;
    var current = this.data.currentTab;
    if (current == 1) {
      var list = that.data.Acc;
      wx.request({
        url: host + "accident.do",
        method: "post",
        data: {
          method: "getAccList",
          dptcode: udptcode,
          page: that.data.Acc.length,
          pagesize: that.data.pagesize
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var Acc = that.data.Acc;
          var _Acc = res.data;
          if (_Acc.length == 0) {
            //判断获取参数等于0，提示数据已经到底
            wx.showToast({
              title: "数据已经到底",
              image: "../../../image/warning.png",
              duration: 2000
            })
          }else{
            for (var bt in _Acc) {
              Acc.push({ aid: _Acc[bt].aid, dptname: _Acc[bt].dptname, atime: _Acc[bt].atime, atype: _Acc[bt].atype, address: _Acc[bt].address });
            }
            that.setData({
              Acc: Acc,
              asize: Acc.length * 105 + that.data.headerHeight,
              defaultHeight: Acc.length * 105 + that.data.headerHeight
            });
          }
        },
        fail: function (res) {
          wx.showModal({
            title: "数据异常",
            content: "请检查网络或重启程序,错误代码：Accident_GETACCLIST," + res.errMsg,
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
    var accdate = wx.getStorageSync("accidentdate")//获取最后查看accident栏目的时间
    wx.request({
      url: host + "accident.do",
      method: "post",
      data: {
        method: "getNewTodayAccList",
        dptcode: udptcode,
        accdate: accdate
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var todayAcc = that.data.todayAcc;
        var _todayAcc = res.data;
        for (var bt in _todayAcc) {
          todayAcc.unshift({ aid: _todayAcc[bt].aid, dptname: _todayAcc[bt].dptname, atime: _todayAcc[bt].atime, atype: _todayAcc[bt].atype, address: _todayAcc[bt].address, isnew: 1 });
        }
        that.setData({
          todayAcc: todayAcc
        });
        //停止加载下拉图标
        wx.stopPullDownRefresh({
          complete: function (res) {
            wx.showToast({
              title: "暂无新警情",
              image: "../../../image/ok2.png",
              duration: 2000
            })
          }
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Accident_GETNEWTODAYACCLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    //初始化Acc和todayAcc长度
    //初始化长度
    that.setData({
      tsize: that.data.todayAcc.length * 105,
    });
    
    if (that.data.tsize > that.data.defaultHeight) {
      that.setData({
        defaultHeight: that.data.tsize + that.data.headerHeight
      });
    }
    /**
     * 更新用户获取Acc时间
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
    var minite = dt.getMinutes();
    var second = dt.getSeconds();
    var dtime = year + "-" + month + "-" + day + " " + hour + ":" + minite + ":" + second;
    //写入cookie
    wx.setStorageSync("accidentdate", dtime);
  },
})
//index.js  
//获取应用实例  
var app = getApp()
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
    zzxfd: [],
    shld: [],
    wx: [],
    loadShow: false,///加载图标显示
    zsize: 0,
    ssize: 0,
    wsize: 0,
    pagesize: 10
  },
  onLoad: function () {
    var that = this;

    //app.validateUser();//验证用户
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
    //从服务器读取数据列表
    /*
      读取专职消防队数据
     */
    wx.request({
      url: host + "unions.do",
      method: "post",
      data: {
        method: "getUnionsList",
        dptcode: udptcode,
        utype: 0, //专职消防队
        page: that.data.zzxfd.length,
        pagesize: 10
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var zzxfd = that.data.zzxfd;
        var _zzxfd = res.data;
        that.setData({
          zzxfd: _zzxfd
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Unions_GETLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    /*
      读取社会联动单位数据
     */
    wx.request({
      url: host + "unions.do",
      method: "post",
      data: {
        method: "getUnionsList",
        dptcode: udptcode,
        utype: 1, //社会联动单位
        page: that.data.shld.length,
        pagesize: 10
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shld = that.data.shld;
        var _shld = res.data;
        that.setData({
          shld: _shld
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Unions_GETLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    /*
      读取微型消防站单位数据
     */
    wx.request({
      url: host + "unions.do",
      method: "post",
      data: {
        method: "getUnionsList",
        dptcode: udptcode,
        utype: 2, //微型消防站
        page: that.data.wx.length,
        pagesize: 10
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var wx = that.data.wx;
        var _wx = res.data;
        that.setData({
          wx: _wx
        });
        //初始化长度
        that.setData({
          zsize: that.data.zzxfd.length * 115,
          ssize: that.data.shld.length * 115,
          wsize: that.data.wx.length * 115
        });
        if (that.data.zsize > that.data.defaultHeight) {
          that.setData({
            defaultHeight: that.data.zsize + that.data.headerHeight
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Unions_GETLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
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
      size = that.data.zzxfd.length;
    } else if (current == 1) {
      size = that.data.shld.length;
    } else if (current == 2) {
      size = that.data.wx.length;
    }
    size = size * 115 + that.data.headerHeight;
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
        size = that.data.zzxfd.length;
      } else if (current == 1) {
        size = that.data.shld.length;
      } else if (current == 2) {
        size = that.data.wx.length;
      }
      size = size * 115 + that.data.headerHeight;
      console.log("size=" + size);
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
    var current = this.data.currentTab;
    var host = app.globalData.host;
    var udptcode = app.globalData.udptcode;
    var page = 0;
    console.log("current="+current);
    if (current == 0) {
      page = that.data.zzxfd.length;
    } else if (current == 1) {
      page = that.data.shld.length;
    } else if (current == 2) {
      page = that.data.wx.length;
    }
    //读取数据
    wx.request({
      url: host + "unions.do",
      method: "post",
      data: {
        method: "getUnionsList",
        dptcode: udptcode,
        utype: current,
        page: page,
        pagesize: that.data.pagesize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var temp = res.data;
        if (temp.length == 0) {
          //判断获取参数等于0，提示数据已经到底
          wx.showToast({
            title: "数据已经到底",
            image: "../../../image/warning.png",
            duration: 2000
          })
        } else {
          if (current == 0) {
            var list = that.data.zzxfd;
            for (var bt in temp) {
              list.push({ uid: temp[bt].uid, utype: 2, title: temp[bt].title, address: temp[bt].address, tel: temp[bt].tel, lng: temp[bt].lng, lat: temp[bt].lat });
            }
            that.setData({
              zzxfd: list,
              zsize: list.length * 115 + that.data.headerHeight,
              defaultHeight: list.length * 115 + that.data.headerHeight
            });
          } else if (current == 1) {
            var list = that.data.shld;
            for (var bt in temp) {
              list.push({ uid: temp[bt].uid, utype: 2, title: temp[bt].title, address: temp[bt].address, tel: temp[bt].tel, lng: temp[bt].lng, lat: temp[bt].lat });
            }
            that.setData({
              shld: list,
              ssize: list.length * 115 + that.data.headerHeight,
              defaultHeight: list.length * 115 + that.data.headerHeight
            });
          } else if (current == 2) {
            var list = that.data.wx;
            for (var bt in temp) {
              list.push({ uid: temp[bt].uid, utype: 2, title: temp[bt].title, address: temp[bt].address, tel: temp[bt].tel, lng: temp[bt].lng, lat: temp[bt].lat });
            }
            that.setData({
              wx: list,
              wsize: list.length * 115 + that.data.headerHeight,
              defaultHeight: list.length * 115 + that.data.headerHeight
            });
          }
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Unions_GETLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  //拨打座机电话
  callTel: function (e) {
    //判断类别
    var tels = e.target.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tels //仅为示例，并非真实的电话号码
    })
  },
  navimap: function (e) {
    console.log("lng=" + e.target.dataset.lng);
    wx.navigateTo({ url: "../../map/show/index?lat=" + e.target.dataset.lat + "&&lng=" + e.target.dataset.lng + "&&title=" + e.target.dataset.title + "&&type=" + e.target.dataset.type });
  }
})
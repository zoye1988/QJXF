// page/phone/index/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uname:"",
    openid:"",
    loadShow: true,///加载图标显示
    ditems:["全部单位"],
    dvals:[0],
    index:0,
    page: 1,
    pagesize: 15,
    tel:"",
    keyword: "",
    // {openid: 1, uname: "恭开生", job: '支队领导', dptname: '文山州公安消防支队', tel: '15299871119' }
    user:[],
    DefaultLimit: 8//功能限制访问权限级别
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    that.setData({
      uname: app.globalData.uname,
      openid: app.globalData.openid
    });
    var job = app.globalData.job;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    this.setData({
      loadShow: true//隐藏底部加载图标
    });
    //获取单位列表
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "dptList"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var ditems = that.data.ditems;
        var dvals = that.data.dvals;
        var temp = res.data;
        for (var bt in temp) {
          ditems.push(temp[bt].dname);
          dvals.push(temp[bt].dcode);
        }
        that.setData({
          ditems: ditems,
          dvals: dvals
        });
      },
    });
    //读取联动电话数据
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "userlist",
        page: that.data.user.length,
        pagesize: that.data.pagesize,
        keyword: that.data.keyword,
        dptcode: that.data.dvals[that.data.index]
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var user = that.data.user;
        var temp = res.data;
        that.setData({
          user: temp,
          loadShow: false//隐藏底部加载图标
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取USER_GETLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    //调用监听截屏操作
    wx.onUserCaptureScreen(function (res) {
      //监控到用户截屏，登记信息
      app.globalData.title = "截屏：电话号码";
      app.globalData.url = "/page/phone/index/index";
      app.ShareAction();
    })
  },
  callTel:function(e){
    var uname = e.currentTarget.dataset.uname;
    var tel = e.currentTarget.dataset.tel;
    wx.showModal({
      title: "操作提示",
      content: "拨打电话给 " + uname+" ?",
      showCancel: true,
      confirmText: "确定",
      cancelText: "取消",
      cancelColor: "#d81e06",
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: "'" + tel + "'" //仅为示例，并非真实的电话号码
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },
  keyChange: function (e) {
    var _keyword = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _keyword = _keyword.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      keyword: _keyword
    });
  },
  keyChange2: function (e) {
    var _keyword = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _keyword = _keyword.replace(/[^\Z0-9]/g, '');
    this.setData({
      tel: _keyword,
    });
  },
  searchAction: function () {
    //加载数据
    var that = this;
    //读取用户节本数据
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    this.setData({
      user: [],//清空数据
      loadShow: true//隐藏底部加载图标
    });
    //读取默认单位数据
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "userlist",
        page: that.data.user.length,
        pagesize: that.data.pagesize,
        keyword: that.data.keyword,
        dptcode: that.data.dvals[that.data.index]
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var user = that.data.user;
        var temp = res.data;
        if (temp.length == 0) {
          //判断获取参数等于0，提示数据已经到底
          wx.showToast({
            title: "无符合要求数据",
            image: "../../../image/warning.png",
            duration: 2000
          })
        }
        that.setData({
          user: temp,
          loadShow: false//隐藏底部加载图标
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取USER_SEARCHLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },

  updateTel:function(){
    //加载数据
    var that = this;
    //读取用户节本数据
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    console.log(that.data.tel);
    //读取默认单位数据
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "updateTel",
        openid:that.data.openid,
        tel:that.data.tel
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result=res.data.result;
        if(result==1){
          wx.showToast({
            title: "数据更新成功",
            image: "../../../image/warning.png",
            duration: 2000
          })
        }else{
          wx.showToast({
            title: "数据更新失败",
            image: "../../../image/warning.png",
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取USER_UPDATETEL," + res.errMsg,
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //加载数据
    var that = this;
    //读取用户节本数据
    var udptcode = app.globalData.udptcode;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    this.setData({
      loadShow: true//隐藏底部加载图标
    });
    //读取默认单位数据
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "userlist",
        page: that.data.user.length,
        pagesize: that.data.pagesize,
        keyword: that.data.keyword,
        dptcode: that.data.dvals[that.data.index]
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var user = that.data.user;
        var temp = res.data;
        if (temp.length == 0) {
          //判断获取参数等于0，提示数据已经到底
          wx.showToast({
            title: "数据已经到底",
            image: "../../../image/warning.png",
            duration: 2000
          })
        } else {
          for (var bt in temp) {
            user.push(temp[bt]);
          }
        }
        that.setData({
          user: user,
          loadShow: false//隐藏底部加载图标
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取USER_GETLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  bindPickerChange: function (e) {
    var that = this;
    var host = app.globalData.host;
    //选择单位类别，更新单位数据列表
    this.setData({
      keyword: "",
      user: [],//清空单位列表
      loadShow: true,//隐藏底部加载图标
      index: e.detail.value
    })
    //加载数据
    //读取默认单位数据
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "userlist",
        page: that.data.user.length,
        pagesize: that.data.pagesize,
        keyword: that.data.keyword,
        dptcode: that.data.dvals[that.data.index]
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var user = that.data.user;
        var temp = res.data;
        if (temp.length == 0) {
          //判断获取参数等于0，提示数据已经到底
          wx.showToast({
            title: "未找到符合数据",
            image: "../../../image/warning.png",
            duration: 2000
          })
        }
        else {
          that.setData({
            user: temp,
            loadShow: false
          });
        }

      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取USER_GETLIST," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  downloadPhone:function(e){
    var uname = e.currentTarget.dataset.uname;
    var phone = e.currentTarget.dataset.phone;
    var dptname = e.currentTarget.dataset.dptname;
    wx.addPhoneContact({
      firstName: uname,   //名字
      mobilePhoneNumber: phone,    //手机号
      remark: dptname,
      success: function () {
        wx.showToast({
          title: "通信数据已保存到手机中",
          image: "../../../image/warning.png",
          duration: 2000
        })
      }
    })
  }
})
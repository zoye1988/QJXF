var app = getApp();
// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    worknotes:[],
    loadShow: true,///加载图标显示
    page: 0,
    pagesize: 10,
    downloadurl: app.globalData.downloadurl,
    openid:"",
    DefaultLimit: 7//功能限制访问权限级别
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.validateUser();//验证用户
    app.checkVisitJob2(this.data.DefaultLimit);//验证用户访问权限
    var udptcode = app.globalData.udptcode;
    var host = app.globalData.host;
    //读取单位分类列表
    wx.request({
      url: host + "worknote.do",
      method: "post",
      data: {
        method: "getWorklistDetail",
        page:that.data.page,
        pagesize:that.data.pagesize,
        downloadurl: that.data.downloadurl
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          worknotes: res.data,
          loadShow:false,
          openid: app.globalData.openid
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取Build_GETBTYPE," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    })
    this.setTaskDate();//更新时间
    //调用监听截屏操作
    wx.onUserCaptureScreen(function (res) {
      //监控到用户截屏，登记信息
      app.globalData.title = "截屏：工作圈";
      app.globalData.url = "/page/work/index/index";
      app.ShareAction();
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
    this.setData({
      loadShow: true,//隐藏底部加载图标
    });
    var that = this;
    var udptcode = app.globalData.udptcode;
    var host = app.globalData.host;
    //读取单位分类列表
    wx.request({
      url: host + "worknote.do",
      method: "post",
      data: {
        method: "getWorklistDetailNew",
        taskdate: app.globalData.taskdate,
        downloadurl: that.data.downloadurl
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _worknotes = that.data.worknotes;
        var temp = res.data;
        var title="";
        if (temp.length == 0) {
          title ="无最新数据"
        } else {
          title = "更新" + temp.length + "条数据"
          for (var bt in temp) {
            _worknotes.unshift(temp[bt]);
          }
          that.setData({
            worknotes: _worknotes,
          });
        }
        wx.showToast({
          title: title,
          image: "../../../image/ok2.png",
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取Build_GETBTYPE," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      },
      complete: function (res) {
        that.setTaskDate();//更新时间
        that.setData({
          loadShow: false
        });
      }
    })
    wx.stopPullDownRefresh({
      complete: function (res) {
        
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      loadShow: true//隐藏底部加载图标
    });
    var that = this;
    var udptcode = app.globalData.udptcode;
    var host = app.globalData.host;
    //读取单位分类列表
    wx.request({
      url: host + "worknote.do",
      method: "post",
      data: {
        method: "getWorklistDetail",
        page: that.data.worknotes.length,
        pagesize: that.data.pagesize,
        downloadurl: that.data.downloadurl
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _worknotes = that.data.worknotes;
        var temp = res.data;
        if(temp.length==0){
          wx.showToast({
            title: "数据已经到底",
            image: "../../../image/warning.png",
            duration: 2000
          })
        }else{
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
          content: "请检查网络或重启程序,错误代码：读取Build_GETBTYPE," + res.errMsg,
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
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: e.target.dataset.ilist
    })
  },
	delItem:function(e){
    var linkid = e.target.dataset.linkid;
    var that = this;
    var host = app.globalData.host;
    wx.showModal({
      title: '提示',
      content: '确定删除此条信息',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: host + "worknote.do",
            method: "post",
            data: {
              method: "delWorknote",
              linkid: linkid
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var result = res.data.result;
              if (result === 1) {
                wx.showToast({
                  icon: "success",
                  title: "删除成功",
                  duration: 1000,
                  success: function (res) {
                    //找到此条数据，显示隐藏
                    var worknotes = that.data.worknotes;
                    var _worknotes=[];
                    for (var bt in worknotes) {
                      if (worknotes[bt].linkID != linkid){
                        _worknotes.push(worknotes[bt]);
                      }
                    }
                    that.setData({
                      worknotes: _worknotes
                    });
                  }
                })
              }
            },
            fail: function (res) {
              wx.showModal({
                title: "数据异常",
                content: "请检查网络或重启程序,错误代码：Worknote_Delete," + res.errMsg,
                showCancel: false,
                confirmText: "确定"
              })
            }
          });
        } else if (res.cancel) {
        }
      }
    })
  },
  //获取用户登录时间
  setTaskDate: function () {
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
    app.globalData.taskdate = dtime;
  },
})
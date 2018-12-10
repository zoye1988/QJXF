//index.js  
//获取应用实例  
var app = getApp();
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
    array: [],//等级名称列表
    arrayID:[],//等级名称参数
    driver:"",
    carid:"WJ云",
    reason:"",
    usetime:"",
    cstatus:"",
    job:0,
    index: 0,//审批等级选择
    jobtitle:"",
    leader:"",
    leaderID:"",
    cars:[],
    loadShow: true,///加载图标显示
    csize: 0,
    pagesize: 10,
    cid:0,
    inCar:true,//  判断用户是否在审批流程
    driverImg: "../../../res/temp.png",//驾驶证
    identifyImg: "../../../res/temp.png",
    downloadurl: app.globalData.downloadurl,
    licences:[],//证件数组
    DefaultLimit: 7//功能限制访问权限级别
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: e.target.dataset.ilist
    })
  },

  onLoad: function () {
    var that = this;
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    var host = app.globalData.host;//默认系统地址
    var udptcode = app.globalData.udptcode;//用户单位id
    var openid = app.globalData.openid;//用户的id
    var uname = app.globalData.uname;
    that.setData({
      driver:uname,
      cars:[]
    });
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          defaultHeight: res.windowHeight,
          winHeight: res.windowHeight
        });
      }
    });
    /**
     * 获取车辆审批列表
     */
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "getCarLicenseList",
        dptcode: app.globalData.udptcode,
        page: that.data.cars.length,
        pagesize: that.data.pagesize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          cars:res.data
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：WORK_GETBRIEF," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      },
      complete:function(res){
        that.setData({
          loadShow:false
        });
      }
    });
    /**
     * 获取用户证件
     */
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "checkCarLicence",
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          driverImg: that.data.downloadurl+res.data.driverLicence,
          identifyImg: that.data.downloadurl+res.data.identifyLicence,
          licences: [that.data.downloadurl + res.data.driverLicence, that.data.downloadurl + res.data.identifyLicence]
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取CAR_USERINFO," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });

    /***
     * 查询是否有已经提交的用车申请
     */
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "getCarLicense",
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result=res.data.result;
        var car=res.data.car;
        if(result>0){
          that.setData({
            inCar:false,
            driver:car.driver,
            carid:car.carid,
            reason:car.reason,
            usetime:car.usetime,
            jobtitle:car.jobtitle,
            cstatus:car.cstatus,
            leader:car.leader,
            cid:car.cid
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：WORK_GETBRIEF," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    /**
     * 获取审批等级列表
     */
    var job = app.globalData.job;
    that.setData({
      job:app.globalData.job
    })
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "getJobList",
        job: job
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var array = [];
        var arrayID = [];
        var temp = res.data;
        for (var bt in temp) {
          array.push(temp[bt].jtitle);
          arrayID.push(temp[bt].jobcode);
        }
        that.setData({
          array: array,
          arrayID: arrayID
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：WORK_GETBRIEF," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    that.setData({
      csize: that.data.cars.length * 125
    });
    if (that.data.csize > that.data.defaultHeight) {
      that.setData({
        defaultHeight: that.data.csize + that.data.headerHeight
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
      size = that.data.cars.length;
      size = size * 125 + that.data.headerHeight;
      if (size < that.data.winHeight) {
        size = that.data.winHeight;
      }
    } else if (current == 1) {
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
        size = that.data.cars.length;
        size = size * 125 + that.data.headerHeight;
        if (size < that.data.winHeight) {
          size = that.data.winHeight;
        }
      } else if (current == 1) {
        size = that.data.winHeight;
      }
      this.setData({
        defaultHeight: size
      });
    }
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    //触底事件，仅涉及Acc
    var host = app.globalData.host;
    var udptcode = app.globalData.udptcode;
    var current = this.data.currentTab;
    if (current == 0) {
      var list = that.data.cars;
      wx.request({
        url: host + "car.do",
        method: "post",
        data: {
          method: "getCarLicenseList",
          dptcode: udptcode,
          page: that.data.cars.length,
          pagesize: that.data.pagesize
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var cars = that.data.cars;
          var _cars = res.data;
          if (_cars.length == 0) {
            //判断获取参数等于0，提示数据已经到底
            wx.showToast({
              title: "数据已经到底",
              image: "../../../image/warning.png",
              duration: 2000
            })
          } else {
            for (var bt in _cars) {
              cars.push({ cid: _cars[bt].cid, usetime: _cars[bt].usetime, carid: _cars[bt].carid, driver: _cars[bt].driver, reason: _cars[bt].reason, cstatus: _cars[bt].cstatus, jobcode: _cars[bt].jobcode, dptname: _cars[bt].dptname });
            }
            that.setData({
              cars: cars,
              csize: cars.length * 125 + that.data.headerHeight,
              defaultHeight: cars.length * 125 + that.data.headerHeight
            });
          }
        },
        fail: function (res) {
          wx.showModal({
            title: "数据异常",
            content: "请检查网络或重启程序,错误代码：CAR_GETLICENSELIST," + res.errMsg,
            showCancel: false,
            confirmText: "确定"
          })
        }
      });
    }
  },
  submitCar:function(){
    var that = this;
    var host = app.globalData.host;
    var driver=this.data.driver;
    var carid=this.data.carid;
    var reason=this.data.reason;
    if(carid=="" || carid==null){
      wx.showModal({
        title: "数据检查",
        content: "车牌号不能为空",
        showCancel: false,
        confirmText: "确定"
      })
      return;
    }
    if (driver == "" || driver == null) {
      wx.showModal({
        title: "数据检查",
        content: "用车人员不能为空",
        showCancel: false,
        confirmText: "确定"
      })
      return;
    }
    if (reason == "" || reason == null) {
      wx.showModal({
        title: "数据检查",
        content: "用车原因不能为空",
        showCancel: false,
        confirmText: "确定"
      })
      return;
    }
    wx.showLoading({
      title: '数据上传中',
      mask: true,
      image: "../../../image/load.gif"
    })
    /**
     * 插入车辆申请表
     */
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "insertCarUnLicense",
        dptcode: app.globalData.udptcode,//用户所属辖区code
        dptname:app.globalData.udptname,
        driver:that.data.driver,
        carID: carid,
        driverid: app.globalData.openid,
        reason:that.data.reason,
        jobtitle:that.data.array[that.data.index],
        jobcode:that.data.arrayID[that.data.index]
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result=res.data.result;
        if(result==1){
          wx.hideLoading();
          wx.showToast({
            title: "申请提交成功",
            icon: "success",
            duration: 2000
          })
          that.setData({
            inCar: false,
            usetime:res.data.usetime,
            jobtitle: that.data.array[that.data.index],
            cstatus:1
          });
          that.refresh();
        }else if (result == 3){  //判断驾驶身份未审核
          wx.showModal({
            title: "身份审核",
            content: "驾驶员身份未备案，请前往审核",
            showCancel: false,
            confirmText: "确定",
            success:function(res){
              if(res.confirm){
                wx.navigateTo({
                  url: '../new/index',
                })
              }
            }
          })
        }else if(result==-1){
          wx.showModal({
            title: "身份审核",
            content: "资料已提交，等待审核",
            showCancel: false,
            confirmText: "确定"
          })
        }else{
          wx.showToast({
            title: "申请提交失败",
            image: "../../../image/warning.png",
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Car_INSERTCARUNLICENSE," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    
  },
  cancelCar: function () {
    var that = this;
    var host = app.globalData.host;
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "delayCarLicense",
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data.result;
        if(result==0){
          wx.showModal({
            title: "操作异常",
            content: "请检查网络或重启程序,错误代码：CAR_DELAY",
            showCancel: false,
            confirmText: "确定"
          })
        }else{
          wx.showToast({
            title: "取消车辆申请",
            icon: "success",
            duration: 2000
          })
          that.refresh();
          that.setData({
            inCar: true,
            carid:"WJ云"
          });
        }
        
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：WORK_GETBRIEF," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  //修改用车人信息
  keyDriver: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      driver: _title
    });
  },
  //修改用车信息
  keyCar: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      carid: _title
    });
  },
  //修改用车原因信息
  keyReason: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      reason: _title
    });
  },
  /**
   审批通过
   */
  carPassBtn:function(e){
    var that = this;
    var cid = e.target.dataset.cid;
    var host = app.globalData.host;
    wx.showModal({
      title: "审批提示",
      content: "同意车辆外出?",
      showCancel: true,
      confirmText: "确定",
      cancelText:"取消",
      cancelColor:"#d81e06",
      success:function(res){
        if(res.confirm){
          //确定车辆外出
          wx.request({
            url: host + "car.do",
            method: "post",
            data: {
              method: "leaderCarLicense",
              leaderid: app.globalData.openid,
              leader: app.globalData.uname,
              cid: cid,
              cstatus:3
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var result = res.data.result;
              if (result == 0) {
                wx.showModal({
                  title: "操作异常",
                  content: "请检查网络或重启程序,错误代码：CAR_CONFIRMLICENSE",
                  showCancel: false,
                  confirmText: "确定"
                })
              } else {
                wx.showToast({
                  title: "完成车辆审批",
                  icon: "success",
                  duration: 2000
                });
                that.refresh();
              }
            },
            fail: function (res) {
              wx.showModal({
                title: "数据异常",
                content: "请检查网络或重启程序,错误代码：CAR_CONFIRMLICENSE," + res.errMsg,
                showCancel: false,
                confirmText: "确定"
              })
            }
          });

        }else if(res.cancel){

        }
      }
    })
  },
  /**
   * 取消审批
   */
  carDelayBtn: function (e) {
    var that=this;
    var cid = e.target.dataset.cid;
    var host = app.globalData.host;
    wx.showModal({
      title: "审批提示",
      content: "取消车辆外出?",
      showCancel: true,
      confirmText: "确定",
      cancelText: "取消",
      cancelColor: "#d81e06",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: host + "car.do",
            method: "post",
            data: {
              method: "leaderCarLicense",
              leaderid: app.globalData.openid,
              leader: app.globalData.uname,
              cid: cid,
              cstatus: 2
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var result = res.data.result;
              if (result == 0) {
                wx.showModal({
                  title: "操作异常",
                  content: "请检查网络或重启程序,错误代码：CAR_CONFIRMLICENSE",
                  showCancel: false,
                  confirmText: "确定"
                })
              } else {
                wx.showToast({
                  title: "完成车辆审批",
                  icon: "success",
                  duration: 2000
                });
                that.refresh();
              }
            },
            fail: function (res) {
              wx.showModal({
                title: "数据异常",
                content: "请检查网络或重启程序,错误代码：CAR_CONFIRMLICENSE," + res.errMsg,
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
  carBack:function(e){
    var that = this;
    var cid = e.target.dataset.cid;
    var host = app.globalData.host;
    wx.showModal({
      title: "操作提示",
      content: "已经返回营区?",
      showCancel: true,
      confirmText: "确定",
      cancelText: "取消",
      cancelColor: "#d81e06",
      success: function (res) {
        if (res.confirm) {
          //确定车辆外出
          wx.request({
            url: host + "car.do",
            method: "post",
            data: {
              method: "carStatusLicense",
              openid: app.globalData.openid,
              cid: cid,
              cstatus:4
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var result = res.data.result;
              if (result == 0) {
                wx.showModal({
                  title: "操作异常",
                  content: "请检查网络或重启程序,错误代码：CAR_STATUSLICENSE",
                  showCancel: false,
                  confirmText: "确定"
                })
              } else {
                wx.showToast({
                  title: "完成车辆状态更新",
                  icon: "success",
                  duration: 2000
                });
                that.refresh();
                that.setData({
                  inCar:true
                });
              }
            },
            fail: function (res) {
              wx.showModal({
                title: "数据异常",
                content: "请检查网络或重启程序,错误代码：CAR_STATUSLICENSE," + res.errMsg,
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
  refresh: function () {
    console.log("refresh");
    var that = this;
    var host = app.globalData.host;//默认系统地址
    var udptcode = app.globalData.udptcode;//用户单位id
    var openid = app.globalData.openid;//用户的id
    var uname = app.globalData.uname;
    that.setData({
      driver: uname,
      cars: []
    });
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          defaultHeight: res.windowHeight,
          winHeight: res.windowHeight
        });
      }
    });
    /**
     * 获取车辆审批列表
     */
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "getCarLicenseList",
        dptcode: app.globalData.udptcode,
        page: that.data.cars.length,
        pagesize: that.data.pagesize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          cars: res.data
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：WORK_GETBRIEF," + res.errMsg,
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
    /***
     * 查询是否有已经提交的用车申请
     */
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "getCarLicense",
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data.result;
        var car = res.data.car;
        if (result > 0) {
          that.setData({
            inCar: false,
            driver: car.driver,
            carid: car.carid,
            reason: car.reason,
            usetime: car.usetime,
            jobtitle: car.jobtitle,
            cstatus: car.cstatus,
            leader: car.leader,
            cid: car.cid
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：WORK_GETBRIEF," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    /**
     * 获取审批等级列表
     */
    var job = app.globalData.job;
    that.setData({
      job: app.globalData.job
    })
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "getJobList",
        job: job
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var array = [];
        var arrayID = [];
        var temp = res.data;
        for (var bt in temp) {
          array.push(temp[bt].jtitle);
          arrayID.push(temp[bt].jobcode);
        }
        that.setData({
          array: array,
          arrayID: arrayID
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：WORK_GETBRIEF," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    that.setData({
      csize: that.data.cars.length * 125
    });
    if (that.data.csize > that.data.defaultHeight) {
      that.setData({
        defaultHeight: that.data.csize + that.data.headerHeight
      });
    }
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.refresh();
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.showToast({
          title: "刷新成功",
          image: "../../../image/ok2.png",
          duration: 2000
        })
      }
    });
  }
})
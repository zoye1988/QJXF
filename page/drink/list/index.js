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
    array: [],//等级名称列表
    arrayID: [],//等级名称参数
    reasonArray:[
      "公务接待",
      "朋友聚会",
      "家人来访",
      "婚丧宴请"
    ],
    iseye:0,
    eyes: [
      { name: '公开', value: '0', checked: 'true'},
      { name: '不公开', value: '1'},
    ],
    reasonID:0,
    time:"17:30",
    uname:"",
    openid:"",
    partner:"",
    show:0,//安全提示显示
    tel:"",
    cstatus: "",
    job: 0,
    index: 0,//审批等级选择
    jobtitle: "",
    leader: "",
    leaderID: "",
    alcohols: [],
    alcohol:"",
    loadShow: true,///加载图标显示
    csize: 0,
    pagesize: 10,
    cid: 0,
    inAlcohol: true,//  判断用户是否在审批流程
    driverImg: "../../../res/temp.png",//驾驶证
    identifyImg: "../../../res/temp.png",
    downloadurl: app.globalData.downloadurl,
    licences: [],//证件数组
    DefaultLimit: 8,//功能限制访问权限级别
    hideLeader: 0,
    automatic: [],
    _jobcode: 0,
    note: 1,
    check: 0,
    usetime: "",
    driver: "",
    reason: "",
    cars:[],
    carid: "",
    inCar: true,//  判断用户是否在审批流程
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
      uname: uname,
      alcohols: [],
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
      url: host + "alcohol.do",
      method: "post",
      data: {
        method: "getAlcoholList",
        dptcode: app.globalData.udptcode,
        page: that.data.alcohols.length,
        pagesize: that.data.pagesize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          alcohols: res.data
        });
        that.setData({
          csize: that.data.alcohols.length * 125
        });
        if (that.data.csize > that.data.defaultHeight) {
          that.setData({
            defaultHeight: that.data.csize + that.data.headerHeight
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
      url: host + "alcohol.do",
      method: "post",
      data: {
        method: "getAlcoholDetail2",
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var alcohol = res.data.alcohol;
        if(alcohol.aid==0){
          that.setData({
            inAlcohol: true
          });
        }else{
          console.log("test");
          if (alcohol.cstatus == 3 ) {
            that.setData({
              show: alcohol.aid,
              inAlcohol: false,
              alcohol: alcohol
            });
          }
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
  },

  onReady: function () {

  },
  //关闭提示
  closeRules:function(){
    this.setData({
      show:0
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
      size = that.data.alcohols.length;
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

  /***
   * 报备时间选择
   */
  bindTimeChange:function(e){
    var that = this;
    this.setData({
      time: e.detail.value
    })
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
        size = that.data.alcohols.length;
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
    var that = this;
    this.showLeader(that.data.arrayID[e.detail.value]);
    this.setData({
      index: e.detail.value
    })
  },

  

  drinkPickerChange: function (e) {
    var that = this;
    this.setData({
      reasonID: e.detail.value
    })
  },
  showLeader: function (index) {
    console.log(index);
    var that = this;
    that.setData({
      hideLeader: 0
    });
    var _jobcode = that.data._jobcode;
    if (index == _jobcode) {
      that.setData({
        hideLeader: 1,
      });
    }
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
      var list = that.data.alcohols;
      wx.request({
        url: host + "alcohol.do",
        method: "post",
        data: {
          method: "getAlcoholList",
          dptcode: udptcode,
          page: that.data.alcohols.length,
          pagesize: that.data.pagesize
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var alcohols = that.data.alcohols;
          var _alcohols = res.data;
          if (_alcohols.length == 0) {
            //判断获取参数等于0，提示数据已经到底
            wx.showToast({
              title: "数据已经到底",
              image: "../../../image/warning.png",
              duration: 2000
            })
          } else {
            for (var bt in _alcohols) {
              alcohols.push(_alcohols[bt]);
            }
            that.setData({
              alcohols: alcohols,
              csize: alcohols.length * 125 + that.data.headerHeight,
              defaultHeight: alcohols.length * 125 + that.data.headerHeight
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
  submitCar: function () {
    var that = this;
    var host = app.globalData.host;
    var uname=that.data.uname;
    var tel=that.data.tel;
    
    if (uname == "" || uname == null) {
      wx.showModal({
        title: "数据检查",
        content: "报备人员不能为空",
        showCancel: false,
        confirmText: "确定"
      })
      return;
    }

    if (tel == "" || tel == null) {
      wx.showModal({
        title: "数据检查",
        content: "紧急电话不能为空",
        showCancel: false,
        confirmText: "确定"
      })
      return;
    }

    /**
     * 插入车辆申请表
     */
    wx.request({
      url: host + "alcohol.do",
      method: "post",
      data: {
        method: "newAlcohol",
        dptcode: app.globalData.udptcode,//用户所属辖区code
        dptname: app.globalData.udptname,
        uname: that.data.uname,
        tel:that.data.tel,
        openid: app.globalData.openid,
        partner: that.data.partner,
        time:that.data.time,
        reason: that.data.reasonArray[that.data.reasonID],
        jobtitle: that.data.array[that.data.index],
        jobcode: that.data.arrayID[that.data.index],
        iseye:that.data.iseye
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data.result;
        if (result == 1) {
          wx.hideLoading();
          wx.showToast({
            title: "申请提交成功",
            icon: "success",
            duration: 2000
          })
          that.setData({
            inAlcohol: false,
          });
          /**
          * 接收信息
          */
          wx.requestSubscribeMessage({
            tmplIds: ['6oxQwPW_baN5AVhfio2ZQFFSEicNHiHP95uP36adKIM'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
            success(res) {
              console.log('已授权接收订阅消息')
            },
            fail(res) {
              console.log("error");
            }
          });
          that.refresh();
        }else if(result==2){
          wx.showModal({
            title: "违规提示",
            content: "申请人员处于值班中，无法审批",
            showCancel: false,
            confirmText: "确定"
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
      url: host + "alcohol.do",
      method: "post",
      data: {
        method: "delay",
        id: that.data.alcohol.aid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data.result;
        if (result == 0) {
          wx.showModal({
            title: "操作异常",
            content: "请检查网络或重启程序,错误代码：ALCOHOL_DELAY",
            showCancel: false,
            confirmText: "确定"
          })
        } else {
          wx.showToast({
            title: "取消饮酒申请",
            icon: "success",
            duration: 2000
          })
          that.setData({
            inAlcohol: true,
            partner: "",
            reasonID:0,
            jobcode: 0
          });
          that.refresh();
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
      uname: _title
    });
  },
  //修改用车信息
  keyCar: function (e) {
    var that = this;
    var host = app.globalData.host;
    var partner = e.detail.value;
    //清除空格和回车
    partner = partner.replace(/[ ]/g, "");    //去掉空格
    partner = partner.replace(/[\r\n]/g, ""); //去掉回车换行
    that.setData({
      partner: partner
    });
  },
  //修改用车原因信息
  keyReason: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    this.setData({
      tel: _title
    });
  },
  /**
   审批通过
   */
  carPassBtn: function (e) {
    var that = this;
    var cid = e.target.dataset.cid;
    var host = app.globalData.host;
    wx.showModal({
      title: "审批提示",
      content: "同意车辆外出?",
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
              method: "leaderCarLicense",
              leaderid: app.globalData.openid,
              leader: app.globalData.uname,
              cid: cid,
              cstatus: 3
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
  /**
   * 取消审批
   */
  carDelayBtn: function (e) {
    var that = this;
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
  carBack: function (e) {
    var that = this;
    var cid = e.target.dataset.cid;
    var host = app.globalData.host;
    wx.showModal({
      title: "操作提示",
      content: "已经安全返回?",
      showCancel: true,
      confirmText: "确定",
      cancelText: "取消",
      cancelColor: "#d81e06",
      success: function (res) {
        if (res.confirm) {
          //更新车辆状态
          wx.request({
            url: host + "alcohol.do",
            method: "post",
            data: {
              method: "back",
              id:that.data.alcohol.aid
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
              }else{
                that.setData({
                  inAlcohol: true,
                  partner: "",
                  reasonID: 0,
                  jobcode: 0
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
  refresh: function () {
    this.onLoad();
  },

  radioChange:function(e){
    this.setData({
      iseye: e.detail.value
    })
  },
  updateCar: function (e) {
    var that = this;
    var isUse = e.currentTarget.dataset.isuse;
    if (isUse == 0) {
      that.setData({
        leader: e.currentTarget.dataset.leader,
        leaderID: e.currentTarget.dataset.openid,
        _jobcode: e.currentTarget.dataset.jobcode,
        carid: e.currentTarget.dataset.carnumber,
        automatic: [],
        check: 1
      });
      that.showLeader(that.data.arrayID[that.data.index]);
    }
  }
})
var app = getApp();
var util = require('../../../util/util.js')
var formatLocation = util.formatLocation
Page({
  data: {
    imageList: [],
    worknote: [],//一日生活制度
    videoTypeIndex: 0,
    videoType: ['拍摄', '相册', '拍摄或相册'],
    videoIndex: 2,
    video: ['前置', '后置', '前置或后置'],
    durationIndex: 10,
    videoString: "",//服务器传回的视频地址
    downloadurl: "",
    src: "",
    title:"",
    _openid:"",
    resDiv: 0,//控制资源上传为图片/视频
    resString: '切换视频资源',
    plan: {
      pid: 1,
      title: "",
      time: "2000-09-01",
      content: "",
      ptime:""
    },
    sourceTypeIndex: ['album', 'camera'],//拍照或图册
    sizeTypeIndex: ['compressed'],//压缩
    countIndex: 3,
    imgString: "",//服务器传回文件字符串
    lng: 104.216248,
    lat: 23.400733,
    DefaultLimit: 8//功能限制访问权限级别
  },
  onLoad: function (options) {
    var that = this;
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    that.setData({
      downloadurl: downloadurl,
      _openid: app.globalData.openid
    });
    var pid = options.pid;//读取传递的ID参数
    var udptcode = app.globalData.udptcode;//用户单位id
    var openid = app.globalData.openid;//用户的id
    var uname = app.globalData.uname;
    //读取单位数据
    wx.request({
      url: host + "notice.do",
      method: "post",
      data: {
        method: "getPlanDetail",
        pid: pid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _plan = res.data.plan;
        that.setData({
          plan: {
            pid: _plan.pid,
            title: _plan.title,
            content: _plan.content,
            time: _plan.time,
            person: _plan.person,
            ptime:_plan.ptime
          },
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Plan_Detail," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    /**
     * worknote
     */
    wx.request({
      url: host + "worknote.do",
      method: "post",
      data: {
        method: "getWorklistBrief",
        targetID: pid,
        downloadurl: downloadurl,
        sipID: "plan"//关联标识
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _worknote = res.data;
        var worknote = that.data.worknote;
        that.setData({
          worknote: res.data
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
    //调用监听截屏操作
    wx.onUserCaptureScreen(function (res) {
      //监控到用户截屏，登记信息
      app.globalData.title = "截屏：工作任务";
      app.globalData.url = "/page/plan/detail/index?id=" + that.data.plan.pid;
      app.ShareAction();
    })
  },

  uploadAccidentVideo: function () {
    var that = this;
    var host = app.globalData.host;//默认系统地址
    /**
     * 获取location
     */
    wx.getLocation({
      success: function (res) {
        that.setData({
          lng: res.longitude,
          lat: res.latitude
        })
      }
    })
    //判断录入数据是否为空
    var inputs = that.data.title + that.data.videoString;
    if (inputs == "" || inputs == null || inputs == "null") {
      wx.showToast({
        image: "../../../image/warning.png",
        title: "输入不能为空",
        duration: 2000
      })
      return;
    }
    /***
     * 读取img数据
     */
    wx.showLoading({
      title: '数据上传中',
      mask: true,
      image: "../../../image/load.gif"
    })
    /*
    保存数据
    */
    wx.request({
      url: host + "worknote.do",
      method: "post",
      data: {
        method: "addWork",
        title: that.data.title,
        dptcode: app.globalData.udptcode,
        dptname: app.globalData.udptname,
        openid: app.globalData.openid,
        uname: app.globalData.uname,
        sipname: "一日生活制度",
        sipID: "plan",//关联标识
        targetID: that.data.plan.pid,
        targetTime: "任务时间：" + that.data.plan.time,
        targetTitle: "任务名称：" + that.data.plan.title,
        targetBrief: "参与人员：" + that.data.plan.person,
        targetIcon: "remind.png",
        targetUrl: "task/detail/index?pid=" + that.data.plan.pid,
        imgs: that.data.videoString,
        lng: that.data.lng,
        lat: that.data.lat,
        index: 0,//标识位，用于控制显示内容
        video: 1        //标识为视频资源
        //在服务器获取时间
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var actionResult = res.data.actionResult;
        
        if (actionResult == 1) {
          wx.showToast({
            icon: "success",
            title: "一日生活制度录入成功",
            duration: 1000
          })
          //清空填写的数据,从后台读取更新后的数据
          that.setData({
            title: "",
            imageList: [],
            worknote: [],
            imgString: "",
            videoString: "",
            src: ""
          });
          wx.request({
            url: host + "worknote.do",
            method: "post",
            data: {
              method: "getWorklistBrief",
              targetID: that.data.plan.pid,
              downloadurl: app.globalData.downloadurl,
              sipID: "plan"//关联标识
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.hideLoading();
              var _worknote = res.data;
              var worknote = that.data.worknote;
              that.setData({
                worknote: res.data
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

        } else {
          wx.showModal({
            title: "服务器异常",
            content: "请联系管理员处理问题,错误代码：WORK_ADD",
            showCancel: false,
            confirmText: "确定"
          })
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
  /**
   * 选择图片
   */
  chooseImage: function () {
    var that = this;
    var host = app.globalData.host;//默认系统地址
    var sercertcode = app.globalData.sercertcode;//系统默认识别码
    wx.chooseImage({
      sourceType: that.data.sourceTypeIndex,
      sizeType: that.data.sizeTypeIndex,
      count: this.data.countIndex,
      success: function (res) {
        var imagelist = res.tempFilePaths;
        that.setData({
          imageList: imagelist
        })
        //上传图片
        for (var i = 0; i < imagelist.length; i++) {
          /**
           * 显示上传提示信息
           */
          wx.showToast({
            icon: "loading",
            title: "正在上传文件",
            mask: true
          })
          wx.uploadFile({
            url: host + "worknote.do?method=uploadFiles",
            filePath: imagelist[i],
            name: 'file',
            header: { "Content-Type": "multipart/form-data" },
            formData: {
              //和服务器约定的token
              'sercertcode': sercertcode
            },
            success: function (res) {
              var _data = res.data;
              var _dataArray = _data.split("\"");
              var resultKey = _dataArray[1];//标识
              var resultVal = _dataArray[3];
              if (_dataArray[1] == "imgfile") {
                that.setData({
                  imgString: that.data.imgString + _dataArray[3] + ";"
                });
              }
              //隐藏
              wx.hideToast();
              if (res.statusCode != 200) {
                wx.showModal({
                  title: '提示',
                  content: "第" + i + "张图片上传失败,原因：" + _dataArray[3],
                  showCancel: false,
                  confirmText: "确定",
                  success: function (res2) {
                    if (res2.confirm) {
                      //继续上传
                    }
                  }
                })
              }
            },
            fail: function (e) {
              wx.showModal({
                title: '提示',
                content: '图片上传失败',
                showCancel: false
              })
            }
          });
        }
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
  /**
   * 系统默认显示图片方式
   */
  previewImage2: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  /**
  * 检索关键字
  */
  keyChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      title: _title
    });
  },
  keyChange2: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    this.setData({
      title: _title
    });
  },
  /**
   * 上传图片
   */
  uploadAccident: function () {
    var that = this;
    var host = app.globalData.host;//默认系统地址
    /**
     * 获取location
     */
    wx.getLocation({
      success: function (res) {
        that.setData({
          lng: res.longitude,
          lat: res.latitude
        })
      }
    })
    //判断录入数据是否为空
    var inputs = that.data.title + that.data.imgString;
    if (inputs == "" || inputs == null || inputs=="null"){
      wx.showToast({
        image: "../../../image/warning.png",
        title: "输入不能为空",
        duration: 2000
      })
      return;
    }
    wx.showLoading({
      title: '数据上传中',
      mask: true,
      image: "../../../image/load.gif"
    })
    /***
     * 读取img数据
     */
    /*
    保存数据
    */
    wx.request({
      url: host + "worknote.do",
      method: "post",
      data: {
        method: "addWork",
        title: that.data.title,
        dptcode: app.globalData.udptcode,
        dptname: app.globalData.udptname,
        openid: app.globalData.openid,
        uname: app.globalData.uname,
        sipname: "一日生活制度",
        sipID: "plan",//关联标识
        targetID: that.data.plan.pid,
        targetTime: "任务时间：" + that.data.plan.time,
        targetTitle: "任务名称：" + that.data.plan.title,
        targetBrief: "参与人员：" + that.data.plan.person,
        targetIcon: "remind.png",
        targetUrl: "task/detail/index?pid=" + that.data.plan.pid,
        imgs: that.data.imgString,
        lng: that.data.lng,
        lat: that.data.lat,
        index:0//标识位，用于控制显示内容
        //在服务器获取时间
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var actionResult = res.data.actionResult;
        if (actionResult == 1) {
          wx.showToast({
            icon: "success",
            title: "一日生活制度录入成功",
            duration: 1000
          })
          //清空填写的数据,从后台读取更新后的数据
          that.setData({
            title: "",
            imageList: [],
            worknote: [],
            imgString: "",
            videoString: "",
            src: ""
          });
          wx.request({
            url: host + "worknote.do",
            method: "post",
            data: {
              method: "getWorklistBrief",
              targetID: that.data.plan.pid,
              downloadurl: app.globalData.downloadurl,
              sipID: "plan"//关联标识
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.hideLoading();
              var _worknote = res.data;
              var worknote = that.data.worknote;
              that.setData({
                worknote: res.data
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

        } else {
          wx.showModal({
            title: "服务器异常",
            content: "请联系管理员处理问题,错误代码：WORK_ADD",
            showCancel: false,
            confirmText: "确定"
          })
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
  //删除操作
  delItem: function (e) {
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
                    var worknote = that.data.worknote;
                    var _worknote = [];
                    for (var bt in worknote) {
                      if (worknote[bt].linkID != linkid) {
                        _worknote.push(worknote[bt]);
                      }
                    }
                    that.setData({
                      worknote: _worknote
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
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    app.globalData.title = "一日生活制度";
    app.globalData.url = "/page/plan/detail/index?id=" + this.data.plan.pid;
    app.ShareAction();
  },
  //选择视频数据
  chooseVideo: function () {
    var that = this;
    var sercertcode = app.globalData.sercertcode;//系统默认识别码
    var host = app.globalData.host;
    wx.chooseVideo({
      sourceType: this.data.videoType[this.data.videoTypeIndex],
      camera: this.data.video[this.data.videoIndex],
      maxDuration: this.data.durationIndex,
      compressed: true,
      success: function (res) {
        that.setData({
          src: res.tempFilePath
        })
        /**
            * 显示上传提示信息
            */
        wx.showToast({
          icon: "loading",
          title: "正在上传文件",
          mask: true
        })
        wx.uploadFile({
          url: host + "worknote.do?method=uploadFiles",
          filePath: that.data.src,
          name: 'file',
          header: { "Content-Type": "multipart/form-data" },
          formData: {
            //和服务器约定的token
            'sercertcode': sercertcode
          },
          success: function (res) {
            var _data = res.data;
            var _dataArray = _data.split("\"");
            var resultKey = _dataArray[1];//标识
            var resultVal = _dataArray[3];
            if (_dataArray[1] == "imgfile") {
              that.setData({
                videoString: that.data.imgString + _dataArray[3]
              });
            }
            //隐藏
            wx.hideToast();
            if (res.statusCode != 200) {
              wx.showModal({
                title: '提示',
                content: "网路故障，错误原因:" + _dataArray[3],
                showCancel: false,
                confirmText: "确定",
                success: function (res2) {
                  if (res2.confirm) {
                    //继续上传
                  }
                }
              })
            }
          },
          fail: function (e) {
            wx.showModal({
              title: '提示',
              content: '视频上传失败',
              showCancel: false
            })
          }
        });
      }
    })
  },
  changeRes: function () {
    var that = this;
    var resDiv = this.data.resDiv;
    resDiv = (1 * resDiv + 1) % 2;
    var resString = "";
    if (resDiv == 0) {
      resString = "切换视频资源";
    } else {
      resString = "切换图像资源";
    }
    that.setData({
      resDiv: resDiv,
      resString: resString
    });
  }
})

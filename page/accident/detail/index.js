var app = getApp();
var util = require('../../../util/util.js')
var formatLocation = util.formatLocation
Page({
  data: {
    imageList: [],
    worknote: [],//火场文书
    sourceTypeIndex: ['album', 'camera'],//拍照或图册
    sizeTypeIndex: ['compressed'],//压缩
    videoTypeIndex: 0,
    videoType: ['拍摄', '相册', '拍摄或相册'],
    videoIndex: 2,
    video: ['前置', '后置', '前置或后置'],
    durationIndex: 10,
    countIndex: 3,//允许上传图片数据
    title: "",//火场文书记录
    downloadurl: "",
    imgString: "",//服务器传回文件字符串
    videoString: "",//服务器传回的视频地址
    lng: 104.216248,
    lat: 23.400733,
    udptcode: "",
    src: "",
    resDiv:0,//控制资源上传为图片/视频
    resString:'切换视频资源',
    accident: {
      aid: "1",
      address: "",
      atid: 0,//事故类型ID
      atype: "火灾扑救",//事故类型名称
      dangerman: 0,//被困人员情况
      frog: "有烟有火",//烟雾情况
      burnthing: "",//燃烧物资
      leader: "",//现场指挥员
      driver: "",//驾驶员
      rescueman: 6,//出动人员
      rescuecar: 1,//出动车辆
      atime: "",//事故发生时间
      dptname: "",
      dptcode: 2,
      brief: "",
      linkphone: ""//报警人联系电话
    },
    DefaultLimit: 8,//功能限制访问权限级别
  },
  onLoad: function (options) {
    var that = this;
    app.validateUser();//验证用户
    app.checkVisitJob(this.data.DefaultLimit);//验证用户访问权限
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    that.setData({
      downloadurl: downloadurl,
      udptcode: app.globalData.udptcode
    });
    var aid = options.aid;//读取传递的ID参数
    var udptcode = app.globalData.udptcode;//用户单位id
    var openid = app.globalData.openid;//用户的id
    var uname = app.globalData.uname;
    //读取单位数据
    wx.request({
      url: host + "accident.do",
      method: "post",
      data: {
        method: "getAccidentDetail",
        aid: aid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _accident = res.data.accident;
        if (_accident.aid == "" || _accident.aid == null || _accident.aid == "null") {
          //提示数据已经丢失
          wx.showModal({
            title: "系统提示",
            content: "数据丢失或删除",
            showCancel: false,
            confirmText: "确定",
            success: function (res) {
              if (res.confirm) {
                //返回首页
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
        that.setData({
          accident: _accident,
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：Accident_Detail," + res.errMsg,
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
        targetID: aid,
        downloadurl: downloadurl,
        sipID: "accident"//关联标识
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
      app.globalData.title = "截屏：警情速递";
      app.globalData.url = "/page/accident/detail/index?id=" + that.data.accident.aid;
      app.ShareAction();
    })
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

    wx.showLoading({
      title: '数据上传中',
      mask: true,
      image: "../../../image/load.gif"
    })

    //判断录入数据是否为空
    var inputs = that.data.title + that.data.imgString;
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
        sipname: "警情速递",
        sipID: "accident",//关联标识
        targetID: that.data.accident.aid,
        targetTime: "事故时间：" + that.data.accident.atime,
        targetTitle: "事故地址：" + that.data.accident.address,
        targetBrief: "事故类别：" + that.data.accident.atype,
        targetIcon: "accident.png",
        targetUrl: "accident/detail/index?aid=" + that.data.accident.aid,
        imgs: that.data.imgString,
        lng: that.data.lng,
        lat: that.data.lat,
        index: 1
        //在服务器获取时间
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var actionResult = res.data.actionResult;
        if (actionResult == 1) {
          wx.hideLoading();
          wx.showToast({
            icon: "success",
            title: "火场文书录入成功",
            duration: 1000
          })
          //清空填写的数据,从后台读取更新后的数据
          that.setData({
            title: "",
            imageList: [],
            worknote: [],
            imgString: "",
            videoString:"",
            src: ""
          });
          wx.request({
            url: host + "worknote.do",
            method: "post",
            data: {
              method: "getWorklistBrief",
              targetID: that.data.accident.aid,
              downloadurl: app.globalData.downloadurl,
              sipID: "accident"//关联标识
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
    /*
    保存数据
    */
    wx.showLoading({
      title: '数据上传中',
      mask: true,
      image: "../../../image/load.gif"
    })

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
        sipname: "警情速递",
        sipID: "accident",//关联标识
        targetID: that.data.accident.aid,
        targetTime: "事故时间：" + that.data.accident.atime,
        targetTitle: "事故地址：" + that.data.accident.address,
        targetBrief: "事故类别：" + that.data.accident.atype,
        targetIcon: "accident.png",
        targetUrl: "accident/detail/index?aid=" + that.data.accident.aid,
        imgs: that.data.videoString,
        lng: that.data.lng,
        lat: that.data.lat,
        index: 1,
        video:1        //标识为视频资源
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
            title: "火场文书录入成功",
            duration: 1000
          })
          //清空填写的数据,从后台读取更新后的数据
          that.setData({
            title: "",
            imageList: [],
            worknote: [],
            imgString: "",
            videoString: "",
            src:""
          });
          wx.request({
            url: host + "worknote.do",
            method: "post",
            data: {
              method: "getWorklistBrief",
              targetID: that.data.accident.aid,
              downloadurl: app.globalData.downloadurl,
              sipID: "accident"//关联标识
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
  //拨打手机电话
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: "'" + this.data.accident.linkphone + "'" //仅为示例，并非真实的电话号码
    })
  },
  /**
   * 
   */
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
  //删除操作
  delAcc: function () {
    var that = this;
    var host = app.globalData.host;
    var aid = that.data.accident.aid;
    wx.showModal({
      title: '提示',
      content: '确定删除警情',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: host + "accident.do",
            method: "post",
            data: {
              method: "delAcc",
              aid: aid
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
                    //跳转
                    wx.redirectTo({
                      url: "../index/index"
                    })
                  }
                })
              }
            },
            fail: function (res) {
              wx.showModal({
                title: "数据异常",
                content: "请检查网络或重启程序,错误代码：Accident_Delete," + res.errMsg,
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
  onShareAppMessage: function () {
    app.globalData.title = "警情速递";
    app.globalData.url = "/page/accident/detail/index?id=" + this.data.accident.aid;
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
      compressed:true,
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
  changeRes:function(){
    var that=this;
    var resDiv=this.data.resDiv;
    resDiv=(1*resDiv+1)%2;
    var resString="";
    if(resDiv==0){
      resString="切换视频资源";
    }else{
      resString="切换图像资源";
    }
    that.setData({
      resDiv:resDiv,
      resString:resString
    });
  }
})


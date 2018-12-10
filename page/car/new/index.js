// page/car/new/index.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    driverImg: "temp2.png",//驾驶证
    identifyImg: "temp2.png",
    sourceTypeIndex: ['album', 'camera'],//拍照或图册
    sizeTypeIndex: ['compressed'],//压缩
    videoTypeIndex: 0,
    countIndex: 1,
    downloadurl: app.globalData.downloadurl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.validateUser();//验证用户
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    var openid = app.globalData.openid;//用户的id
    that.setData({
      downloadurl: downloadurl,
      udptcode: app.globalData.udptcode
    });
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
          driverImg: res.data.driverLicence,
          identifyImg: res.data.identifyLicence
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

  },
  /**
   * 选择identifyCard
   */
  chooseIdentifyImage: function () {
    var that = this;
    var host = app.globalData.host;//默认系统地址
    var sercertcode = app.globalData.sercertcode;//系统默认识别码
    wx.chooseImage({
      sourceType: that.data.sourceTypeIndex,
      sizeType: that.data.sizeTypeIndex,
      count: this.data.countIndex,
      success: function (res) {
        var tempImg = res.tempFilePaths;
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
          filePath: tempImg[0],
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
                identifyImg:_dataArray[3]
              });
            }
            //隐藏
            wx.hideToast();
            if (res.statusCode != 200) {
              wx.showModal({
                title: '提示',
                content: "图片上传失败",
                showCancel: false,
                confirmText: "确定"
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
    })
  },

  /**
   * 选择identifyCard
   */
  chooseDriverImage: function () {
    var that = this;
    var host = app.globalData.host;//默认系统地址
    var sercertcode = app.globalData.sercertcode;//系统默认识别码
    wx.chooseImage({
      sourceType: that.data.sourceTypeIndex,
      sizeType: that.data.sizeTypeIndex,
      count: this.data.countIndex,
      success: function (res) {
        var tempImg = res.tempFilePaths;
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
          filePath: tempImg[0],
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
                driverImg: _dataArray[3]
              });
            }
            //隐藏
            wx.hideToast();
            if (res.statusCode != 200) {
              wx.showModal({
                title: '提示',
                content: "图片上传失败",
                showCancel: false,
                confirmText: "确定"
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
    })
  },
  submitIdentifyLicence:function(){
    var that = this;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    var openid = app.globalData.openid;//用户的id
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "insertIdentifyLicence",
        openid: openid,
        identifyImg: this.data.identifyImg
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result=res.data.result;
        if(result==1){
          wx.showToast({
            icon: "success",
            title: "资料提交成功",
            duration: 1000
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取CAR_INSERTIDENTIFYIMG," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  submitDriverLicence: function () {
    var that = this;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    var openid = app.globalData.openid;//用户的id
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "insertDriverLicence",
        openid: openid,
        driverImg: this.data.driverImg
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data.result;
        if (result == 1) {
          wx.showToast({
            icon: "success",
            title: "资料提交成功",
            duration: 1000
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取CAR_INSERTDRIVERIMG," + res.errMsg,
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

  }
})
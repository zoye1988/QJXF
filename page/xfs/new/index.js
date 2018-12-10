var app = getApp();
var util = require('../../../util/util.js')
var formatLocation = util.formatLocation
// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['运行正常', '故障维修'],
    sourceTypeIndex: ['album', 'camera'],//拍照或图册
    sizeTypeIndex: ['compressed'],//压缩
    xfsarray: ['内扣式接口', '卡扣式接口'],
    tempFilePath: '',
    hasLocation: false,
    imageList: [],
    imgString: "",
    xstatus:0,//运行状态
    diameter:60,//管网直径
    pressure:1.5,//压力
    types:0,//管网类型
    title: '',//名称
    lng: 104.216248,
    lat: 23.400733,
    address: "",
    downloadurl: ""
  },

  bindPickerChange: function (e) {
    this.setData({
      xstatus: e.detail.value
    })
  },

  bindPickerChange2: function (e) {
    this.setData({
      types: e.detail.value
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
      count: 1,
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
                  imgString: _dataArray[3]
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
  xfsTitleChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      title: _title
    });
  },
  diameterChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字。
    _title = _title.replace(/[^\Z0-9]/g, '');
    this.setData({
      diameter: _title
    });
  },
  pressureChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字。
    _title = _title.replace(/[^\Z0-9]/g, '');
    this.setData({
      pressure: _title
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //app.validateUser();//验证用户
    this.setData({
      downloadurl:app.globalData.downloadurl
    });
  },
  //提交表格
  submitXFS: function () {
    //判断输入是否为空
    var that = this;
    var host = app.globalData.host;
    var title = that.data.title;
    var address = that.data.address;
    var lng = that.data.lng;
    var lat = that.data.lat;
    var xstatus = that.data.xstatus;
    var types = that.data.types;
    var diameter=that.data.diameter;
    var pressure = that.data.pressure;
    var imgString = that.data.imgString;
    if (title === "" || address === "" || lng === "" || lat === "" || diameter === "" || pressure === "") {
      wx.showModal({
        title: "验证提示",
        content: "填写表格存在遗漏项，请检查",
        showCancel: false,
        confirmText: "确定"
      })
    } else {
      wx.showLoading({
        title: '数据上传中',
        mask: true,
        image: "../../../image/load.gif"
      })
      //将输入插入服务器
      wx.request({
        url: host + "xfs.do",
        method: "post",
        data: {
          method: "addXfs",
          title: title,
          address: address,
          xstatus: xstatus,
          lng: lng,
          lat: lat,
          types: types,
          diameter: diameter,
          pressure: pressure,
          image: that.data.imgString,
          dptcode: app.globalData.udptcode
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data.result;
          wx.hideLoading();
          if (result == 1) {
            wx.showToast({
              icon: "success",
              title: "社会单位数据采集成功",
              duration: 1000
            })
            //清除表格
            that.claerXFS();
          } else {
            wx.showModal({
              title: "操作异常",
              content: "请检查网络或重启程序,错误代码：Build_ADDBUILD," + res.errMsg,
              showCancel: false,
              confirmText: "确定"
            })
          }
        },
        fail: function (res) {
          wx.showModal({
            title: "数据异常",
            content: "请检查网络或重启程序,错误代码：Build_ADDBUILD," + res.errMsg,
            showCancel: false,
            confirmText: "确定"
          })
        }
      });
    }
  },
  //清空表格数据
  claerXFS: function () {
    this.setData({
      title: "",
      lng: "",
      lat: "",
      pressure: 1.5,
      diameter: 60,
      locationAddress: "",
      address: "",
      imgString: ""
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  chooseLocation: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          location: formatLocation(res.longitude, res.latitude),
          lng: res.longitude,//读取地址数据
          lat: res.latitude,//读取地址数据
          locationAddress: res.address,
          address: res.address
        })
      }
    })
  },
  clear: function () {
    this.setData({
      hasLocation: false
    })
  }

})
// index.js
var app = getApp();
var util = require('../../../util/util.js')
var formatLocation = util.formatLocation
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePath: '',
    hasLocation: false,
    imageList: [],
    sourceTypeIndex: ['album', 'camera'],//拍照或图册
    sizeTypeIndex: ['compressed'],//压缩
    countIndex: 5,
    title: "",//标题
    content: "",
    lng: 104.216248,
    lat: 23.400733,
    imgString: "",
    time: "",
    wid: 0
  },
  titleChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    this.setData({
      title: _title
    });
  },
  contentChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    this.setData({
      content: _title
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.validateUser();//验证用户
    //获取坐标
    wx.getLocation({
      success: function (res) {
        that.setData({
          lng: res.longitude,
          lat: res.latitude
        })
      }
    })
  },
  dateFtt: function () {
    var that = this;
    var fmt = "yyyy-MM-dd hh:mm:ss";
    var date = new Date();
    var o = {
      "M+": date.getMonth() + 1,                 //月份   
      "d+": date.getDate(),                    //日   
      "h+": date.getHours(),                   //小时   
      "m+": date.getMinutes(),                 //分   
      "s+": date.getSeconds(),                 //秒   
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
      "S": date.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    that.setData({
      time: fmt
    });
  },
  //提交note
  submitWeather: function () {
    var that = this;
    var host = app.globalData.host;
    var title = that.data.title;
    var content = that.data.content;
    if (title === "" || content === "") {
      wx.showModal({
        title: "验证提示",
        content: "填写数据存在遗漏项，请检查",
        showCancel: false,
        confirmText: "确定"
      })
    } else {
      wx.showLoading({
        title: '数据上传中',
        mask: true,
        image: "../../../image/load.gif"
      })
      //获得当前时间
      that.dateFtt();
      //将输入插入服务器
      wx.request({
        url: host + "notice.do",
        method: "post",
        data: {
          method: "addWeather",
          title: title,
          content: content,
          time: that.data.time,
          openid: app.globalData.openid,
          author: app.globalData.uname,
          dptcode: app.globalData.udptcode,
          dptname: app.globalData.udptname,
          image: that.data.imgString
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data.result;
          if (result != 0) {
            wx.showToast({
              icon: "success",
              title: "灾情预警录入成功",
              duration: 1000
            })
            that.setData({
              wid: result
            });
            //插入worknote
            that.worknote();
            //清除表格
            that.clearTable();
          } else {
            wx.showModal({
              title: "操作异常",
              content: "请检查网络或重启程序,错误代码：Notice_ADDNOTE," + res.errMsg,
              showCancel: false,
              confirmText: "确定"
            })
          }
        },
        fail: function (res) {
          wx.showModal({
            title: "数据异常",
            content: "请检查网络或重启程序,错误代码：Notice_ADDNOTE," + res.errMsg,
            showCancel: false,
            confirmText: "确定"
          })
        }
      });
    }
  },
  //清空表格数据
  clearTable: function () {
    this.setData({
      title: "",
      content: "",
      imageList: [],
      imgString: "",
      time: "",
      wid: 0
    });
  },
  //worknote
  worknote: function () {
    var that = this;
    var host = app.globalData.host;
    var _content = this.data.content;
    _content = _content.substr(0, 10) + "...";
    //获取当前时间
    that.dateFtt();
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
        sipname: "灾害预警",
        sipID: "weather",//关联标识
        targetID: that.data.wid,
        targetTime: "通报时间：" + that.data.time,
        targetTitle: "通报标题：" + that.data.title,
        targetBrief: "通报内容：" + _content,
        targetIcon: "weather.png",
        targetUrl: "plan/show/index?nid=" + that.data.wid + "&code=weather",
        imgs: that.data.imgString,
        lng: that.data.lng,
        lat: that.data.lat,
        index: 0
        //在服务器获取时间
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var actionResult = res.data.actionResult;
        if (actionResult == 1) {
          wx.hideLoading();
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
          content: "请检查网络或重启程序,错误代码：WORK_ADD," + res.errMsg,
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
      count: 5,
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
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  }
})
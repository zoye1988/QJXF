var app = getApp();
var util = require('../../../util/util.js')
var formatLocation = util.formatLocation
// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePath: '',
    hasLocation: false,
    imageList: [],
    bitems: [],
    bitemsval: [],
    bindex: 0,//默认选择类型
    sourceTypeIndex: ['album', 'camera'],//拍照或图册
    sizeTypeIndex: ['compressed'],//压缩
    title:'',//单位名称
    lng: 104.216248,
    lat: 23.400733,
    address:"",
    tel:"",
    phone:"",
    imgString:"",
    buildtype:0,//单位类别数据
    downloadurl:""
  },
  //选择单位类别
  bindPickerChange: function (e) {
    var that=this;
    this.setData({
      bindex: e.detail.value,
      buildtype: that.data.bitemsval[e.detail.value]
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
                  imgString:_dataArray[3]
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.validateUser();//验证用户
    //读取用户节本数据
    var udptcode = app.globalData.udptcode;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    //读取单位分类列表
    wx.request({
      url: host + "build.do",
      method: "post",
      data: {
        method: "getBuildItem",
        dptcode: udptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var btlist = that.data.bitems;
        var btvlist = that.data.bitemsval;
        var temp = res.data;
        for (var bt in temp) {
          btlist.push(temp[bt].btname);
          btvlist.push(temp[bt].btid);
        }
        that.setData({
          bitems: btlist,
          bitemsval: btvlist,
          buildtype: btvlist[0],//默认的单位类别
          downloadurl: downloadurl
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序",
          showCancel: false,
          confirmText: "确定"
        })
      }
    })

  },
  //清空表格数据
  claerBuild:function(){
    this.setData({
      title:"",
      lng:"",
      lat:"",
      tel:"",
      phone:"",
      locationAddress:"",
      address:"",
      imgString:""

    });
  },
  //提交表格
  submitBuild:function(){
    //判断输入是否为空
    var that=this;
    var host = app.globalData.host;
    var title=that.data.title;
    var address=that.data.address;
    var buildtype = that.data.bitemsval[that.data.bindex];
    var lng=that.data.lng;
    var lat=that.data.lat;
    var tel=that.data.tel;
    var phone=that.data.phone;
    var imgString = that.data.imgString;
    if(title==="" || address==="" || lng==="" || lat==="" || tel==="" || phone==="")    {
      wx.showModal({
        title: "验证提示",
        content: "填写表格存在遗漏项，请检查",
        showCancel: false,
        confirmText: "确定"
      })
    }else{
      wx.showLoading({
        title: '数据上传中',
        mask: true,
        image: "../../../image/load.gif"
      })
      //将输入插入服务器
      wx.request({
        url: host + "build.do",
        method: "post",
        data: {
          method: "AddBuild",
          title:title,
          address:address,
          btid:buildtype,
          lng:lng,
          lat:lat,
          tel:tel,
          phone:phone,
          image:that.data.imgString,
          dptcode: app.globalData.udptcode
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result=res.data.result;
          wx.hideLoading();
          if(result==1){
            wx.showToast({
              icon: "success",
              title: "社会单位数据采集成功",
              duration: 1000
            })
            //清除表格
            that.claerBuild();
          }else{
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
            content: "请检查网络或重启程序",
            showCancel: false,
            confirmText: "确定"
          })
        }
      });
    }
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
  },
  buildTitleChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      title: _title
    });
  },
  telChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      tel: _title
    });
  },
  phoneChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字。
    _title = _title.replace(/[^\Z0-9]/g, '');
    this.setData({
      phone: _title
    });
  }
  
})
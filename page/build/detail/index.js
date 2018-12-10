// index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    build: { 
      id: "0", 
      title: "",
      address: "",
      tip: "",
      tel: "",
      phone: "",
      image: "../../../res/temp.png",
      lng: 104.216248,
      lat: 23.400733,
      dtpname:"",
    },
    bFile:[]//单位附件列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.validateUser();//验证用户
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    var bid = options.id;//读取传递的ID参数
    //读取单位数据
    wx.request({
      url: host + "build.do",
      method: "post",
      data: {
        method: "getBuildDetail",
        bid:bid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _build = res.data.build;
        if (_build.bid == "" || _build.bid == null || _build.bid=="null"){
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
          build: {
            id: _build.tid,
            title: _build.title,
            address: _build.address,
            tip: _build.btname,
            tel: _build.tel,
            phone: _build.phone,
            image: downloadurl+_build.imagestring,
            lng: _build.lng,
            lat: _build.lat,
            dptname:_build.dptname
          }
        });
        //将navrigaterBar名称修改
        wx.setNavigationBarTitle({
          title: _build.title
        })
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
    //读取单位附件数据
    wx.request({
      url: host + "build.do",
      method: "post",
      data: {
        method: "getBuildFile",
        bid: bid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var _bfile = res.data;
        var bfile=that.data.bFile;
        
        that.setData({
          bFile: _bfile
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
    });
    //调用监听截屏操作
    wx.onUserCaptureScreen(function (res) {
      //监控到用户截屏，登记信息
      app.globalData.title = "截屏：社会单位";
      app.globalData.url = "/page/build/detail/index?id=" + that.data.build.id;
      app.ShareAction();
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    app.globalData.title = "社会单位";
    app.globalData.url = "/page/build/detail/index?id=" + this.data.build.id;
    app.ShareAction();
  },
  //拨打座机电话
  callTel:function(){
    wx.makePhoneCall({
      phoneNumber: "'"+this.data.build.tel+"'" //仅为示例，并非真实的电话号码
    })
  },
  //拨打手机电话
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: "'" + this.data.build.phone + "'" //仅为示例，并非真实的电话号码
    })
  },
  navimap:function(e){
    wx.navigateTo({ url: "../../map/show/index?lat=" + e.target.dataset.lat + "&&lng=" + e.target.dataset.lng + "&&title=" + e.target.dataset.title + "&&type=" + e.target.dataset.type });
  },
  
  downloadFile: function (e) {//下载文件
    var downloadurl = app.globalData.downloadurl;//读取全局参数
    var that = this;
    wx.showLoading({
      title: '文件下载中',
      mask:true,
      image:"../../../image/load.gif"   
    })
    wx.downloadFile({
      url: downloadurl+e.currentTarget.dataset.files, //仅为示例，并非真实的资源
      success: function (res) {
        wx.hideLoading();
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
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
  }
})
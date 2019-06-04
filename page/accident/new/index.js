// index.js
var app = getApp();
var util = require('../../../util/util.js')
var formatLocation = util.formatLocation
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['火灾扑救', '抢险救援', '社会救助','执勤保卫','其他灾害'],
    frog:['无','有浓烟','有火光','有烟有火'],
    index: 0,
    findex:0,
    address:"",
    atid:0,//事故类别
    atype:"火灾扑救",
    dangerman:0,
    burnthing:"",
    leader:"",
    driver:"",
    rescueman:0,
    rescuecar:0,
    phone:"",
    brief:"",
    udptname:"",
    lng: 103.8075265288353,
    lat: 25.484506828614666,
    aid:0,
    atime:"",
    lock:0//用于防止多次提交数据
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChange2: function (e) {
    this.setData({
      findex: e.detail.value
    })
  },
  //被困人员
  dangermanChange:function(e){
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\Z0-9]/g, '');
    this.setData({
      dangerman: _title
    });
  },
  //事故地址
  addressChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      address: _title
    });
  },
  //燃烧物质
  burnthingChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      burnthing: _title
    });
  },
  //指挥员
  leaderChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      leader: _title
    });
  },
  //驾驶员
  driverChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    this.setData({
      driver: _title
    });
  },
  //出动人员
  rescuemanChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\Z0-9]/g, '');
    this.setData({
      rescueman: _title
    });
  },
  //出动车辆
  rescuecarChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\Z0-9]/g, '');
    this.setData({
      rescuecar: _title
    });
  },
  //phone
  phoneChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _title = _title.replace(/[^\Z0-9]/g, '');
    this.setData({
      phone: _title
    });
  },
  //brief
  briefChange: function (e) {
    var _title = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    this.setData({
      brief: _title
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.validateUser();//验证用户
    //获取基本参数
    this.setData({
      udptname: app.globalData.udptname
    })
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
  //提交灾害
  submitAccident:function(){
    //判断输入是否为空
    var that = this;
    var host = app.globalData.host;
    var address = that.data.address;
    var burnthing=that.data.burnthing;
    var leader=that.data.leader;
    var driver=that.data.driver;
    var phone=that.data.phone;
    var brief=that.data.brief;
    var dangerman=that.data.dangerman;
    var rescueman=that.data.rescueman;
    var rescuecar=that.data.rescuecar;
    if (address === "" || leader === "" || driver === "" || phone === "" || brief === "" || dangerman === "" || rescueman === "" || rescuecar === "") {
      wx.showModal({
        title: "验证提示",
        content: "填写数据存在遗漏项，请检查",
        showCancel: false,
        confirmText: "确定"
      })
    } else {
      that.setData({
        lock:1//锁住按钮
      })
      //将输入插入服务器
      wx.request({
        url: host + "accident.do",
        method: "post",
        data: {
          method: "addAccident",
          address: address,
          burnthing: burnthing,
          leader: leader,
          driver: driver,
          phone: phone,
          brief: brief,
          dangerman: dangerman,
          rescueman: rescueman,
          rescuecar: rescuecar,
          dptcode: app.globalData.udptcode,
          dptname: app.globalData.udptname,
          atid: that.data.index,
          atype: that.data.array[that.data.index],
          frog: that.data.frog[that.data.findex],
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data.result;
          if (result != 0) {
            wx.showToast({
              icon: "success",
              title: "警情事故录入成功",
              duration: 1000
            })
            that.setData({
              aid:result,
              lock:0//解锁
            });
            //插入worknote
            that.worknote();
            //清除表格
            that.clearTable();
          } else {
            wx.showModal({
              title: "操作异常",
              content: "请检查网络或重启程序,错误代码：Accident_ADDACCIDENT," + res.errMsg,
              showCancel: false,
              confirmText: "确定"
            })
          }
        },
        fail: function (res) {
          wx.showModal({
            title: "数据异常",
            content: "请检查网络或重启程序,错误代码：Accident_ADDACCIDENT," + res.errMsg,
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
      index: 0,
      findex: 0,
      address: "",
      atid: 0,//事故类别
      atype: "火灾扑救",
      dangerman: 0,
      burnthing: "",
      leader: "",
      driver: "",
      rescueman: 0,
      rescuecar: 0,
      phone: "",
      brief: "",
      lng: "",
      lat: ""
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
  dateFtt:function(){
    var that=this;
    var fmt= "yyyy-MM-dd hh:mm:ss";
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
      atime:fmt
    });
  },
  //worknote
  worknote:function(){
    var that = this;
    var host = app.globalData.host;
    //获取当前时间
    that.dateFtt();
    wx.request({
      url: host + "worknote.do",
      method: "post",
      data: {
        method: "addWork",
        title: "受理一起新的警情",
        dptcode: app.globalData.udptcode,
        dptname: app.globalData.udptname,
        openid: app.globalData.openid,
        uname: app.globalData.uname,
        sipname: "警情速报",
        sipID: "accident",//关联标识
        targetID: that.data.aid,
        targetTime: "事故时间：" + that.data.atime,
        targetTitle: "事故地址：" + that.data.address,
        targetBrief: "事故类别：" + that.data.array[that.data.index],
        targetIcon: "accident.png",
        targetUrl: "accident/detail/index?aid=" + that.data.aid,
        imgs:"",
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
  }
})
//index.js  
//获取应用实例  
var app = getApp();
Page({
  data: {
    latitude: 0,
    longitude: 0,
    selflatitude:0,
    selflongitude:0,
    markers: [],
    circles: [],
    controls: [],
    icon: "/image/address.png",
    title: "",
    pointId: 0,
    pointtype: "",
    mapCtx: "",
    currentTab:0,
    index: 0,//考勤类别
    dutytime: "0000-00-00",
    uname: app.globalData.uname,
    dptname : app.globalData.udptname,
    dutyArray:['请选择','上午-上班考勤','上午-下班考勤','下午-上班考勤','下午-下班考勤','值班抽查考勤'],
    begindate:"0000-00-00",//申请开始日期
    enddate:"0000-00-00",//终止时间
    begintime:"00:00",
    endtime:"23:59",
    leaveArray:['请选择','事假','休假','病假','产(护理)假','婚假','加班'],
    lindex:0,//请假类别
    actionreason:"",
    Duty: {
      did: 0,
      dutytime: "",
      morningcheckin: "",
      morningcheckout: "",
      afternooncheckin: "",
      afternooncheckout: "",
      workcheck: "",
      dutype: 0,
      actioncheckin: "",
      actioncheckout: "",
      actionreason: "",
      leader: "",
      leadercode: 0,//指定审批权限
      dutystatus: 0,
      dptname: "",
      dptcode: 2,
      openid: "",
      uname: "",
      jobtitle: "未审核人员"
    },
    array:[],
    arrayID:[],
    jindex:0
  },
  onLoad: function () {
    var that = this;
    app.validateUser();//验证用户
    var host = app.globalData.host;//默认系统地址
    var udptcode = app.globalData.udptcode;//用户单位id
    var dptname = app.globalData.udptname;
    var openid = app.globalData.openid;//用户的id
    var uname = app.globalData.uname;
    this.mapCtx = wx.createMapContext('myMap');
    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "getSelfDuty",
        openid: openid,
        dptcode: udptcode//员工所属的单位
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          Duty: res.data[0],
          actionreason: res.data[0].actionreason,
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取duty_Detail," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    //getDefaultData
    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "getDefaultData",
        dptcode: udptcode//员工所属的单位
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          dutytime: res.data.dutytime,
          begindate: res.data.dutytime,
          enddate: res.data.dutytime,
          latitude: res.data.lat,
          longitude: res.data.lng,
          circles: [{
            latitude: res.data.lat,
            longitude: res.data.lng,
            color: '#0079ffa0',
            fillColor: '#7cb5ec88',
            radius: 100,//100米
            strokeWidth: 0
          }]
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取duty_Detail," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
    that.getSelfPos();
  },
  //获取自身位置
  getSelfPos:function(){
    var that=this;
    wx.showLoading({
      title: '数据定位中',
      mask: "true"
    })
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        wx.hideLoading();
        that.setData({
          markers: []
        })
        var markers = that.data.markers;
        markers.push({
          id: 1,
          latitude: res.latitude,
          longitude: res.longitude,
          title: "我",
          iconPath: "/image/map/self.png",
          width: 30,
          height: 30
        })
        that.setData({
          selflatitude: res.latitude,
          selflongitude: res.longitude,
          markers: markers
        })
      }
    });
  },
  //提交考勤
  submitDuty:function(){
    
    //更新我的地址
    var that=this;
    var index = that.data.index;
      if(index==0){
        wx.showToast({
          title: "请选择考勤类型",
          image: "../../../image/warning.png",
          duration: 2000
        })
        return;
      }
    var host = app.globalData.host;//默认系统地址
    that.getSelfPos();
    //读取我的坐标和比对坐标
    wx.request({
      url: host + "duty.do",
      method: "post",
      data: {
        method: "setDuty",
        openid: app.globalData.openid,
        uname: app.globalData.uname,
        dptcode: app.globalData.udptcode,//员工所属的单位
        dptname:app.globalData.udptname,
        jobtitle: app.globalData.jobtitle,
        dutytime:that.data.dutytime,
        dutype:that.data.index,
        lng: that.data.longitude,
        lat: that.data.latitude,
        selflng: that.data.selflongitude,
        selflat: that.data.selflatitude,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var warning=res.data.warning;
        if(warning!=''){
          wx.showModal({
            title: "数据异常",
            content: warning,
            showCancel: false,
            confirmText: "确定"
          })
        }else{
          wx.showModal({
            title: "考勤提示",
            content: "提交操作成功",
            showCancel: false,
            confirmText: "确定",
            success: function (res) {
              if (res.confirm) {
                wx.request({
                  url: host + "duty.do",
                  method: "post",
                  data: {
                    method: "getSelfDuty",
                    openid: app.globalData.openid,
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    that.setData({
                      Duty: res.data[0],
                      actionreason:res.data[0].actionreason,
                      index:0
                    });
                  },
                  fail: function (res) {
                    wx.showModal({
                      title: "数据异常",
                      content: "请检查网络或重启程序,错误代码：读取duty_Detail," + res.errMsg,
                      showCancel: false,
                      confirmText: "确定"
                    })
                  }
                });
              }
            }
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取duty_Detail," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  //选择加班界面
  leaveBtn:function(){
    wx.navigateTo({
      url: '../new/index',
    })
  }
})
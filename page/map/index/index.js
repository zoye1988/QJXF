// index.js
var app = getApp();
var util = require('../../../util/util.js')
var formatLocation = util.formatLocation
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0,
    longitude: 0,
    defaultWidth: 0,
    defaultHeight: 0,
    markers: [],
    circles: [],
    controls: [],
    icon: "/image/address.png",
    title: "",
    pointId: 0,
    pointtype: "",
    mapCtx: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.validateUser();//验证用户
    /** 
     * 获取系统信息 
     */
    this.mapCtx = wx.createMapContext('myMap')
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          defaultWidth: res.windowWidth,
          defaultHeight: res.windowHeight
        });
      }
    });
    that.setData({
      controls: [
        {
          id: 'selfLoc',
          iconPath: '../../../image/selfloc.png',
          position: {
            left: that.data.defaultWidth - 60,
            top: that.data.defaultHeight - 100,
            width: 40,
            height: 40
          },
          clickable: true
        }
      ],
      
    });
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          circles: [{
            latitude: res.latitude,
            longitude: res.longitude,
            color: '#0079ffa0',
            fillColor: '#7cb5ec88',
            radius: 500,//三公里
            strokeWidth: 0
          }]
        })
      }
    });
    //获得point
    that.getMapPoint();
  },

  //获取区域内对象
  getMapPoint: function () {
    //读取默认单位数据
    var that = this;
    var host = app.globalData.host;
    wx.request({
      url: host + "map.do",
      method: "post",
      data: {
        method: "getMapPoint",
        lat: that.data.latitude,
        lng: that.data.longitude
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //清空markers
        that.setData({
          markers:[]
        })
        var maps = res.data;
        var markers = that.data.markers;
        for (var i in maps) {
          markers.push({
            id: maps[i].id,
            latitude: maps[i].lat,
            longitude: maps[i].lng,
            title: maps[i].types,
            iconPath: "/image/map/" + maps[i].icon + ".png",
            width: 30,
            height: 30,
            callout: {
              content: maps[i].title,
              color: '#888',
              fontSize: 12,
              borderRadius: 10,
              bgColor: '#fcfcfc',
              padding: 5,
              display: 'BYCLICK'
            }
          })
          that.setData({
            markers: markers
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：读取Build_GETLIST," + res.errMsg,
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
  //获取自己的坐标和周围数据
  getSelfLoc: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          circles: [{
            latitude: res.latitude,
            longitude: res.longitude,
            color: '#0079ffa0',
            fillColor: '#7cb5ec88',
            radius: 500,
            strokeWidth: 0
          }]
        })
      }
    });
    //获得point
    that.getMapPoint();
    that.mapCtx.moveToLocation();//返回原地
  },
  //点击标记点对应的气泡时触发
  markertap: function (e) {
    var that = this;
    //console.log(e);
    var markerId = e.markerId;
    var temp = this.data.markers;
    for (var i in temp) {
      if (temp[i].id == markerId) {
        that.setData({
          icon: temp[i].iconPath,
          title: temp[i].callout.content,
          pointId: temp[i].id,
          pointtype: temp[i].title
        })
        break;
      }
    }
  },
  //点击控件时触发
  callouttap: function (e) {
    var that = this;
    //console.log(e);
    var markerId = e.markerId;
    var temp = this.data.markers;
    for (var i in temp) {
      if (temp[i].id == markerId) {
        that.setData({
          icon: temp[i].iconPath,
          title: temp[i].callout.content,
          pointId: temp[i].id,
          pointtype: temp[i].title
        })
        break;
      }
    }
  },
  //查找数据
  showMapInfo: function () {
    var that = this;
    var title = that.data.title;
    var pointId = that.data.pointId;
    var types = that.data.pointtype;
    if (types == "") {
      wx.showToast({
        title: "请点击地图图标",
        image: "../../../image/warning.png",
        duration: 2000
      })
      return
    }
    if (types == 'build') {
      wx.navigateTo({
        url: "/page/build/detail/index?id=" + pointId
      })
    } else if (types == 'xfs') {
      wx.navigateTo({
        url: "/page/xfs/detail/index?id=" + pointId
      })
    } else {
      wx.navigateTo({
        url: "/page/union/detail/index?id=" + pointId + "&types=" + types
      })
    }
  }
})
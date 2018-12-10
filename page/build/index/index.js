var app = getApp();
// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    builds: [],
    loadShow: true,///加载图标显示
    bitems: ["全部类别"],
    bitemsval: [0],
    bindex: 0,//默认选择类型
    page: 1,
    pagesize: 10,
    keyword: "",
    downloadurl:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.validateUser();
    var that = this;
    that.setData({
      downloadurl: app.globalData.downloadurl
    });
    //读取用户节本数据
    var udptcode = app.globalData.udptcode;
    var host = app.globalData.host;
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
          bitemsval: btvlist
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
    }),
      //读取默认单位数据
      wx.request({
        url: host + "build.do",
        method: "post",
        data: {
          method: "getBuildList",
          dptcode: udptcode,
          page: that.data.builds.length,
          pagesize: that.data.pagesize,
          bindex: that.data.bindex,
          keyword: that.data.keyword
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.setData({
            builds: res.data,
            loadShow: false
          });
        },
        fail: function (res) {
          wx.showModal({
            title: "数据异常",
            content: "请检查网络或重启程序",
            showCancel: false,
            confirmText: "确定"
          })
        },
        complete:function(res){
          that.setData({
            loadShow: false,
            downloadurl:app.globalData.downloadurl
          });
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
    this.setData({
      loadShow: true//隐藏底部加载图标
    });
    var that = this;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    //加载数据
    //读取默认单位数据
    wx.request({
      url: host + "build.do",
      method: "post",
      data: {
        method: "getBuildList",
        dptcode: app.globalData.udptcode,
        page: that.data.builds.length,
        pagesize: that.data.pagesize,
        bindex: that.data.bindex,
        keyword: that.data.keyword
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var bulidlist = that.data.builds;
        var temp = res.data;
        if (temp.length == 0) {
          //判断获取参数等于0，提示数据已经到底
          wx.showToast({
            title: "数据已经到底",
            image: "../../../image/warning.png",
            duration: 2000
          })
        } 
        else {
          for (var bt in temp) {
            bulidlist.push({ bid: temp[bt].bid, title: temp[bt].title, address: temp[bt].address, tel: temp[bt].tel, btname: temp[bt].btname, imagestring: temp[bt].imagestring });
          }
        }
        that.setData({
          builds: bulidlist,
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序",
          showCancel: false,
          confirmText: "确定"
        })
      },
      complete:function(res){
        that.setData({
          loadShow: false
        });
      }
    });
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var items = this.data.items;
    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value == e.detail.value
    }

    this.setData({
      items: items
    });
  },
  /**
   * 显示社会单位分类
   */
  showItem_build: function () {
    if (this.data.itemShow == false) {
      this.setData({
        itemShow: true
      })
    } else {
      this.setData({
        itemShow: false
      })
    }

  },
  bindPickerChange: function (e) {
    var that=this;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    //选择单位类别，更新单位数据列表
    this.setData({
      bindex: this.data.bitemsval[e.detail.value],//更新单位类别
      keyword:"",
      builds:[],//清空单位列表
      loadShow: true//隐藏底部加载图标
    })
    //加载数据
    //读取默认单位数据
    wx.request({
      url: host + "build.do",
      method: "post",
      data: {
        method: "getBuildList",
        dptcode: app.globalData.udptcode,//用户所属辖区code
        page: that.data.builds.length,//从现有列表中读取总数
        pagesize: that.data.pagesize,
        bindex: that.data.bindex,//单位类别
        keyword: that.data.keyword//搜索关键词
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var bulidlist = that.data.builds;
        var temp = res.data;
        if (temp.length == 0) {
          //判断获取参数等于0，提示数据已经到底
          wx.showToast({
            title: "数据已经到底",
            image: "../../../image/warning.png",
            duration: 2000
          })
        }
        else {
          that.setData({
            builds: temp,
            loadShow: false
          });
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
  },
  searchAction:function(){
    var that = this;
    var host = app.globalData.host;
    var downloadurl = app.globalData.downloadurl;
    that.setData({
      builds: [],//清空单位列表
      loadShow: true//隐藏底部加载图标
    });
    //加载数据
    //读取默认单位数据
    wx.request({
      url: host + "build.do",
      method: "post",
      data: {
        method: "getBuildList",
        dptcode: app.globalData.udptcode,//用户所属辖区code
        page: that.data.builds.length,//从现有列表中读取总数
        pagesize: that.data.pagesize,
        bindex: that.data.bindex,//单位类别
        keyword: that.data.keyword//搜索关键词
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var bulidlist = that.data.builds;
        var temp = res.data;
        if (temp.length == 0) {
          //判断获取参数等于0，提示数据已经到底
          
        }
        else {
          that.setData({
            builds: temp,
            loadShow: false
          });
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
  },
  keyChange:function(e){
    var _keyword = e.detail.value;
    //通过正则表达式，仅能输入数字、英文、中文。
    _keyword = _keyword.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'');
    this.setData({
      keyword: _keyword,
      bindex:0//清空搜索类别
    });
  }
})
// page/car/check/detail/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    defaultHeight: 0,
    leftHeight: 0,
    rightHieght:0,
    pagesize: 6,
    checkList:[],
    cid:0,
    dptcode:2,
    loadShow: true,///加载图标显示
    carcheck:{
      dptname:"",
      types:0,
      checker:"-------",
      carstatus:"null",
      carid:""
    },
    newlist:[
      {
        status:0,
        desc:"",
        title: "水量电量情况"
      },
      {
        status: 0,
        desc: "",
        title: "燃油机油情况"
      },
      {
        status: 0,
        desc: "",
        title: "制动转向情况"
      },
      {
        status: 0,
        desc: "",
        title: "轮胎气压情况"
      },
      {
        status: 0,
        desc: "",
        title: "车灯警灯喇叭"
      },
      {
        status: 0,
        desc: "",
        title: "随车器材装备"
      },
      {
        status: 0,
        desc: "",
        title: "内外环境卫生"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var host = app.globalData.host;//默认系统地址
    var cid=options.cid;
    var dptcode=options.dptcode;
    var _temp={
      dptname: options.dptname,
      types: options.types,
      checker: "-------",
      carstatus: "null",
      carid: options.carid
    }
    that.setData({
      carcheck:_temp,
      cid:cid
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          defaultHeight: res.windowHeight,
          rightHieght: res.windowHeight+30,
          leftHieght: res.windowHeight
        });
      }
    });
    /** 
     * 获取系统信息 
     */
    
    //获取当日的日期
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10)
      month = "0" + month;
    var day = date.getDate();
    if (day < 10)
      day = "0" + day;
    var today =year + "-" + month + "-" + day;
    /**
     * 读取检查情况列表
     */
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "getCheckDetail",
        pagesize:that.data.pagesize,
        page:0,
        cid:cid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var checkList=res.data;
        var leftHeight=0;
        if (checkList.length != 0) {
          if (checkList[0].checkdate == today){
            that.setData({
              carcheck: checkList[0],
            })
          }
          leftHeight = checkList.length * 125;
        }else{
          leftHeight = 125;
        }
        that.setData({
          checkList: checkList,
          leftHeight: leftHeight,
          defaultHeight: leftHeight
        });
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：WORK_GETBRIEF," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      },
      complete: function (res) {
        that.setData({
          loadShow: false
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
   * 提交检查结果
   */
  submitCheck:function(){
    var that = this;
    var host = app.globalData.host;//默认系统地址
    var uname=app.globalData.uname;
    var openid=app.globalData.openid;
    //整合问题
    var newlist=that.data.newlist;
    var status=0,error="";
    for(var i=0;i<newlist.length;i++){
      if(newlist[i].status==1){
        status=1;
        error+=newlist[i].title+"："+newlist[i].desc+"\n";
      }
    }
    wx.request({
      url: host + "car.do",
      method: "post",
      data: {
        method: "submitCheck",
        aid: that.data.cid,
        carstatus:status,
        checklist:error,
        checker:uname,
        openid:openid,
        carnumber: that.data.carcheck.carid,
        dptcode:that.data.dptcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result=res.data.result;
        if(result==1){
          wx.showToast({
            title: "申请提交成功",
            icon: "success",
            duration: 1000,
            complete:function(e){
              //返回上一级
              setTimeout(function(){
                wx.redirectTo({
                  url: '../list/index',
                })
              } ,1000 );
              
            }
          });
          
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：WORK_GETBRIEF," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      },
      complete: function (res) {
        that.setData({
          loadShow: false
        });
      }
    });
  },
  /**
   * 正常BTN
   */
  normalBtn:function(e){
    var that = this;
    var id = e.target.dataset.id;
    var _newlist=that.data.newlist;
    _newlist[id].status = 0;
    that.setData({
      newlist: _newlist
    })
  },

  /**
   * 故障BTN
   */
  errorBtn: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    var _newlist = that.data.newlist;
    _newlist[id].status = 1;
    that.setData({
      newlist: _newlist
    })
  },

  errorInfo:function(e){
    var that = this;
    var id = e.target.dataset.id;
    var _title = e.detail.value;
    var _newlist = that.data.newlist;
    _newlist[id].desc = _title;
    _newlist[id].status = 1;
    that.setData({
      newlist: _newlist
    })
  },

  swichNav: function (e){
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var height=0;
      if (e.target.dataset.current==0){
        height=that.data.leftHeight;
      }else{
        height = that.data.rightHieght;
      }
      that.setData({
        currentTab: e.target.dataset.current,
        defaultHeight:height
      })
    }
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    var current = e.detail.current;
    var size = 0;
    if (current == 0) {
      size = that.data.leftHeight;
    } else if (current == 1) {
      size = that.data.rightHieght;
    }
    this.setData({
      defaultHeight: size
    });
  }
})
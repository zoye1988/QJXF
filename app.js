const openIdUrl = require('./config').openIdUrl

App({
  onShow: function () {
  },
  onHide: function () {
  },
  globalData: {
    hasLogin: false,
    openid:"",//登录用户openid
    uname: "",//用户名称
    udptcode: 0,//所属单位标号
    udptname: "",//所属单位名称
    uimg: "",//用户头像
    job:0,//用户职务
    jobtitle:"未验证用户",
    ustatus: 0,//用户审核，默认为0未通过
    lastlogindate: "2000-10-01 09:00:00",//默认用户登录时间，储存在本地的时间
    accidentdate: "2000-10-01 09:00:00",//默认用户查看事故时间，储存在本地的时间
    taskdate: "2000-10-01 09:00:00",//默认用户查看任务时间，储存在本地的时间
    worknotedate: "2000-10-01 09:00:00",//工作圈登录时间，保存在本地
    eventdate: "2000-10-01 09:00:00",//要情时间，保存在本地
    homedate:"2000-10-01 09:00:00",//首页登录时间
    user_sercertcode: "",//服务器赋予用户的连接版本密码
    /**
     * 系统默认参数
     */
    //downloadurl: 'http://127.0.0.1:8080/wxadmin/res/',//默认系统下载链接
    //host: "http://127.0.0.1:8080/wxadmin/",//默认系统数据访问地址
    // downloadurl: 'http://192.168.3.4:8080/wxadmin/res/',//默认系统下载链接
    // host: "http://192.168.3.4:8080/wxadmin/",//默认系统数据访问地址
    // wss:"ws://192.168.3.4:8080/wxadmin/chat", //建立websocket通信地址
    downloadurl:'https://www.zhurendata.com/rescue/res/',//默认系统下载链接
    host: "https://www.zhurendata.com/rescue/",//默认系统数据访问地址
    wss: "wss://www.zhurendata.com/rescue/chat", //建立websocket通信地址
    sercertcode: "8E7E552B",//与服务器通信默认识别密码,软件版本的默认属性
    url:"",title:""//用户share记录
  },
  onLaunch: function () {//登录时，全局读取用户信息
    //console.log("程序开始运行一次此函数");
    this.globalData.lastlogindate = wx.getStorageSync("lastlogindate");
    this.loginDateCheck();//检查用户账号是否超期
    var ustatus = wx.getStorageSync("ustatus");
    if (ustatus ==1){
      this.globalData.openid = wx.getStorageSync("openid");
      this.globalData.uname = wx.getStorageSync("uname");
      this.globalData.udptcode = wx.getStorageSync("udptcode");
      this.globalData.udptname = wx.getStorageSync("udptname");
      this.globalData.job = wx.getStorageSync("job");
      this.globalData.jobtitle = wx.getStorageSync("jobtitle");
      this.globalData.uimg = wx.getStorageSync("uimg");
      this.globalData.ustatus = wx.getStorageSync("ustatus");
      this.globalData.user_sercertcode = wx.getStorageSync("user_sercertcode");
      this.globalData.lastlogindate = wx.getStorageSync("lastlogindate");
      this.globalData.worknotedate = wx.getStorageSync("worknotedate");
      this.globalData.accidentdate = wx.getStorageSync("accidentdate");
      this.globalData.taskdate = wx.getStorageSync("taskdate");
      this.globalData.eventdate = wx.getStorageSync("eventdate");
      this.globalData.homedate = wx.getStorageSync("homedate");
    }
    //this.validateUser();//验证用户登录信息
  },
  //用户验证时间用户登录权限
  loginDateCheck:function(){
    //获取现在时间
    var newDate = new Date();
    var lastDate = new Date(this.globalData.lastlogindate);
    var diff = newDate.getTime() - lastDate.getTime();  
    var day=parseInt(diff/(1000*60*60*24));
    if(day>=60){//大于60天，要求重新验证用户数据
      wx.setStorageSync("ustatus", 0);
      wx.setStorageSync("isPost", 0);
      wx.showModal({
        title: "系统提示",
        content: "用户登录超期，请重启程序",
        showCancel: false,
        confirmText: "确定",
        success: function (res) {
        }
      })
    }
  },
  //系统验证函数，用户验证用户是否具备使用权限
  validateUser: function () {
    //从cookie中读取全部数据
    var sercertcode = this.globalData.sercertcode;
    var user_sercertcode = this.globalData.user_sercertcode;
    if (sercertcode != user_sercertcode){
      wx.showModal({
        title: "系统提示",
        content: "您没有权限访问此页面",
        showCancel: false,
        confirmText: "确定",
        success:function(res){
          if(res.confirm){
            //返回首页
            wx.redirectTo({
              url: '/page/illegal/index'
            })
          }
        }
      })
    } else if (this.globalData.ustatus==0){
      wx.showModal({
        title: "系统提示",
        content: "您的账号已被冻结,请联系管理员",
        showCancel: false,
        confirmText: "确定",
        success: function (res) {
          if (res.confirm) {
            //返回首页
            wx.redirectTo({
              url: '/page/illegal/index'
            })
          }
        }
      })
    }
  },
  //登记转发信息，防止泄密
  ShareAction:function(){
    var host = this.globalData.host;
    var uname = this.globalData.uname;
    var openid = this.globalData.openid;
    var url = this.globalData.url;
    var title = this.globalData.title;
    wx.request({
      url: host + "user.do",
      method: "post",
      data: {
        method: "logShare",
        uname:uname,
        openid:openid,
        url:url,
        title:title
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
      },
      fail: function (res) {
        wx.showModal({
          title: "数据异常",
          content: "请检查网络或重启程序,错误代码：User_LOGSHARE," + res.errMsg,
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  },
  // lazy loading openid
  getUserOpenId: function(callback) {
    var self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success: function(data) {
          wx.request({
            url: openIdUrl,
            data: {
              code: data.code
            },
            success: function(res) {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid
              callback(null, self.globalData.openid)
            },
            fail: function(res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail: function(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },
  checkVisitJob:function(appLimit){//功能验证函数
    //获取用户的访问权限等级
    var job = this.globalData.job;
    if (appLimit<job){
      wx.showModal({
        title: "系统提示",
        content: "您无权访问此功能",
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
  },
  checkVisitJob2: function (appLimit) {//功能验证函数
    //获取用户的访问权限等级
    var job = this.globalData.job;
    if (appLimit < job) {
      wx.showModal({
        title: "系统提示",
        content: "您无权访问此功能",
        showCancel: false,
        confirmText: "确定",
        success: function (res) {
          if (res.confirm) {
            //返回首页
            wx.reLaunch({
              url: '/page/home/index',
            })
          }
        }
      })
    }
  }
})

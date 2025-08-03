// app.js
App({
  /* 服务器地址 */
  service_url: "http://localhost:8080",
  userinfo: {
    
  },
  globalData: {
    appName: "校园生活"
  },
  onLaunch: function () {
    console.log("onLaunch");
    const that = this;
    wx.request({
      url: this.service_url + "/user?wechat_id=wxid_456781",
      success(res) {
        // 获取用户信息成功
        console.log(res.data);
        that.userinfo = res.data;
      },
      fail(res) {
        // 获取失败
        console.log(res)

        // user not found
        if (res.code == 404) {

        }
      }
    })
  }
});

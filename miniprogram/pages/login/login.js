// pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    input_student_id: 'S2023001',
    input_password: "",

    // 显示注册提示
    showRegisterInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 读取用户信息
    const userinfo = wx.getStorageSync("userinfo");
    console.log("userinfo", userinfo)
    // 已经有用户信息了，直接跳转到主页
    if (userinfo) {
      getApp().userinfo = userinfo;
      wx.switchTab({
        url: '/pages/index/index',
      });
    } else {
      wx.showToast({
        title: '请登陆',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  // 学号和密码方式登录
  // 测试：2020006：2020006
  async loginByStudentNo(student_no, password) {
    try {
      const res = await wx.pro.request({
        url: getApp().service_url + "/loginByStudent",
        data: {
          student_no: String(student_no),
          password: password,
        },
        method: "POST",
      });
      if (res.statusCode == 200) {
        return true;
      } else {
        throw new Error(res.statusCode);
        return false;
      }
    } catch (e) {
      console.log('e', e);
      throw e;
      return false;
    } finally {}
  },

  async getStudentInfo(student_no) {
    try {
      const res = await wx.pro.request({
        url: getApp().service_url + "/student_info?" + "student_no=" + student_no,
        method: "GET",
      });
      console.log(res);
      if (res.statusCode == 200) {
        console.log(res);
        return res.data;
      } else {
        throw new Error(res.statusCode);
      }
    } catch (e) {
      console.log(e);
      throw e;
    } finally {}
  },

  // 登录按钮响应
  async onLoginButtonClick() {
    try {
      console.log("user: ", this.data.input_student_id)
      console.log("password: ", this.data.input_password)
      const res = await this.loginByStudentNo(
        this.data.input_student_id,
        this.data.input_password
      );

      console.log("login result:",res);

      if (res == false) {
        return;
      }
      
      // 获取学生信息
      const userinfo = await this.getStudentInfo(this.data.input_student_id)

      console.log('userinfo:', userinfo)

      // 存储信息到本地，下次无需登陆
      wx.setStorageSync('userinfo',userinfo)

      // 查询到数据用户数据保存到全局变量
      getApp().userinfo = userinfo;

      await wx.pro.showToast({
        title: '登录成功'
      })
    } catch (e) {
      console.log(e);
      await wx.pro.showToast({
        title: "登录失败: " + e.message,
      });
      return;
    } finally {}

    // 跳转到主页
    wx.switchTab({
      url: '/pages/index/index',
    });
  },

  OnShowRegisterInfo() {
    this.setData({
      showRegisterInfo: true
    });
  },

  onCloseRegisterInfo() {
    this.setData({
      showRegisterInfo: false
    });
  }

});
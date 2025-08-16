// pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    input_student_id: '2023001',
    input_password: "",

    // 显示注册提示
    showRegisterInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

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

  onStudentIdInputChange(e) {
    this.setData({
      input_student_id: e.detail,
    });
  },

  onPasswdInputChange(e) {
    this.setData({
      input_password: e.detail,
    });
  },

  // 学号和密码方式登录
  // 测试：2020006：2020006
  async loginByStudentId(student_id, password) {
    try {
      const res = await wx.pro.request({
        url: getApp().service_url + "/loginById",
        data: {
          student_id: student_id,
          password: password,
        },
        method: "post",
      });
      console.log(res);
      if (res.statusCode == 200) {
        await wx.pro.wx.setStorageSync('token', res.data.cookie);
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
      const res = await this.loginByStudentId(
        Number(this.data.input_student_id),
        this.data.input_password
      );
      console.log("login result:");
      console.log(res);

      // 查询到数据用户数据保存到全局变量
      getApp().userinfo = res;

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

    await wx.pro.switchTab({
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
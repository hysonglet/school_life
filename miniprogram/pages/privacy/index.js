// pages/privacy/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 检查是否同意隐私政策
    const isAgree = wx.getStorageSync('isAgree');
    console.log('isAgree:', isAgree);
    // 首次打开隐私政策页面时，检查是否同意隐私政策
    if (isAgree != null && isAgree !== undefined && isAgree === true) {
      // 跳转到登录页面
      wx.navigateTo({
        url: '/pages/login_by_class/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  agreePrivacy() {
    wx.setStorageSync('isAgree', true); // 存储同意状态
    // 跳转到主页
    wx.navigateTo({
      url: '/pages/login_by_class/index',
    })
  },

  exitPrivacy() {
    wx.setStorageSync('isAgree', false); // 存储同意状态
    wx.exitMiniProgram();
  },
})
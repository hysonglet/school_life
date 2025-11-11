// pages/index/lovedog/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    content: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.onRefreshNew();
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
  onPullDownRefresh() {
    this.onRefreshNew();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  onClickLeft() {
    wx.navigateBack();
  },

  // 刷新舔狗日记
  onRefreshNew() {
    const URL = "https://api.iyuns.com/api/dog";
    try {
      let response = wx.request({
        url: URL,
        method: "GET",
        success: (res) => {
          this.setData({
            content: res.data.data,
          });
        },
        fail: (err) => {
          console.error(err);
          wx.showToast({
            title: "刷新失败",
            icon: "none",
            duration: 1000,
          });
        },
      });
    } catch (err) {
      console.log(err);
    }
  },

  onCopyToClipboard() {
    wx.setClipboardData({
      data: this.data.content,
      success: (res) => {
        wx.showToast({
          title: "复制成功",
          icon: "none",
          duration: 1000,
        });
      }
    });
  },
});
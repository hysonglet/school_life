// pages/personal/personal.js
Page({

  /**
   * Page initial data
   */
  data: {
    departmentShow: false,
    classSelect: "",
    classFieldValue: "",
    departmentsOptions: [],
    selectRoleKindNumber: 1,
  },

  /**
   * Lifecyclei function--Called when page load
   */
  onLoad(options) {
    const app = getApp();

    // 从本地读取班级，课表信息
    this.setData({
      classFieldValue: wx.getStorageSync("classFieldValue"),
      classSelect: wx.getStorageSync("classSelect"),
      coursesSchedule: wx.getStorageSync("coursesSchedule"),
      departmentsOptions: wx.getStorageSync("departmentsOptions"),
      selectRoleKindNumber: wx.getStorageSync("selectRoleKindNumber")
    })

    console.log('departmentsOptions', this.data.departmentsOptions)

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  onCollapseChange(e) {
    this.setData({
      collapseActiveName: e.detail
    });
  },

  onClearCache() {
    wx.clearStorageSync()
    wx.showToast({
      title: '缓存已清除',
      icon: 'none'
    })

    wx.navigateTo({
      url: '/pages/login_by_class/index',
    })
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})
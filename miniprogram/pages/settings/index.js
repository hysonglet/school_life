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
    databaseSyncDateTime:"2025-09-01 00:00:00"
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
      selectRoleKindNumber: wx.getStorageSync("selectRoleKindNumber"),
      databaseSyncDateTime: wx.getStorageSync("databaseSyncDateTime")
    })

    // console.log('departmentsOptions', this.data.departmentsOptions)
    this.getDatabaseSyncDatetime();
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

  // 获取数据库更新时间
  async getDatabaseSyncDatetime() {
    const rst = await wx.pro.request({
      url: getApp().service_url + "/database_version",
      method: 'GET',
    })

    if (rst.statusCode !== 200) {
      return ""
    }

    this.setData({
      databaseSyncDateTime: rst.data.update,
    })

    return this.data.databaseSyncDateTime
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})
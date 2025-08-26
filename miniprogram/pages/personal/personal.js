// pages/personal/personal.js
Page({

  /**
   * Page initial data
   */
  data: {
    collapseActiveName: 1,
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
    userinfo: {}
  },

  /**
   * Lifecyclei function--Called when page load
   */
  onLoad(options) {

    const app = getApp();

    this.setData({
      userinfo: app.userinfo
    });

    console.log(app.userinfo)

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

  onSubmitPasswordChange: async function (e) {
    if (this.data.oldPassword.length == 0) {
      wx.showToast({
        title: '请输入旧密码',
        icon: 'none'
      });
      return
    }

    if (this.data.newPassword.length == 0) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none'
      })
      return
    }

    if (this.data.newPassword != this.data.newPasswordConfirm) {
      wx.showToast({
        title: '两次输入密码不一致',
        icon: 'none'
      })
      return
    }

    try {
      console.log('update password')
      const res = await wx.pro.request({
        url: getApp().service_url + '/update_password',
        method: 'POST',
        data: {
          'old_password': this.data.oldPassword,
          'new_password': this.data.newPassword,
          'student_no': this.data.userinfo.student_no
        }
      });

      if (res.statusCode == 200) {
        wx.showToast({
          title: '密码修改成功',
          icon: 'none'
        })

        this.setData({
          oldPassword: '',
          newPassword: '',
          newPasswordConfirm: ''
        })
      }
      else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })

        this.setData({
          oldPassword: '',
          newPassword: '',
          newPasswordConfirm: ''
        })
      }

      console.log('update password res: ', res)
    }
    catch (e) {
      wx.showToast({
        title: e.message,
        icon: 'none'
      })
    }
    finally {
    }
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})
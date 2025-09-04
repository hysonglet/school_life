// pages/personal/personal.js
Page({

  /**
   * Page initial data
   */
  data: {
    departmentShow: false,
    classSelect: "",
    classFieldValue: "",
    departmentsOptions: []
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
      departmentsOptions: wx.getStorageSync("departmentsOptions")
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

  onDepartmentClick() {
    this.setData({
      departmentShow: true
    })
  },

  onDepartmentClose() {
    this.setData({
      departmentShow: false
    })
  },

  async onDepartmentFinish(e) {
    // console.log(e)
    const {
      selectedOptions,
      value
    } = e.detail;
    const fieldValue = selectedOptions
      .map((option) => option.text || option.name)
      .join('/');

    console.log(selectedOptions);
    console.log(value)
    console.log(fieldValue)

    getApp().classSelect = value;
    const data = await getApp().getClassesSchedule();
    if (data.length == 0) {
      wx.showToast({
          title: '该班级暂时未录入课表',
          icon: 'none'
        }
      )
      return;
    }
    else{
      this.setData({
        classFieldValue: fieldValue,
        classSelect: value,
      })

      getApp().coursesSchedule = data

      wx.setStorageSync("coursesSchedule", data)
      wx.setStorageSync("classFieldValue", fieldValue)
      wx.setStorageSync("classSelect", value)
    }
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})
// pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    departmentShow: false,
    classSelect: "",
    departmentsOptions: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getClassesData();

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

  // 获取所有班级的清单
  async getClassesData() {
    const rst = await wx.pro.request({
      url: getApp().service_url + "/class_sets",
      method: "GET",
    })

    const data = rst.data;

    data.map(item => {
      const dep = this.data.departmentsOptions.find(dep => dep.text == item.department);
      if (dep) {
        const major = dep.children.find(m => m.text == item.major);

        if (major) {
          major.children.push({
            text: item.class,
            value: item.class
          })
        }
        else {
          dep.children.push({
            text: item.major,
            value: item.major,
            children: [{
              text: item.class,
              value: item.class,
            }]
          })
        }
      } else {
        this.data.departmentsOptions.push({
          text: item.department,
          value: item.department,
          children: [{
            text: item.major,
            value: item.major,
            children: [{
              text: item.class,
              value: item.class,
            }]
          }]
        })
      }

      this.setData({
         departmentsOptions: this.data.departmentsOptions
      })
    })

    console.log('options:', this.data.departmentsOptions)
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

  onDepartmentFinish(e) {
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

    this.setData({
      fieldValue,
      classSelect: value,
    })
  },

  OnShowRegisterInfo() {
    this.setData({
      showRegisterInfo: true,
    })
  },

  onCloseRegisterInfo() {
    this.setData({
      showRegisterInfo: false,
    })
  },

  async onLoginButtonClick() {
    if (!this.data.classSelect || this.data.classSelect.length == 0) {
      wx.showToast({
        title: '请选择班级',
        icon: 'none'
        })
      return;
    }

    getApp().classSelect = this.data.classSelect;
    const data = await getApp().getClassesSchedule();

    if (data.length == 0) {
      wx.showToast({
        title: '该班级课表暂未录入',
        icon: 'none'
        })
      return;
    }

    console.log('data', data)
    getApp().coursesSchedule = data;
    // 跳转到主页
    wx.switchTab({
      url: '/pages/index/index',
    });
  }

});
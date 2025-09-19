// pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    departmentShow: false,
    classSelect: "",
    classFieldValue: "",
    departmentsOptions: [],
    selectRoleKindNumber: 1, // 1: 学生，2:老师
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 从本地读取班级，课表信息
    this.setData({
      classFieldValue: wx.getStorageSync("classFieldValue"),
      classSelect: wx.getStorageSync("classSelect"),
      coursesSchedule: wx.getStorageSync("coursesSchedule"),
      departmentsOptions: wx.getStorageSync("departmentsOptions"),
      selectRoleKindNumber: wx.getStorageSync("selectRoleKindNumber")
    })

    if (this.data.classSelect &&
      this.data.classFieldValue &&
      this.data.departmentsOptions &&
      this.data.classFieldValue.length > 0 &&
      ((this.data.selectRoleKindNumber === 1) || (this.data.selectRoleKindNumber === 2))) {
      // 跳转到主页
      wx.switchTab({
        url: '/pages/index/index',
      });
    }

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

  async onRefreshClicked() {
    await this.getClassesData();

    wx.stopPullDownRefresh();
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
  async onPullDownRefresh() {
    await this.getClassesData();
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

  // 获取所有班级的清单
  async getClassesData() {
    const rst = await wx.pro.request({
      url: getApp().service_url + "/class_sets",
      method: "GET",
    })

    if (rst.statusCode != 200) {
      await wx.pro.showToast({
        title: "数据获取失败: " + rst.statusCode,
        icon: "none"
      })
      return
    }
    const data = rst.data;

    this.data.departmentsOptions = []

    data.map(item => {
      const dep = this.data.departmentsOptions.find(dep => dep.text == item.department);
      if (dep) {
        const major = dep.children.find(m => m.text == item.major);

        if (major) {
          major.children.push({
            text: item.class,
            value: item.class
          })
        } else {
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

      wx.setStorageSync("departmentsOptions", this.data.departmentsOptions)
    })
  },

  // 获取所有部门的清单
  async getDepartmentData() {
    const rst = await wx.pro.request({
      url: getApp().service_url + "/departments",
      method: "GET",
    })

    if (rst.statusCode != 200) {
      await wx.pro.showToast({
        title: "数据获取失败: " + rst.statusCode,
        icon: "none"
      })
      return
    }
    const data = rst.data;

    this.data.departmentsOptions = []

    data.map(item => {
      this.data.departmentsOptions.push({
        text: item.department,
        value: item.department
      })

      this.setData({
        departmentsOptions: this.data.departmentsOptions
      })

      wx.setStorageSync("departmentsOptions", this.data.departmentsOptions)
    })
  },

  async onDepartmentClick() {
    await this.getClassesData();

    this.setData({
      departmentShow: true,
    })
  },

  onDepartmentClose() {
    this.setData({
      departmentShow: false
    })
  },

  // 学生角色下选择班级结束事件
  onDepartmentFinish(e) {
    const {
      selectedOptions,
      value
    } = e.detail;
    const fieldValue = selectedOptions
      .map((option) => option.text || option.name)
      .join('/');

    this.setData({
      classFieldValue: fieldValue,
      classSelect: value,
      selectRoleKindNumber: 1,
    })

    wx.setStorageSync("selectRoleKindNumber", 1)
  },

  async onteacherDepartmentSelectClick() {
    // 请求老师选择所需的部门选择数据
    await this.getDepartmentData()

    this.setData({
      teacherDepartmentShow: true,
    })
  },

  onteacherDepartmentSelectClose() {
    this.setData({
      teacherDepartmentShow: false
    })
  },

  onteacherDepartmentSelectFinish(e) {
    console.info(e.detail)
    this.setData({
      classFieldValue: e.detail.value,
      selectRoleKindNumber: 2
    })
    wx.setStorageSync("selectRoleKindNumber", 2)
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

  onCollapseRuleSelectChange(e) {

    if (e.detail != 1 && e.detail != 2) {
      return
    }
    
    // 如果用户没有切换角色，则不更新班级或教师填写的内容
    if(this.data.selectRoleKindNumber != e.detail) {
      this.setData({
        classFieldValue: "",
        classSelect: "",
      })
    }

    this.setData({
      selectRoleKindNumber: e.detail
    })
  },

  async onLoginButtonClick() {
    // 当前是学生模式
    if (this.data.selectRoleKindNumber == 1) {
      if (!this.data.classSelect || this.data.classSelect.length == 0) {
        wx.showToast({
          title: '请选择班级',
          icon: 'none'
        })
        return;
      }
    } else {
      // 当前是老师模式
      if (!this.data.classFieldValue || this.data.classFieldValue.length == 0) {
        wx.showToast({
          title: '请选择部门',
          icon: 'none'
        })
        return;
      }

      if (!this.data.classSelect || this.data.classSelect.length == 0) {
        wx.showToast({
          title: '请输入您的姓名',
          icon: 'none'
        })
        return;
      }
    }

    getApp().classSelect = this.data.classSelect;

    let data;
    if (this.data.selectRoleKindNumber == 1) {
      data = await getApp().getClassesSchedule(this.data.classSelect);

      if (data.length == 0) {
        wx.showToast({
          title: '该班级课表暂未录入',
          icon: 'none'
        })
        return;
      }
    } else {
      data = await getApp().getTeacherSchedule(this.data.classSelect, this.data.classFieldValue)

      if (data.length == 0) {
        wx.showToast({
          title: '您的信息暂未录入或部门选择错误',
          icon: 'none'
        })
        return;
      }
    }

    console.log('data', data)
    getApp().coursesSchedule = data;

    //  保存班级名称到本地
    wx.setStorageSync('classSelect', this.data.classSelect)

    wx.setStorageSync('classFieldValue', this.data.classFieldValue)

    // 保存课表到本地
    wx.setStorageSync('coursesSchedule', data)

    // 跳转到主页
    wx.switchTab({
      url: '/pages/index/index',
    });
  },

});
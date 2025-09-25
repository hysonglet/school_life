// app.js
import {
  promisifyAll
} from 'wx-promise-pro';

promisifyAll(wx, wx.pro);

App({
  /* 服务器地址 */
  service_url: "https://sgtong.cloud",
  // service_url: "http://localhost:8080",
  userinfo: {},
  autoWechatLogin: true,
  isLogin: false,
  globalData: {
    appName: "校园生活"
  },
  launchFinished: false,
  // 第一周开始日期
  semesterStartDate: "2025-09-01",
  // 从数据库中请求的课程表
  coursesSchedule: [],
  // 选择的班级
  classSelect: "",

  onLaunch: async function () {
    // 从本地读取班级，课表信息
    this.classFieldValue = wx.getStorageSync("classFieldValue"),
    this.classSelect = wx.getStorageSync("classSelect"),
    this.coursesSchedule = wx.getStorageSync("coursesSchedule"),
    this.departmentsOptions = wx.getStorageSync("departmentsOptions")

    this.launchFinished = true
  },

  // 获取微信小程序临时code码
  async getWechatCode() {
    try {
      await wx.pro.showLoading({
        title: '同步数据中...'
      });

      const loginRes = await wx.pro.login();
      if (!loginRes.code) {
        throw new Error("获取code失败")
      }

      console.log('code:' + loginRes.code);

      return loginRes.code;
    } catch (e) {
      console.log(e);
      wx.pro.showToast({
        title: e.message + '获取code失败',
        icon: 'none'
      })

      throw e;
    }
    finally {
      await wx.pro.hideLoading();
    }
  },

  // 获取openid
  async getOpenId() {
    try {
      const res = await wx.pro.request({
        url: this.service_url + "/getOpenId",
        data: {
          'code': await this.getWechatCode()
        },
        method: "post"
      });
      if (!res.data.openid) {
        throw new Error("获取open_id失败")
      }

      return res.data.openid;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  async getUserInfo(openid) {
    console.log("getUserInfo...");
    try {
      const student_user = await wx.pro.request({
        url: this.service_url + "/userinfo?wechat_id=" + openid,
        method: "get"
      });

      console.log(student_user);
      if (!student_user.data) {
        throw new Error("获取用户信息失败")
      }
      return student_user.data;
    } catch (e) {
      throw e;
    }
    finally {
    }
  },
  // 获取班级课表
  async getClassesSchedule(class_name) {
    try {
    const rst = await wx.pro.request({
        url: getApp().service_url + "/class_course",
        method: "GET",
        data: {
          class_name: class_name
        }
      })

      console.log(rst)
      if (!rst.data) {
        throw new Error("获取用户信息失败")
      }

      return rst.data;
    }
    catch (e) {
      console.log(e);
      throw e;
    }
    finally {
    }
  },

  // 获取教师课表
  async getTeacherSchedule(teacher_name, department) {
    try {
    const rst = await wx.pro.request({
        url: getApp().service_url + "/teacher_course",
        method: "GET",
        data: {
          teacher_name: teacher_name,
          department_name: department
        }
      })

      console.log(rst)
      if (!rst.data) {
        throw new Error("获取用户信息失败")
      }

      return rst.data;
    }
    catch (e) {
      console.log(e);
      throw e;
    }
    finally {
    }
  },

  async refreshCourses() {
    let data = [];

    let selectRoleKindNumber = wx.getStorageSync("selectRoleKindNumber");
    this.classFieldValue = wx.getStorageSync("classFieldValue");
    let classSelect = wx.getStorageSync('classSelect');

    // console.log("selectRoleKindNumber:", selectRoleKindNumber);

    if (selectRoleKindNumber == 1) {
      data = await this.getClassesSchedule(this.classSelect);
    }
    else {
      data = await this.getTeacherSchedule(this.classSelect, this.classFieldValue)

      // console.log("teacher: :", this.classSelect, this.classFieldValue)
    }

    // console.log('refresh: ', data)
    if (data.length === 0) {
      wx.showToast({
        title: '刷新失败',
        icon: 'none'
      })
      return;
    }

    this.coursesSchedule = data;

    // console.log('refresh: ', data)

    return data;
  }
});
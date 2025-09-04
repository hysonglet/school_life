// app.js
import {
  promisifyAll
} from 'wx-promise-pro';

promisifyAll(wx, wx.pro);

App({
  /* 服务器地址 */
  // service_url: "https://sgtong.cloud",
  service_url: "http://localhost:8080",
  // service_url: "http://43.136.124.10:8080",
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
    // // 自动登录
    // if (this.autoWechatLogin == false) {
    //   return;
    // }

    // await wx.pro.showLoading({
    //   title: '同步数据中...'
    // });

    // const openid = await this.getOpenId();
    // await wx.pro.hideLoading();

    // if (openid) {
    //   this.globalData.openid = openid;
    //   console.log("openid:" + openid);
    // } else {
    //   await wx.pro.showToast({
    //     title: '获取openid失败',
    //     icon: icon.Error
    //   })
    // }

    // this.userinfo = await this.getUserInfo(openid);

    // await this.getCoursesSchedule(); // 获取课程表

    // console.log(this.coursesSchedule)
    // console.log("onLaunch end");

    // this.launchFinished = true;
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
  async getClassesSchedule() {
    try {
    const rst = await wx.pro.request({
        url: getApp().service_url + "/class_course",
        method: "GET",
        data: {
          class_name: this.classSelect
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

  // 获取学生课程表
  async getCoursesSchedule() {
    try {
      const sourse_cache = await wx.pro.request({
        url: this.service_url + "/course?" + "student_no=" + this.userinfo.student_no,
        method: "get"
      });

      if (!sourse_cache) {
        throw new Error("获取用户信息失败")
      }

      this.coursesSchedule = sourse_cache.data;
    } catch (e) {
      throw e;
    }
    finally {
    }

  }

});
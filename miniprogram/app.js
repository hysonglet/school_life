// app.js
import {
  promisifyAll
} from 'wx-promise-pro';

promisifyAll(wx, wx.pro);

App({
  /* 服务器地址 */
  service_url: "http://localhost:8080",
  userinfo: {},
  autoWechatLogin: true,
  isLogin: false,
  globalData: {
    appName: "校园生活"
  },
  launchFinished: false,
  // 第一周开始日期
  semesterStartDate: "2025-08-15",
  // 从数据库中请求的课程表
  coursesSchedule: [],

  onLaunch: async function () {
    console.log("onLaunch");

    // 自动登录
    if (this.autoWechatLogin == false) {
      return;
    }

    await wx.pro.showLoading({
      title: '同步数据中...'
    });

    const openid = await this.getOpenId();
    await wx.pro.hideLoading();

    if (openid) {
      this.globalData.openid = openid;
      console.log("openid:" + openid);
    } else {
      await wx.pro.showToast({
        title: '获取openid失败',
        icon: icon.Error
      })
    }

    // this.userinfo = await this.getUserInfo(openid);

    // console.log("userInfo:");
    // console.log(this.userinfo);

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

  // 获取课程表
  async getCoursesSchedule() {
    // 测试用
    const coursesScheduleCache = [
      {
        week_start: 1,
        week_end: 5,
        week: 1,
        class_start: 1,
        class_duration: 1,
        object: "数据库系统",
        address: "D2实训楼 203",
        teacher: "老师1",
      },
      {
        week_start: 1,
        week_end: 6,
        week: 2,
        class_start: 5,
        class_duration: 2,
        object: "Python 程序设计",
        address: "D2实训楼 203",
        teacher: "老师2",
      },
      {
        week_start: 4,
        week_end: 5,
        week: 1,
        class_start: 3,
        class_duration: 2,
        object: "计算机基础",
        address: "D2实训楼 203",
        teacher: "老师3",
      },
      {
        week_start: 4,
        week_end: 8,
        week: 1,
        class_start: 3,
        class_duration: 2,
        object: "Web开发",
        address: "D2实训楼 203",
        teacher: "老师3",
      },
      {
        week_start: 4,
        week_end: 8,
        week: 5,
        class_start: 3,
        class_duration: 2,
        object: "Web开发",
        address: "D2实训楼 203",
        teacher: "老师3",
      },
      {
        week_start: 1,
        week_end: 5,
        week: 6,
        class_start: 1,
        class_duration: 2,
        object: "心理健康",
        address: "D2实训楼 203",
        teacher: "老师2",
      },
      {
        week_start: 1,
        week_end: 5,
        week: 1,
        class_start: 3,
        class_duration: 2,
        object: "心理健康",
        address: "D2实训楼 203",
        teacher: "老师2",
      },
    ];

    this.coursesSchedule = coursesScheduleCache;
  }

});
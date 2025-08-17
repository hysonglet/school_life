// app.js
import {
  promisifyAll
} from 'wx-promise-pro';

promisifyAll(wx, wx.pro);

App({
  /* 服务器地址 */
  service_url: "http://localhost:8080",
  userinfo: {},
  autoWechatLogin: false,
  isLogin: false,
  globalData: {
    appName: "校园生活"
  },
  schdule_info: {
    // 第一周开始日期
    semesterStartDate: "2025-08-15"
  },
  /**
 * 小程序启动时的生命周期函数，用于处理初始化逻辑。
 * 1. 检查是否启用自动微信登录，若未启用则直接返回。
 * 2. 显示加载提示，同步数据中。
 * 3. 获取用户的 openid，若成功则存入全局数据，否则提示失败。
 * 4. 根据 openid 获取用户信息，并打印日志。
 * @async
 * @function onLaunch
 * @returns {Promise<void>} 无返回值，但包含异步操作。
 */
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

    this.userinfo = await this.getUserInfo(openid);

    console.log("userInfo:");
    console.log(this.userinfo);

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
  }
});
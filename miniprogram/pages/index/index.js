const {
  init
} = require('@cloudbase/wx-cloud-client-sdk')
const client = init(wx.cloud)
const models = client.models

import * as utils from "../../utils/date"

Page({
  data: {
    todayCourses: [],
    noticeTabActive: 0,
    announcement_list: []
  },
  async onLoad() {

    while (!getApp().launchFinished) {
      // 等待 100ms 再检查（避免死循环）
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log("onLoad end");

    // 获取今日课程
    await this.updateTodayCourses();

    // 获取广告
    await this.getAnnouncement();
  },

  onReady: async function () {
    await this.updateTodayCourses();
  },
  onChangeTab(e) { },
  onOpenTipsModal() { },

  async onPullDownRefresh() {
    await this.getAnnouncement();

    wx.stopPullDownRefresh();

    console.log("广告获取完毕");
  },

  imageLoadError(e) {
    console.log('image load error: ', e)
  },

  gotoWebPage(url) {
    const targetUrl = url;

    const mpWeixinRegex = /^https:\/\/mp\.weixin\.qq\.com(\S*)?$/i;

    // 匹配微信公众号的链接才能跳转
    if (mpWeixinRegex.test(targetUrl)) {
      wx.navigateTo({
        url: `/pages/webview/index?url=${targetUrl}`
      })
    }
  },

  // 按下图片跳转到图片的链接
  goToWebPage(e) {
    const targetUrl = e.currentTarget.dataset.index;

    const mpWeixinRegex = /^https:\/\/mp\.weixin\.qq\.com(\S*)?$/i;

    // 匹配微信公众号的链接才能跳转
    if (mpWeixinRegex.test(targetUrl)) {
      wx.navigateTo({
        url: `/pages/webview/index?url=${targetUrl}`
      })
    }
  },

  course_time() {
    this.gotoWebPage("https://mp.weixin.qq.com/s/G4aECnVEWPfFf0B_oxVDkQ")
  },

  // 跳转到舔狗日记
  lovedog() {
    let ret = wx.navigateTo({
      url: '/pages/index/lovedog/index?name=lovedog',
    })
  },

  loveword() {
    let ret = wx.navigateTo({
      url: '/pages/index/lovedog/index?name=loveword',
    })
  },

  goodmorning() {
    let ret = wx.navigateTo({
      url: '/pages/index/lovedog/index?name=morning',
    })
  },

  goodevening() {
    let ret = wx.navigateTo({
      url: '/pages/index/lovedog/index?name=evening',
    })
  },

  historyTody() {
    let ret = wx.navigateTo({
      url: '/pages/index/lovedog/index?name=history',
    })
  },

  unimplement() {
    wx.showToast({
      title: '此功能暂未开放',
      icon: "none"
    })
  },

  onTabItemTap: async function (item) {
    console.log("onTabItemTap: " + item.index);
    if (item.index == 0) {
      await this.updateTodayCourses();
    }
  },

  // 从服务器中获取通知广告
  async getAnnouncement() {
    const rst = await wx.pro.request({
      url: getApp().service_url + "/get_announcement",
      method: 'GET'
    })

    const data = rst.data;

    console.log('announcement', data)

    this.setData(
      {
        announcement_list: data
      }
    )
  },

  // 获取今日课程
  async updateTodayCourses() {
    const app = getApp();

    const today = new Date();
    const semesterStartDate = new Date(app.semesterStartDate);
    const nowWeek = utils.getWeekNumber(semesterStartDate, today);

    const todayCoursesCache = app.coursesSchedule.filter(courses => {

      // 只提取当前的课程出来
      return (courses.week_start <= nowWeek) &&
        (courses.week_end >= nowWeek) &&
        (today.getDay() == courses.week) &&
        ((courses.week_type === 'both') ||
          ((courses.week_type === 'single') && ((nowWeek) % 2 === 1)) ||
          ((courses.week_type === 'double') && ((nowWeek) % 2 === 0)));
    })

    // 去重
    const uniqueArray = [...new Map(todayCoursesCache.map(item => [(item.class_start), item])).values()];
    // console.log('todayCoursesCache', todayCoursesCache);
    // console.log('uniqueArray', uniqueArray)


    this.setData({
      todayCourses: uniqueArray
    })
  }
});
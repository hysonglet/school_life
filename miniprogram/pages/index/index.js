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
    announcement_list: [{
        "images": "/resources/images/test/风景.jpg",
        "desc": "关于举办电子设计大赛的通知",
        "type": "通知"
      },
      {
        "images": "/resources/images/test/邵工1.jpg",
        "desc": "热烈祝贺我校获得全国大学生电子设计竞赛一等奖",
        "type": "新闻"
      },
      {
        "images": "/resources/images/test/邵工2.jpg",
        "desc": "关于寒假放假的工作安排",
        "type": "通知"
      },
      {
        "images": "/resources/images/test/邵工3.jpg",
        "desc": "国家计算机二级考试培训",
        "type": "广告"
      }
    ]
  },
  async onLoad() {

    while (!getApp().launchFinished) {
      // 等待 100ms 再检查（避免死循环）
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log("onLoad end");

    await this.updateTodayCourses();
  },

  onReady: async function () {
    await this.updateTodayCourses();
  },
  onChangeTab(e) {},
  onOpenTipsModal() {},
  onTabItemTap: async function(item) {
    console.log("onTabItemTap: " + item.index);
    if (item.index == 0) {
      await this.updateTodayCourses();
    }
  },

  // 获取今日课程
  async updateTodayCourses() {
    const app = getApp();

    const today = new Date();
    const semesterStartDate = new Date(app.semesterStartDate);

    const todayCoursesCache = app.coursesSchedule.filter(courses => {
      const courseDate = new Date(semesterStartDate);
      courseDate.setDate(semesterStartDate.getDate() + (courses.week_start - 1) * 7 + (courses.week - 1));

      const nowWeek = utils.getWeekNumber(semesterStartDate, today);
      return (courses.week_start <= nowWeek) &&
        (courses.week_end >= nowWeek) &&
        (today.getDay() == courses.week);
    })

    console.log(todayCoursesCache);

    this.setData({
      todayCourses: todayCoursesCache
    })
  }
});
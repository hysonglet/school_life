// pages/study/curriculum.js

import * as utils from "../../utils/date"

Page({

  /**
   * Page initial data
   */
  data: {
    // 当前显示的周
    week_index: -1,
    // 当前学期的周数
    week_count: 20,
    // 当前学期的所有周的选项清单
    weeks_array: [],
    // 当前显示的月份
    mounth: 1,
    // 课程颜色表
    courseColor: {},
    // 显示课程详细信息
    showCourseInfo: false,
    showCourseInfoCountent: {},
    selectRoleKindNumber: 1, // 1: 学生， 2:老师
    // 选择的班级
    classSelect: "",
    // 从数据库中获得的课程表清单
    // TODO：单双周考虑
    coursesSchedule: [],
    curriculum_time_list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    // 课程表的日期显示列表
    week_days: [{
        week: "周一",
        is_today: true,
        day: 1
      },
      {
        week: "周二",
        is_today: false,
        day: 2
      },
      {
        week: "周三",
        is_today: false,
        day: 3
      },
      {
        week: "周四",
        is_today: false,
        day: 4
      },
      {
        week: "周五",
        is_today: false,
        day: 5
      },
      {
        week: "周六",
        is_today: false,
        day: 6
      },
      {
        week: "周日",
        is_today: false,
        day: 7
      },
    ]
  },

  // 根据周数刷新周和日期显示的后台数据
  updateWeekDays() {
    const app = getApp();

    // 获取当前学期的开始日期
    const startDate = app.semesterStartDate;

    // 根据当前周数获取一周的日期列表
    const data_list = utils.getWeekDate(startDate, this.data.week_index + 1, true);

    const today = new Date();

    // 返回的日期列表对象
    const week_days = Array.from(data_list, (item) => {
      const day = item.getYear();
      return {
        // 星期
        week: utils.getWeekday(item),
        // 是否是今天
        is_today: item.getDate() == today.getDate() && item.getMonth() == today.getMonth(),
        // 日期
        day: item.getDate()
      };
    })

    // 月份和日期
    this.setData({
      week_days: week_days,
      mounth: data_list[0].getMonth() + 1
    })
  },

  // 更新课程表，将课程名提取到数组
  async _updateCourseList() {
    const colorList = [
      "#fbff35ff",
      "#df7767ff",
      "#4DFFBE",
      "#1de0f2ff",
      "#7bec2aff",
      "#F5CBCB",
      "#78C841",
      "#B4E50D",
      "#FF9B2F",
      "#dd20c7ff",
      "#F5BABB",
      "#11ebceff",
      "#FF90BB",
      "#FFC1DA",
      "#f1587cff",
      "#53fff4ff",
      "#FF894F",
      "#EA5B6F",
      "#FAEB92",
      "#CC66DA",
      "#9929EA",
      "#FF2DD1",
      "#00FFDE"
    ];

    const selectRoleKindNumber = wx.getStorageSync("selectRoleKindNumber")

    this.setData({
      coursesSchedule: getApp().coursesSchedule
    })

    const courseColorCache = {};


    console.log(this.data.coursesSchedule)
    const object_list = [...new Set(this.data.coursesSchedule.map(course => course.object+course.class))];

    object_list.forEach((courseName, index) => {
      courseColorCache[courseName] = colorList[index % colorList.length];
    })


    this.setData({
      courseColor: courseColorCache,
    })
    console.log("courseColor", this.data.courseColor)
  },

  /**
   * 处理周数切换事件
   * @param {Object} event - 事件对象，包含切换的周数详情
   * @description 更新当前选中的周数索引，并刷新周数对应的日期列表
   */
  onWeekChange(event) {
    // console.log(event)
    this.setData({
      week_index: event.detail
    })


    // 刷新
    this.updateWeekDays();
  },

  onSwiperWeekChange(event) {
    // console.log(event)
    this.setData({
      week_index: event.detail.current
    })

    // 刷新
    this.updateWeekDays();
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    this.data.selectRoleKindNumber = getApp().selectRoleKindNumber;

    this.updateWeekDays()

    await this._updateCourseList()

    if (this.data.week_count > 0) {
      const array = Array.from({
          length: this.data.week_count
        },
        (_, index) => ({
          text: `第${index + 1}周`,
          value: index
        })
      );

      this.setData({
        weeks_array: array
      })
      const today = new Date();
    }
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

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },

  // 监听底部TabBar点击事件
  onTabItemTap: async function (item) {
    console.log('当前点击的Tab信息:', item);
    switch (item.index) {
      case 0:
        break;
      case 1:
        await this.onRefresh()
        break;
    }
  },


  async onRefresh() {
    // await getApp().getCoursesSchedule();
    await this._updateCourseList();
    const week = utils.getWeekNumber(getApp().semesterStartDate, new Date());

    console.log("week", week)
    this.setData({
      week_index: week - 1
    })

    this.setData({
      classSelect: getApp().classSelect
    })
  },

  onCourseInfoShow(event) {
    const course = event.currentTarget.dataset.index;
    console.log(course)

    this.setData({
      showCourseInfo: true,
      showCourseInfoCountent: course
    })
  },

  // 课程信息关闭
  onCourseInfoClose() {
    this.setData({
      showCourseInfo: false
    })
  }
})
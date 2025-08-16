const {
  init
} = require('@cloudbase/wx-cloud-client-sdk')
const client = init(wx.cloud)
const models = client.models

Page({
  data: {
    announcement_list: [{
        "images": "/resources/images/test/广告通知测试.png",
        "desc": "这是一个通知",
        "type": "通知"
      },
      {
        "images": "/resources/images/test/广告通知测试.png",
        "desc": "这是一个广告",
        "type": "广告"
      },
      {
        "images": "/resources/images/test/广告通知测试.png",
        "desc": "这是一个广告",
        "type": "广告"
      },
      {
        "images": "/resources/images/test/广告通知测试.png",
        "desc": "这是一个广告",
        "type": "广告"
      }
    ],
    notices: {
      class: [{
          "text": "08:30",
          "address": "创新楼 1105",
          "desc": "电路分析"
        },
        {
          "text": "09:30",
          "address": "创新楼 1105",
          "desc": "计算机组成原理"
        },
        {
          "text": "10:30",
          "address": "创新楼 1105",
          "desc": "嵌入式"
        },
        {
          "text": "11:30",
          "address": "创新楼 1105",
          "desc": "Python"
        },
        {
          "text": "13:30",
          "address": "创新楼 1105",
          "desc": "数据结构"
        },
        {
          "text": "15:30",
          "address": "创新楼 1105",
          "desc": "C语言"
        },
        {
          "text": "17:30",
          "address": "创新楼 1105",
          "desc": "C++"
        },
      ],
      notices: [{
          "text": "12:20",
          "desc": "班会 创新楼 1105"
        },
        {
          "text": "12:30",
          "desc": "联谊 创新楼 1105"
        }
      ],
      life: [

      ]
    },
  },
  async onLoad() {},
  onChangeTab(e) {},
  onOpenTipsModal() {}
});
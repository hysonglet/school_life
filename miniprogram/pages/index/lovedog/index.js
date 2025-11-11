// pages/index/lovedog/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    url: "",
    pageName: "",
    title: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const LOVE_DOG_URL = "https://api.iyuns.com/api/dog";
    const LOVE_WORD_URL = "https://jkapi.com/api/tuweiqinghua";
    const MORNING_URL = "https://jkapi.com/api/zaoan";
    const EVENING_URL = "https://jkapi.com/api/wanan";
    const HISTORY_URL = "https://jkapi.com/api/history";

    this.setData({
      pageName: options.name,
    })

    switch (options.name) {
      case "lovedog":
        this.setData({
          url: LOVE_DOG_URL,
          title: "舔狗日记"
        })
        break;
      case "loveword":
        this.setData({
          url: LOVE_WORD_URL,
          title: "土味情话"
        })
        break;
      case "morning":
        this.setData({
          url: MORNING_URL,
          title: "早安"
        })
        break;
        case "evening":
          this.setData({
            url: EVENING_URL,
            title: "晚安"
          })
          break;
          case "history":
          this.setData({
            url: HISTORY_URL,
            title: "历史今日"
          })
          break;
      default:
        break;
    }
    this.onRefreshNew();
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
  onPullDownRefresh() {
    this.onRefreshNew();
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

  onClickLeft() {
    wx.navigateBack();
  },

  // 刷新舔狗日记
  onRefreshNew() {
    try {
      let response = wx.request({
        url: this.data.url,
        method: "GET",
        success: (res) => {
          let content = "";
          console.log("res: ", res);
          switch (this.data.pageName){
            case "lovedog": content = res.data.data;break;
            case "loveword": content = res.data; break;
            case "morning": content = res.data; break;
            case "evening": content = res.data; break;
            case "history": content = res.data; break;
            default: break;
          }
          this.setData({
            content: content,
          });
        },
        fail: (err) => {
          console.error(err);
          wx.showToast({
            title: "刷新失败",
            icon: "none",
            duration: 1000,
          });
        },
      });
    } catch (err) {
      console.log(err);
    }
  },

  onCopyToClipboard() {
    wx.setClipboardData({
      data: this.data.content,
      success: (res) => {
        wx.showToast({
          title: "复制成功",
          icon: "none",
          duration: 1000,
        });
      }
    });
  },
});
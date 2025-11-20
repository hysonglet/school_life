// pages/index/happyavatar/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrentIndex: 0,
    refreshCount: 1,
    videoAd: null,
    avatarInfoList: [
      {
        title: "敷衍",
        type: "ugly-avatar",
        src: "https://avatar.app.luler.top/avatar?type=ugly-avatar&r=0.8223577398152413"
      },
      {
        title: "装B",
        type: "multiavatar",
        src: ""
      },
      {
        title: "无语男",
        type: "facesjs&gender=male",
        src: ""
      },
      {
        title: "无语女",
        type: "facesjs&gender=female",
        src: ""
      },
      {
        title: "像素男",
        type: "dicebear&style=male",
        src: ""
      },
      {
        title: "像素女",
        type: "dicebear&style=female",
        src: ""
      },
      {
        title: "像素老六",
        type: "dicebear&style=avataaars",
        src: ""
      },
      {
        title: "呵呵",
        type: "type=dicebear&style=avataaars",
        src: ""
      },
      {
        title: "机器人",
        type: "dicebear&style=bottts",
        src: ""
      },
      {
        title: "骷髅头",
        type: "dicebear&style=gridy",
        src: ""
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.onRefresh()
    this.downloadImage();


    // 若在开发者工具中无法预览广告，请切换开发者工具中的基础库版本
    // 在页面中定义激励视频广告

    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      this.data.videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-08c0f684fb078aed'
      })
      this.data.videoAd.onLoad(() => {})
      this.data.videoAd.onError((err) => {
        console.error('激励视频光告加载失败', err)
      })
      this.data.videoAd.onClose((res) => {
        console.log(res);
        // 正常观看结束，否则继续播放广告
        if (res && res.isEnded) {
          return;
        }
        // 没有看完广告，则等下继续让播放广告
        this.setData({
          refreshCount: this.data.refreshCount - 2,
        })
        
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 下载网络图片到本地临时文件
   */
  downloadImage() {
    const AVATAR_URL = "https://avatar.app.luler.top/avatar";

    var rand = Math.random();
    const imageUrl = AVATAR_URL + "?" + "type=" + this.data.avatarInfoList[this.data.swiperCurrentIndex].type + "&r=" + rand;

    const that = this;
    // 显示加载提示
    this.setData({ isLoading: true });

    wx.showToast({
      title: '正在生成中...',
      icon: 'none',
      duration: 60000,
    })

    // 下载图片
    wx.downloadFile({
      url: imageUrl,
      success: (res) => {
        // 下载成功：获取临时路径
        if (res.statusCode === 200) {
          const tempFilePath = res.tempFilePath;
          // console.log("图片下载成功，临时路径：", tempFilePath);

          // 更新数据，显示图片（隐藏加载提示）
          that.setData({
            refreshCount: this.data.refreshCount + 1,
            [`avatarInfoList[${that.data.swiperCurrentIndex}].src`]: tempFilePath,
            isLoading: false
          });

          wx.hideToast()

        } else {
          // 下载失败（状态码非200）
          that.handleError("图片下载失败，状态码：" + res.statusCode);
        }
      },
      fail: (err) => {
        // 下载失败（网络错误、域名未配置等）
        console.error('url', imageUrl)
        console.error("图片下载失败：", err);
        that.handleError("网络错误，图片下载失败");
      }
    });
  },

  /**
   * 统一处理错误（显示提示 + 隐藏加载）
   */
  handleError(errorMsg) {
    wx.showToast({
      title: errorMsg,
      icon: 'none',
      duration: 2000
    });
    this.setData({ isLoading: false });
  },

  /**
   * 图片加载完成监听（可选，确保图片渲染成功）
   */
  onImageLoad(e) {
    // console.log("图片渲染完成，尺寸：", e.detail.width, "x", e.detail.height);


    if (this.data.refreshCount % 10 == 0) {
      // 用户触发广告后，显示激励视频广告
      if (this.data.videoAd) {
        this.data.videoAd.show().catch(() => {
          // 失败重试
          this.data.videoAd.load()
            .then(() => this.data.videoAd.show())
            .catch(err => {
              console.error('激励视频 广告显示失败', err)
            })
        })
      }
    }
  },

  /**
   * 保存图片到手机相册
   */
  saveImageToAlbum() {
    const tempFilePath = this.data.avatarInfoList[this.data.swiperCurrentIndex].src;
    if (!tempFilePath) {
      wx.showToast({ title: '图片未加载完成', icon: 'none' });
      return;
    }

    // 1. 检查用户是否授权保存图片
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          // 2. 未授权：发起授权请求
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              // 授权成功：执行保存
              this.doSaveImage(tempFilePath);
            },
            fail: () => {
              // 用户拒绝授权：引导手动开启
              wx.showToast({
                title: '请允许保存图片到相册',
                icon: 'none',
                duration: 2000
              });
              // 可选：跳转到权限设置页
              wx.openSetting({
                success: (settingRes) => {
                  if (settingRes.authSetting['scope.writePhotosAlbum']) {
                    this.doSaveImage(tempFilePath);
                  }
                }
              });
            }
          });
        } else {
          // 3. 已授权：直接执行保存
          this.doSaveImage(tempFilePath);
        }
      }
    });
  },

  /**
   * 执行保存图片的核心操作
   */
  doSaveImage(tempFilePath) {
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: () => {
        wx.showToast({
          title: '图片保存成功！',
          icon: 'success',
          duration: 1500
        });
      },
      fail: (err) => {
        console.error("图片保存失败：", err);
        wx.showToast({
          title: '图片保存失败，请稍后再试',
          icon: 'none'
        });
      }
    });
  },

  onClickLeft() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      // 有上一页，返回
      wx.navigateBack({ delta: 1 });
    } else {
      // 无上一页，跳转首页（根据实际情况调整 url）
      wx.navigateTo({ url: 'pages/index/index' });
    }
  },

  onSwiperChange(e) {
    // console.log(e);
    this.setData({
      swiperCurrentIndex: e.detail.current
    });

    if (this.data.avatarInfoList[this.data.swiperCurrentIndex].src.length == 0) {
      this.downloadImage();
    }
  },

  onImageLoadStart() {
    // console.log('onImageLoadStart')
  },

  onImageLoadSuccess() {
    wx.hideToast();
  },

  onImageLoadError() {
    console.log(onImageLoadError)

    wx.hideToast();
    wx.showToast({
      title: '生成失败!',
      icon: 'none',
    })
  },
})
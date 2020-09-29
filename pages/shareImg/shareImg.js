const app = getApp()
import { ApiGetUserMsgByOpenId } from '../../utils/server/login'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgDraw: {},
    openSetting: false,
    isAuthPhoto: false,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.saveImg()
    wx.showLoading({
      title: '数据加载中...',
    })
    const { openId, userId } = options
    ApiGetUserMsgByOpenId(userId).then(res => {
      wx.hideLoading()
      if(res.code === 1) {
        this.setData({
          userInfo: res.data
        })
        wx.getSetting({
          success: res => {
            let authSetting = res.authSetting
            if (!authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: ()=> {
                  this.setData({
                    isAuthPhoto: true,
                    openSetting: false,
                  })
                },fail: ()=> {
                  console.log('>>> test',)
                  this.setData({
                    isAuthPhoto: false,
                    openSetting: true,
                  })
                }
              })
            } else {
              this.setData({
                isAuthPhoto: true,
                openSetting: false,
              })
            }
          }
        })
        
      }
    }).catch(() =>{
        wx.hideLoading()
    })
   
  },

  openSetting(e) {
    const authSetting = e.detail.authSetting
    if (authSetting['scope.writePhotosAlbum']) {
      this.setData({
        openSetting: false
      })
      this.saveImg()
    } else {
      wx.showToast({
        title: '未开启相册权限,请在次点击保存图片',
        icon: 'none',
      })
    }
  },
  saveImg() {
    wx.showLoading({
      title: '生成中'
    })
    const { headUrl, nickName, userLevel, winCount, loseCount, score } = this.data.userInfo
    const imgDraw = {
      width: '1500rpx',
      height: '2412rpx',
      // background: 'https://qiniu-image.qtshe.com/20190506share-bg.png',
      views: [
        // 背景
        {
          type: 'image',
          url: '/assets/images/flower.png',
          css: {
            top: '280rpx',
            left: '50rpx',
            width: '1410rpx',
            height: '1086rpx',
          },
        },
        {
          type: 'image',
          url: '/assets/images/share/bg.png',
          css: {
            top: '1600rpx',
            left: '60rpx',
            width: '880rpx',
            height: '410rpx',
          },
        },
        // 头像
        {
          type: 'image',
          // url: '/assets/images/test/logo.jpg',
          url: headUrl,
          css: {
            top: '1676rpx',
            left: '120rpx',
            width: '260rpx',
            height: '260rpx',
            borderWidth: '12rpx',
            borderColor: '#FFF',
            borderRadius: '260rpx'
          }
        },
        // 二维码
        {
          type: 'image',
          url: '/assets/images/share/code.png',
          css: {
            top: '1600rpx',
            left: '980rpx',
            width: '410rpx',
            height: '410rpx',
            borderRadius: '410rpx'
          }
        },
        {
          type: 'text',
          text: nickName,
          css: {
            top: '1676rpx',
            fontSize: '60rpx',
            left: '420rpx',
            align: 'left',
            width: "480rpx",
            color: '#ffffff'
          }
        },
        {
          type: 'text',
          text: userLevel,
          css: {
            top: '1770rpx',
            fontSize: '60rpx',
            left: '420rpx',
            align: 'left',
            width: "480rpx",
            color: '#ffffff'
          }
        },
        {
          type: 'text',
          text: `${winCount}胜${loseCount}负｜${score}分`,
          css: {
            top: '1870rpx',
            fontSize: '60rpx',
            left: '420rpx',
            align: 'left',
            width: "480rpx",
            color: '#ffffff'
          }
        },
      ]
    }
    // const imgDraw = {
    //   width: '750rpx',
    //   height: '1206rpx',
    //   // background: 'https://qiniu-image.qtshe.com/20190506share-bg.png',
    //   views: [
    //     // 背景
    //     {
    //       type: 'image',
    //       url: '/assets/images/flower.png',
    //       css: {
    //         top: '140rpx',
    //         left: '25rpx',
    //         width: '705rpx',
    //         height: '543rpx',
    //       },
    //     },
    //     {
    //       type: 'image',
    //       url: '/assets/images/share/bg.png',
    //       css: {
    //         top: '800rpx',
    //         left: '30rpx',
    //         width: '440rpx',
    //         height: '205rpx',
    //       },
    //     },
    //     // 头像
    //     {
    //       type: 'image',
    //       url: '/assets/images/test/logo.jpg',
    //       css: {
    //         top: '838rpx',
    //         left: '60rpx',
    //         width: '130rpx',
    //         height: '130rpx',
    //         borderWidth: '6rpx',
    //         borderColor: '#FFF',
    //         borderRadius: '130rpx'
    //       }
    //     },
    //     // 二维码
    //     {
    //       type: 'image',
    //       url: '/assets/images/share/code.png',
    //       css: {
    //         top: '800rpx',
    //         left: '490rpx',
    //         width: '205rpx',
    //         height: '205rpx',
    //         borderRadius: '205rpx'
    //       }
    //     },
    //     {
    //       type: 'text',
    //       text: '青团子',
    //       css: {
    //         top: '838rpx',
    //         fontSize: '30rpx',
    //         left: '210rpx',
    //         align: 'left',
    //         width: "240rpx",
    //         color: '#ffffff'
    //       }
    //     },
    //     {
    //       type: 'text',
    //       text: '青团子',
    //       css: {
    //         top: '885rpx',
    //         fontSize: '30rpx',
    //         left: '210rpx',
    //         align: 'left',
    //         width: "240rpx",
    //         color: '#ffffff'
    //       }
    //     },
    //     {
    //       type: 'text',
    //       text: '51胜10负｜100分',
    //       css: {
    //         top: '935rpx',
    //         fontSize: '30rpx',
    //         left: '210rpx',
    //         align: 'left',
    //         width: "240rpx",
    //         color: '#ffffff'
    //       }
    //     },
    //   ]
    // }
    this.setData({
      imgDraw
    })
  },
  onImgErr(e) {
    wx.hideLoading()
    wx.showToast({
      title: '生成分享图失败，请刷新页面重试'
    })
  },
  onImgOK(e) {
    console.log('>>> e', e)
    this.savePhoto(e.detail.path)
  },
  savePhoto(path) {
    console.log('>>> path', path)
    wx.showLoading({
      title: '图片保存中...',
      mask: true
    })
    wx.saveImageToPhotosAlbum({
      filePath: path,
      success: (res) => {
        console.log('>>> success', res)
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
        setTimeout(() => {
          this.setData({
            visible: false
          })
        }, 300)
      },
      fail: (res) => {
        console.log('>>> fail', res)
        wx.getSetting({
          success: res => {
            let authSetting = res.authSetting
            if (!authSetting['scope.writePhotosAlbum']) {
              wx.showModal({
              title: '提示',
              content: '您未开启保存图片到相册的权限',
              success(res) {
                if (res.confirm) {
                  wx.openSetting()
                }
              }
            })
            }
          }
        })
        setTimeout(() => {
          wx.hideLoading()
        }, 300)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
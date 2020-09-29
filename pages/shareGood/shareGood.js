// pages/shareGood/shareGood.js
import { ApiGetUserMsgByOpenId, ApiLikeVAlid, ApiDoLike } from '../../utils/server/login';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reslut: {},
    userId: null,
    isCanClickGood: false,
    goodDialogVisible: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { userId } = options;
    const userInfo = app.globalData.userInfo;
    this.setData({
      userId,
    })
    console.log('>>> userInfo', userInfo)
    if (userInfo && userInfo.login && userInfo.openId) {
      wx.showLoading({
        title: '数据加载中...',
      })
      ApiLikeVAlid(
        userInfo.openId,
        userId
      ).then((res) => {
        wx.hideLoading()
        let showTips = (msg) => {
          wx.showModal({
            showCancel: false,
            content: msg,
            title: '提示',
            success() {
              if (userInfo.roleType === '1') {
                wx.redirectTo({
                  url: '/pages/adminIndex/adminIndex',
                })
              } else {
                wx.redirectTo({
                  url: '/pages/index/index',
                })
              }
            }
          })
        }
        switch(res.code) {
          case 1:
            this.setData({
              goodDialogVisible: true,
              reslut: {
                nickName: res.data ? res.data.nickName : '' ,
                avatarUrl: res.data ? res.data.headUrl : '' ,
              }
            })
            break;
          case 0:
            showTips('参赛人员不能为自己或他人点赞,点击确定将回到首页')
            break;
          case 3:
            showTips('您已为该参赛人员点过赞,点击确定将回到首页')
            break;
        }
      }).catch(err => wx.hideLoading())
    } else {
      wx.showModal({
        showCancel: false,
        content: '登陆成功后才能点赞, 点击确定将跳到登陆页!',
        title: '提示',
        success: () => {
          wx.setStorageSync('shareData', {
            isShare: '1',
            userId: this.data.userId
          })
          wx.redirectTo({
            url: '/pages/loginType/loginType?isShare=1',
          })
        }
      })
    }
  },

  handleGoods() {
    ApiDoLike(
      App.globalData.userInfo.openId,
      this.data.userId
    ).then(res => {
      if(res.code === 1) {
        let reslut = this.data.reslut
        wx.showToast({
          title: '点赞成功！',
          icon: 'none'
        })
        reslut.success = true;
        this.setData({
          reslut: reslut,
        })
      }
    })
  },
  handleFix() {
    const userInfo = App.globalData.userInfo;
    if (userInfo.roleType === '1') {
      wx.navigateTo({
        url: '/pages/adminIndex/adminIndex',
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }
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
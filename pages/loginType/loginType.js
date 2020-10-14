// pages/loginType/loginType.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAuthSetting: false,
    isShare: '0',
  },
  getUserInfo: function(e) {
    console.log('执法人员', e)
    const userInfo = e.detail.userInfo
    App.globalData.userInfo = Object.assign(App.globalData.userInfo, userInfo)
    const type = 'law'
    this.goLoginPage(type)
  },
  getUserInfoPublic(e) {
    const userInfo = e.detail.userInfo
    App.globalData.userInfo = Object.assign(App.globalData.userInfo, userInfo)
    const type = 'public'
    this.goLoginPage(type)
  },
  getUserInfoAdmin(e) {
    const userInfo = e.detail.userInfo
    App.globalData.userInfo = Object.assign(App.globalData.userInfo, userInfo)
    const type = 'admin'
    this.goLoginPage(type)
  },
  goLoginPage(type) {
    const { isShare } = this.data
    wx.navigateTo({
      url: `/pages/login/login?type=${type}&isShare=${isShare}`,
    })    
  },
  handleGo(e) {
    console.log('>>> e', e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('>>> options', options)
    wx.hideShareMenu()
    const { isShare } = options;
    if (isShare !== '1') {
      wx.removeStorageSync('shareData')
    } else {
      const strongShareData = wx.getStorageSync('shareData');
      if (strongShareData) {
        this.setData({
          isShare: strongShareData.isShare,
          userId: strongShareData.userId,
        })
      }
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
    // if (App.globalData.userInfo.avatarUrl) {
    //   this.setData({
    //     isAuthSetting: true
    //   })
    // } else {
    //   this.setData({
    //     isAuthSetting: false
    //   })
    // }
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
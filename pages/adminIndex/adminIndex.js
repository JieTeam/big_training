// pages/adminIndex/adminIndex.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rulesBox: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!App.globalData.userInfo || App.globalData.userInfo.login === false) {
      wx.redirectTo({
        url: '/pages/loginType/loginType',
      })
    }
  },
  go(e) {
    const type = e.currentTarget.dataset.type;
    let url = null
    switch (type) {
        case 'provinceWarSituation':
            url='/pages/provinceWarSituation/provinceWarSituation'
            break;
        case 'adminRanking':
            url='/pages/ranking/ranking?checkedType=2'
            break;
        case 'provinceRanking':
            url='/pages/adminRanking/adminRanking'
            break;
        case 'honor':
            url='/pages/honor/index'
            break;
        default:
            break;
    }
    if (!url) return;
    wx.navigateTo({
      url: url,
    })
    console.log('e', e)
  },
  rulesBoxShow () {
    this.setData({
      rulesBox: !this.data.rulesBox
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
    wx.hideHomeButton()
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
    const { openId, userId } = app.globalData.userInfo
    return {
      title: "执法大练兵知识竞赛",
      path:`/pages/shareImg/shareImg?openId=${openId}&userId=${userId}` 
    }
  }
})
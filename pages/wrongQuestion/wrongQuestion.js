import { getWrongQuestionList } from '../../utils/server/request'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wrongList: [],
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    this.getListData()
  },
  getListData() {
    const userInfo = app.globalData.userInfo
    wx.showLoading({
      title: '数据加载中...',
    })
    getWrongQuestionList(userInfo.userId).then((res) => {
      wx.hideLoading()
      if(res.code === 1) {
        function isRight(arr1, arr2) {
          arr1.length === arr2.length &&
          arr1.every((item) => arr2.includes(item))
        }
        this.setData({
          wrongList: res.data.map((item) => {
            item.userOption === item.userOption.split(',')
            item.rightAnswer === item.rightAnswer.split(',')
            item.isRight = isRight(item.userOption, item.rightAnswer)
            return item;
          })
        })
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
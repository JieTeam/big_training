// pages/provinceWarSituation/provinceWarSituation.js

import { getProvinceData } from '../../utils/server/request'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinceData: {}
  },
  getListData() {
    wx.showLoading({
      title: '数据加载中...',
    })
    const userId = app.globalData.userInfo.userId
    getProvinceData(userId).then(res => {
      console.log('>>> res', res)
      wx.hideLoading()
      if(res.code === 1) {
        res.data.addUpWinRate = (res.data.addUpWinRate * 100).toFixed(2)
        res.data.todayWinRate = (res.data.todayWinRate * 100).toFixed(2)
        this.setData({
          provinceData: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListData()
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
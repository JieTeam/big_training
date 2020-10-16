// pages/record/record.js
const app = getApp();
const Utils = require('../../utils/util.js');
import { getTrainListApi } from "../../utils/server/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkedType: 'matching',
    userInfo: {},
    rankingTabData: [
      {
        title: '匹配对战',
        type: 'matching',
        checked: true,
      },
      {
        title: '每周一测',
        type: 'week',
      },
    ],
    recordData: [],
  },
  handleTab(e) {
    const currentItem = e.target.dataset.item;
    console.log("==>", currentItem.type)
    this.setData({
      checkedType: currentItem.type,
      recordData: []
    })
    const newTabData = this.data.rankingTabData.map((item) => {
      item.checked = false
      if (item.type === currentItem.type) {
        item.checked = true
      }
      return item;
    })
    this.setData({
      rankingTabData: newTabData
    })
    this.getRankList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    const userInfo = app.globalData.userInfo
    if (userInfo.roleType !== '2') {
      this.setData({
        checkedType: 'week',
        rankingTabData: [{
          title: '每周一测',
          type: 'week',
          checked: true,
        }],
      })
    }
    this.setData({
      userInfo
    })
    wx.nextTick(() => {
      this.getRankList()
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

  },
  // 获取战绩
  async getRankList() {
    const that = this;
    Utils.showLoading();
    try {
        const userInfo = app.globalData.userInfo
        const result = await getTrainListApi({
            userId: userInfo.userId,
            trainType: that.data.checkedType=='matching'?'1':'2'
        })
        Utils.hideLoading();
        if(result.code!=1) return;
        that.setData({
            recordData: result.data
        })
    } catch (error) {
        Utils.hideLoading();
    }
  }
})
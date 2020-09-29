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
  },
  handleTab(e) {
    const currentItem = e.target.dataset.item;
    this.setData({
      checkedType: currentItem.type
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
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.getRankList()
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
    const userInfo = app.globalData.userInfo
    const result = await getTrainListApi({
        userId: userInfo.userId,
        trainType: that.data.checkedType=='matching'?'1':'2'
    })
    if(result.code!=1) return;
    
  }
})
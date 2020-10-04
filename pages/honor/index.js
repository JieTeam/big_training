// pages/honor/index.js
import { filePath } from '../../utils/server/config'
import { getAwardList } from '../../utils/server/request'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showVisible: false,
    honorData: [],
    imagePath: '',
    type: null
  },
  getListData() {
    wx.showLoading({
      title: '数据加载中...',
    })
    const userTypeSwichText = {
      3: 'group',
      4: 'group',
      5: 'group',
      2: 'personal',
      1: 'public',
    }
    const { userId, workingDivision } = app.globalData.userInfo;
    const code = this.data.type === 'admin' ? workingDivision : null
    getAwardList(userId,code).then(res => {
      wx.hideLoading()
      if (res.code === 1) {
        console.log('>>> data', res)

        const data = res.data.map((item => {
          const { awardsType, awardsLevel} = item;
          const typeText = userTypeSwichText[awardsType]
          item.imagePath = `${filePath}${typeText}-${awardsLevel}.png`
          return item
        }))
        console.log('>>> data', data)
        this.setData({
          honorData: data
        })
      }
    }).catch(err => {
      wx.hideLoading()
    })
  },
  close() {
    this.setData({
      showVisible: false,
    })
  },
  handleView(e) {
    // console.log('>> e', e, e.currentTarget.dataset.imagePath)
    this.setData({
      showVisible: true,
      imagePath: e.currentTarget.dataset.imagepath
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { type } = options
    this.setData({
      type
    })
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
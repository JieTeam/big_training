// pages/honor/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showVisible: false,
    medalList: [
        {
            name: "黄金",
            type: 1
        },
        {
            name: "白银",
            type: 2
        },
        {
            name: "青铜",
            type: 3
        },{
          name: "青铜",
          type: 3
      },
    ]
  },
  close() {
    this.setData({
      showVisible: false,
    })
  },
  open() {
    this.setData({
      showVisible: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
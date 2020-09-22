// pages/ranking/ranking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkedType: 'person',
    rankingTabData: [
      {
        title: '个人排行榜',
        type: 'person',
        checked: true,
      },
      {
        title: '省内排行榜',
        type: 'person1',
      },
      {
        title: '省级排行榜',
        type: 'province',
      },
    ],
    personClomn: [
      {
        title: '排名',
        key: 'ranking',
      },
      {
        title: '省份',
        key: 'key2',
      },
      {
        title: '平均积分',
        key: 'key3',
      },
      {
        title: '参与人数',
        key: 'key3',
      },
      {
        title: '答题次数',
        key: 'key4',
      }
    ],
    personData: [
      {
        ranking: '1',
        key2: '2',
        key3: '3',
        key4: '1',
      },
      {
        ranking: '2',
        key2: '2',
        key3: '3',
        key4: '1',
      }
    ]
    
  },
  handleTab(e) {
    const currentItem = e.target.dataset.item;
    console.log('>>>>currentItem', currentItem)
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
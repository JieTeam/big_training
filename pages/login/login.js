// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipsDialogVisible: false,
    getCodeMsg: '获取验证码',
    codeTime: 60,
    isGetMsgCode: false,
    params: {
      region: [],
      name: '',
      phone: '',
      msgCode: '',
      personType: 0,
    }
  },
  getMsgCode() {
    if (this.data.isGetMsgCode) return;
    this.setData({
      isGetMsgCode: true,
    })
    let codeTime = this.data.codeTime
    const codeInterval = setInterval(() => {
      codeTime -= 1
      this.setData({
        getCodeMsg: `(${codeTime}) 秒后重新获取`
      })
      if (codeTime === 0) {
        clearInterval(codeInterval)
        this.setData({
          getCodeMsg: '获取验证码',
          isGetMsgCode: false,
        })
      }
    },  1000);
  },
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      ['params.region']: e.detail.value
    })
  },
  handleInputChange(e) {
    const type = e.target.dataset.type
    thihs.setData({
      [`params.${type}`]: e.detail.value
    })
  },
  
  radioChange(e) {
    this.setData({
      ['params.personType']: e.detail.value
    })
  },
  handleFix() {
    console.log('>>> test')
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
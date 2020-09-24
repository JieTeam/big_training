const App = getApp()
import { ApiCheckUser, ApiGetOpenId, ApiGetLogin } from '../../utils/server/login'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipsDialogVisible: false,
    getCodeMsg: '获取验证码',
    codeTime: 60,
    isGetMsgCode: false,
    type: 'law',
    params: {
      region: [],
      name: '',
      phone: '',
      msgCode: '',
      roleType: '3',
    }
  },
  showRrrorMsg(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 1000
    })
  },
  checkUserBasic(type) {
    const { region, name, phone, msgCode } = this.data.params
    if(region.length === 0) {
      this.showRrrorMsg('请选择所属省份')
      return false;
    } else if (!name) {
      this.showRrrorMsg('请填写真是名称')
      return false;
    } else if (!(/^1[3456789]\d{9}$/.test(phone))) {
      this.showRrrorMsg('请填写正确的手机号')
      return false
    }
    if (type === 'msgCode') {
      return true
    }
    if (!msgCode) {
      this.showRrrorMsg('请填写验证码')
      return false
    }
    return true
  },
  checkUser() {
    return new Promise((resolve, reject) => {
    const { region, name, phone, msgCode } = this.data.params
      if (this.data.type === 'law') {
        ApiCheckUser({
          region: [...new Set(region)].join('-'),
          name,
          phoneNo: phone,
        }).then((res) => {
          if (res.code === 1) {
            // 调用发送验证码接口
            wx.showToast({
              title: '验证码发送成功',
              icon: 'none',
              duration: 1000,
            })
            resolve(true)
          } else {
            resolve(false)
          }
        }).catch(err => {
          resolve(false)
        })
      } else {
        resolve(true)
      }
    })
  },
  async getMsgCode() {
    if (!this.checkUserBasic('msgCode')) return
    if (this.data.isGetMsgCode) return;
    this.checkUser().then((res) => {
      if (res) {
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
      }
    })
  },
  getOpenId() {
    return new Promise((resolve, reject) => {
      if(App.globalData.userInfo.openId) {
        resolve(App.globalData.userInfo);
        return;
      }
      wx.login({
        success(res) {
          if (res.code) {
            ApiGetOpenId(res.code).then(res => {
              if (res.code === 1) {
                resolve(res)
              }
            })
          }
        }
      })
    })
  },
  async handleSubmit(){
    const userInfo = App.globalData.userInfo
    if(!this.checkUserBasic())  return;
    const res = await this.getOpenId();
    userInfo.openId = res.data.openId;
    console.log('>>> userInfo', userInfo)
    switch(this.data.type) {
      case 'admin':
        userInfo.roleType = '1'
        break;
      case 'law':
        userInfo.roleType = '2'
        break;
      case 'public':
        userInfo.roleType = this.data.params.roleType
        break;
    }
    const { region, name, phone, msgCode } = this.data.params
    const { roleType, openId, nickName, avatarUrl} = userInfo;
    wx.showLoading({
      title: '登陆中...',
    })
    ApiGetLogin({
      frontRegionName: [...new Set(region)].join('-'),
      name,
      phoneNo: phone,
      openId, 
      nickName,
      verificationCode: msgCode,
      headUrl: avatarUrl,
      roleType,
    }).then(res => {
      wx.hideLoading()
      if(res.code === 1) {
        userInfo.login = true;
        wx.setStorageSync('userInfo', userInfo)
        this.setData({
          tipsDialogVisible: true,
        })
      }
    }).catch(err => wx.hideLoading())
  },
  bindRegionChange(e) {
    this.setData({
      ['params.region']: e.detail.value
    })
  },
  handleInputChange(e) {
    const type = e.target.dataset.type
    this.setData({
      [`params.${type}`]: e.detail.value
    })
  },
  radioChange(e) {
    this.setData({
      ['params.roleType']: e.detail.value
    })
  },
  handleFix() {
    if (userInfo.roleType === '1') {
      wx.navigateTo({
        url: '/pages/adminIndex/adminIndex',
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('>>> options', options)
    this.setData({
      type: options.type,
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
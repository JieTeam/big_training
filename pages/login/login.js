import { ApiCheckUser, ApiGetOpenId, ApiGetLogin } from '../../utils/server/login'
import { getCityCode, init, changeCloumt,getCityIndex } from '../../utils/city'
import { ApiLikeVAlid, ApiDoLike } from '../../utils/server/login';

import cities from '../../utils/cities'

const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipsDialogVisible: false,
    // 点赞
    goodDialogVisible: false,
    reslut: {},

    getCodeMsg: '获取验证码',
    codeTime: 60,
    isGetMsgCode: false,
    isShare: '0',
    type: 'law',
    cities: cities,
    cityArray: [[],[],[]],
    region: [],
    region_code: [],
    regionValue: [0, 0, 0],
    province_index: 0,
    params: {
      region: [],
      name: '',
      phone: '',
      msgCode: '',
      roleType: '3',
    }
  },
  bindMultiPickerChange(e) {
    let array = getCityIndex(this.data.cityArray,e.detail.value, this.data.cities);
    console.log(array)
    this.setData({
      region: array.map(item => item.name),
      region_code: array.map(item => item.id),
      ['params.region']: array.map(item => item.id),
      citysIndex:e.detail.value
    })
  },
  bindMultiPickerColumnChange(e) {
    let column = e.detail.column;
    let index = e.detail.value;
    if(column == 0 ){
      this.setData({
        province_index:index,
        cityArray: changeCloumt(this.data.cities,this.data.cityArray,index,column, )
      })
    }
    if(column == 1){
      this.setData({
        cityArray: changeCloumt( this.data.cities,this.data.cityArray,index,column,this.data.province_index,)
      })
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
      this.showRrrorMsg('请填写真实名称')
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
    const { type, params } = this.data
    const { region, name, phone, msgCode } = this.data.params
        ApiCheckUser({
          region: [...new Set(region)].join('-'),
          name,
          phoneNo: phone,
          roleType: type === 'law' ? '2' : params.roleType
        }).then((res) => {
          console.log('>>> res', res)
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
        }).catch( err => {
          resolve(false)
        })
    })
  },
  async getMsgCode() {
    if (!this.checkUserBasic('msgCode')) return
    if (this.data.isGetMsgCode) return;
    this.checkUser().then((res) => {
      console.log('>>> res', res)
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
        }, 1000);
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
      if(res.code === 1 && res.data) {
        userInfo.login = true;
        userInfo.userId = res.data.id;
        // 后台返回的是数字 转字符串
        userInfo.roleType = res.data.roleType + '';
        wx.setStorageSync('userInfo', userInfo)
        const strongShareData = wx.getStorageSync('shareData');
        if (strongShareData && strongShareData.isShare === '1') {
         
          this.likeVAlid(strongShareData)
        } else {
          this.setData({
            tipsDialogVisible: true,
          })
        }
      } else {
        console.error('>>> dologin', res)
      }
    }).catch(err => wx.hideLoading())
  },
  likeVAlid(strongShareData) {
    wx.showLoading({
      title: '数据加载中...',
    })
    const userInfo = App.globalData.userInfo
    if(strongShareData && strongShareData.userId) {
      ApiLikeVAlid(
        userInfo.openId,
        strongShareData.userId
      ).then((res) => {
        wx.hideLoading()
        let showTips = (msg) => {
          wx.showModal({
            showCancel: false,
            content: msg,
            title: '提示',
            success() {
              if (userInfo.roleType === '1') {
                wx.redirectTo({
                  url: '/pages/adminIndex/adminIndex',
                })
              } else {
                wx.redirectTo({
                  url: '/pages/index/index',
                })
              }
            }
          })
        }
        switch(res.code) {
          case 1:
            this.setData({
              goodDialogVisible: true,
              reslut: {
                nickName: res.data ? res.data.nickName : '' ,
                avatarUrl: res.data ? res.data.headUrl : '' ,
              }
            })
            break;
          case 0:
            showTips('参赛人员不能为自己或他人点赞,点击确定将回到首页')
            break;
          case 3:
            showTips('当前用户已为该参赛人员点过赞,点击确定将回到首页')
            break;
        }
      })
    } else {
      wx.showToast({
        title: '数据格式无效！',
        icon: 'none',
      })
    }
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
  handleGoods() {
    ApiDoLike(
      App.globalData.userInfo.openId,
      this.data.userId
    ).then(res => {
      if(res.code === 1) {
        wx.showToast({
          icon: 'none',
          title: '点赞成功！'
        })
        let reslut = this.data.reslut
        reslut.success = true;
        this.setData({
          reslut: reslut,
        })
      }
    })
  },
  // 点赞
  handleGoods() {
    ApiDoLike(
      App.globalData.userInfo.openId,
      this.data.userId
    ).then(res => {
      if(res.code === 1) {
        let reslut = this.data.reslut
        wx.showToast({
          title: '点赞成功！',
          icon: 'none'
        })
        reslut.success = true;
        this.setData({
          reslut: reslut,
        })
      }
    })
  },
  // 登陆提示确定 点赞 确定
  handleFix() {
    const userInfo = App.globalData.userInfo;
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
    console.log('>> ', options)
    const { type } = options
    this.setData({
      type,
      cityArray: init(this.data.cities),
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
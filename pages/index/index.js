//index.js
// import regeneratorRuntime from "../../utils/runtime.js";   // 使用 async/await 引入
const Utils = require("../../utils/util.js");
const app = getApp(); // 获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rulesBox: false,
  },
  onReady() {
    
  },
  go(e) {
    const type = e.currentTarget.dataset.type || e.target.dataset.type;
    let url = null;
    switch (type) {
      case "knowledgeBase":
        url = '/pages/knowledgeBase/knowledgeBase'
        break;
      case "ranking":
        url = "/pages/ranking/ranking";
        break;
      case "wrongQuestion":
        url = "/pages/wrongQuestion/wrongQuestion";
        break;
      case "record":
        url = "/pages/record/record";
        break;
      default:
        break;
    }
    if (!url) return;
    wx.navigateTo({
      url,
    });
  },
  rulesBoxShow() {
    this.setData({
      rulesBox: !this.data.rulesBox,
    });
  },
  onLoad: function () {
    if (!app.globalData.userInfo || app.globalData.userInfo.login === false) {
      wx.redirectTo({
        url: '/pages/loginType/loginType',
      })
    } else if (app.globalData.userInfo.roleType === '1') {
      wx.redirectTo({
        url: '/pages/adminIndex/adminIndex',
      })
    }
    // if (app.globalData.userInfo.openid) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true,
    //   });
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = (res) => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true,
    //     });
    //     setTimeout(() => {
    //       this.getOpenid();
    //     }, 500);
    //   };
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: (res) => {
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true,
    //       });
    //     },
    //   });
    // }
  },
  gofight() {
    let timer = setTimeout(() => {
      wx.navigateTo({
        url: "../fight/index",
      });
    }, 200);
  },
  getUserInfo: function (e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
    setTimeout(() => {
      this.getOpenid();
    }, 500);
  },
});

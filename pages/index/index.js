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
    userInfo: {},
  },
  go(e) {
    const type = e.currentTarget.dataset.type || e.target.dataset.type;
    let url = null;
    switch (type) {
      case "fight":
        url = "/pages/fight/index";
        break;
      case "week":
        url = "/pages/week/index";
        break;
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
    if (app.globalData.userInfo.login) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }
    
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
  onShareAppMessage() {
    return {
      title: "执法大练兵知识竞赛",
      path:`/pages/index/index?url=${url}` 
    }
  }
});

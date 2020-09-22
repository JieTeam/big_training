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
  go(e) {
    const type = e.currentTarget.dataset.type || e.target.dataset.type;
    console.log(">> e", e);
    let url = null;
    switch (type) {
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
    if (app.globalData.userInfo.openid) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      });
      this.getOpenid();
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
        setTimeout(() => {
          this.getOpenid();
        }, 500);
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });
          setTimeout(() => {
            this.getOpenid();
          }, 500);
        },
      });
    }
  },
  getOpenid: function () {
    let that = this; //获取openid不需要授权
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      app.globalData.userInfo = Object.assign({}, userInfo);
      that.gofight();
    } else {
      wx.login({
        success: async function (res) {
          //请求自己后台获取用户openid
          const { statusCode, data } = await Utils.request.getLogin({
            appid: "wxd4728d868b084d7a",
            secret: "d02d319fe703183f9d3b2b6cb64b9673",
            js_code: res.code,
            grant_type: "authorization_code",
          });
          if (statusCode != 200 || !data.openid) return;
          userInfo = {
            ...that.data.userInfo,
            ...data,
          };
          app.globalData.userInfo = Object.assign({}, userInfo);
          wx.setStorageSync("userInfo", JSON.stringify(userInfo));
          that.gofight();
        },
      });
    }
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

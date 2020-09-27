//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        const initUserInfo = {
            login: false,
            // roleType: 3, // 1-省级管理员，2-执法人员，3-辅助执法人员，4-公众
        }
        const userInfo = wx.getStorageSync('userInfo') || initUserInfo;
        this.globalData.userInfo = userInfo
        // 
        // wx.login({
        //     success: res => {
        //         console.log('>>> res', res)
        //         // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //     }
        // })

        // if (userInfo) {
        //     this.globalData.userInfo = userInfo
        //     if (userInfo.roleType === '1') {
        //         wx.redirectTo({
        //           url: '/pages/adminIndex/adminIndex',
        //         })
        //     }
        // } else {
        //     wx.redirectTo({
        //       url: '/pages/loginType/loginType',
        //     })
        // }

        // 登录
        // wx.login({
        //     success: res => {
        //         // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //     }
        // })
        // 获取用户信息
        // wx.getSetting({
        //     success: res => {
        //         if (res.authSetting['scope.userInfo']) {
        //             // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //             wx.getUserInfo({
        //                 success: res => {
        //                     // 可以将 res 发送给后台解码出 unionId
        //                     this.globalData.userInfo = res.userInfo
        //                     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //                     // 所以此处加入 callback 以防止这种情况
        //                     if (this.userInfoReadyCallback) {
        //                         this.userInfoReadyCallback(res)
        //                     }
        //                 }
        //             })
        //         }
        //     }
        // })
    },
    globalData: {
        userInfo: {
            avatarUrl: "../../assets/images/test/logo.jpg",
            nickName: "水木青蓝"
        }
    }
})
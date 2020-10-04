//app.js
App({
    onLaunch: function () {
        const number = Math.floor(Math.random()*50+1);
        // 展示本地存储能力
        const initUserInfo = {
            "login": false,
            // "roleType":"2",
            // "nickName":"花下木",
            // "gender":1,
            // "language":"zh_CN",
            // "city":"",
            // "province":"",
            // "country":"South Georgia and the South Sandwich Islands",
            // "avatarUrl":"./assets/images/test/me_logo.png",
            // "openId":"oNQfV5Db727_nejfyID2WriDpLvo",
            // "userId": 4,
            // "name": "小白",
            // "workingDivision":"11010000",
            // "userLevel":"执法新兵",
            // "winRate":"0.00",
            // "winCount":1,
            // "tieCount":0,
            // "loseCount":1,
            // "count":2,
            // "score":6,
            // "phoneNo":"13162238613",
            // "fullRegionName":"北京市-东城区"
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
        userInfo: {}
    }
})
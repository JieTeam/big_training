// pages/fight_result/index.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        meInfo: null,
        rivalInfo: null,
        plate: null,
        roomId: null,
        fightResult: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this;
        this.setData({
            roomId: options.roomId
        })
        wx.getStorage({
            key: 'roomId',
            success: (result) => {
                const data = result.data;
                let resImg = data.homeScore>data.awayScore?'done':data.homeScore<data.awayScore?'filed':'draw';
                that.setData({
                    fightResult: data,
                    plate: `../../assets/images/fight_result/${resImg}.png`
                });
                wx.nextTick(()=>{
                    console.log(that.data.fightResult);
                })
            }
        });
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
        this.resetPage();
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
        const { openId, userId } = app.globalData.userInfo
        return {
            title: "2020年生态环境保护执法大练兵知识竞赛",
            path:`/pages/shareGood/shareGood?openId=${openId}&userId=${userId}` 
        }
    },
    resetPage() {
        this.setData({
            meInfo: {
                ...app.globalData.userInfo
            },
            rivalInfo: null
        })
    },
    go(e) {
        const type = e.currentTarget.dataset.type || e.target.dataset.type;
        let url = null;
        switch (type) {
            case "regame":
                url = "/pages/fight/index";
                break;
            case "share":
                url = "pages/shareImg/shareImg";
                break;
        }
        if (!url) return;
        wx.redirectTo({
            url: url
        });
    }
})
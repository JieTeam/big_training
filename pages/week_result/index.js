// pages/fight_result/index.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        meInfo: null,
        score: 520,
        plate: null,
        accuracy: "26/30",
        time: "05:20"
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

    },
    resetPage() {
        this.setData({
            meInfo: {
                ...app.globalData.userInfo,
                score: 60
            },
            rivalInfo: {
                header: "../../assets/images/test/me_logo.png",
                name: "小白",
                score: 80
            },
        })
        setTimeout(() => {
            this.setData({
                plate: "../../assets/images/fight_result/done.png"
            })
        }, 500);
    }

})
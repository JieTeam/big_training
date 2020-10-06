// pages/knowledgeBase_2/knowledgeBase_2.js
import rules from "../../utils/rules";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: null,
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const index = Number(options.index);
        this.setData({
            index: index,
            list: rules[index].list
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

    },
    readRule(e) {
        const key = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: `/pages/knowledgeBase_3/knowledgeBase_3?index=${this.data.index}&key=${key}`,
        });
          
    }
})
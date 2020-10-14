// pages/knowledgeBase_2/knowledgeBase_2.js
import rules from "../../utils/rules";
import { filePath } from "../../utils/server/config"
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
      wx.hideShareMenu()
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
        const {name, type} = e.currentTarget.dataset.item;
        wx.showLoading({
          title: '文档加载中...',
        })
        // console.log('>>> `${filePath}${name}${type}`', `${filePath}${name}${type}`)
        wx.downloadFile({
            // 示例 url，并非真实存在
            url: `${filePath}${name}${type}`,
            success: function (res) {
              const filePath = res.tempFilePath
              wx.openDocument({
                filePath: filePath,
                success: function (res) {
                  console.log('打开文档成功')
                  wx.hideLoading({
                    success: (res) => {},
                  })
                },
                fail: function(err) {
                    console.log('>>> err openDocument', err)
                    wx.hideLoading({
                      success: (res) => {},
                    })
                    wx.showToast({
                      title: '文档加载失败,请重试',
                      icon: 'none'
                    })
                }
              })
            },
            fail: function(err) {
                console.log('>>> err downloadFile', err)
                wx.hideLoading({
                  success: (res) => {},
                })
                wx.showToast({
                  title: '文档加载失败,请重试',
                  icon: 'none'
                })
            }
        })
        // wx.navigateTo({
        //     url: `/pages/knowledgeBase_3/knowledgeBase_3?index=${this.data.index}&key=${key}`,
        // });
          
    }
})
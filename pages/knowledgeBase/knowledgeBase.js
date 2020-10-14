// pages/knowledgeBase/knowledgeBase.js
import rules from "../../utils/rules";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rules: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        
        this.setData({
            rules: rules
        })
    },
    test () {
        wx.downloadFile({
            // 示例 url，并非真实存在
            url: 'http://blog.8bjl.cn/upload/book/pdf/%E5%88%B6%E6%B5%86%E9%80%A0%E7%BA%B8%E5%B7%A5%E4%B8%9A%E6%B0%B4%E6%B1%A1%E6%9F%93%E7%89%A9%E6%8E%92%E6%94%BE%E6%A0%87%E5%87%86.pdf',
            success: function (res) {
              const filePath = res.tempFilePath
              wx.openDocument({
                filePath: filePath,
                success: function (res) {
                  console.log('打开文档成功')
                }
              })
            }
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
    selRule(e) {
        const { index } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/knowledgeBase_2/knowledgeBase_2?index=${index}`
        });
          
    }
})
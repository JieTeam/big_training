// pages/matching/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hint: "匹配中...",
        meInfo: {
            header: "../../assets/images/test/logo.jpg",
            name: "水木青蓝"
        },
        rivalInfo: null,
        matchSuc: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getrival();
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

    /**
     * 匹配
     */
    getrival: function () {
        const _this = this;
        let timer = setTimeout(function(){
            clearTimeout(timer);
            timer = null;
            _this.setData({
                rivalInfo: {
                    header: "../../assets/images/test/me_logo.png",
                    name: "小白"
                },
                matchSuc: true
            })
            let timer1 = setTimeout(function() {
                clearTimeout(timer1);
                timer1 = null;
                wx.navigateTo({
                    url: "../fight/index"
                });
            },1500)
            
        },3000)
    },
    /**
     * 没匹配成功之前放弃对战
     */
    fqAgainst: function() {
        let pages = getCurrentPages(); //当前页面
        let beforePage = pages[pages.length - 2]; //前一页
        wx.navigateBack({
            success: function () {
                beforePage.onLoad(); // 执行前一个页面的onLoad方法
            }
        });
    }
})
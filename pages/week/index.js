// pages/week/index.js
let prigressTime = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        done: false,
        progress: 0
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
        this.getToPic();
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
    getToPic() {
        const that = this;
        let count = 0,eAngle=0;
        function animation() {
            if (count <= 300) {
                count+=30;
                eAngle = eAngle + Math.PI / 6;
                that.drawCountdownCircle(0, eAngle, () => {
                    
                });
                that.setData({
                    progress: Math.floor(count*100/360)
                })
            } else {
                that.setData({
                    progress: 99
                })
                that.drawCountdownCircle(0, 0.99*2*Math.PI, () => {
                    
                });
            }
        }
        clearInterval(prigressTime);
        prigressTime = setInterval(animation, 200);
    },
    /**绘制倒计时圆环 */
    drawCountdownCircle(sAngle = START_ANGLE, eAngle = END_ANGLE, callback) {
        const query = wx.createSelectorQuery();
        query.select('#loop')
        .fields({ node: true, size: true })
        .exec((res) => {
            const canvas = res[0].node;
            canvas.width = 200;
            canvas.height = 200;
            const context = canvas.getContext('2d');

            // 绘制圆环
            context.save();
            context.strokeStyle = '#03d6b3';
            context.beginPath();
            context.lineWidth = 7;
            context.arc(100, 100, 90, sAngle, eAngle, false);
            context.stroke();
            context.closePath();
            context.restore();
            
            typeof callback == 'function' && callback();
        })
    },
})
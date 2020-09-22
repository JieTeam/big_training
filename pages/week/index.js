// pages/week/index.js
const app = getApp();
let prigressTime = null;
let countdownId = null; // 答题倒计时计时器ID
Page({

    /**
     * 页面的初始数据
     */
    data: {
        meInfo: null,
        done: false, // 是否加载完成
        progress: 0, // 加载进度

        subject: '', //当前题目名
        questionType: '', //题目类型 0：单选，1：多选
        questionTypeId: '', //题目类型ID
        questionId: '', // 当前题目ID
        questionImageUrl: '', //题目图片地址
        answerList: [], //当前题目答案选项
        questionIdList: [1,2,3,4,5,6,7,8,9,10], //返回的本次挑战题目所有数据的ID
        questionIndex: 0, //当前答题数组下标
        subSuc: false
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
        this.myModal = this.selectComponent('#myModal');
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
        if(prigressTime) clearInterval(prigressTime);  // 清除加载计时器
        if(countdownId) clearInterval(countdownId);  // 清除答题计时器
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
     * 获取题目
     */
    getToPic() {
        const that = this;
        let timer = setTimeout(function(){
            clearTimeout(timer);
            timer = null;
            that.setData({
                done: true,
                subject: '人们常说：“无事不登三宝殿”中的“三宝”是指哪三宝？', //当前题目名
                questionType: '1', //题目类型 0：单选，1：多选
                questionTypeId: '', //题目类型ID
                questionId: '', // 当前题目ID
                questionImageUrl: '', //题目图片地址
                answerList: [
                    {
                        answer: "A、纸、砚、笔",
                        id: 0
                    },
                    {
                        answer: "B、佛、法、僧",
                        id: 1
                    },
                    {
                        answer: "C、书、剑、琴",
                        id: 2
                    },
                    {
                        answer: "D、金、银、玉",
                        id: 3
                    }
                ], //当前题目答案选项
                questionIdList: [1,2,3,4,5,6,7,8,9,10], //返回的本次挑战题目所有数据的ID
                questionIndex: 0, //当前答题数组下标
            })
        }, 3000);
    },
    /**
     * 绘制加载进度
     */
    setLoad() {
        const that = this;
        let count = 0,eAngle=0;
        function animation() {
            if (count <= 300) {
                count+=30;
                eAngle = eAngle + Math.PI / 6;
                that.drawLoadCircle('#loop', 0, eAngle, 7, '#03d6b3');
                that.setData({
                    progress: Math.floor(count*100/360)
                })
            } else {
                let progress = that.data.done ? 100:99;
                that.drawLoadCircle('#loop', 0, progress*Math.PI/50, 7, '#03d6b3', function() {
                    that.setData({
                        progress: progress
                    });
                    
                    if(that.data.done) {
                        clearInterval(prigressTime);
                        prigressTime = null;
                        setTimeout(() => {
                            that.startCountdown();
                        }, 200);
                    }
                });
            }
        }
        clearInterval(prigressTime);
        prigressTime = setInterval(animation, 200);
    },
    /**绘制加载/倒计时背景圆环 */
    drawLoadCircle(domId, sAngle, eAngle, lineWidth, circleColor, callback) {
        const query = wx.createSelectorQuery();
        query.select(domId)
        .fields({ node: true, size: true })
        .exec((res) => {
            const canvas = res[0].node;
            canvas.width = 200;
            canvas.height = 200;
            const context = canvas.getContext('2d');

            // 绘制圆环
            context.save();
            context.strokeStyle = circleColor;
            context.beginPath();
            context.lineWidth = lineWidth;
            context.arc(100, 100, 90, sAngle, eAngle, false);
            context.stroke();
            context.closePath();
            context.restore();
            
            typeof callback == 'function' && callback();
        })
    },

    /**绘制倒计时圆环 */
    drawCountdownCircle(sAngle, eAngle, step, callback) {
        const query = wx.createSelectorQuery();
        query.select('#countDown')
        .fields({ node: true, size: true })
        .exec((res) => {
            const canvas = res[0].node;
            canvas.width = 200;
            canvas.height = 200;
            const context = canvas.getContext('2d');

            // 绘制圆环
            context.save();
            context.strokeStyle = '#ffffff';
            context.beginPath();
            context.lineWidth = 10;
            context.arc(100, 100, 90, sAngle, eAngle, false);
            context.stroke();
            context.closePath();
            context.restore();

            // 绘制倒计时文本
            context.save();
            let minute = Math.floor(step/60), second = step%60;
            minute = minute < 1 ? '00':minute<10?'0'+minute:minute;
            second = second < 1 ? '00':second<10?'0'+second:second;
            let time = `${minute}:${second}`;
            context.font = "bold 60px Arial";       // 设置字体大小
            context.fillStyle = "#ffffff";           // 设置文字颜色
            // 姓名（距左：间距 + 头像直径 + 间距）（距下：总高 - 间距 - 文字高 - 头像直径 + 下移一点 ）
            context.fillText(time, 145-(time.length*24), 120);
            context.restore();
            typeof callback == 'function' && callback();
        })
    },
    /**开始倒计时 */
    startCountdown(callback) {
        let that = this;
        let step = 30*60; // 计数动画次数
        that.drawLoadCircle('#countdownBg', 0, 2 * Math.PI, 10, 'rgba(255,255,255,0.4)');
        // 动画函数
        function animation() {
            if (step > 1) { // 30分钟
                step-=1;
                let eAngle = (step*Math.PI/900)-(0.5*Math.PI);
                that.drawCountdownCircle(-0.5*Math.PI, eAngle, step);
            } else {
                console.log("答题结束");
                clearInterval(countdownId);
            }
        };

        clearInterval(countdownId);
        countdownId = setInterval(animation, 1000);
        typeof callback == 'function' && callback();
    },
    resetPage() {
        const that = this;
        this.setData({
            meInfo: app.globalData.userInfo,
            done: false, // 是否加载完成
            progress: 0, // 加载进度

            subject: '', //当前题目名
            questionType: '', //题目类型 0：单选，1：多选
            questionTypeId: '', //题目类型ID
            questionId: '', // 当前题目ID
            questionImageUrl: '', //题目图片地址
            answerList: [], //当前题目答案选项
            questionIdList: [1,2,3,4,5,6,7,8,9,10], //返回的本次挑战题目所有数据的ID
            questionIndex: 0, //当前答题数组下标
        })
        setTimeout(function(){
            that.getToPic();
            that.setLoad();
        }, 500);
    },
    /**
     * 选择答案
     */
    selAnswer() {
        
    },
    /**
     * 下一题
     */
    nextTopic() {
        console.log("下一题")
    },
    /**
     * 上一题
     */
    prevTopic() {
        console.log("上一题")
    },
    /**
     * 提交答案
     */
    submitAnswer() {
        this.setData({
            subSuc: true
        })
        this.myModal.showModal("提交成功");
        clearInterval(countdownId);
        setTimeout(() => {
            this.myModal.hideModal();
            wx.redirectTo({
                url: '../week_result/index'
            })
        }, 500);
    }
})
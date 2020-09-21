// pages/fight/index.js
const app = getApp();
const Utils = require('../../utils/util.js');
let match_timer = null; // 匹配计时器
const START_ANGLE = 1.5 * Math.PI; // 起始弧度，单位弧度（在3点钟方向）
const END_ANGLE = -0.5 * Math.PI; // 终止弧度
let countdownId = null; // 答题倒计时计时器ID
let count = 0; // 倒计时累计秒数
let heartbeatTimerId = null; // 心跳计时器
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hint: "匹配中...",
        meInfo: null,
        rivalInfo: null,
        matchSuc: false, // 是否匹配成功
        isMatch: false, // 匹配
        enterAnswer: false, // 是否进入答题
        // meInfo: {
        //     header: "../../assets/images/test/logo.jpg",
        //     name: "水木青蓝",
        //     score: 60
        // },
        // rivalInfo: {
        //     header: "../../assets/images/test/me_logo.png",
        //     name: "小白",
        //     score: 80
        // },
        roomId: null, // 匹配房间id
        gameTime: 10, // 倒计时总时间（秒）
        userAnswerResultClass: '', // 用户选择答案的样式
        userAnswerResult: [], // 用户答题结果记录，答对1，答错0
        
        isAnswerLoaded: false, // 答案是否加载完成（动画完成）

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

        isGameOver: false, // 游戏是否正常结束
        showGameResult: false  // 是否显示比赛结果
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
        // 返回后，关闭计时器，避免后台继续调用题目接口
        clearInterval(countdownId);
        
        if (this.data.isGameOver) {
            
        } else {
            wx.closeSocket();
            // 提前退出，不能获取任何奖励
            Utils.showModal('提示', '您放弃了挑战!');
        }
        
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
    /**连接websocket */
    connectWebSocket() {
        let that = this;
        wx.connectSocket({
            url: Utils.service.wsUrl + '/' + app.globalData.userInfo.openid + '/2',
            success: res => {
                console.log("建立连接");
                that.initWebSocketListener();
            }
        });
    },
    /**初始化websocket监听 */
    initWebSocketListener() {
        let that = this;
        wx.onSocketOpen(res => {
            // that.sendHeartBeat();  // 发送心跳
            this.setData({
                isMatch: true
            });
            // 开始匹配对手
            const msg = JSON.stringify({
                status: 1,
                data: null
            })
            wx.sendSocketMessage({
                data: msg
            })
            // that.initCountUp();
        })
        wx.onSocketError(res => {
            clearInterval(heartbeatTimerId);
            Utils.showModal('提示', '连接到服务器失败', () => {
                wx.closeSocket();
                // that.connectWebSocket();
            });
        })
        wx.onSocketClose(res => {
            clearInterval(heartbeatTimerId);
        })
        wx.onSocketMessage(res => {
            const _this = this;
            var msg = JSON.parse(res.data);
            console.log("msg==>",msg);

            switch (msg.status) {
                case 2||'2':  // 匹配成功
                    // clearInterval(countUpTimerId);
                    _this.setData({
                        rivalInfo: {
                            ...res.data.enemyUser,
                            header: "../../assets/images/test/me_logo.png",
                            name: "小白",
                            score: 0
                        },
                        matchSuc: true,
                        roomId: msg.data.roomid,
                        questionIdList: msg.data.iusse
                    });
                    let timer = setTimeout(() => {
                        clearTimeout(timer);
                        _this.readyAnswer();
                    }, 200);
                    break;
                case 'challengelimit':
                    // that.cancelMatch();
                    // Utils.showModal('提示', '今日的挑战次数已用完！', () => {
                    //     wx.navigateBack();
                    // });
                    break;
            }
        });
    },
    /**计算匹配用时 */
    initCountUp() {
        countUpTimerId = setInterval(() => {
            let costTime = this.data.matchingCostTime;
            this.setData({
                matchingCostTime: costTime + 1
            })

            if (this.data.matchingCostTime == 15 && !this.data.isMatched) {
                this.cancelMatch();
                Utils.showModal('提示', '当前段位匹配人数不足，请选择其他段位进行匹配！', () => {
                    wx.navigateBack();
                })
            }
        }, 1000)
    },
    /**发送心跳 */
    sendHeartBeat() {
        heartbeatTimerId = setInterval(() => {
            wx.sendSocketMessage({
                data: JSON.stringify({
                    interfaceName: 'heart',
                    param: {}
                })
            })
        }, 5000);
    },
    /**
     * 匹配
     */
    getrival: function () {
        const _this = this;
        match_timer = setTimeout(function(){
            clearTimeout(match_timer);
            match_timer = null;
            _this.setData({
                rivalInfo: {
                    header: "../../assets/images/test/me_logo.png",
                    name: "小白",
                    score: 0
                },
                matchSuc: true
            })
            let timer1 = setTimeout(function() {
                clearTimeout(timer1);
                timer1 = null;
                _this.readyAnswer();
            },1500)
        },3000)
    },
    /**
     * 没匹配成功之前放弃对战
     */
    fqAgainst: function() {
        this.setData({
            isMatch: false
        })
        wx.closeSocket();
    },
    /**
     * 开始匹配
     */
    startMatch() {
        this.connectWebSocket();  // 建立socket连接，开始匹配

        // this.getrival();
    },
    resetPage() {
        this.setData({
            hint: "匹配中...",
            meInfo: {
                ...app.globalData.userInfo,
                score: 0
            },
            rivalInfo: null,
            matchSuc: false,
            isMatch: false
        })
    },
    /**
     * 进入答题
     */
    readyAnswer() {
        this.setData({
            enterAnswer: true
        })
        setTimeout(() => {
            this.drawCountdownBg();
            this.drawCountdownCircle();
        }, 200);
        this.initQuestion();
    },
    /**绘制倒计时背景 */
    drawCountdownBg() {
        const query = wx.createSelectorQuery();
        query.select('#countdownBg')
        .fields({ node: true, size: true })
        .exec((res) => {
            const canvas = res[0].node;
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d')
            ctx.lineWidth = 10; // 设置圆环的宽度
            ctx.strokeStyle = 'rgba(255,255,255, 0.3)'; // 设置圆环的颜色
            ctx.lineCap = 'butt'; // 设置圆环端点的形状
            ctx.beginPath(); //开始一个新的路径 
            ctx.arc(100, 100, 90, 0, 2 * Math.PI, true); //设置一个原点(100,100)，半径为90的圆的路径到当前路径
            ctx.stroke(); //对当前路径进行描边
        })
    },

    /**绘制倒计时圆环 */
    drawCountdownCircle(sAngle = START_ANGLE, eAngle = END_ANGLE, callback) {
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
            let time = this.data.gameTime - count+'';
            context.font = "bold 80px Arial";             // 设置字体大小
            context.fillStyle = "#ffffff";           // 设置文字颜色
            // 姓名（距左：间距 + 头像直径 + 间距）（距下：总高 - 间距 - 文字高 - 头像直径 + 下移一点 ）
            context.fillText(time, 100-(time.length*24), 130);
            context.restore();
            typeof callback == 'function' && callback();
        })
    },
    /**开始倒计时 */
    startCountdown(callback) {
        let that = this;
        let step = 0; // 计数动画次数
        let sAngle = START_ANGLE; // 起始弧度，单位弧度（在3点钟方向）
        let eAngle = END_ANGLE; // 终止弧度

        // 动画函数
        function animation() {
            if (step < 3) {
                eAngle = eAngle - 2 * Math.PI / that.data.gameTime;
                that.drawCountdownCircle(sAngle, eAngle, () => {
                    count++;
                });
                step++;
            } else {
                clearInterval(countdownId);

                // 如果倒计时结束，用户还未选择答案，也算答错
                // 记录每道题答题结果
                let userAnswerResult = that.data.userAnswerResult;
                userAnswerResult[that.data.questionIndex] = 0;
                that.setData({
                    userAnswerResult: userAnswerResult,
                });

                that.submitAnswerToServer(false);

                // 最后一题
                if (that.data.questionIndex + 1 >= that.data.questionIdList.length) {
                    that.gameOver();
                } else {
                    // setTimeout(() => {
                    //     that.getNextQuestion();
                    // }, 1000)
                }
            }
        };

        clearInterval(countdownId);
        countdownId = setInterval(animation, 1000);
        typeof callback == 'function' && callback();
    },

    /**初始化题目 */
    initQuestion() {
        let that = this;
        setTimeout(() => {
            that.startCountdown(() => {
                that.setData({
                    isAnswerLoaded: true
                })
            });
        }, 600)
    },

    /**获取下一道题目 */
    getNextQuestion() {
        let that = this;
        // 题目数组下标
        let questionIndex = that.data.questionIndex + 1;
        // 避免出现多余的题目
        if (questionIndex >= that.data.questionIdList.length) {
            that.gameOver();
        } else {
            let nextQuestionId = that.data.questionIdList[questionIndex];
            that.doGetNextQuestion(questionIndex, nextQuestionId);
        }
    },
    doGetNextQuestion(questionIndex, nextQuestionId) {
        console.log(`第${questionIndex}题`);
        let that = this;
        setTimeout(() => {
            that.setData({
                // answerList: res.returnData.answer,
                questionIndex: questionIndex,
            });
            setTimeout(() => {
                that.startCountdown(() => {
                    that.setData({
                        isAnswerLoaded: true
                    })
                });
            }, 1000)
        }, 600)
    },

    /**比赛结束 */
    gameOver() {
        let that = this;
        that.calculateIntegral(); // 计算挑战积分
        setTimeout(() => {
            console.log("游戏结束")
            that.setData({
                isGameOver: true,
                showGameResult: true
            })
        }, 1000)
    },
    /**
     * 计算得分
     */
    calculateIntegral() {
        
    },
    /**提交答案给后台 */
    submitAnswerToServer(isRightAnswer, callback) {
        
    },
    /** 单选 答题并提交结果 */
    submitAnswer(event) {
        let that = this;
        if (that.data.isAnswerLoaded) { // 答案加载完成后才能答题
            if(that.data.questionType=='0') {
                // 用户选择的答案
                let userAnswer = event.currentTarget.dataset.id;
                that.showAnswerResult(userAnswer)
            } else {

            }
        }
    },
    showAnswerResult(userAnswer) {

    }
})
// pages/fight/index.js
const app = getApp();
const Utils = require('../../utils/util.js');
let match_timer = null; // 匹配计时器
let startMatchTimer = null;
const START_ANGLE = 1.5 * Math.PI; // 起始弧度，单位弧度（在3点钟方向）
const END_ANGLE = -0.5 * Math.PI; // 终止弧度
let countdownId = null; // 答题倒计时计时器ID
let count = 0; // 倒计时累计秒数
let heartbeatTimerId = null; // 心跳计时器
let uid = null;
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

        roomId: null, // 匹配房间id
        gameTime: 10, // 倒计时总时间（秒）
        userAnswerResultClass: '', // 用户选择答案的样式
        userAnswerResult: [], // 用户答题结果记录，答对1，答错0
        
        isAnswerLoaded: false, // 答案是否加载完成（动画完成）
        questionList: [], // 返回的本次挑战题目所有数据的ID
        currentQuestion: {}, // 当前答题信息

        isGameOver: false, // 游戏是否正常结束
        showGameResult: false  // 是否显示比赛结果
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.resetPage();
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
        // 返回后，关闭计时器，避免后台继续调用题目接口
        clearInterval(countdownId);
        
        if (this.data.isGameOver||!this.data.matchSuc) {
            
        } else {
            wx.closeSocket();
            
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
    /**
     * 开始匹配
     */
    startMatch() {
        Utils.showLoading('进入匹配');
        let n = 0;
        startMatchTimer = setInterval(() => {
            n+=1;
            if(n>=10) {
                clearInterval(startMatchTimer);
                Utils.hideLoading();
            }
        }, 1000);
        this.connectWebSocket();  // 建立socket连接，开始匹配
    },
    /**连接websocket */
    connectWebSocket() {
        let that = this;
        uid = new Date().getTime().toString().slice(-5);
        wx.connectSocket({
            url: Utils.service.wsUrl + '/' + uid + '/2',
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
            Utils.hideLoading();
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
        })
        wx.onSocketError(res => {
            Utils.hideLoading();
            Utils.showModal('提示', '连接到服务器失败', () => {
                wx.closeSocket();
            });
        })
        wx.onSocketClose(res => {
            clearInterval(countdownId);
        })
        wx.onSocketMessage(res => {
            const _this = this;
            var msg = JSON.parse(res.data);
            switch (msg.status) {
                case 2||'2':  // 匹配成功
                    console.log("msg==>",msg.data);
                    _this.setData({
                        rivalInfo: {
                            ...res.data.enemyUser,
                            header: res.data.head||"../../assets/images/test/me_logo.png",
                            name: res.data.nickName,
                            score: 0
                        },
                        matchSuc: true,
                        roomId: msg.data.roomId,
                        questionList: msg.data.iusse
                    });
                    let timer = setTimeout(() => {
                        clearTimeout(timer);
                        _this.readyAnswer();
                    }, 200);
                    break;
                case 'challengelimit':
                    
                    // Utils.showModal('提示', '今日的挑战次数已用完！', () => {
                    //     wx.navigateBack();
                    // });
                    break;
            }
        });
    },
    /**
     * 进入答题
     */
    readyAnswer() {
        const that = this;
        const question = Object.assign({},this.data.questionList[0]);
        question.questionCategoryName = question.questionCategory=="1" ? "政治理论":
                                        question.questionCategory=="2" ? "政策":
                                        question.questionCategory=="3" ? "法律法规":
                                        "规章制度";
        question.questionTypeName = question.questionType=="1" ? "判断":
                                        question.questionType=="2" ? "单选":
                                        "多选";
        question.options = [
            { key: "option1", value: question.option1 },
            { key: "option2", value: question.option2 },
            { key: "option3", value: question.option3 },
            { key: "option4", value: question.option4 }
        ]
        console.log("question==>",question);
        this.setData({
            enterAnswer: true,
            currentQuestion: question
        })
        wx.nextTick(()=> {
            that.getCountdownCanvas(()=>{
                that.drawCountdownBg();
                that.startCountdown(() => {
                    that.setData({
                        isAnswerLoaded: true
                    })
                });
            })
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
            console.log(234);
            if (step < 10) {
                eAngle = eAngle - 2 * Math.PI / that.data.gameTime;
                that.drawCountdownCircle(sAngle, eAngle, () => {
                    count++;
                });
                step++;
            } else {
                clearInterval(countdownId);
                // 如果倒计时结束，用户还未选择答案，也算答错
                that.setData({
                    userAnswerResult: [],
                });
                that.showAnswerResult([],false);
                // 最后一题
                if (that.data.currentQuestion.num>= that.data.questionList.length) {
                    that.gameOver();
                } else {
                    setTimeout(() => {
                        that.getNextQuestion();
                    }, 1000)
                }
            }
        };
        clearInterval(countdownId);
        console.log(123);
        countdownId = setInterval(animation, 1000);
        typeof callback == 'function' && callback();
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
    resetPage() {
        this.setData({
            hint: "匹配中...",
            meInfo: {
                ...app.globalData.userInfo,
                score: 0
            },
            rivalInfo: null,
            matchSuc: false, // 是否匹配成功
            isMatch: false, // 匹配
            enterAnswer: false, // 是否进入答题
            
            roomId: null, // 匹配房间id
            gameTime: 10, // 倒计时总时间（秒）
            userAnswerResultClass: '', // 用户选择答案的样式
            userAnswerResult: [], // 用户答题结果记录，答对1，答错0
            rivalAnswerResult: [], // 对方答题结果
            questionList: [], //返回的本次挑战题目所有数据
            isAnswerLoaded: false, // 答案是否加载完成（动画完成）
            isShowRightAnswer: false, // 是否显示正确答案
            currentQuestion: {}, // 当前答题信息

            isGameOver: false, // 游戏是否正常结束
            showGameResult: false  // 是否显示比赛结果
        })
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

    getCountdownCanvas(callback) {
        const that = this;
        const query = wx.createSelectorQuery();
        query.select('#countDown')
        .fields({ node: true, size: true })
        .exec((res) => {
            const canvas = res[0].node;
            canvas.width = 200;
            canvas.height = 200;
            const context = canvas.getContext('2d');
            that.setData({
                countdownContext: context
            })
            wx.nextTick(() => {
                typeof callback == 'function' && callback();
            })
        })
    },

    /**绘制倒计时圆环 */
    drawCountdownCircle(sAngle = START_ANGLE, eAngle = END_ANGLE, callback) {
        countdownContext.fillStyle = 'rgba(0,0,0,0)';
        countdownContext.fillRect(0, 0, 200, 200)
        // 绘制圆环
        countdownContext.save();
        countdownContext.strokeStyle = '#ffffff';
        countdownContext.beginPath();
        countdownContext.lineWidth = 10;
        countdownContext.arc(100, 100, 90, sAngle, eAngle, false);
        countdownContext.stroke();
        countdownContext.closePath();
        countdownContext.restore();

        // 绘制倒计时文本
        countdownContext.save();
        let time = this.data.gameTime - count+'';
        countdownContext.font = "bold 80px Arial";             // 设置字体大小
        countdownContext.fillStyle = "#ffffff";           // 设置文字颜色
        // 姓名（距左：间距 + 头像直径 + 间距）（距下：总高 - 间距 - 文字高 - 头像直径 + 下移一点 ）
        countdownContext.fillText(time, 100-(time.length*24), 130);
        countdownContext.restore();
        typeof callback == 'function' && callback();
    },
    /**获取下一道题目 */
    getNextQuestion() {
        let that = this;
        // 题目数组下标
        let questionIndex = that.data.questionIndex + 1;
        // 避免出现多余的题目
        if (questionIndex >= that.data.questionList.length) {
            that.gameOver();
        } else {
            let nextQuestionId = that.data.questionList[questionIndex];
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
        setTimeout(() => {
            console.log("游戏结束")
            that.setData({
                isGameOver: true,
                showGameResult: true
            })
        }, 1000)
    },
    /** 单选 答题并提交结果 */
    submitAnswer(event) {
        if(count>=10) return false;
        let that = this;
        if (that.data.isAnswerLoaded) { // 答案加载完成后才能答题
            let userAnswer = event.currentTarget.dataset.id;
            let result = that.data.userAnswerResult;
            result.push(userAnswer);
            that.setData({
                userAnswerResult: result
            })
            if(that.data.currentQuestion.questionType!='3') { // 判断或者单选直接提交
                clearInterval(countdownId);
                let isRight = that.data.userAnswerResult.join(",")== that.currentQuestion.rightAnswer;
                this.setData({
                    isShowRightAnswer: true
                })
                // 用户选择的答案
                that.showAnswerResult(result,isRight)
            } else {

            }
        }
    },
    showAnswerResult(result,isRight) {
        let score = 0;
        switch (count) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                score = 100;
                break;
            case 7:
                score = 80;
                break;
            case 8:
                score = 60;
                break;
            case 9:
                score = 40;
                break;
            case 10:
                score = 20;
                break;
            default:
                break;
        }
        let meInfo = this.data.meInfo;
        meInfo.score = score;
        this.setData({
            meInfo:meInfo
        })
        const msg = JSON.stringify({
            status: 2,
            data: {
                uid: uid,
                num: this.currentQuestion.num,
                answer: result&&result.length?result.join(","):"",
                ansTime: count,
                score: score,
                yes: isRight,
                subjectId: this.currentQuestion.id
            }
        })
        wx.sendSocketMessage({
            data: msg
        })
        wx.nextTick(() =>{
            count = 0;
        })
    }
})
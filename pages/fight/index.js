// pages/fight/index.js
const app = getApp();
const Utils = require('../../utils/util.js');
let countdownId = null; // 答题倒计时计时器ID
let count = 0; // 倒计时累计秒数
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
        userAnswerResult: [], // 用户答题结果记录
        meisAnswer: false, // 我方是否完成答题
        rivalisAnswer: false, // 对方是否答题
        questionList: [], //返回的本次挑战题目所有数据
        isAnswerLoaded: false, // 答案是否加载完成（动画完成）
        isShowRightAnswer: false, // 是否显示正确答案
        currentQuestion: {}, // 当前答题信息

        isGameOver: false, // 游戏是否正常结束
        showGameResult: false  // 是否显示比赛结果
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        count = 0;
        this.resetPage();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // 保持屏幕常亮
        Utils.keepScreenOn();
        wx.hideShareMenu(); // 隐藏转发按钮
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
        const that = this;
        count = 0;
        clearInterval(countdownId);
        that.resetPage();
        if (that.data.isGameOver||!that.data.matchSuc) {
            
        } else {
            Utils.showModal('提示', '您放弃了挑战!');
        }
        wx.closeSocket();
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
        this.connectWebSocket();  // 建立socket连接，开始匹配
    },
    /**连接websocket */
    connectWebSocket() {
        let that = this;
        uid = new Date().getTime().toString().slice(-5);
        console.log("uid==>",uid)
        wx.connectSocket({
            url: Utils.service.wsUrl + '/' + uid + '/2',
            success: res => {
                that.initWebSocketListener();
            }
        });
    },
    /**初始化websocket监听 */
    initWebSocketListener() {
        const that = this;
        wx.onSocketOpen(res => {
            Utils.hideLoading();
            that.setData({
                isMatch: true
            });

            // 开始匹配对手
            wx.sendSocketMessage({
                data: JSON.stringify({
                    status: 1,
                    data: null
                })
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
            var msg = JSON.parse(res.data);
            console.log("msg==>",msg);
            switch (msg.status) {
                case 1||'1':
                    console.log("上线");
                    break;
                case 2||'2':  // 匹配成功
                    that.setData({
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
                        that.readyAnswer(0);
                    }, 200);
                    break;
                case 3||'3': // 对方答题
                    const rivalAnswer = msg.data.answer.split(",");
                    let question = Object.assign({},that.data.currentQuestion);
                    let rivalInfo = Object.assign({},that.data.rivalInfo);
                    if(rivalAnswer.length) {
                        console.log("rivalAnswer==>",rivalAnswer)
                        for (let i = 0; i < question.options.length; i++) {
                            const item = question.options[i];
                            if(rivalAnswer.indexOf(item.key)>=0) item.rivalActive = true;
                        }
                        that.setData({
                            currentQuestion: question,
                        })
                        wx.nextTick(() => {
                            console.log("question==>",that.data.currentQuestion);
                        })
                    }
                    rivalInfo.score = msg.data.score;
                    that.setData({
                        rivalInfo: rivalInfo,
                        rivalisAnswer: true
                    })
                    if(that.data.meisAnswer) {
                        console.log("敌方clear");
                        that.getNextQuestion();
                    }
                    break;
                case 4||'4': // 答题结束
                    break;
                case 5||'5': // 对方断线
                    break;   
            }
        });
    },
    /**
     * 进入答题
     */
    readyAnswer(index) {
        const that = this;
        that.setData({
            isAnswerLoaded: false
        })
        const question = Object.assign({},that.data.questionList[index]);
        question.questionCategoryName = question.questionCategory=="1" ? "政治理论":
                                        question.questionCategory=="2" ? "政策":
                                        question.questionCategory=="3" ? "法律法规":
                                        "规章制度";
        question.questionTypeName = question.questionType=="1" ? "判断":
                                        question.questionType=="2" ? "单选":
                                        "多选";
        let optFlag1 = question.rightAnswer.indexOf("option1")>=0, 
            optFlag2 = question.rightAnswer.indexOf("option2")>=0,
            optFlag3 = question.rightAnswer.indexOf("option3")>=0, 
            optFlag4 = question.rightAnswer.indexOf("option4")>=0;
            /**
             * 正确选项默认错误类名，用户选中才改为正确类名
             */
        question.options = [
            { key: "option1", value: question.option1, isRight: optFlag1, className: optFlag1? 'right':'error' }, 
            { key: "option2", value: question.option2, isRight: optFlag2, className: optFlag2? 'right':'error' },
            { key: "option3", value: question.option3, isRight: optFlag3, className: optFlag3? 'right':'error' },
            { key: "option4", value: question.option4, isRight: optFlag4, className: optFlag4? 'right':'error' }
        ]
        console.log("question==>",question);
        that.setData({
            enterAnswer: true,
            currentQuestion: question
        })
        wx.nextTick(()=> {
            if(index==0)that.drawCountdown('#countdownBg', 0, 2*Math.PI, 'rgba(255,255,255, 0.3)');
            that.startCountdown().then(()=> {
                that.setData({
                    isAnswerLoaded: true, // 题目加载完成
                    userAnswerResult: [], // 用户答题结果记录
                    meisAnswer: false, // 我方是否完成答题
                    rivalisAnswer: false, // 对方是否答题
                    isShowRightAnswer: false, // 是否显示正确答案
                })
            })
        })
    },
    /**开始倒计时 */
    startCountdown() {
        return new Promise((resolve,reject) => {
            let that = this;
            let sAngle = -0.5*Math.PI; // 起始弧度，单位弧度（在3点钟方向）
            let eAngle = 0; // 终止弧度

            // 动画函数
            function animation() {
                eAngle = ((that.data.gameTime-count)*2*Math.PI/that.data.gameTime)-0.5*Math.PI;
                that.drawCountdown('#countDown', sAngle, eAngle, '#ffffff', true).then(() => {
                    console.log("count==>",count)
                    if(count >= that.data.gameTime) {
                        console.log("倒计时clear")
                        that.getNextQuestion();
                    }
                })
            };
            clearInterval(countdownId);
            countdownId = setInterval(animation, 1000);
            resolve(true)
        })
    },
    /**获取下一道题目 */
    async getNextQuestion() {
        let that = this;
        that.setData({
            isShowRightAnswer: true
        });
        if(countdownId)clearInterval(countdownId);
        // 如果倒计时结束，用户还未选择答案，也算答错
        if(!that.data.meisAnswer) {
            await that.showAnswerResult([],false);
        }
        // 下一题
        let timer = setTimeout(() => {
            clearInterval(timer);
            count = 0;
            // 题目数组下标
            let questionIndex = that.data.currentQuestion.num;
            console.log(`第${questionIndex}题`);
            // 避免出现多余的题目
            if (questionIndex >= that.data.questionList.length) {
                that.gameOver();
            } else {
                that.readyAnswer(questionIndex);
            }
        }, 600)
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
            userAnswerResult: [], // 用户答题结果记录
            meisAnswer: false, // 我方是否完成答题
            rivalisAnswer: false, // 对方是否答题
            questionList: [], //返回的本次挑战题目所有数据
            isAnswerLoaded: false, // 答案是否加载完成（动画完成）
            isShowRightAnswer: false, // 是否显示正确答案
            currentQuestion: {}, // 当前答题信息

            isGameOver: false, // 游戏是否正常结束
            showGameResult: false  // 是否显示比赛结果
        })
    },
    /**绘制倒计时圆环 */
    drawCountdown(domId, sAngle, eAngle, color, isTime) {
        return new Promise((resolve,reject) => {
            const query = wx.createSelectorQuery();
            query.select(domId)
            .fields({ node: true, size: true })
            .exec((res) => {
                count+=1;
                const canvas = res[0].node;
                canvas.width = 200;
                canvas.height = 200;
                const ctx = canvas.getContext('2d')
                ctx.lineWidth = 10; // 设置圆环的宽度
                ctx.strokeStyle = color; // 设置圆环的颜色
                ctx.lineCap = 'butt'; // 设置圆环端点的形状
                ctx.beginPath(); //开始一个新的路径 
                ctx.arc(100, 100, 90, sAngle, eAngle, false); //设置一个原点(100,100)，半径为90的圆的路径到当前路径
                ctx.stroke(); //对当前路径进行描边
                if(isTime) {
                    let time = this.data.gameTime - count+'';
                    ctx.font = "bold 80px Arial";             // 设置字体大小
                    ctx.fillStyle = "#ffffff";           // 设置文字颜色
                    // 姓名（距左：间距 + 头像直径 + 间距）（距下：总高 - 间距 - 文字高 - 头像直径 + 下移一点 ）
                    ctx.fillText(time, 100-(time.length*24), 130);
                }
                resolve(true);
            })
        })
    },

    /**比赛结束 */
    gameOver() {
        let that = this;
        setTimeout(() => {
            console.log("游戏结束");
            wx.closeSocket();
            that.setData({
                isGameOver: true,
                showGameResult: true
            })
        }, 1000)
    },
    /** 单选 答题并提交结果 */
    submitAnswer(event) {
        let that = this;
        // if(count>=10 || that.data.meisAnswer) return false;
        if (that.data.isAnswerLoaded) { // 答案加载完成后才能答题
            let userAnswerIndex = event.currentTarget.dataset.id;
            let question = that.data.currentQuestion;
            let selOpt = question.options[userAnswerIndex];
            selOpt.meActive = true;
            selOpt.className = selOpt.isRight?'right':'error'
            let result = that.data.userAnswerResult;
            result.push(selOpt.key);
            that.setData({
                userAnswerResult: result,
                currentQuestion: question
            })
            if(that.data.currentQuestion.questionType!='3') { // 判断或者单选直接提交
                // 用户选择的答案
                let isRight = result.length&&(result.join(",") == that.data.currentQuestion.rightAnswer);
                that.showAnswerResult(result,isRight);
            }
        }
    },
    doubleSub() {
        // 用户选择的答案
        let result = that.data.userAnswerResult;
        let isRight = result.length&&(result.join(",") == that.data.currentQuestion.rightAnswer);
        this.showAnswerResult(result,isRight);
    },
    showAnswerResult(result,isRight) {
        const that = this;
        that.setData({
            meisAnswer: true
        })
        let score = 0;
        if(isRight) {
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
        } 
        let meInfo = that.data.meInfo;
        meInfo.score = score;
        that.setData({
            meInfo: meInfo
        })
        const msg = JSON.stringify({
            status: 2,
            data: {
                uid: uid,
                num: that.data.currentQuestion.num,
                answer: result&&result.length?result.join(","):"",
                ansTime: count,
                score: score,
                yes: isRight,
                subjectId: that.data.currentQuestion.id
            }
        })
        console.log("msg==>",msg)
        wx.sendSocketMessage({
            data: msg
        })
        console.log("that.data.rivalisAnswer==>",that.data.rivalisAnswer)
        
        console.log("我方答题")
        if(that.data.rivalisAnswer) {
            console.log("我方clear");
            that.getNextQuestion()
        }
    }
})
// pages/fight/index.js
const app = getApp();
const Utils = require('../../utils/util.js');
let matchTimer = null; // 匹配计时器
let allowNext = true; // 是否允许进入下一题
let countdownId = null; // 答题倒计时计时器ID
let count = 0; // 倒计时累计秒数
let activeResult=[]; // 用户选择结果
let isRunAway = false; // 逃跑
import { matchApi } from "../../utils/server/request";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        indexSwichText: {
            0: 'A',
            1: 'B',
            2: 'C',
            3: 'D',
        },
        startNumber: 60,
        isAllow: false,  // 是否可以进行匹配对战
        hint: "匹配中...",
        meInfo: null,
        rivalInfo: null,
        connectSocket: false,
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
        questionIndex: 0,  // 当前题目下标
        isSubDouble: false,  // 多选是否提交

        isGameOver: false, // 游戏是否正常结束
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        countdownId = null; // 答题倒计时计时器ID
        count = 0; // 倒计时累计秒数
        activeResult=[]; // 用户选择结果
        isRunAway = false; // 逃跑

        this.setData({
            meInfo: {
                ...app.globalData.userInfo,
                score: 0
            }
        })
        wx.nextTick(() => {
            this.getAllowMatch();
        })
    },
    async getAllowMatch() {
        Utils.showLoading();
        try {
            const result = await matchApi(this.data.meInfo.userId);
            Utils.hideLoading();
            if(result.code!==1) {
                wx.showModal({
                    showCancel: false,
                    content: result.msg,
                    title: '提示',
                    success() {
                        wx.navigateBack();
                    }
                })
                return;
            } else  {
                this.setData({
                    isAllow: true
                })
            }
        } catch (error) {
            Utils.hideLoading()
        }
            
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
        matchTimer && clearTimeout(matchTimer);
        // 返回后，关闭计时器，避免后台继续调用题目接口
        const that = this;
        if (that.data.isGameOver||!that.data.isMatch) {
            
        } else {
            Utils.showToast('您放弃了挑战!');
            this.fqAgainst()
            wx.closeSocket();
        }
    },
    accordCloseSocket() {
        wx.sendSocketMessage({
            data: JSON.stringify({
                status: 4,
                data: 'close'
            })
        });
        clearInterval(countdownId);
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
        const that = this;
        console.log("开始匹配")
        // 开始匹配对手
        wx.sendSocketMessage({
            data: JSON.stringify({
                status: 1,
                data: null
            })
        })
        this.setData({
            isMatch: true
        });
        let n=0;
        matchTimer && clearTimeout(matchTimer);
        matchTimer = setInterval(() => {
            // 60 秒 没有匹配到结束匹配
            if(n>= 60) { // 分钟
                clearTimeout(matchTimer);
                matchTimer = null;
                Utils.showToast('暂未匹配到符合条件的对手，请稍后再试');
                that.fqAgainst();
            }
            const startNumber = this.data.startNumber - 1
            this.setData({
                startNumber
            })
            n+=1;
        }, 1000);
    },
    /**连接websocket */
    connectWebSocket() {
        Utils.showLoading();
        const that = this;
        try {
            wx.closeSocket()
        } catch (error) {
            console.log("socket未连接")
        }
        setTimeout(() => {
            wx.connectSocket({
                url: Utils.service.wsUrl + '/' + that.data.meInfo.userId + '/2',
                success: res => {
                    that.initWebSocketListener(); // 监听socket
                }
            });
        }, 500);
    },
    /**初始化websocket监听 */
    initWebSocketListener() {
        const that = this;
        wx.onSocketOpen(res => {
            console.log("建立连接");
            Utils.hideLoading();
            that.startMatch()
        })
        wx.onSocketError(res => {
            Utils.hideLoading();
            Utils.showModal('提示', '连接到服务器失败', () => {
                // that.connectWebSocket()
            });
        })
        wx.onSocketClose(res => {
            console.log("关闭")
            clearInterval(countdownId);
        })
        wx.onSocketMessage(res => {
            var msg = JSON.parse(res.data);
            console.log("接收==>",msg)
            switch (msg.status) {
                case 1||'1':
                    console.log("上线");
                    break;
                case 2||'2':  // 匹配成功
                    clearInterval(matchTimer);
                    matchTimer = null;
                    that.setData({
                        rivalInfo: {
                            ...msg.data.enemyUser,
                            score: 0
                        },
                        matchSuc: true,
                        roomId: msg.data.roomId,
                        questionList: msg.data.iusse
                    });
                    wx.nextTick(() => {
                        that.readyAnswer(that.data.questionIndex);
                    })
                    break;
                case 3||'3': // 对方答题
                    const rivalAnswer = msg.data.answer.split(",");
                    let question = Object.assign({},that.data.currentQuestion);
                    let rivalInfo = Object.assign({},that.data.rivalInfo);
                    if(rivalAnswer.length) {
                        for (let i = 0; i < question.options.length; i++) {
                            const item = question.options[i];
                            if(rivalAnswer.indexOf(item.key)>=0) {
                                item.rivalActive = true;
                            }
                        }
                        that.setData({
                            currentQuestion: question,
                        })
                    }
                    rivalInfo.score += msg.data.score;
                    that.setData({
                        rivalInfo: rivalInfo,
                        rivalisAnswer: true
                    })
                    if(that.data.meisAnswer) {
                        that.getNextQuestion();
                    }
                    break;
                case 4||'4': // 答题结束
                    that.gameOver(msg.data);
                    break;
                case 5||'5': // 对方逃跑
                    Utils.showToast("对方逃跑");
                    clearInterval(countdownId);
                    isRunAway = true;
                    wx.sendSocketMessage({
                        data: JSON.stringify({
                            status: 3,
                            data: null
                        })
                    })
                    break;
                case 6||'6': // 对方逃跑
                    Utils.showModal('提示', '抱歉，服务器爆满，请稍后重试!');
                    that.fqAgainst();
                    break;
            }
        });
    },
    /**
     * 进入答题
     */
    readyAnswer(index) {
        console.log(`第${index+1}题`)
        const that = this;
        that.setData({
            isAnswerLoaded: false
        });
        if(!that.data.questionList[index]) return;
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
        that.setData({
            enterAnswer: true,
            currentQuestion: question
        }, () => {
            // 防止 enterAnswer 没有设置完成就执行方法
            wx.nextTick(()=> {
                if(index==0)that.drawCountdown('#countdownBg', 0, 2*Math.PI, 'rgba(255,255,255, 0.3)');
                that.drawCountdown('#countDown', -0.5*Math.PI, 1.5*Math.PI, '#ffffff', true);
                let rivalInfo = that.data.rivalInfo, meInfo = that.data.meInfo;
                // rivalInfo.score = 0; meInfo.score = 0;
                activeResult = [];
                that.setData({
                    isAnswerLoaded: true, // 题目加载完成
                    userAnswerResult: [], // 用户答题结果记录
                    meisAnswer: false, // 我方是否完成答题
                    rivalisAnswer: false, // 对方是否答题
                    isShowRightAnswer: false, // 是否显示正确答案
                    isSubDouble: false,  // 多选是否提交
                    meInfo: meInfo,  // 切题重置分数
                    rivalInfo: rivalInfo,
                })
                that.startCountdown();  // 开始画圆
            })
        })
        // wx.nextTick(()=> {
        //     if(index==0)that.drawCountdown('#countdownBg', 0, 2*Math.PI, 'rgba(255,255,255, 0.3)');
        //     that.drawCountdown('#countDown', -0.5*Math.PI, 1.5*Math.PI, '#ffffff', true);
        //     let rivalInfo = that.data.rivalInfo, meInfo = that.data.meInfo;
        //     rivalInfo.score = 0; meInfo.score = 0;
        //     activeResult = [];
        //     that.setData({
        //         isAnswerLoaded: true, // 题目加载完成
        //         userAnswerResult: [], // 用户答题结果记录
        //         meisAnswer: false, // 我方是否完成答题
        //         rivalisAnswer: false, // 对方是否答题
        //         isShowRightAnswer: false, // 是否显示正确答案
        //         isSubDouble: false,  // 多选是否提交
        //         meInfo: meInfo,  // 切题重置分数
        //         rivalInfo: rivalInfo,
        //     })
        //     that.startCountdown();  // 开始画圆
        // })
    },
    /**开始倒计时 */
    startCountdown() {
        let that = this;
        let sAngle = -0.5*Math.PI; // 起始弧度，单位弧度（在3点钟方向）
        let eAngle = 0; // 终止弧度

        // 动画函数
        function animation() {
            count = count>=that.data.gameTime?that.data.gameTime:(count+1);
            eAngle = ((that.data.gameTime-count)*2*Math.PI/that.data.gameTime)-0.5*Math.PI;
            that.drawCountdown('#countDown', sAngle, eAngle, '#ffffff', true).then(() => {
                if(count >= that.data.gameTime) {
                    that.getNextQuestion();
                }
            })
        };
        clearInterval(countdownId);
        console.log("开始")
        countdownId = setInterval(animation, 1000);
    },
    /**获取下一道题目 */
    async getNextQuestion() {
        let that = this;
        if(!allowNext||(that.data.questionIndex >= that.data.questionList.length)) return;
        allowNext = false;
        let timer1 = setTimeout(() => {
            clearTimeout(timer1)
            allowNext = true
        }, 800);
        if(countdownId){
            clearInterval(countdownId);
        }
        // 如果倒计时结束，用户还未选择答案，也算答错
        if(!that.data.meisAnswer) {
            await that.showAnswerResult([],false,'auto');
        }
        // 下一题
        let timer = setTimeout(() => {
            clearInterval(timer);
            count = 0;
            // 题目数组下标
            let questionIndex = that.data.questionIndex+1;
            that.setData({
                questionIndex: questionIndex
            })
            // 避免出现多余的题目
            if ((questionIndex >= that.data.questionList.length)||isRunAway) {
                console.log("等待服务端发送结果");
            } else {
                that.readyAnswer(questionIndex);
            }
        }, 600)
    },
    /**
     * 没匹配成功之前放弃对战
     */
    fqAgainst: function() {
        matchTimer && clearTimeout(matchTimer);
        this.setData({
            isMatch: false,
            startNumber: 60,
        })
        this.accordCloseSocket();
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
            questionIndex: 0,  // 当前答题下标
            isSubDouble: false,  // 多选是否提交

            isGameOver: false, // 游戏是否正常结束
        })
    },
    /**绘制倒计时圆环 */
    drawCountdown(domId, sAngle, eAngle, color, isTime) {
        return new Promise((resolve,reject) => {
            const query = wx.createSelectorQuery();
            query.select(domId)
            .fields({ node: true, size: true })
            .exec((res) => {
                const canvas = res[0].node;
                canvas.width = 200;
                canvas.height = 200;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0,0,200,200);
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
    gameOver(data) {
        let that = this;
        if(that.data.isGameOver) return;
        that.setData({
            isGameOver: true
        })
        let fightResult = {};
        if(that.data.meInfo.userId == data.homeUId) {
            fightResult = {
                homeExperience: data.homeExperience,
                homeScore: data.homeScore,
                homeResult: data.homeResult,
                homeUId: data.homeUId,
                awayExperience: data.awayExperience,
                awayResult: data.awayResult,
                awayScore: data.awayScore,
                awayUId: data.awayUId,
                beginTime: data.beginTime,
                endTime: data.endTime
            }
        } else {
            fightResult = {
                homeExperience: data.awayExperience,
                homeScore: data.awayScore,
                homeResult: data.awayResult,
                homeUId: data.awayUId,
                awayExperience: data.homeExperience,
                awayScore: data.homeScore,
                awayResult: data.homeResult,
                awayUId: data.homeUId,
                beginTime: data.beginTime,
                endTime: data.endTime,
                roomId: data.roomId
            }
        }
        fightResult.homeName = that.data.meInfo.name;
        fightResult.homeHead = that.data.meInfo.avatarUrl;
        fightResult.awayName = that.data.rivalInfo.name;
        fightResult.awayHead = that.data.rivalInfo.headUrl;
        
        wx.setStorage({
            key: 'roomId',
            data: fightResult,
            success: (result) => {}
        });
        wx.closeSocket();
        wx.nextTick(() => {
            console.log("游戏结束");
            wx.redirectTo({
                url: `/pages/fight_result/index?roomId=${data.roomId}`
            });
        })
    },
    /** 单选 答题并提交结果 */
    submitAnswer(event) {
        let that = this;
        console.log('>>>>> submitAnswer', count, that.data.meisAnswer, that.data.isAnswerLoaded)
        if(count>=10 || that.data.meisAnswer) return false;
        if (that.data.isAnswerLoaded) { // 答案加载完成后才能答题
            let userAnswerIndex = event.currentTarget.dataset.id;
            let question = that.data.currentQuestion;
            let selOpt = question.options[userAnswerIndex];
            
            const findIndex = activeResult.findIndex(v=>v==selOpt.key); // 多选可取消
            if(findIndex>=0) {
                selOpt.meActive = false;
                activeResult.splice(findIndex,1);
            }else{
                selOpt.meActive = true;
                activeResult.push(selOpt.key);
            }
            that.setData({
                userAnswerResult: activeResult,
                currentQuestion: question
            })
            if(that.data.currentQuestion.questionType!='3') { // 判断或者单选直接提交
                // 用户选择的答案
                let isRight = activeResult.length&&(activeResult.join(",") == that.data.currentQuestion.rightAnswer);
                that.showAnswerResult(activeResult,isRight);
            }
        }
    },
    doubleSub() {
        const that = this;
        // 用户选择的答案
        that.setData({
            isSubDouble: true
        })
        // 判断答案是否正确
        let isRight = false
        if (activeResult.length > 0) {
            const rightAnswer = that.data.currentQuestion.rightAnswer.split(',')
            isRight = (activeResult.length === rightAnswer.length && activeResult.every(item => rightAnswer.includes(item)))
        }
        this.showAnswerResult(activeResult,isRight);
    },
    showAnswerResult(result,isRight, type='self') {
        const that = this;
        that.setData({
            meisAnswer: true,
            isShowRightAnswer: true
        })
        let score = 0;
        if(isRight) {
            switch (count) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    score = 100;
                    break;
                case 6:
                    score = 80;
                    break;
                case 7:
                    score = 60;
                    break;
                case 8:
                    score = 40;
                    break;
                case 9:
                case 10:
                    score = 20;
                    break;
                default:
                    break;
            }
            if(that.data.currentQuestion.questionType=='3')score=2*score;
        } 
        // console.log('>>> isRight',result, isRight, count, score)
        let meInfo = that.data.meInfo;
        meInfo.score += score;
        that.setData({
            meInfo: meInfo
        })
        const msg = JSON.stringify({
            status: 2,
            data: {
                uid: that.data.meInfo.userId,
                num: that.data.currentQuestion.num,
                answer: result&&result.length?result.join(","):"",
                ansTime: count,
                score: score,
                yes: isRight,
                subjectId: that.data.currentQuestion.id
            }
        });
        console.log("send==>",msg)
        wx.sendSocketMessage({
            data: msg
        })
        if(that.data.rivalisAnswer&&type!='auto') {
            that.getNextQuestion()
        }
    }
})

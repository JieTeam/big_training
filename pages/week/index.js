// pages/week/index.js
const app = getApp();
const Utils = require('../../utils/util.js');
let progressTime = null;
let countdownId = null; // 答题倒计时计时器ID
let cutTopic = true; // 是否可以切题
let trainStartTime = "", trainStartTimeNum=0, trainEndTime = "", trainEndTimeNum=0; // 答题开始结束时间
let trainId = null;
let gameTime = '', step = 0;
import { getWeektoPicApi, subWeekAnswerApi, startWeekAnswerApi } from "../../utils/server/request";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        done: false, // 是否加载完成
        progress: 0, // 加载进度
        topicData: {}, // 抽取题目信息
        currentQuestion: {}, // 当前答题信息
        questionList: [], //返回的本次挑战题目所有数据的ID
        questionIndex: 0, //当前答题数组下标
        subSuc: false,
        meInfo: {},
        indexSwichText: {
            0: 'A',
            1: 'B',
            2: 'C',
            3: 'D',
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        this.setData({
            meInfo: app.globalData.userInfo
        })
        this.getToPic();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.myModal = this.selectComponent('#myModal');
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
        if(progressTime) clearInterval(progressTime);  // 清除加载计时器
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
     * 抽取题目
     */
    async getToPic() {
        const that = this;
        that.setLoad();
        try {
            const result = await getWeektoPicApi({
                userId: app.globalData.userInfo.userId
            });
            console.log("题目数据==》",result);
            if(result.code!==1) {
                clearInterval(progressTime);
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    wx.navigateBack();
                }, 1000);
            } else {
                that.setData({
                    topicData: result.data,
                    questionList: result.data.questionList
                })
                wx.nextTick(() => {
                    trainId = result.data.trainId;
                    that.readyAnswer(0);
                });
            }
        } catch (error) {
            wx.showToast({
                title: "当前用户访问量大，请稍候再试！",
                icon: 'none',
                duration: 1000
            })
            clearInterval(progressTime);
            let timer = setTimeout(() => {
                clearTimeout(timer);
                wx.navigateBack();
            }, 1000);
        }
    },
    /**
     * 进入答题
     * @param {trainId} 训练记录ID 
     */
    async startWeekAnswer () {
        const res = await startWeekAnswerApi(trainId);
    },
    /**
     * 获取当前题目
     */
    readyAnswer(index) {
        const that = this;
        const questionList = that.data.questionList;
        if(!questionList[index]) return;
        const question = Object.assign({},questionList[index]);
        if(!question.init) {
            question.questionCategoryName = question.questionCategory===1 ? "政治理论":
                                            question.questionCategory===2 ? "政策":
                                            question.questionCategory===3 ? "法律法规":
                                            "规章制度";
            question.questionTypeName = question.questionType===1 ? "判断":
                                            question.questionType===2 ? "单选":
                                            "多选";
            let optFlag1 = question.rightAnswer.indexOf("option1")>=0, 
                optFlag2 = question.rightAnswer.indexOf("option2")>=0,
                optFlag3 = question.rightAnswer.indexOf("option3")>=0, 
                optFlag4 = question.rightAnswer.indexOf("option4")>=0;
                /**
                 * 正确选项默认错误类名，用户选中才改为正确类名
                 */
            question.options = question.questionType===1?[
                { key: "option1", value: question.option1, isRight: optFlag1, className: optFlag1? 'right':'error' }, 
                { key: "option2", value: question.option2, isRight: optFlag2, className: optFlag2? 'right':'error' }
            ]:[
                { key: "option1", value: question.option1, isRight: optFlag1, className: optFlag1? 'right':'error' }, 
                { key: "option2", value: question.option2, isRight: optFlag2, className: optFlag2? 'right':'error' },
                { key: "option3", value: question.option3, isRight: optFlag3, className: optFlag3? 'right':'error' },
                { key: "option4", value: question.option4, isRight: optFlag4, className: optFlag4? 'right':'error' }
            ]
            question.init = true;
            questionList[index] = question;
            that.setData({
                questionList: questionList
            })
        } 
        that.setData({
            questionIndex: index,
            currentQuestion: question
        })
        if(index===0) {
            that.setData({
                done: true
            })
            let time = new Date();
            trainStartTimeNum = time.getTime()+200;
            trainStartTime = Utils.dateFormat(time);
        }
    },
    /**
     * 绘制加载进度
     */
    setLoad() {
        const that = this;
        let count = 0,eAngle=0;
        function animation() {
            if (count <= 320) {
                count+=20;
                eAngle = eAngle + Math.PI / 18;
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
                        clearInterval(progressTime);
                        progressTime = null;
                        setTimeout(() => {
                            that.startCountdown();
                            that.startWeekAnswer();
                        }, 200);
                    }
                });
            }
        }
        clearInterval(progressTime);
        progressTime = setInterval(animation, 200);
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
            context.clearRect(0,0,200,200);
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
    drawCountdownCircle(sAngle, eAngle, callback) {
        const query = wx.createSelectorQuery();
        query.select('#countDown')
        .fields({ node: true, size: true })
        .exec((res) => {
            if(!(res&&res[0]&&res[0].node)) return;
            const canvas = res[0].node;
            canvas.width = 200;
            canvas.height = 200;
            const context = canvas.getContext('2d');
            context.clearRect(0,0,200,200)

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
            let minute = Math.floor(step/6000), second = Math.floor((step%6000)/100), second1 = (step%6000)%100;
            minute = minute < 1 ? '00':minute<10?'0'+minute:minute;
            second = second < 1 ? '00':second<10?'0'+second:second;
            second1 = second1 < 1 ? '00':second1<10?'0'+second1:second1;
            // let time = `${minute}:${second}:${second1}`;
            let time = `${minute}:${second}`;


            // 用时统计
            let useTime = 1800-Math.ceil(step/100);
            let useMinute = Math.floor(useTime/60), useSecond = Math.floor(useTime%60);
            useMinute = useMinute < 1 ? '00':useMinute<10?'0'+useMinute:useMinute;
            useSecond = useSecond < 1 ? '00':useSecond<10?'0'+useSecond:useSecond;
            gameTime = `${useMinute}:${useSecond}`;

            context.font = "bold 40px Arial";       // 设置字体大小
            context.fillStyle = "#ffffff";           // 设置文字颜色
            // 姓名（距左：间距 + 头像直径 + 间距）（距下：总高 - 间距 - 文字高 - 头像直径 + 下移一点 ）
            context.fillText(time, 148-(time.length*16)-16, 110);
            context.restore();
            typeof callback == 'function' && callback();
        })
    },
    /**开始倒计时 */
    startCountdown(callback) {
        let that = this;
        step = 30*60*100; // 计数动画次数
        // let step = 200 // 计数动画次数
        that.drawLoadCircle('#countdownBg', 0, 2 * Math.PI, 10, 'rgba(255,255,255,0.4)');
        // 动画函数
        function animation() {
            if (step > 1) { // 30分钟
                step-=1;
                let eAngle = (step*Math.PI/90000)-(0.5*Math.PI);
                that.drawCountdownCircle(-0.5*Math.PI, eAngle);
            } else {
                let time = new Date();
                trainEndTimeNum = time.getTime();
                that.submitAnswer();
                clearInterval(countdownId);
            }
        };

        clearInterval(countdownId);
        countdownId = setInterval(animation, 10);
        typeof callback == 'function' && callback();
    },
    /**
     * 选择答案
     */
    selAnswer(event) {
        let that = this;
        if(that.data.currentQuestion.isAnswer) return;
        const questionList = that.data.questionList;
        let userAnswerIndex = event.currentTarget.dataset.id;
        let question = Object.assign({},that.data.currentQuestion);

        question.activeResult = question.activeResult || [];
        let selOpt = question.options[userAnswerIndex];
        
        const findIndex = question.activeResult.findIndex(v=>v==selOpt.key); // 多选可取消
        if(findIndex>=0) {
            selOpt.active = false;
            question.activeResult.splice(findIndex,1);
        }else{
            selOpt.active = true;
            question.activeResult.push(selOpt.key);
        }

        question.userOption = question.activeResult.length?question.activeResult.join(","):'';
        question.answerRight = false
        if (question.userOption) {
            const userOptionArr = question.userOption.split(',')
            const rightAnswerArr = that.data.currentQuestion.rightAnswer.split(',')
            question.answerRight = (userOptionArr.length === rightAnswerArr.length && userOptionArr.every(item => rightAnswerArr.includes(item)))
        }
        if(question.questionType!=3) {
            question.isAnswer = true;
            question.score = question.answerRight? 3:0;
        } else {
            question.score = question.answerRight? 5:0;
        }
        questionList[that.data.questionIndex] = question;
        that.setData({
            currentQuestion: question,
            questionList: questionList
        })
    },
    /**
     * 下一题
     */
    nextTopic() {
        if(!cutTopic) return;
        if(!this.data.currentQuestion.isAnswer) {
            Utils.showModal('提示', '请确保当前题目已答题完毕！');
            return;
        }
        cutTopic = false;
        let tiemr = setTimeout(() => {
            cutTopic = true;
        }, 600);

        let index = this.data.questionIndex+1;
        if(index<this.data.questionList.length) {
            this.readyAnswer(index)
        } else {
            trainEndTimeNum = trainStartTimeNum+((1800-Math.ceil(step/100))*1000);
            trainEndTime = Utils.dateFormat(trainEndTimeNum);
            this.submitAnswer()
        }
    },
    /**
     * 上一题
     */
    prevTopic() {
        if(!cutTopic) return;
        cutTopic = false;
        let tiemr = setTimeout(() => {
            cutTopic = true;
        }, 600);

        let index = this.data.questionIndex-1;
        if(index>=0)this.readyAnswer(index)
    },
    /**
     * 多选题确认答案
     */
    sureAnswer() {
        const that = this;
        if(!this.data.currentQuestion.activeResult || this.data.currentQuestion.activeResult.length === 0) {
            Utils.showModal('提示', '请确保当前题目已答题完毕！');
            return;
        }
        let question = Object.assign({},that.data.currentQuestion);
        const questionList = that.data.questionList;
        question.isAnswer = true;
        questionList[that.data.questionIndex] = question;
        that.setData({
            currentQuestion: question,
            questionList: questionList
        })
    },
    /**
     * 提交答案
     */
    async submitAnswer() {
        wx.showLoading({
          title: '答案提交中...',
        })
        const that = this;
        this.setData({
            subSuc: true
        });
        clearInterval(countdownId);
        const topicData = Object.assign({},that.data.topicData);
        delete topicData.questionList;
        topicData.trainStartTime = trainStartTime;
        topicData.trainEndTime = trainEndTime;
        topicData.trainCostTime = Math.floor((trainEndTimeNum-trainStartTimeNum)/10);
        const questionList = Object.assign([],that.data.questionList);
        // const rightList = questionList.filter(v=>{
        //     return v.answerRight
        // }).map(v=>{
        //     return {
        //         questionId: v.id,
        //         userOption: v.userOption
        //     }
        // })
        // const wrongList = questionList.filter(v=>{
        //     return !v.answerRight
        // }).map(v=>{
        //     return {
        //         questionId: v.id,
        //         userOption: v.userOption
        //     }
        // })
        // topicData.rightList = rightList;
        // topicData.wrongList = wrongList;
        topicData.questionList = questionList;
        let scoreTotal = 0, rightNum = 0;
        for (let i = 0; i < questionList.length; i++) {
            const element = questionList[i];
            scoreTotal += (element.score?element.score:0);
            rightNum += (element.answerRight?1:0);
        }
        topicData.trainScore = scoreTotal;
        wx.setStorage({
            key: 'weekTestRes',
            data: {
                trainScore: scoreTotal,
                gameTime: gameTime,
                accuracy: `${rightNum}/${questionList.length}`
            },
            success: (result) => {}
        });
        const result = await subWeekAnswerApi(topicData);
        wx.hideLoading({
          success: (res) => {},
        })
        if(result.code!==1) return;
        this.myModal.showModal("提交成功");
        
        setTimeout(() => {
            this.myModal.hideModal();
            wx.redirectTo({
                url: '../week_result/index'
            })
        }, 500);
    }
})
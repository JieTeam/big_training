const moment = require('moment');
const request = require('./server/request');
// 系统参数
const systemInfo = wx.getSystemInfoSync();

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const throttle = (fn,interval) =>{
    let canRun = true;
    return function(){
        if(!canRun) return;
        canRun = false;
        setTimeout(function() {
            fn.apply(this,arguments);
            canRun = true;
        },interval||300);
    }
}
const isNullOrUndefined = (obj) =>{
    return obj===null || obj === undefined
}
const dateFormat = (date, type="YYYY-MM-DD HH:mm:ss")=> {
    if (typeof date === "string") {
        date = date.replace(/-/g,"/");
    }
    let time = moment(new Date(date)).format(type);
    return time;
}

module.exports = {
    WIN_WIDTH: systemInfo.screenWidth,
    WIN_HEIGHT: systemInfo.screenHeight,
    IS_IOS: /ios/i.test(systemInfo.system),
    IS_ANDROID: /android/i.test(systemInfo.system),
    STATUS_BAR_HEIGHT: systemInfo.statusBarHeight,
    DEFAULT_HEADER_HEIGHT: 46, // systemInfo.screenHeight - systemInfo.windowHeight - systemInfo.statusBarHeight
    DEFAULT_CONTENT_HEIGHT: systemInfo.screenHeight - systemInfo.statusBarHeight - wx.DEFAULT_HEADER_HEIGHT,
    IS_APP: true,
    service: {
        // wsUrl: `ws://10.134.62.106:8090/websocket`, // 焦公司服务
        // wsUrl: `ws://3435k69g44.zicp.vip/websocket`, // 焦家服务
        // wsUrl: `ws://192.168.1.4:8090/websocket`, // 本机服务
        // wsUrl: `ws://125.35.101.176:8090/websocket`, // 测试服务
        wsUrl: `wss://dlb.591hb.net/websocket`, // 测试服务
    },
    request: request,
    throttle: throttle,
    isNullOrUndefined: isNullOrUndefined,
    dateFormat: dateFormat,
    /**显示模态对话框 */
    showModal(title, content, callback) {
        wx.hideToast();
        wx.showModal({
            title: title || '提示',
            content: content || '',
            showCancel: false,
            success: () => {
                typeof callback == 'function' && callback();
            }
        })
    },
    /**显示 loading 提示框 */
    showLoading(title, callback) {
        wx.hideLoading({
            complete: ()=>{

            }
        }); // 先关闭已存在的loading
        
        wx.showLoading({
            title: title || '正在加载...',
            mask: true,
            success: () => {
                typeof callback == 'function' && callback();
            }
        })
    },
    hideLoading() {
        // setTimeout(() => {
            wx.hideLoading({
                complete: ()=>{
                    
                }
            });
        // }, 10)
    },
    showToast(title) {
        wx.showToast({
            icon: 'none',
            title: title,
            duration: 2000,
        })
    },
    success(title) {
        wx.showToast({
            image: '/assets/images/icon/success.png',
            title: title,
            duration: 2000,
        })
    },
    error(title) {
        wx.showToast({
            image: '/assets/images/icon/error.png',
            image: image,
            title: title,
            duration: 2000,
        })
    },
    /**保持屏幕常亮 */
    keepScreenOn(value = true) {
        wx.setKeepScreenOn({
            keepScreenOn: value,
        })
    }
}

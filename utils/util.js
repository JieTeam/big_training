const moment = require('moment');
const numeral = require('numeral');

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
    throttle: throttle,
    isNullOrUndefined: isNullOrUndefined,
    dateFormat: dateFormat
}

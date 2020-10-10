// loading配置，请求次数统计
// function startLoading() {
//     wx.showLoading({
//         title: 'Loading...',
//         icon: 'none'
//     })
// }

// function endLoading() {
//     wx.hideLoading();
// }
// 声明一个对象用于存储请求个数
// let needLoadingRequestCount = 0;

// function showFullScreenLoading() {
//     if (needLoadingRequestCount === 0) {
//         startLoading();
//     }
//     needLoadingRequestCount++;
// };

// function tryHideFullScreenLoading() {
//     if (needLoadingRequestCount <= 0) return;
//     needLoadingRequestCount--;
//     if (needLoadingRequestCount === 0) {
//         endLoading();
//     }
// };

const Api = {
    request: function (method, url, params) {
        // wx.showNavigationBarLoading();
        // showFullScreenLoading();
        return new Promise((resolve, reject) => {
            wx.request({
                url: url,
                method: method,
                data: Object.assign({}, params),
                header: {
                    'content-type': method == 'GET' ? 'application/x-www-form-urlencoded' : 'application/json',
                    'Accept': 'application/json'
                },
                dataType: 'json',
                success: function (res) {
                    const {
                        data,
                        statusCode,
                        errMsg
                    } = res;
                    if (res.statusCode === 200) {
                        if (data.code !== 1 && ( !params  || !params.notShowError)) {
                            let timer = setTimeout(() => {
                                clearTimeout(timer);
                                timer = null;
                                wx.showToast({
                                    title: data.msg,
                                    icon: 'none',
                                    duration: 2000,
                                })
                            }, 300);
                        } 
                        resolve(res.data)
                    } else {
                        let timer = setTimeout(() => {
                            clearTimeout(timer);
                            timer = null;
                            wx.showToast({
                                title: `服务器异常 - ${statusCode}`,
                                icon: 'none',
                                duration: 2000
                            })
                        }, 300);
                        resolve(res)
                    }
                },
                fail: function (err) {
                    reject(err);
                },
                complete: function (e) {
                    // tryHideFullScreenLoading();
                    // wx.hideNavigationBarLoading();
                }
            })
        })
    }
}
export default Api;
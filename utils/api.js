// loading配置，请求次数统计
function startLoading() {
    wx.showLoading({
        title: 'Loading...',
        icon: 'none'
    })
}
function endLoading() {
    wx.hideLoading();
}
// 声明一个对象用于存储请求个数
let needLoadingRequestCount = 0;
function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading();
    }
    needLoadingRequestCount++;
};
function tryHideFullScreenLoading() {
if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
        endLoading();
    }
};

const Api = {
    request: function(method, url, params) {
        wx.showNavigationBarLoading();
        showFullScreenLoading();
        
        return new Promise((resolve, reject) => {
            wx.request({
                url: url,
                method: method,
                data: Object.assign({}, params.data),
                header: {
                    'content-type': method == 'GET'?'application/json':'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                dataType: 'json',
                success: function (res) {
                    if (typeof res.data === "object") {
                        if (res.data.status) {
                            if (res.data.status === -200) {
                                // wx.showToast({
                                //     title: "为确保能向您提供最准确的服务，请退出应用重新授权",
                                //     icon: "none"
                                // });
                                // reject("请重新登录");
                            } else if (res.data.status === -201) {
                                // wx.showToast({
                                //     title: res.data.msg,
                                //     icon: "none"
                                // });
                                // setTimeout(function () {
                                //     wx.navigateTo({
                                //         url: "/pages/user/supplement/supplement"
                                //     });
                                // }, 1000);
                                // reject(res);
                            }
                        }
                    }
                    resolve(res.data.result);
                },
                fail: function(err) {
                    reject(err);
                },
                complete: function(e) {
                    tryHideFullScreenLoading();
                    wx.hideNavigationBarLoading();
                }
            })
        })
    },
    result: function(method, url, params) {
        let _this = this;
        return _this.fetchApi(params, method, url).then(res => res);
    }
}
export default Api;
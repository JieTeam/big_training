// pages/ranking/ranking.js
const App = getApp();
const Utils = require('../../utils/util.js');
import { getProvinceCityListApi } from "../../utils/server/request";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null,
        checkedType: '7',
        rankingTabData: [
            {
                title: '个人排行',
                type: '7',
                checked: true,
            },
            {
                title: '市级排行',
                type: '5',
            },
            {
                title: '县级排行',
                type: '6',
            },
        ],
        tableHead7: [
            "排名","用户","地区","综合成绩","等级"
        ],
        tableHead5: [
            "排名","城市","综合成绩","参与人数","答题次数"
        ],
        tableHead6: [
            "排名","区县","综合成绩","参与人数","答题次数"
        ],
        tableHead: [
            "排名","用户","地区","综合成绩","等级"
        ],
        personClomn: [
          'id','field1','field2','rankId','field4'
        ],
        personData: []
    },
    handleTab(e) {

        const currentItem = e.target.dataset.item;

        let personClomn=[];
        if(currentItem.key=='7'){
            personClomn = [
                'id','field1','field2','rankId','field4'
            ];
        } else {
            personClomn = [
                'id','field1','rankId','field3','field4'
            ];
        }
        this.setData({
            checkedType: currentItem.key,
            personClomn: personClomn
        })
        const newTabData = this.data.rankingTabData.map((item) => {
            item.checked = false
            if (item.type === currentItem.type) {
                item.checked = true
            }
            return item;
        })
        this.setData({
            rankingTabData: newTabData,
            tableHead: this.data['tableHead'+this.data.checkedType]
        })
        wx.nextTick(() => {
            this.getProvinceCityList();
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this;
        this.setData({
            userInfo: App.globalData.userInfo
        })
        wx.nextTick(() => {
            that.getProvinceCityList()
        });
          
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
    async getProvinceCityList() {
        const that = this;
        Utils.showLoading();
        console.log(that.data.checkedType);
        try {
            const result = await getProvinceCityListApi({
                pvcode: that.data.userInfo.workingDivision,
                pvtype: that.data.checkedType
            })
            Utils.hideLoading();
            if(result.code!=1) return;
            that.setData({
                personData: result.data
            })
        } catch (error) {
            Utils.hideLoading();
        }
    }
})
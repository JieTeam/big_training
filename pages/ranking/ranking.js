// pages/ranking/ranking.js
const app = getApp();
const Utils = require('../../utils/util.js');
import { getRankListApi } from "../../utils/server/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkedType: '1',
    rankingTabData: [
      {
        title: '个人排行榜',
        type: 'person',
        key: '1',
        checked: true,
      },
      {
        title: '省级排行榜',
        type: 'province',
        key: '2',
      },
      {
        title: '市级排行榜',
        type: 'city',
        key: '3',
      },
      {
        title: '县级排行榜',
        type: 'county',
        key: '4',
      }
    ],
    tableHead1: [
        "排名","用户","省份","积分","等级"
    ],
    tableHead2: [
        "排名","省份","平均积分","参与人数","答题次数"
    ],
    tableHead3: [
        "排名","城市","平均积分","参与人数","答题次数"
    ],
    tableHead4: [
        "排名","区县","平均积分","参与人数","答题次数"
    ],
    tableHead: [],
    personClomn: [
      'id','field1','field2','field3','field4'
    ],
    personData: [
    ]
    
  },
  handleTab(e) {
    const currentItem = e.target.dataset.item;
    this.setData({
      checkedType: currentItem.key
    })
    const newTabData = this.data.rankingTabData.map((item) => {
      item.checked = false
      if (item.key === currentItem.key) {
        item.checked = true
      }
      return item;
    })
    this.setData({
      rankingTabData: newTabData
    })
    this.getRankList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRankList()
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
  // 获取排行榜列表
  async getRankList() {
    const that = this;
    try {
        Utils.showLoading();
        that.setData({
            tableHead: that.data['tableHead'+that.data.checkedType]
        })
        const result = await getRankListApi({
            type: that.data.checkedType
        })
        Utils.hideLoading();
        if(result.code!==1) return;
        that.setData({
            personData: result.data
        })
    } catch (err) {
        Utils.hideLoading();
    }
  }
})
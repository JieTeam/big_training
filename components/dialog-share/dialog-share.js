// components/dialog-share/dialog-share.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    reslut: {
      type: Object,
      value: {},
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    go() {
      this.triggerEvent('handleFix')
    },
    handleGoods() {
      this.triggerEvent('handleGoods')
    }
  }
})

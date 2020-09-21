// components/dialog-tips/dialog-tips.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'right' 
    },
    tips: {
      type: String,
      value: '提交成功'
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
    _handleFix() {
      this.triggerEvent('ok')
    }
  }
})

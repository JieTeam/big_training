// components/dialog-region/dialog-region.js

import cities from '../../utils/cities'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cities: {
      type: Array,
      value: cities,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    province: [],
    city: [],
    area: [],
    selectData:[],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFix() {
      this.triggerEvent('ok', this.data.selectData)
    },
    init() {
      // this.province = this.cities
      console.log('>>> test', this.data.cities, cities)
      this.setData({
        province: this.data.cities
      })
    },
    handleProvince(e) {
      const {item, index} = e.currentTarget.dataset
      const province = this.data.province.map(_item => {
        if (_item.regionCode === item.regionCode) {
          _item.checked = true
        }else {
          _item.checked = false
        }
        return _item
      })
      this.setData({
        province,
        city: item.children,
        area: [],
        selectData: [item],
      })
      
    },
    handleCity(e) {
      const {item, index} = e.currentTarget.dataset
      const city = this.data.city.map(_item => {
        if (_item.regionCode === item.regionCode) {
          _item.checked = true
        }else {
          _item.checked = false
        }
        return _item
      })
      let selectData = this.data.selectData
      selectData.splice(1)
      selectData.push(item)
      this.setData({
        city,
        area: item.children,
        selectData,
      })
    },
    handleArea(e) {
      const {item, index} = e.currentTarget.dataset;
      const area = this.data.area.map(_item => {
        if (_item.regionCode === item.regionCode) {
          _item.checked = true
        }else {
          _item.checked = false
        }
        return _item
      })
      let selectData = this.data.selectData
      selectData.splice(2)
      selectData.push(item)
      this.setData({
        area,
        selectData,
      })
      console.log('>>> selectData', selectData)
    }
  }
})

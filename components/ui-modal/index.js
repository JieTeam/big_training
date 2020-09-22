// components/ui-modal/index.js
Component({
    options: {
        addGlobalClass: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        
    },

    /**
     * 组件的初始数据
     */
    data: {
        visible: false,
        title: "",
        status: "success"
    },

    /**
     * 组件的方法列表
     */
    methods: {
        showModal(title,status='success') {
            this.setData({
                title: title,
                status: status,
                visible: true
            })
        },
        hideModal() {
            this.setData({
                visible: false
            })
        }
    }
})

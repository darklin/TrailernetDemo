function msg (Vue) {
  Vue.prototype.$msg = function (msg, type) {
    // 消息类型: success/info/warning/error
    if (!type) type = 'warning'
    this.$alert(msg, ' ', {
      showConfirmButton: false,
      type: type
    })
  }
}

export default msg

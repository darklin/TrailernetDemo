// 表单搜索记录
function formStore (Vue, axios) {
  if (formStore.installed) return

  Vue.prototype.$formStore = function (key, form) {
    if (arguments.length === 1) {
      let str = this.$localStorage(key)
      return str ? JSON.parse(str) : {}
    } else if (arguments.length === 2) {
      if (form['signId']) delete form['signId']
      this.$localStorage(key, JSON.stringify(form))
    }
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(formStore)
}

export default formStore

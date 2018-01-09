// echarts封装
function vcharts (Vue, echarts) {
  if (vcharts.installed) return
  Vue.prototype.$echarts = echarts
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vcharts)
}

export default vcharts

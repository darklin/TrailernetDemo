// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
require('es6-promise').polyfill()
import Vue from 'vue'
import App from './App'
import router from './router'

// import mixins from '@/mixins'

// 引入第三方库
import axios from 'axios'
import ElementUI from 'element-ui'
import VueI18n from 'vue-i18n'
import echarts from 'echarts'

// 引入插件
import ajax from '@/utils/ajax'
import sessionStorage from '@/utils/sessionStorage'
import localStorage from '@/utils/localStorage'
import msg from '@/utils/msg'
import vcharts from '@/utils/vcharts'
import date from '@/utils/date'

// 导入语言包
import locale from 'element-ui/lib/locale/lang/en'
import zh from '@/lang/zh'
import en from '@/lang/en'

// 引入样式
import 'element-ui/lib/theme-default/index.css'
import '@/assets/css/reset.less'
import '@/assets/css/style.less'

// 过滤器
import thousands from '@/filters/thousands'
import dayText from '@/filters/day-text'
Vue.filter('thousands', thousands)
Vue.filter('dayText', dayText)

// 获取语言类型
let lang = window.localStorage.getItem('lang') || 'zh'

// 使用插件
Vue.use(ajax, axios)
// ElementUI语言国际化
if (lang === 'zh') {
  Vue.use(ElementUI)
} else {
  Vue.use(ElementUI, { locale })
}
Vue.use(VueI18n)
Vue.use(sessionStorage)
Vue.use(localStorage)
Vue.use(msg)
Vue.use(vcharts, echarts)
Vue.use(date)

// 初始化国际语言
const i18n = new VueI18n({
  locale: lang,
  messages: { zh, en }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  // mixins: [mixins],
  template: '<App/>',
  components: { App }
})

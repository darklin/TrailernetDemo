// cookie操作封装
import Cookie from 'js-cookie'
function cookie (Vue, axios) {
  if (cookie.installed) return

  Vue.prototype.$cookie = function (key, val, opts) {
    if (arguments.length === 0) {
      return Cookie.get()
    } else if (arguments.length === 1) {
      return Cookie.get(key)
    } else if (arguments.length === 2) {
      return Cookie.set(key, val)
    } else if (arguments.length === 3) {
      return Cookie.set(key, val, opts)
    }
  }

  Vue.prototype.$jsonCookie = function (key) {
    if (arguments.length === 0) {
      return Cookie.getJSON()
    } else if (arguments.length === 1) {
      return Cookie.getJSON(key)
    }
  }

  Vue.prototype.$rmCookie = function (key, opts) {
    if (arguments.length === 0) {
      let cookies = Cookie.get()
      for (let key in cookies) {
        Cookie.remove(key)
      }
    } else if (arguments.length === 1) {
      Cookie.remove(key)
    } else if (arguments.length === 2) {
      Cookie.remove(key, opts)
    }
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(cookie)
}

export default cookie

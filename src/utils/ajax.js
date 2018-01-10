import qs from 'qs'

// axios网络请求
function ajax (Vue, axios) {
  if (ajax.installed) return
  Vue.prototype.$baseURL = axios.defaults.baseURL = (process.env.NODE_ENV === 'production') ? 'http://web2.sf-trailernet.com/' : 'http://web2.sf-trailernet.com/'
  // Vue.prototype.$baseURL = axios.defaults.baseURL = (process.env.NODE_ENV === 'production') ? 'http://web2.sf-trailernet.com/' : 'http://192.168.1.125:8081/xhtrailer_main_web/'
  // 序列化对象
  Vue.prototype.$serialize = params => qs.stringify(params)
  Vue.prototype.$ajax = function (params, method = 'get') {
    let data = params['data'] || {}
    if (params['loading']) this.isLoading = true
    let [getData, postData, headers] = [null, null, null]
    if (method === 'post') {
      postData = qs.stringify(data)
      headers = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    } else {
      getData = data
    }
    axios({
      method: method,
      url: params['url'],
      params: getData,
      data: postData,
      headers: headers,
      withCredentials: true
    }).then(res => {
      res = res.data
      if (res.data.authorityCheckState === 1) this.$router.replace('/login')
      else if (res.data.authorityCheckState === 2) this.$router.replace('/error')
      if (params['loading']) this.isLoading = false
      if (!res.status) {
        if (params['success'] !== undefined) params.success(res.data)
      } else {
        if (!params['fail']) this.$msg(res.message)
        else params.fail(res)
      }
    }).catch(err => {
      if (params['loading']) this.isLoading = false
      if (params['error'] !== undefined) params.error(err)
    })
  }

  // get请求
  Vue.prototype.$get = function (params) {
    this.$ajax(params, 'get')
  }

  // post请求
  Vue.prototype.$post = function (params) {
    this.$ajax(params, 'post')
  }

  // put请求
  Vue.prototype.$put = function (params) {
    params.data['_method'] = 'PUT'
    this.$ajax(params, 'post')
  }

  // patch请求
  Vue.prototype.$patch = function (params) {
    params.data['_method'] = 'PATCH'
    this.$ajax(params, 'post')
  }

  // delete请求
  Vue.prototype.$delete = function (params) {
    this.$ajax(params, 'delete')
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ajax)
}

export default ajax

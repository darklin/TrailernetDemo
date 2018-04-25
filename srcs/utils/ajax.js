import querystring from './querystring'

// axios网络请求
function ajax (Vue, axios) {
  if (ajax.installed) return

  Vue.prototype.$baseURL = axios.defaults.baseURL = (process.env.NODE_ENV === 'production') ? '/crmsys/' : 'http://192.168.10.109/crmsys/'
  /**
   * [$ajax 网络请求]
   * @param  {[String]} url [请求地址]
   * @param  {[Object]} data [请求参数]
   * @param  {[Boolean]} noToken [参数中不传signId]
   * @param  {[Boolean]} loading [请求加载动画]
   * @param  {[Function]} success [成功回调]
   * @param  {[Function]} error [失败回调]
   * @param  {[Boolean]} fail [返回错误是否弹出错误提示信息]
   * @return {[type]}        [description]
   */
  Vue.prototype.$ajax = function (params) {
    // 参数对象
    let data = params['data'] || {}
    // 获取缓存中signId,如果存在并且noToken为false就传参
    let signId = this.$sessionStorage('signId')
    if (signId && !params['noToken']) data['signId'] = signId
    // 判断是否有加载动画，如果有就显示
    if (params['loading']) this.isLoading = true
    // 发送post请求
    axios.post(params['url'], querystring.stringify(data)).then(res => {
      // 设置signId
      let signId = res.headers.signid
      if (signId === 'needLogin') {
        this.$alert(`需要登录`, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.replace('/login')
          }
        })
      } else if (signId === 'noRole') {
        this.$alert(`没有权限`, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.replace('/login')
          }
        })
      } else if (signId === 'offline') {
        this.$alert(`已在其他地方登录`, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.replace('/login')
          }
        })
      }
      if (signId !== 'needLogin' && signId !== 'noRole' && signId !== 'offline') {
        if (signId) this.$sessionStorage('signId', signId)
        if (params['loading']) this.isLoading = false
        // 成功回调
        let data = res.data
        if (data.success) {
          if (params['success'] !== undefined) params.success(data)
        } else {
          // 错误状态信息弹出
          if (!params['fail']) this.$msg(data.message)
        }
      }
    }, err => {
      if (params['loading']) this.isLoading = false
      // 失败回调
      if (params['error'] !== undefined) params.error(err)
    })
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ajax)
}

export default ajax

function date (Vue) {
  Vue.prototype.$date = function (date) {
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      console.error('时间格式不正确')
      return
    }
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    if (month < 10) month = '0' + month
    if (day < 10) day = '0' + day
    if (hour < 10) hour = '0' + hour
    if (minute < 10) minute = '0' + minute
    if (second < 10) second = '0' + second
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  Vue.prototype.$firstDate = function (date) {
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      console.error('时间格式不正确')
      return
    }
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = '01'
    let hour = '00'
    let minute = '00'
    let second = '00'
    if (month < 10) month = '0' + month
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  // 将本地时间转换为UTC时间进行传输
  Vue.prototype.$localDate2UTC = function (date) {
    var timeStamp = date.getTime()
    return new Date(timeStamp + this.$timezoneOffset(date)).toLocaleString().substr(0, 17)
  }

  // 将服务器传输的UTC时间转为本地时间显示
  Vue.prototype.$UTC2LocalDate = function (date) {
    var timeStamp = date.getTime()
    return new Date(timeStamp - this.$timezoneOffset(date)).toLocaleString().substr(0, 17)
  }

  // 获取本地时间与UTC时间的时间差
  Vue.prototype.$timezoneOffset = function (date) {
    var offset = date.getTimezoneOffset() * 60 * 1000
    return offset
  }
}

export default date

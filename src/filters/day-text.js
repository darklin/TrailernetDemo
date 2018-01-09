const dayText = date => {
  date = new Date(date.replace(/-/g, '/'))
  var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return week[date.getDay()]
}

export default dayText

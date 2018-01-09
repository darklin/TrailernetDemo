export {loadJS} from './load'

export const noop = () => {}

// 深圳坐标
export const center = {
  lng: 115.903086,
  lat: 39.897445
}

export const getTime = date => {
  return new Date(date).getTime()
}

const period = (start, end) => {
  let startDate = start.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/)
  let endDate = end.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/)
  let startTime = new Date(startDate[1], startDate[2] - 1, startDate[3], startDate[4], startDate[5], startDate[6]).getTime()
  let endTime = new Date(endDate[1], endDate[2] - 1, endDate[3], endDate[4], endDate[5], endDate[6]).getTime()
  let runTime = (endTime - startTime) / 1000
  let day = Math.floor(runTime / 86400)
  runTime = runTime % 86400
  let hour = Math.floor(runTime / 3600)
  runTime = runTime % 3600
  let minute = Math.floor(runTime / 60)
  runTime = runTime % 60
  let second = runTime
  return {
    day,
    hour,
    minute,
    second
  }
}

export const getMin = (start, end) => {
  let startDate = start.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/)
  let endDate = end.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/)
  let startTime = new Date(startDate[1], startDate[2] - 1, startDate[3], startDate[4], startDate[5], startDate[6]).getTime()
  let endTime = new Date(endDate[1], endDate[2] - 1, endDate[3], endDate[4], endDate[5], endDate[6]).getTime()
  let runTime = (endTime - startTime) / 1000 / 60
  return runTime
}

// export const getPeriod = (start, end) => {
//   let {day, hour, minute, second} = period(start, end)
//   return `${day}天${hour}时${minute}分${second}秒`
// }
let lang = window.localStorage.getItem('lang') || 'zh'
export const getPeriod = (start, end) => {
  let runTime = end - start
  let day = Math.floor(runTime / 1440)
  runTime = runTime % 1440
  let hour = Math.floor(runTime / 60)
  runTime = runTime % 60
  let minute = runTime
  let time = ''
  if (lang === 'zh') {
    time = `${day} 天 ${hour} 小时 ${minute} 分`
  } else {
    time = `${day} D ${hour} H ${minute} M`
  }
  return time
}

export const periodMark = (start, end) => {
  let {day, hour, minute, second} = period(start, end)
  let time = ''
  if (lang === 'zh') {
    if (day) {
      time = `${day} 天 ${hour} 小时 ${minute} 分 ${second} 秒`
    } else if (hour) {
      time = `${hour} 小时 ${minute} 分 ${second} 秒`
    } else {
      time = `${minute} 分 ${second} 秒`
    }
    time = `${day} 天 ${hour} 小时 ${minute} 分`
  } else {
    if (day) {
      time = `${day} D ${hour} H ${minute} M ${second} S`
    } else if (hour) {
      time = `${hour} H ${minute} M ${second} S`
    } else {
      time = `${minute} M ${second} S`
    }
  }
  return time
}

/**
 * window.BMap
 * window.map
 * window.geocoder
 */
import {loadJS, noop, center, getTime, getPeriod, getMin, periodMark} from './util'

// 加载百度地图JS库
export const loadMapJS = (url, callback) => {
  if (!window.BMap) {
    loadJS(url)
    window.init = () => callback()
  } else {
    callback()
  }
}

// 初始化百度地图
export const initMap = (isloca, callback = noop, point = center, container = 'map') => {
  const BMap = window.BMap
  const map = window.map = new BMap.Map(container, {enableMapClick: false})
  const centerPoint = new BMap.Point(point.lng, point.lat)
  map.centerAndZoom(centerPoint, 12)
  // 浏览器定位
  if (isloca) {
    let geolocation = new BMap.Geolocation()
    geolocation.getCurrentPosition(function (r) {
      if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
        map.panTo(r.point)
      }
    }, {enableHighAccuracy: true})
  }
  // 启用滚轮放大缩小
  map.enableScrollWheelZoom()
  // 禁止双击地图放大
  map.disableDoubleClickZoom()
  // 添加地图控件
  let mapType = new BMap.MapTypeControl({mapTypes: [window.BMAP_NORMAL_MAP, window.BMAP_SATELLITE_MAP]})
  var control = new BMap.ScaleControl({anchor: window.BMAP_ANCHOR_BOTTOM_LEFT, offset: new window.BMap.Size(10, 10)})
  // 添加默认缩放平移控件
  // let navigation = new BMap.NavigationControl()
  map.addControl(mapType)
  map.addControl(control)
  callback()
}

// 添加覆盖物
export const addMarker = (point, icon, w = 31, h = 35) => {
  const [map, BMap] = [window.map, window.BMap]
  let marker = new BMap.Marker(point, {
    icon: new BMap.Icon(icon, new BMap.Size(w, h))
  })
  map.addOverlay(marker)
  return marker
}

// 添加停靠点覆盖物
export const addStopMarker = (point, icon, text) => {
  const [map, BMap] = [window.map, window.BMap]
  let marker = new BMap.Marker(point, {
    icon: new BMap.Icon(icon, new BMap.Size(24, 24))
  })
  let label = new BMap.Label(text, {
    offset: new BMap.Size(-24, -24)
  })
  label.setStyle({
    lineHeight: '24px',
    backgroundColor: '#333',
    border: 'none'
  })
  marker.setLabel(label)
  map.addOverlay(marker)
  return marker
}

// 添加带有文本覆盖物
export const addHoverMarker = (point, icon, text) => {
  const [map, BMap] = [window.map, window.BMap]
  let marker = new BMap.Marker(point, {
    icon: new BMap.Icon(icon, new BMap.Size(14, 14))
  })
  let label = new BMap.Label(text, {
    offset: new BMap.Size(-28, -28)
  })
  label.setStyle({
    width: '120px',
    lineHeight: '24px',
    backgroundColor: '#333',
    border: 'none'
  })
  marker.setLabel(label)
  map.addOverlay(marker)
  return marker
}

// 添加带有文本覆盖物
export const addLabelMarker = (point, icon, text, w = 32, h = 32) => {
  const [map, BMap] = [window.map, window.BMap]
  let marker = new BMap.Marker(point, {
    icon: new BMap.Icon(icon, new BMap.Size(w, h))
  })
  let label = new BMap.Label(text, {
    offset: new BMap.Size(-16, -24)
  })
  label.setStyle({
    lineHeight: '24px',
    backgroundColor: 'rgba(53, 59, 71, .8)',
    border: 'none'
  })
  marker.setLabel(label)
  map.addOverlay(marker)
  return marker
}

// 移除覆盖物
export const removeOverlay = (data) => {
  if (data instanceof Array) {
    data.forEach(overlay => {
      window.map.removeOverlay(overlay)
    })
  } else {
    window.map.removeOverlay(data)
  }
}

// 添加车标
export const addCarMarker = (point, icon, text, content, w = 32, h = 32) => {
  addLabelMarker(point, icon, text, w, h)
  let infoWindow = window.infoWindow = addOverlay(point, content)
  let closeBtn = document.getElementById('closeBtn')
  closeBtn.addEventListener('click', () => {
    removeOverlay(infoWindow)
  })
}

// 添加车标事件
export const addEventMarker = (point, icon, text, callback) => {
  let marker = addLabelMarker(point, icon, text)
  // 将覆盖物加入数组中
  window.overlays.push(marker)
  marker.addEventListener('click', function () {
    removeOverlay(window.infoWindow)
    getAddress(point, callback)
  })
}

// 自定义覆盖物
const customOverlay = () => {
  const BMap = window.BMap
  return class CustomOverlay extends BMap.Overlay {
    constructor (point, content) {
      super()
      this._point = point
      this._content = content
      this._map = window.map
    }
    initialize () {
      var div = this._div = document.createElement('div')
      div.style.position = 'absolute'
      div.innerHTML = this._content
      this._map.getPanes().floatPane.appendChild(div)
      return div
    }
    draw () {
      var pixel = this._map.pointToOverlayPixel(this._point)
      this._div.style.left = pixel.x - this._div.offsetWidth / 2 + 'px'
      this._div.style.top = pixel.y - this._div.offsetHeight + 20 + 'px'
    }
  }
}

// 获取地理位置
export const getAddress = (point, callback) => {
  let [BMap, geocoder] = [window.BMap, window.geocoder]
  if (!geocoder) geocoder = new BMap.Geocoder()
  geocoder.getLocation(new BMap.Point(point.lng, point.lat), function (rs) {
    let addr = rs.addressComponents
    callback(`${addr.province}${addr.city}${addr.district}${addr.street}${addr.streetNumber}`)
  })
}

// 自定义信息窗体
const addOverlay = (point, content) => {
  const map = window.map
  let infoWindow = new (customOverlay())(point, content)
  map.addOverlay(infoWindow)
  return infoWindow
}

// 添加事件信息窗体
const addEventOverlay = (point, content, info) => {
  let infoWindow = window.infoWindow = addOverlay(point, content)
  let closeBtn = document.getElementById('closeBtn')
  let trailBtn = document.getElementById('trailBtn')
  let trackBtn = document.getElementById('trackBtn')
  let GPS = document.getElementById('GPS')
  let beidou = document.getElementById('beidou')
  closeBtn.addEventListener('click', () => {
    removeOverlay(infoWindow)
  })
  trailBtn.addEventListener('click', () => {
    window.localStorage.setItem('trail', JSON.stringify(info))
    window.open(info.path + '/home/bTrail')
  })
  trackBtn.addEventListener('click', () => {
    window.localStorage.setItem('track', JSON.stringify(info))
    window.open(info.path + '/home/bTrack')
  })
  GPS.addEventListener('click', () => {
    window.localStorage.setItem('satellite', JSON.stringify(info))
    window.open(info.path + '/home/satellite')
  })
  beidou.addEventListener('click', () => {
    window.localStorage.setItem('satellite', JSON.stringify(info))
    window.open(info.path + '/home/satellite')
  })
  window.overlays.push(infoWindow)
}

// 添加hover窗体
export const addHoverOverlay = (point, content) => {
  let hoverOverlay = window.hoverOverlay = addOverlay(point, content)
  let closeBtn = document.getElementById('closeBtn')
  closeBtn.addEventListener('click', () => {
    removeOverlay(hoverOverlay)
    removeOverlay(window.hoverCircle)
  })
}

// 获取旋转角度
export const getRotation = (curPos, targetPos) => {
  const map = window.map
  let deg = 0
  if (!targetPos) return deg
  curPos = map.pointToPixel(curPos)
  targetPos = map.pointToPixel(targetPos)
  if (targetPos.x !== curPos.x) {
    let tan = (targetPos.y - curPos.y) / (targetPos.x - curPos.x)
    let atan = Math.atan(tan)
    deg = atan * 360 / (2 * Math.PI)
    if (targetPos.x < curPos.x) {
      deg = -deg + 90 + 90
    } else {
      deg = -deg
    }
    return -deg
  } else {
    let disy = targetPos.y - curPos.y
    let bias = 0
    if (disy > 0) bias = -1
    else bias = 1
    return -bias * 90
  }
}

// 获取最近距离
export const getNearDistance = () => {
  let [zoom, ratio] = [window.map.getZoom(), 1]
  if (zoom < 5) {
    ratio = 400
  } else if (zoom < 8) {
    ratio = 300
  } else if (zoom < 11) {
    ratio = 150
  } else if (zoom < 14) {
    ratio = 30
  } else if (zoom < 15) {
    ratio = 20
  } else if (zoom < 17) {
    ratio = 6
  } else {
    ratio = 2
  }
  return (30 - zoom) * ratio
}

// 将v值限定在a,b之间，经度使用
// const _getLoop = (v, a, b) => {
//   while (v > b) {
//     v -= b - a
//   }
//   while (v < a) {
//     v += b - a
//   }
//   return v
// }

// 将v值限定在a,b之间，纬度使用
// const _getRange = (v, a, b) => {
//   if (a != null) {
//     v = Math.max(v, a)
//   }
//   if (b != null) {
//     v = Math.min(v, b)
//   }
//   return v
// }

// const getDistance = (p1, p2, EARTHRADIUS = 6370996.81) => {
//   let [p1Lng, p1Lat, p2Lng, p2Lat] = [_getLoop(p1.lng, -180, 180), _getRange(p1.lat, -74, 74), _getLoop(p2.lng, -180, 180), _getRange(p2.lat, -74, 74)]
//   let [x1, y1, x2, y2] = [Math.PI * p1Lng / 180, Math.PI * p1Lat / 180, Math.PI * p2Lng / 180, Math.PI * p2Lat / 180]
//   return EARTHRADIUS * Math.acos((Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1)))
// }

export const getMinDistance = (point, pointArr) => {
  let [index, distance] = [0, window.map.getDistance(point, pointArr[0])]
  pointArr.forEach((item, i) => {
    let curDistance = window.map.getDistance(point, item)
    if (curDistance < distance) {
      index = i
      distance = curDistance
    }
  })
  return {index, distance}
}

export default {
  loadMapJS,
  initMap,
  addMarker,
  addStopMarker,
  addHoverMarker,
  addLabelMarker,
  addCarMarker,
  addEventMarker,
  removeOverlay,
  getAddress,
  addEventOverlay,
  addHoverOverlay,
  getRotation,
  getTime,
  getPeriod,
  periodMark,
  getNearDistance,
  getMinDistance,
  getMin
}

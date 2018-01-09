import {loadJS, noop, center, getTime, getPeriod, periodMark} from './util'

// 加载Google地图JS库
export const loadMapJS = (url, callback) => {
  if (!window.google) {
    loadJS(url)
    window.init = () => callback()
  } else {
    callback()
  }
}

// 初始化Google地图
export const initMap = (islocate, callback = noop, point = center, container = 'map') => {
  const GMap = window.google.maps
  const map = window.map = new GMap.Map(document.getElementById('map'), {
    center: center,
    clickableIcons: false,
    zoom: 12,
    fullscreenControl: false,
    panControl: false,
    zoomControl: false,
    scaleControl: true,
    streetViewControl: false,
    mapTypeControlOptions: {
      position: window.google.maps.ControlPosition.RIGHT_TOP
    },
    // mapTypeControl: false
    mapTypeId: window.google.maps.MapTypeId.SATELLITE
  })
  if (islocate) {
    window.geocoder = new GMap.Geocoder()
    // 浏览器定位
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        map.panTo({lat: position.coords.latitude, lng: position.coords.longitude})
      })
    }
  }
  callback()
}

// 添加覆盖物
export const addMarker = (point, icon, w = 31, h = 35) => {
  const [map, GMap] = [window.map, window.google.maps]
  let marker = new GMap.Marker({
    position: point,
    icon: icon,
    map
  })
  return marker
}

// 添加停靠点覆盖物
export const addStopMarker = (point, icon, text) => {
  const [map, GMap] = [window.map, window.google.maps]
  let marker = new GMap.Marker({
    position: point,
    icon: icon,
    map
  })
  let infoLay = new GMap.OverlayView()
  infoLay.setMap(map)
  infoLay.onAdd = () => {
    let el = document.createElement('div')
    el.style.border = 'none'
    el.style.position = 'absolute'
    el.style.zIndex = 10
    el.innerHTML = `<div class="map-marker stop-marker"><i>${text}</i></div>`
    infoLay.el = el
    let panes = infoLay.getPanes()
    let overlayLayer = panes.overlayLayer
    overlayLayer.appendChild(el)
  }
  infoLay.draw = () => {
    let el = infoLay.el
    let projection = infoLay.getProjection()
    let pixel = projection.fromLatLngToDivPixel(new GMap.LatLng(point.lat, point.lng))
    let content = el.children[0]
    let height = content.clientHeight
    let width = content.clientWidth
    el.style.top = (pixel.y - height) + 'px'
    el.style.left = (pixel.x - (width / 2)) + 'px'
  }
  infoLay.onRemove = () => {
    infoLay.el.parentNode.removeChild(infoLay.el)
    infoLay.el = null
  }
  // 将覆盖物加入数组中
  if (!window.overlays) window.overlays = []
  window.overlays.push(marker)
  window.overlays.push(infoLay)
  return marker
}

// 添加带有文本覆盖物
export const addHoverMarker = (point, icon, text) => {
  const [map, GMap] = [window.map, window.google.maps]
  let marker = new GMap.Marker({
    position: point,
    icon: icon,
    map
  })
  let infoLay = new GMap.OverlayView()
  infoLay.setMap(map)
  infoLay.onAdd = () => {
    let el = document.createElement('div')
    el.style.border = 'none'
    el.style.position = 'absolute'
    el.style.zIndex = 10
    el.innerHTML = `<div class="map-marker hover-marker"><i>${text}</i></div>`
    infoLay.el = el
    let panes = infoLay.getPanes()
    let overlayLayer = panes.overlayLayer
    overlayLayer.appendChild(el)
  }
  infoLay.draw = () => {
    let el = infoLay.el
    let projection = infoLay.getProjection()
    let pixel = projection.fromLatLngToDivPixel(new GMap.LatLng(point.lat, point.lng))
    let content = el.children[0]
    let width = content.clientWidth
    el.style.top = (pixel.y - 13) + 'px'
    el.style.left = (pixel.x - (width / 2)) + 'px'
  }
  infoLay.onRemove = () => {
    infoLay.el.parentNode.removeChild(infoLay.el)
    infoLay.el = null
  }
  return {
    marker,
    infoLay
  }
}

// 添加带有文本覆盖物
export const addLabelMarker = (point, icon, text, w = 32, h = 32) => {
  const [map, GMap] = [window.map, window.google.maps]
  let marker = new GMap.Marker({
    position: point,
    icon: icon,
    map
  })
  let infoLay = new GMap.OverlayView()
  infoLay.setMap(map)
  infoLay.onAdd = () => {
    let el = document.createElement('div')
    el.style.border = 'none'
    el.style.position = 'absolute'
    el.style.zIndex = 10
    el.innerHTML = `<div class="map-marker"><i>${text}</i></div>`
    infoLay.el = el
    let panes = infoLay.getPanes()
    let overlayLayer = panes.overlayLayer
    overlayLayer.appendChild(el)
  }
  infoLay.draw = () => {
    let el = infoLay.el
    let projection = infoLay.getProjection()
    let pixel = projection.fromLatLngToDivPixel(new GMap.LatLng(point.lat, point.lng))
    let content = el.children[0]
    let height = content.clientHeight
    let width = content.clientWidth
    el.style.top = (pixel.y - height) + 'px'
    el.style.left = (pixel.x - (width / 2)) + 'px'
  }
  infoLay.onRemove = () => {
    infoLay.el.parentNode.removeChild(infoLay.el)
    infoLay.el = null
  }
  // 将覆盖物加入数组中
  if (!window.overlays) window.overlays = []
  window.overlays.push(marker)
  window.overlays.push(infoLay)
  return marker
}

// 添加带有文本覆盖物
const addMoveMarker = (point, icon) => {
  const [map, GMap] = [window.map, window.google.maps]
  let marker = new GMap.Marker({
    position: point,
    icon: icon,
    map
  })
  return marker
}

const addMoveLabel = (point, text) => {
  const [map, GMap] = [window.map, window.google.maps]
  let infoLay = new GMap.OverlayView()
  infoLay.setMap(map)
  infoLay.onAdd = () => {
    let el = document.createElement('div')
    el.style.border = 'none'
    el.style.position = 'absolute'
    el.style.zIndex = 10
    el.innerHTML = `<div class="map-marker"><i>${text}</i></div>`
    infoLay.el = el
    let panes = infoLay.getPanes()
    let overlayLayer = panes.overlayLayer
    overlayLayer.appendChild(el)
  }
  infoLay.draw = () => {
    let el = infoLay.el
    let projection = infoLay.getProjection()
    let pixel = projection.fromLatLngToDivPixel(new GMap.LatLng(point.lat, point.lng))
    let content = el.children[0]
    let height = content.clientHeight
    let width = content.clientWidth
    el.style.top = (pixel.y - height) + 'px'
    el.style.left = (pixel.x - (width / 2)) + 'px'
  }
  infoLay.onRemove = () => {
    infoLay.el.parentNode.removeChild(infoLay.el)
    infoLay.el = null
  }
  return infoLay
}

// 移除覆盖物
export const removeOverlay = (data) => {
  if (data instanceof Array) {
    data.forEach(overlay => {
      overlay.setMap(null)
    })
  } else {
    data.setMap(null)
  }
}

// 添加车标
export const addCarMarker = (point, icon, text, content, w = 32, h = 32) => {
  addLabelMarker(point, icon, text, w, h)
  let infoWindow = window.infoWindow = addOverlay(point, content)
  setTimeout(() => {
    let closeBtn = document.getElementById('closeBtn')
    closeBtn.addEventListener('click', () => {
      infoWindow.setMap(null)
    })
  }, 13)
}

// 添加车标事件
export const addEventMarker = (point, icon, text, callback) => {
  let marker = addLabelMarker(point, icon, text)
  window.overlays.push(marker)
  marker.addListener('click', function () {
    if (window.infoWindow) window.infoWindow.setMap(null)
    getAddress(point, callback)
  })
}

// 获取地理位置 result[].types: 地址类型
export const getAddress = (point, callback) => {
  let [GMap, geocoder] = [window.google.maps, window.geocoder]
  if (!geocoder) geocoder = new GMap.Geocoder()
  geocoder.geocode({'location': point}, (result, status) => {
    if (status === 'OK') {
      callback(result[0].formatted_address)
    } else {
    }
  })
}

// 自定义信息窗体
const addOverlay = (point, content, h = 0) => {
  const [map, GMap] = [window.map, window.google.maps]
  let overlay = new GMap.OverlayView()
  overlay.setMap(map)
  overlay.onAdd = () => {
    let el = document.createElement('div')
    el.style.border = 'none'
    el.style.position = 'absolute'
    el.style.zIndex = 10
    el.innerHTML = content
    overlay.el = el
    let panes = overlay.getPanes()
    // overlayImage层级可以接受DOM事件
    let overlayImage = panes.overlayImage
    overlayImage.appendChild(el)
  }
  overlay.draw = () => {
    let el = overlay.el
    let projection = overlay.getProjection()
    let pixel = projection.fromLatLngToDivPixel(new GMap.LatLng(point.lat, point.lng))
    let content = el.children[0]
    let height = content.clientHeight
    let width = content.clientWidth
    el.style.top = (pixel.y - height + h) + 'px'
    el.style.left = (pixel.x - (width / 2)) + 'px'
  }
  overlay.onRemove = () => {
    overlay.el.parentNode.removeChild(overlay.el)
    overlay.el = null
  }
  return overlay
}

// 添加事件信息窗体
const addEventOverlay = (point, content, info) => {
  let infoWindow = window.infoWindow = addOverlay(point, content)
  setTimeout(() => {
    let closeBtn = document.getElementById('closeBtn')
    let trailBtn = document.getElementById('trailBtn')
    let trackBtn = document.getElementById('trackBtn')
    closeBtn.addEventListener('click', () => {
      infoWindow.setMap(null)
    })
    trailBtn.addEventListener('click', () => {
      window.localStorage.setItem('trail', JSON.stringify(info))
      window.open(info.path + '/home/gTrail')
    })
    trackBtn.addEventListener('click', () => {
      window.localStorage.setItem('track', JSON.stringify(info))
      window.open(info.path + '/home/gTrack')
    })
  }, 13)
  window.overlays.push(infoWindow)
}

// 添加hover窗体
export const addHoverOverlay = (point, content) => {
  window.hoverOverlay = addOverlay(point, content, 18)
  setTimeout(() => {
    let closeBtn = document.getElementById('closeBtn')
    closeBtn.addEventListener('click', () => {
      window.hoverOverlay.setMap(null)
      if (window.hoverWinLay) window.hoverWinLay.setMap(null)
      if (window.hoverWinMarker) window.hoverWinMarker.setMap(null)
    })
  }, 13)
}

const pointToPixel = point => {
  let overlay = new window.google.maps.OverlayView()
  overlay.draw = noop
  overlay.setMap(window.map)
  let proj = overlay.getProjection()
  let googlePixel = proj.fromLatLngToContainerPixel(point)
  overlay.setMap(null)
  return googlePixel
}

// 获取旋转角度
export const getRotation = (curPos, targetPos) => {
  let deg = 0
  if (!targetPos) return deg
  curPos = pointToPixel(curPos)
  targetPos = pointToPixel(targetPos)
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

export const getMinDistance = (point, pointArr) => {
  let [GMap, spherical] = [window.google.maps, window.google.maps.geometry.spherical]
  let [index, distance] = [0, spherical.computeDistanceBetween(point, new GMap.LatLng(pointArr[0].lat, pointArr[0].lng))]
  pointArr.forEach((item, i) => {
    let curDistance = spherical.computeDistanceBetween(point, new GMap.LatLng(item.lat, item.lng))
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
  addMoveMarker,
  addMoveLabel,
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
  getMinDistance
}

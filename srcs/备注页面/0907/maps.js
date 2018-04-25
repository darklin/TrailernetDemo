// 加载JS库
export const loadJS = url => {
  let script = document.createElement('script')
  script.setAttribute('src', url)
  document.body.appendChild(script)
}

// 加载地图JS库
export const loadMapJS = (url, type, callback) => {
  if (type === 'AMap') {
    if (!window.AMap) {
      loadJS(url)
      window.init = () => callback()
    } else {
      callback()
    }
  } else if (type === 'GMap') {
    if (!window.google) {
      loadJS(url)
      window.init = () => callback()
    } else {
      callback()
    }
  }
}

const noop = () => {}
const car = {
  // 默认中心点
  centerPoint: {
    lng: 116.397428,
    lat: 39.90923
  },
  ComplexOverlay: null,
  // 自定义窗体
  infoWindow: null
}

// 加载百度地图JS库
const loadBMapJS = (url, callback) => {
  if (!window.BMap) {
    loadJS(url)
    window.init = () => callback()
  } else {
    callback()
  }
}

// 初始化百度地图
const initBMap = (callback = noop, point = car.centerPoint, BMap = window.BMap) => {
  const map = window.map = new BMap.Map('map', {enableMapClick: false})
  const center = new BMap.Point(point.lng, point.lat)
  map.centerAndZoom(center, 12)
  // 浏览器定位
  let geolocation = new BMap.Geolocation()
  geolocation.getCurrentPosition(function (r) {
    if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
      map.panTo(r.point)
    }
  }, {enableHighAccuracy: true})
  // 启用滚轮放大缩小
  map.enableScrollWheelZoom()
  // 禁止双击地图放大
  map.disableDoubleClickZoom()
  // 添加地图控件
  let mapType = new BMap.MapTypeControl({mapTypes: [window.BMAP_NORMAL_MAP, window.BMAP_SATELLITE_MAP]})
  // 添加默认缩放平移控件
  map.addControl(mapType)
  // 自定义信息窗体类
  class ComplexOverlay extends BMap.Overlay {
    constructor (carInfo) {
      super()
      this._point = new BMap.Point(carInfo.Longitude, carInfo.Latitude)
      this._info = carInfo
    }
    initialize () {
      var div = this._div = document.createElement('div')
      div.style.position = 'absolute'
      let item = this._info
      div.innerHTML = `<div class="map-window bmap-window">
                        <div class="map-window-header">${item['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                        <div class="map-window-body">
                          <div class="map-item"><label>${item['organization']}:</label><span>${item['OrgName']}</span></div>
                          <div class="map-item"><label>${item['state']}:</label><span>${item['status']}</span></div>
                          <div class="map-item"><label>${item['alarmType']}:</label><span>${item['AlarmType']}</span></div>
                          <div class="map-item"><label>${item['spped']}:</label><span>${item['Speed']}</span></div>
                          <div class="map-item"><label>${item['powerSupplyMode']}:</label><span>${item['PowerSupplyMode']}</span></div>
                          <div class="map-item"><label>${item['dumpEnergy']}:</label><span>${item['SurplusElectricity']}%</span></div>
                          <div class="map-item"><label>${item['positionTime']}:</label><span>${item['ReportingTime']}</span></div>
                          <div class="map-item"><label>${item['position']}:</label><span>${item['address']}</span></div>
                        </div>
                        <div class="map-window-footer">
                          <a href="javascript:;" class="footer-btn trail-btn" id="trailBtn">${item['runningOfTrack']}</a>
                          <a href="javascript:;" class="footer-btn track-btn" id="trackBtn">${item['realtimeTrack']}</a>
                        </div>
                      </div>`
      map.getPanes().labelPane.appendChild(div)
      return div
    }
    draw () {
      var pixel = map.pointToOverlayPixel(this._point)
      this._div.style.left = pixel.x - 172 + 'px'
      this._div.style.top = pixel.y - 309 + 'px'
    }
    // 删除自定义窗体
    clear () {
      this._div.parentNode.removeChild(this._div)
      car.infoWindow = null
    }
  }
  car.ComplexOverlay = ComplexOverlay
  callback()
}

// 百度地图获取地理位置
const getBAddress = (point, callback, BMap = window.BMap) => {
  if (!window.geocoder) window.geocoder = new BMap.Geocoder()
  window.geocoder.getLocation(new BMap.Point(point.lng, point.lat), function (rs) {
    let addr = rs.addressComponents
    callback(`${addr.province}${addr.city}${addr.district}${addr.street}${addr.streetNumber}`)
  })
}

// 百度地图添加覆盖物
const addBMarker = (carInfo, map = window.map, BMap = window.BMap) => {
  let marker = new BMap.Marker(new BMap.Point(carInfo.Longitude, carInfo.Latitude), {
    icon: new BMap.Icon(carInfo.icon, new BMap.Size(32, 32))
  })
  let label = new BMap.Label(carInfo.LicensePlate, {
    offset: new BMap.Size(-16, -24)
  })
  label.setStyle({
    lineHeight: '24px',
    backgroundColor: '#333',
    border: 'none'
  })
  marker.setLabel(label)
  map.addOverlay(marker)
  marker.addEventListener('click', function () {
    getBAddress({
      lng: carInfo.Longitude,
      lat: carInfo.Latitude
    }, address => {
      carInfo['address'] = address
      if (car.infoWindow) {
        car.infoWindow.clear()
      }
      customBOverlay(carInfo)
    })
  })
}

// 百度地图创建自定义信息窗体
const customBOverlay = (carInfo, map = window.map, BMap = window.BMap) => {
  car.infoWindow = new car.ComplexOverlay(carInfo)
  map.addOverlay(car.infoWindow)
  let closeBtn = document.getElementById('closeBtn')
  let trailBtn = document.getElementById('trailBtn')
  let trackBtn = document.getElementById('trackBtn')
  closeBtn.addEventListener('click', () => {
    car.infoWindow.clear()
  })
  trailBtn.addEventListener('click', () => {
    let pathname = window.location.pathname + '#'
    window.localStorage.setItem('trail', JSON.stringify(carInfo))
    window.open(pathname + '/home/trail1')
  })
  trackBtn.addEventListener('click', () => {
    let pathname = window.location.pathname + '#'
    window.localStorage.setItem('track', JSON.stringify(carInfo))
    window.open(pathname + '/home/track1')
  })
}

const loadGMapJS = (url, callback) => {
  if (!window.google) {
    loadJS(url)
    window.init = () => callback()
  } else {
    callback()
  }
}

const initGMap = (callback = noop, point = car.centerPoint, GMap = window.google.maps) => {
  const map = window.map = new GMap.Map(document.getElementById('map'), {
    center: {lat: point.lat, lng: point.lng},
    clickableIcons: false,
    zoom: 12
  })
  // google 并不存在 GScaleControl这个控件 比例尺的控件为  scaleControl
  // map.addControl(new GMap.GScaleControl())
  // 浏览器定位
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      map.panTo({lat: position.coords.latitude, lng: position.coords.longitude})
    })
  }
  callback()
}

const getGAddress = (point, callback, GMap = window.google.maps) => {
  if (!window.geocoder) window.geocoder = new GMap.Geocoder()
  window.geocoder.geocode({'location': {lat: point.lat, lng: point.lng}}, (result, status) => {
    if (status === 'OK') {
      callback(result[0].formatted_address)
    }
  })
}

const addGMarker = (carInfo, map = window.map, GMap = window.google.maps) => {
  let latlng = {lat: carInfo.Latitude, lng: carInfo.Longitude}
  let marker = new GMap.Marker({
    position: latlng,
    icon: carInfo.icon,
    map: map
  })
  let infoLay = new GMap.OverlayView()
  infoLay.setMap(map)
  infoLay.onAdd = () => {
    let el = document.createElement('div')
    el.style.border = 'none'
    el.style.position = 'absolute'
    el.style.zIndex = 10
    el.innerHTML = `<div class="map-marker"><i>${carInfo['LicensePlate']}</i></div>`
    infoLay.el = el
    let panes = infoLay.getPanes()
    let overlayLayer = panes.overlayLayer
    overlayLayer.appendChild(el)
  }
  infoLay.draw = () => {
    let el = infoLay.el
    let projection = infoLay.getProjection()
    let pixel = projection.fromLatLngToDivPixel(new GMap.LatLng(carInfo.Latitude, carInfo.Longitude))
    let content = el.children[0]
    let height = content.clientHeight
    let width = content.clientWidth
    el.style.top = (pixel.y - height) + 'px'
    el.style.left = (pixel.x - (width / 2)) + 'px'
  }
  marker.addListener('click', () => {
    getGAddress(latlng, address => {
      carInfo['address'] = address
      if (car.infoWindow) {
        car.infoWindow.setMap(null)
      }
      customGOverlay(carInfo)
    })
  })
}

const customGOverlay = (carInfo, map = window.map, GMap = window.google.maps) => {
  let info = `<div class="map-window google-map-window">
                <div class="map-window-header">${carInfo['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                <div class="map-window-body">
                  <div class="map-item"><label>${carInfo['organization']}:</label><span>${carInfo['OrgName']}</span></div>
                  <div class="map-item"><label>${carInfo['state']}:</label><span>${carInfo['status']}</span></div>
                  <div class="map-item"><label>${carInfo['alarmType']}:</label><span>${carInfo['AlarmType']}</span></div>
                  <div class="map-item"><label>${carInfo['spped']}:</label><span>${carInfo['Speed']}</span></div>
                  <div class="map-item"><label>${carInfo['powerSupplyMode']}:</label><span>${carInfo['PowerSupplyMode']}</span></div>
                  <div class="map-item"><label>${carInfo['dumpEnergy']}:</label><span>${carInfo['SurplusElectricity']}%</span></div>
                  <div class="map-item"><label>${carInfo['positionTime']}:</label><span>${carInfo['ReportingTime']}</span></div>
                  <div class="map-item"><label>${carInfo['position']}:</label><span>${carInfo['address']}</span></div>
                </div>
                <div class="map-window-footer">
                  <a href="javascript:;" class="footer-btn trail-btn" id="trailBtn">${carInfo['runningOfTrack']}</a>
                  <a href="javascript:;" class="footer-btn track-btn" id="trackBtn">${carInfo['realtimeTrack']}</a>
                </div>
              </div>`
  // 添加覆盖物
  if (car.infoWindow) {
    car.infoWindow.setMap(null)
  }
  let overlay = car.infoWindow = new GMap.OverlayView()
  overlay.setMap(map)
  overlay.onAdd = () => {
    let el = document.createElement('div')
    el.style.border = 'none'
    el.style.position = 'absolute'
    el.style.zIndex = 10
    el.innerHTML = info
    overlay.el = el
    let panes = overlay.getPanes()
    // overlayImage层级可以接受DOM事件
    let overlayImage = panes.overlayImage
    overlayImage.appendChild(el)
  }
  overlay.draw = () => {
    let el = overlay.el
    let projection = overlay.getProjection()
    let pixel = projection.fromLatLngToDivPixel(new GMap.LatLng(carInfo.Latitude, carInfo.Longitude))
    let content = el.children[0]
    let height = content.clientHeight
    let width = content.clientWidth
    el.style.top = (pixel.y - height) + 'px'
    el.style.left = (pixel.x - (width / 2)) + 'px'
  }
  overlay.onRemove = () => {
    overlay.el.parentNode.removeChild(overlay.el)
    overlay.el = null
    return overlay
  }
  // 延时解决无法获取closeBtn元素
  setTimeout(() => {
    let closeBtn = document.getElementById('closeBtn')
    let trailBtn = document.getElementById('trailBtn')
    let trackBtn = document.getElementById('trackBtn')
    closeBtn.addEventListener('click', () => {
      overlay.setMap(null)
    })
    trailBtn.addEventListener('click', () => {
      let pathname = window.location.pathname + '#'
      window.localStorage.getItem('trail', JSON.stringify(carInfo))
      // this.$localStorage('trail', JSON.stringify(carInfo))
      window.open(pathname + '/home/trail')
    })
    trackBtn.addEventListener('click', () => {
      let pathname = window.location.pathname + '#'
      window.localStorage.getItem('track', JSON.stringify(carInfo))
      // this.$localStorage('track', JSON.stringify(carInfo))
      window.open(pathname + '/home/track')
    })
  }, 13)
}

export default {
  loadJS,
  loadMapJS,
  loadBMapJS,
  initBMap,
  getBAddress,
  addBMarker,
  customBOverlay,
  loadGMapJS,
  initGMap,
  getGAddress,
  addGMarker,
  customGOverlay
}

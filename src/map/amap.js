// 高德地图js库
import {loadJS, noop, center, getTime, getPeriod, periodMark} from './util'

// 地图链接地址
const mapURL = '//webapi.amap.com/maps?v=1.3&key=36bbb44aa97730cacd6025ea4f9f11cf&plugin=AMap.Geocoder&callback=init'

// 加载地图JS库
const loadMapJS = (url, callback) => {
  // window.AMap 高德地图资源
  // 如果全局不存在window.AMap,则加载
  // 防止多次加载地图造成资源浪费
  if (!window.AMap) {
    loadJS(url)
    window.init = () => callback()
  } else {
    callback()
  }
}

// 初始化地图
const initMap = function (islocate, callback = noop, point = center) {
  let AMap = window.AMap
  this.map = new AMap.Map('map', {
    resizeEnable: true,
    zoom: 12,
    center: [point.lng, point.lat]
  })
  // 加载地图插件(比例尺、定位、类别切换)
  AMap.plugin(['AMap.Scale', 'AMap.MapType'], () => {
    this.map.addControl(new AMap.Scale())
    this.map.addControl(new AMap.MapType())
  })
  if (islocate) {
    AMap.plugin(['AMap.Geolocation'], () => {
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 10000, // 超过10秒后停止定位，默认：无穷大
        maximumAge: 0, // 定位结果缓存0毫秒，默认：0
        convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: false // 显示定位按钮，默认：true
      })
      geolocation.getCityInfo((status, result) => {
        if (status === 'complete') {
          this.map.panTo([result.center[0], result.center[1]])
        }
      })
    })
  }
  callback()
}

// 添加覆盖物
const addMarker = function (icon, point) {
  return new window.AMap.Marker({
    icon: icon,
    position: point,
    map: this.map
  })
}

// 文本覆盖物
const labelMarker = function (data) {
  return new window.AMap.Marker({
    content: `<div class="map-marker ${this.markerIcon[data['value']]}"><i>${data['LicensePlate']}</i></div>`,
    position: [data['Longitude'], data['Latitude']],
    map: this.map
  })
}

// 文本覆盖物
const hoverMarker = function (data) {
  return new window.AMap.Marker({
    content: `<div class="map-marker hover_icon"><i>${data['ReportingTime']}</i></div>`,
    position: [data['Longitude'], data['Latitude']],
    map: this.map,
    offset: new window.AMap.Pixel(-16, -5)
  })
}

// 图标覆盖物
const iconMarker = function (icon, text, point, pos = {x: -12, y: -12}) {
  return new window.AMap.Marker({
    content: `<div class="map-marker ${icon}"><i>${text}</i></div>`,
    position: point,
    map: this.map,
    offset: new window.AMap.Pixel(pos.x, pos.y)
  })
}

// 车标覆盖物
const carMarker = function (data) {
  if (!this.marker) this.marker = labelMarker.call(this, data)
  else this.marker.setPosition([data.Longitude, data.Latitude])
}

// 自定义窗体内容
const winContent = function (data, ftEl = '') {
  return `<div class="map-window">
            <div class="map-window-header">${data['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
            <div class="map-window-body">
              <div class="map-item"><label>${this.$t('common.organization')}:</label><span>${data['OrgName'] || JSON.parse(window.localStorage.getItem('trail') || '')['OrgName']}</span></div>
              <div class="map-item"><label>${this.$t('common.state')}:</label><span>${data['status']}</span></div>
              <div class="map-item"><label>${this.$t('loca.alarmType')}:</label><span>${data['AlarmType']}</span></div>
              <div class="map-item"><label>${this.$t('common.speedKm')}:</label><span>${data['Speed']}</span></div>
              <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${this.powerSupplyMode[data['PowerSupplyMode']]}</span></div>
              <div class="map-item"><label>${this.$t('loca.dumpEnergy')}:</label><span>${data['SurplusElectricity']}%</span></div>
              <div class="map-item"><label>${this.$t('loca.positionTime')}:</label><span>${data['ReportingTime']}</span></div>
              <div class="map-item"><label>${this.$t('boxUp.position')}:</label><span>${data['address']}</span></div>
            </div>
            ${ftEl}
          </div>`
}

// 跳转链接窗体内容
const winEventContent = function (data) {
  let El = `<div class="map-window-footer">
              <a class="footer-btn trail-btn" id="trailBtn">${this.$t('loca.runningOfTrack')}</a>
              <a class="footer-btn track-btn" id="trackBtn">${this.$t('loca.realtimeTrack')}</a>
            </div>`
  return winContent.call(this, data, El)
}

// 自定义信息窗体
const addInfoWin = function (data, content = winContent.call(this, data)) {
  if (!this.infoWindow) {
    this.infoWindow = new window.AMap.InfoWindow({
      isCustom: true,
      autoMove: true
    })
  }
  this.infoWindow.setContent(content)
  let point = [data.Longitude, data.Latitude]
  // 没有初始化信息窗体或关闭信息窗体,打开信息窗体,否则设置其坐标位置
  if (!this.infoWindow || !this.infoWindow.getIsOpen()) this.infoWindow.open(this.map, point)
  else this.infoWindow.setPosition(point)

  setTimeout(() => {
    let closeBtn = document.getElementById('closeBtn')
    closeBtn.addEventListener('click', () => {
      this.infoWindow.close()
    })
  }, 13)
}

// 自定义信息窗体
const addHoverInfoWin = function (data, content = winContent.call(this, data)) {
  if (!this.infoWindow) {
    this.infoWindow = new window.AMap.InfoWindow({
      isCustom: true,
      autoMove: true,
      offset: new window.AMap.Pixel(0, 26)
    })
  }
  this.infoWindow.setContent(content)
  let point = [data.Longitude, data.Latitude]
  // 没有初始化信息窗体或关闭信息窗体,打开信息窗体,否则设置其坐标位置
  if (!this.infoWindow || !this.infoWindow.getIsOpen()) this.infoWindow.open(this.map, point)
  else this.infoWindow.setPosition(point)
}

// 添加事件信息窗体
const addEventWin = function (data) {
  addInfoWin.call(this, data, winEventContent.call(this, data))
  // 延时解决无法获取closeBtn元素
  setTimeout(() => {
    let closeBtn = document.getElementById('closeBtn')
    let trailBtn = document.getElementById('trailBtn')
    let trackBtn = document.getElementById('trackBtn')
    closeBtn.addEventListener('click', () => {
      this.infoWindow.close()
    })
    trailBtn.addEventListener('click', () => {
      let trail = {
        CarID: data['CarID'],
        LicensePlate: data['LicensePlate'],
        OrgName: data['OrgName'],
        PowerSupplyMode: data['PowerSupplyMode'],
        SurplusElectricity: data['SurplusElectricity']
      }
      this.$localStorage('trail', JSON.stringify(trail))
      window.open('/#/home/aTrail')
    })
    trackBtn.addEventListener('click', () => {
      let track = {
        CarID: data['CarID'],
        OrgName: data['OrgName'],
        LicensePlate: data['LicensePlate']
      }
      this.$localStorage('track', JSON.stringify(track))
      window.open('/#/home/aTrack')
    })
  }, 13)
}

// 绘制轨迹
const drawPath = function (path = this.pathArr) {
  if (!this.polyline) {
    this.polyline = new window.AMap.Polyline({
      map: this.map,
      path,
      strokeColor: '#333',
      strokeOpacity: 0.5,
      strokeWeight: 4,
      strokeStyle: 'solid'
    })
  } else {
    this.polyline.setPath(path)
  }
}

// 添加车标事件
const addEventMarker = function (data) {
  // 文本和图标标注点
  let marker = labelMarker.call(this, data)
  marker.on('click', () => {
    // 自定义信息窗体
    addEventWin.call(this, data)
  })
}

// 添加车标轨迹
const addCarMarker = function (data) {
  // 首次渲染则创建车标标注、自定义信息窗体、路线轨迹
  // 之后只需改变相应内容和位置即可
  carMarker.call(this, data)
  addInfoWin.call(this, data)
  drawPath.call(this)
}

// 添加带有悬浮覆盖物
const addHoverWin = function (data) {
  if (this.circle) this.circle.hide()
  data['LicensePlate'] = this.trail['LicensePlate']
  if (this.hover) {
    this.hover.show()
    this.hover.setPosition([data.Longitude, data.Latitude])
  } else {
    this.hover = hoverMarker.call(this, data)
  }
  addHoverInfoWin.call(this, data)
  setTimeout(() => {
    let closeBtn = document.getElementById('closeBtn')
    closeBtn.addEventListener('click', () => {
      this.infoWindow.close()
      this.hover.hide()
    })
  }, 13)
}

// 添加带有悬浮覆盖物
const addCircleMarker = function (data) {
  if (this.circle) {
    this.circle.show()
    this.circle.setPosition([data.Longitude, data.Latitude])
  } else {
    this.circle = hoverMarker.call(this, data)
  }
  this.circle.on('click', () => {
    getAddress([data.Longitude, data.Latitude], address => {
      data['address'] = address
      addHoverWin.call(this, data)
    })
  })
}

// 绘制车辆历史轨迹
const drawCarPath = function () {
  // 清除地图覆盖物
  this.map.clearMap()
  // 绘制轨迹避免清除后无法绘制
  this.polyline = null
  drawPath.call(this)
  addMarker.call(this, require('@/assets/images/locus_start.png'), this.pathArr[0])
  addMarker.call(this, require('@/assets/images/locus_end.png'), this.pathArr[this.sliderSize - 1])
  this.stopArr.forEach(item => {
    iconMarker.call(this, 'stop_icon', item['time'], [item['Longitude'], item['Latitude']])
  })
  this.marker = iconMarker.call(this, 'car_icon', this.trail['LicensePlate'], this.pathArr[0])
}

// 获取地理位置
const getAddress = (point, callback) => {
  let [AMap, geocoder] = [window.AMap, window.geocoder]
  if (!geocoder) geocoder = window.geocoder = new AMap.Geocoder()
  AMap.convertFrom(point, 'gps', (status, result) => {
    geocoder.getAddress(result.locations, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        callback(result.regeocodes[0].formattedAddress)
      }
    })
  })
}

// 获取旋转角度
const getRotation = function (curPos, targetPos) {
  let deg = 0
  if (!targetPos) return deg
  curPos = this.map.lnglatToPixel(curPos)
  targetPos = this.map.lnglatToPixel(targetPos)
  if (targetPos.getX() !== curPos.getX()) {
    let tan = (targetPos.getY() - curPos.getY()) / (targetPos.getX() - curPos.getX())
    let atan = Math.atan(tan)
    deg = atan * 360 / (2 * Math.PI)
    if (targetPos.getX() < curPos.getX()) {
      deg = -deg + 90 + 90
    } else {
      deg = -deg
    }
    return -deg
  } else {
    let disy = targetPos.getY() - curPos.getY()
    let bias = 0
    if (disy > 0) bias = -1
    else bias = 1
    return -bias * 90
  }
}

// 获取最近距离
const getNearDistance = function () {
  let [zoom, ratio] = [this.map.getZoom(), 1]
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

// 获取最小距离
const getMinDistance = function (point) {
  point = new window.AMap.LngLat(point.lng, point.lat)
  let [index, distance] = [0, point.distance(this.pathArr[0])]
  this.pathArr.forEach((item, i) => {
    let curDistance = point.distance(item)
    if (curDistance < distance) {
      index = i
      distance = curDistance
    }
  })
  return {index, distance}
}

export default {
  mapURL,
  loadMapJS,
  initMap,
  addEventMarker,
  addCarMarker,
  addHoverWin,
  addCircleMarker,
  drawCarPath,
  getAddress,
  getRotation,
  getNearDistance,
  getMinDistance,
  getTime,
  periodMark,
  getPeriod
}

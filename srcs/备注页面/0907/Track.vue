<template>
  <div class="content-box track-content" :class="{'track-table-content': !isTableOpen}">
    <div class="trace-licence">{{track['LicensePlate']+ $t('loca.sTrack')}}</div>
    <div class="map-box" id="map"></div>
    <div class="monitor-table">
      <div class="monitor-table-header">
        <div class="title">{{$t('home.monitorList')}}</div>
        <div class="monitor-down-btn" @click="tableOpen"></div>
      </div>
      <div class="monitor-table-body" v-if="isTableOpen">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            width="80"
            :label="$t('index.indexField')">
          </el-table-column>
          <el-table-column
            prop="status"
            min-width="120"
            :label="$t('common.state')">
          </el-table-column>
          <el-table-column
            prop="AlarmType"
            min-width="240"
            :label="$t('loca.alarmType')">
          </el-table-column>
          <el-table-column
            prop="ReportingTime"
            min-width="150"
            :label="$t('loca.positionTime')">
          </el-table-column>
          <el-table-column
            prop="Speed"
            min-width="120"
            :label="$t('common.speedKm')">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import Maps from '@/utils/maps'
import gMap from '@/map/gmap'
import Transform from '@/utils/transform'
export default {
  name: 'track',
  data () {
    let track = JSON.parse(this.$localStorage('track') || '')
    return {
      time: 20,
      track: track,
      isTableOpen: false,
      map: null,
      geocoder: null,
      infoWindow: null,
      infoLay: null,
      marker: null,
      centerAPoint: [116.397428, 39.90923],
      centerGPoint: {lat: 39.90923, lng: 116.397428},
      powerSupplyMode: {0: this.$t('monitor.mainPower'), 1: this.$t('monitor.battery'), 2: this.$t('monitor.solarEnergy')},
      pathArr: [],
      markerClass: {
        3: 'move',
        4: 'unMove',
        5: 'stop',
        6: 'unStop',
        1: 'park',
        2: 'unPark',
        7: 'offline'
      },
      markerIcon: {
        3: 'monitor_run_icon',
        4: 'monitor_run_null_icon',
        5: 'monitor_stop_icon',
        6: 'monitor_stop_null_icon',
        1: 'monitor_park_icon',
        2: 'monitor_park_null_icon',
        7: 'monitor_offline_icon'
      },
      tableData: [],
      polyline: null
    }
  },
  beforeCreate () {
    this.$parent.isOpen = false
  },
  mounted () {
    if (this.$i18n.locale === 'zh') {
      Maps.loadMapJS('//webapi.amap.com/maps?v=1.3&key=36bbb44aa97730cacd6025ea4f9f11cf&plugin=AMap.Geocoder&callback=init', 'AMap', () => {
        let AMap = window.AMap
        let map = new AMap.Map('map', {
          resizeEnable: true,
          zoom: 12,
          center: this.centerAPoint
        })
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation', 'AMap.MapType'], function () {
          map.addControl(new AMap.ToolBar())
          map.addControl(new AMap.Scale())
          map.addControl(new AMap.Geolocation())
          map.addControl(new AMap.MapType())
        })
        this.infoWindow = new AMap.InfoWindow({
          isCustom: true
        })
        this.marker = new AMap.Marker({
          content: '',
          position: this.centerAPoint,
          map: map
        })
        this.geocoder = new AMap.Geocoder()
        this.map = map
        this.refreshHandle()
      })
    } else {
      gMap.loadMapJS('//maps.googleapis.com/maps/api/js?key=AIzaSyB2KjWfZMG_HJdCr3IBMqOIkQcGBzykuUI&language=en&callback=init', () => {
        gMap.initMap(() => this.refreshHandle())
      })
    }
  },
  methods: {
    refreshHandle () {
      this.getData()
      window.setInterval(() => {
        this.time--
        if (this.time === 0) {
          this.time = 20
          this.getData()
        }
      }, 1000)
    },
    // 表格收缩处理
    tableOpen () {
      this.isTableOpen = !this.isTableOpen
    },
    getData () {
      this.$get({
        url: '/location/carRealtimePosition',
        data: {carID: this.track['CarID']},
        success: data => {
          let point = Transform.wgs2gcj(data.Latitude, data.Longitude)
          if (this.$i18n.locale === 'zh') {
          } else {
            let GMap = window.google.maps
            // 清理覆盖物
            let overlays = window.overlays || []
            overlays.map(item => {
              item.setMap(null)
            })
            if (window.infoWindow) window.infoWindow.setMap(null)
            window.overlays = []
            gMap.getAddress(point, address => {
              data['Latitude'] = point.lat
              data['Longitude'] = point.lng
              data['address'] = address
              this.tableData.push(data)
              let markerPoint = new GMap.LatLng(data.Latitude, data.Longitude)
              this.pathArr.push(markerPoint)
              let content = `<div class="map-window google-map-window">
                          <div class="map-window-header">${data['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                          <div class="map-window-body">
                            <div class="map-item"><label>${this.$t('common.organization')}:</label><span>${this.track['OrgName']}</span></div>
                            <div class="map-item"><label>${this.$t('common.state')}:</label><span>${data['status']}</span></div>
                            <div class="map-item"><label>${this.$t('loca.alarmType')}:</label><span>${data['AlarmType']}</span></div>
                            <div class="map-item"><label>${this.$t('common.speedKm')}:</label><span>${data['Speed']}</span></div>
                            <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${this.powerSupplyMode[data['PowerSupplyMode']]}</span></div>
                            <div class="map-item"><label>${this.$t('loca.dumpEnergy')}:</label><span>${data['SurplusElectricity']}</span></div>
                            <div class="map-item"><label>${this.$t('loca.positionTime')}:</label><span>${data['ReportingTime']}</span></div>
                            <div class="map-item"><label>${this.$t('boxUp.position')}:</label><span>${data['address']}</span></div>
                          </div>
                        </div>`
              gMap.addCarMarker(point, require(`@/assets/images/car.png`), data['LicensePlate'], content, 65, 23)
              window.map.panTo(markerPoint)
              // 绘制轨迹
              if (this.polyline) {
                this.polyline.setPath(this.pathArr)
              } else {
                this.polyline = new GMap.Polyline({
                  map: window.map,
                  path: this.pathArr,
                  geodesic: true,
                  strokeColor: '#333',
                  strokeOpacity: 0.5,
                  strokeWeight: 4
                })
              }
            })
          }
        }
      })
    },
    initMap (item) {
      let map = this.map
      let powerSupplyMode = this.powerSupplyMode
      let marker = this.marker
      if (this.$i18n.locale === 'zh') {
        let infoWindow = this.infoWindow
        let lnglat = [item.Longitude, item.Latitude]
        map.panTo(lnglat)
        marker.setContent(`<div class="map-marker ${this.markerClass[this.track.value]}"><i>${item.LicensePlate}</i></div>`)
        marker.setPosition(lnglat)
        infoWindow.open(map, lnglat)
        this.getAddress(lnglat, address => {
          let info = `<div class="map-window">
                        <div class="map-window-header">${item['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                        <div class="map-window-body">
                          <div class="map-item"><label>${this.$t('common.organization')}:</label><span>${this.track['OrgName']}</span></div>
                          <div class="map-item"><label>${this.$t('common.state')}:</label><span>${item['status']}</span></div>
                          <div class="map-item"><label>${this.$t('loca.alarmType')}:</label><span>${item['AlarmType']}</span></div>
                          <div class="map-item"><label>${this.$t('common.speedKm')}:</label><span>${item['Speed']}</span></div>
                          <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${powerSupplyMode[item['PowerSupplyMode']]}</span></div>
                          <div class="map-item"><label>${this.$t('loca.dumpEnergy')}:</label><span>${item['SurplusElectricity']}</span></div>
                          <div class="map-item"><label>${this.$t('loca.positionTime')}:</label><span>${item['ReportingTime']}</span></div>
                          <div class="map-item"><label>${this.$t('boxUp.position')}:</label><span>${address}</span></div>
                        </div>
                      </div>`
          infoWindow.setContent(info)
        })
        // 绘制轨迹
        /* eslint-disable no-new */
        new window.AMap.Polyline({
          map: map,
          path: this.pathArr,
          strokeColor: '#333',
          strokeOpacity: 0.5,
          strokeWeight: 4,
          strokeStyle: 'solid'
        })
      } else {
        let GMap = window.google.maps
        let infoLay = this.infoLay
        let latlng = {lat: item.Latitude, lng: item.Longitude}
        // marker.setMap(null)
        map.panTo(latlng)
        marker.setPosition(latlng)
        infoLay.setMap(map)
        infoLay.onAdd = () => {
          let el = document.createElement('div')
          el.style.border = 'none'
          el.style.position = 'absolute'
          el.style.zIndex = 10
          el.innerHTML = `<div class="map-marker"><i>${item['LicensePlate']}</i></div>`
          infoLay.el = el
          let panes = infoLay.getPanes()
          let overlayLayer = panes.overlayLayer
          overlayLayer.appendChild(el)
        }
        infoLay.draw = () => {
          let el = infoLay.el
          let projection = infoLay.getProjection()
          let pixel = projection.fromLatLngToDivPixel(new GMap.LatLng(item.Latitude, item.Longitude))
          let content = el.children[0]
          let height = content.clientHeight
          let width = content.clientWidth
          el.style.top = (pixel.y - height) + 'px'
          el.style.left = (pixel.x - (width / 2)) + 'px'
        }
        this.getAddress(latlng, address => {
          let info = `<div class="map-window google-map-window">
                        <div class="map-window-header">${item['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                        <div class="map-window-body">
                          <div class="map-item"><label>${this.$t('common.organization')}:</label><span>${this.track['OrgName']}</span></div>
                          <div class="map-item"><label>${this.$t('common.state')}:</label><span>${item['status']}</span></div>
                          <div class="map-item"><label>${this.$t('loca.alarmType')}:</label><span>${item['AlarmType']}</span></div>
                          <div class="map-item"><label>${this.$t('common.speedKm')}:</label><span>${item['Speed']}</span></div>
                          <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${powerSupplyMode[item['PowerSupplyMode']]}</span></div>
                          <div class="map-item"><label>${this.$t('loca.dumpEnergy')}:</label><span>${item['SurplusElectricity']}</span></div>
                          <div class="map-item"><label>${this.$t('loca.positionTime')}:</label><span>${item['ReportingTime']}</span></div>
                          <div class="map-item"><label>${this.$t('boxUp.position')}:</label><span>${address}</span></div>
                        </div>
                      </div>`
          let overlay = new GMap.OverlayView()
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
            let pixel = projection.fromLatLngToDivPixel(new GMap.LatLng(item.Latitude, item.Longitude))
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
        })
        // 绘制轨迹
        /* eslint-disable no-new */
        new GMap.Polyline({
          map: map,
          path: this.pathArr,
          geodesic: true,
          strokeColor: '#333',
          strokeOpacity: 0.5,
          strokeWeight: 4
        })
      }
    },
    // 获取地理位置
    getAddress (lnglat, callback) {
      if (this.$i18n.locale === 'zh') {
        window.AMap.convertFrom(lnglat, 'gps', (status, result) => {
          this.geocoder.getAddress(result.locations, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              callback(result.regeocodes[0].formattedAddress)
            }
          })
        })
      } else {
        this.geocoder.geocode({'location': lnglat}, (result, status) => {
          if (status === 'OK') {
            callback(result[0].formatted_address)
          }
        })
      }
    }
  }
}
</script>

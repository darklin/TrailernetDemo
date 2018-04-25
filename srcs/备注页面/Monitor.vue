<template>
  <div class="content-box monitor-content" :class="{'monitor-table-content': !isTableOpen, 'monitor-search-content': !isSearchOpen}">
    <div class="monitor-status-list">
      <div class="item fl" @click="statusCheck(3)">
        <div class="title">{{$t('golbal.run')}}</div>
        <div class="text">{{statusData[3].length}}</div>
      </div>
      <div class="item fl" @click="statusCheck(4)">
        <div class="title">{{$t('golbal.run')}}</div>
        <div class="text">{{statusData[4].length}}</div>
      </div>
      <div class="item fl" @click="statusCheck(5)">
        <div class="title">{{$t('golbal.stop')}}</div>
        <div class="text">{{statusData[5].length}}</div>
      </div>
      <div class="item fl" @click="statusCheck(6)">
        <div class="title">{{$t('golbal.stop')}}</div>
        <div class="text">{{statusData[6].length}}</div>
      </div>
      <div class="item fl" @click="statusCheck(1)">
        <div class="title">{{$t('golbal.park')}}</div>
        <div class="text">{{statusData[1].length}}</div>
      </div>
      <div class="item fl" @click="statusCheck(2)">
        <div class="title">{{$t('golbal.park')}}</div>
        <div class="text">{{statusData[2].length}}</div>
      </div>
      <div class="item fl" @click="statusCheck(7)">
        <div class="title">{{$t('golbal.offline')}}</div>
        <div class="text">{{statusData[7].length}}</div>
      </div>
    </div>
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
          :row-class-name="highlightRow"
          style="width: 100%">
          <el-table-column
            type="index"
            width="80"
            :label="$t('index.indexField')"
            header-align="center"
            align="center">
          </el-table-column>
          <el-table-column
            prop="OrgName"
            width="120"
            header-align="center"
            align="center"
            :label="$t('common.organization')">
          </el-table-column>
          <el-table-column
            prop="LicensePlate"
            width="120"
            header-align="center"
            align="center"
            :label="$t('excel.licenseNumber')">
          </el-table-column>
          <el-table-column
            prop="status"
            min-width="120"
            header-align="center"
            align="center"
            :label="$t('common.state')">
          </el-table-column>
          <el-table-column
            prop="AlarmType"
            min-width="400"
            header-align="center"
            align="center"
            show-overflow-tooltip
            :label="$t('loca.alarmType')">
          </el-table-column>
          <el-table-column
            prop="ReportingTime"
            min-width="170"
            header-align="center"
            align="center"
            :label="$t('loca.positionTime')">
          </el-table-column>
          <el-table-column
            prop="Speed"
            min-width="120"
            :label="$t('common.speedKm')"
            header-align="center"
            align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            min-width="400"
            show-overflow-tooltip
            :label="$t('boxUp.position')">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="monitor-search" v-show="isSearchOpen">
      <div class="search-header">
        <div class="title">{{$t('loca.chooseCar')}}</div>
        <div class="monitor-open-btn" @click.stop="searchOpen"></div>
      </div>
      <div class="search-box clearfix">
        <el-form :model="searchForm" class="search-form">
          <el-form-item :label="$t('car.carNo')">
            <el-input v-model="searchForm.licensePlate"></el-input>
          </el-form-item>
          <el-form-item :label="$t('trailer.carState')">
            <el-select v-model="searchForm.status" clearable placeholder="">
              <el-option value="0" :label="$t('trailer.noLimit')"></el-option>
              <el-option value="1" :label="$t('golbal.park') +' ' + $t('golbal.boxUpAndNotConnect')"></el-option>
              <el-option value="2" :label="$t('golbal.park') +' ' + $t('golbal.notBoxUpAndNotConnect')"></el-option>
              <el-option value="3" :label="$t('golbal.run')  +' ' + $t('golbal.boxUpAndConnect')"></el-option>
              <el-option value="4" :label="$t('golbal.run')  +' ' + $t('golbal.notBoxUpAndConnect')"></el-option>
              <el-option value="5" :label="$t('golbal.stop') +' ' + $t('golbal.boxUpAndConnect')"></el-option>
              <el-option value="6" :label="$t('golbal.stop') +' ' + $t('golbal.notBoxUpAndConnect')"></el-option>
              <el-option value="7" :label="$t('golbal.offline')"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('common.organization')">
            <el-select v-model="searchForm.orgIDs" clearable placeholder="">
              <el-option v-for="item,index in zNodes" :label="item.name" :value="item.id" :key="index" :checked="item.checked"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button :loading="isLoading" class="search-btn fl" @click="searchHandle">{{$t('common.search')}}</el-button>
      </div>
      <el-tree
        :data="treeData"
        :props="{label: 'LicensePlate'}"
        node-key="CarID"
        ref="listTree"
        show-checkbox
        :render-content="renderContent"
        @node-click="handleNodeClick"
        @check-change="handleCheckChange"
        class="search-tree">
      </el-tree>
    </div>
    <div class="monitor-search-btn" @click.stop="searchOpen" v-show="!isSearchOpen"></div>
  </div>
</template>

<script>
import Maps from '@/utils/maps'
import Transform from '@/utils/transform'
let pathname = window.location.pathname + '#'
export default {
  name: 'monitor',
  data () {
    return {
      isLoading: false,
      isTableOpen: false,
      isSearchOpen: true,
      zNodes: [],
      searchForm: {
        status: '',
        licensePlate: '',
        orgIDs: ''
      },
      map: null,
      geocoder: null,
      centerAPoint: [116.397428, 39.90923],
      centerGPoint: {lat: 39.90923, lng: 116.397428},
      powerSupplyMode: {0: '主电', 1: '电池', 2: '太阳能'},
      checkStatus: 0,
      statusData: {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []},
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
        7: 'monitor_offline_icon',
        0: 'monitor_offline_truck_icon'
      },
      tableData: [],
      treeData: []
    }
  },
  beforeCreate () {
    this.$parent.isOpen = false
  },
  created () {
    this.getListTree()
    this.queryOrganizate()
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
        AMap.plugin(['AMap.Scale', 'AMap.Geolocation', 'AMap.MapType'], function () {
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: false // 显示定位按钮，默认：true
          })
          geolocation.getCityInfo(function (status, result) {
            if (status === 'complete') {
              map.setCenter([result.center[0], result.center[1]])
            }
          })
          map.addControl(new AMap.Scale())
          map.addControl(new AMap.MapType())
        })
        this.geocoder = new AMap.Geocoder()
        this.map = map
      })
    } else {
      Maps.loadMapJS('//maps.googleapis.com/maps/api/js?key=AIzaSyB2KjWfZMG_HJdCr3IBMqOIkQcGBzykuUI&language=en&callback=init', 'GMap', () => {
        let GMap = window.google.maps
        let map = new GMap.Map(document.getElementById('map'), {
          center: this.centerGPoint,
          clickableIcons: false,
          zoom: 12
        })
        this.geocoder = new GMap.Geocoder()
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            // eviltransform.gcj2wgs(lat, lng)
            map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude})
          })
        }
        this.map = map
      })
    }
  },
  watch: {
    geocoder () {
      this.getTableAddress()
    },
    map () {
      // 首页跳转过来的选中状态
      if (this.treeData.length) {
        window.setTimeout(() => {
          let status = this.$route.query.status
          if (status) this.statusCheck(Number(status))
        }, 500)
      }
    }
  },
  methods: {
    // 获取监控数据
    getListTree () {
      this.$get({
        url: '/location/listTree',
        data: this.searchForm,
        success: data => {
          let datas = data.datas || []
          for (var i = 0; i < datas.length; i++) {
            let temp = Transform.wgs2gcj(datas[i].Latitude, datas[i].Longitude)
            datas[i].Longitude = temp.lng
            datas[i].Latitude = temp.lat
          }
          let statusData = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []}
          let tableData = []
          datas.forEach(item => {
            if (item.value !== 0) {
              tableData.push(item)
            }
            if (item.value === 3) {
              statusData[3].push(item)
            } else if (item.value === 4) {
              statusData[4].push(item)
            } else if (item.value === 5) {
              statusData[5].push(item)
            } else if (item.value === 6) {
              statusData[6].push(item)
            } else if (item.value === 1) {
              statusData[1].push(item)
            } else if (item.value === 2) {
              statusData[2].push(item)
            } else if (item.value === 7) {
              statusData[7].push(item)
            }
          })
          this.statusData = statusData
          this.treeData = datas
          this.tableData = tableData
          this.getTableAddress()
          // 首页跳转过来的选中状态
          if (this.map) {
            window.setTimeout(() => {
              let status = this.$route.query.status
              if (status) this.statusCheck(Number(status))
            }, 500)
          }
        }
      })
    },
    // 获取表格地址数据
    getTableAddress () {
      this.tableData.map(item => {
        let point = null
        if (this.$i18n.locale === 'zh') {
          point = [item.Longitude, item.Latitude]
        } else {
          point = {lat: item.Latitude, lng: item.Longitude}
        }
        this.getAddress(point, address => {
          item['address'] = address
        })
      })
    },
    // 高亮选择的状态
    highlightRow (row, index) {
      if (row.value === this.checkStatus) {
        return 'monitor-check-row'
      }
    },
    // 车辆状态选择
    statusCheck  (status) {
      this.checkStatus = status
      this.$refs.listTree.setCheckedNodes(this.statusData[status])
    },
    // 节点被点击处理
    handleNodeClick (data, node) {
      this.$refs.listTree.setChecked(data, !node['checked'])
    },
    // 选中的车辆处理
    handleCheckChange (item, status) {
      if (item.value === 0) {
        if (status) {
          this.$nextTick(() => {
            this.$message({
              message: `${item.LicensePlate} 还未上路`,
              customClass: 'monitor-message',
              iconClass: 'message-img',
              duration: 2000
            })
            this.$refs.listTree.setChecked(item, false)
          })
        }
      } else {
        let checkedNodes = this.$refs.listTree.getCheckedNodes()
        this.initMap(checkedNodes)
      }
    },
    initMap (data) {
      let firstPoint = data[0]
      let map = this.map
      if (this.$i18n.locale === 'zh') {
        map.clearMap()
        if (firstPoint) {
          let AMap = window.AMap
          let powerSupplyMode = this.powerSupplyMode
          map.panTo([firstPoint.Longitude, firstPoint.Latitude])
          // 信息窗口
          let infoWindow = new AMap.InfoWindow({
            isCustom: true
          })
          for (let i = 0; i < data.length; i++) {
            let item = data[i]
            let lnglat = [item.Longitude, item.Latitude]
            let marker = new AMap.Marker({
              content: `<div class="map-marker ${this.markerClass[item.value]}"><i>${item.LicensePlate}</i></div>`,
              position: lnglat,
              map: map
            })
            marker.on('click', e => {
              this.getAddress(lnglat, address => {
                let info = `<div class="map-window">
                              <div class="map-window-header">${this.$t('excel.licenseNumber')}: ${item['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                              <div class="map-window-body">
                                <div class="map-item"><label>${this.$t('common.organization')}:</label><span>${item['OrgName']}</span></div>
                                <div class="map-item"><label>${this.$t('common.state')}:</label><span>${item['status']}</span></div>
                                <div class="map-item"><label>${this.$t('loca.alarmType')}:</label><span>${item['AlarmType']}</span></div>
                                <div class="map-item"><label>${this.$t('common.speedKm')}:</label><span>${item['Speed']}</span></div>
                                <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${powerSupplyMode[item['PowerSupplyMode']]}</span></div>
                                <div class="map-item"><label>${this.$t('loca.dumpEnergy')}:</label><span>${item['SurplusElectricity']}%</span></div>
                                <div class="map-item"><label>${this.$t('loca.positionTime')}:</label><span>${item['ReportingTime']}</span></div>
                                <div class="map-item"><label>${this.$t('boxUp.position')}:</label><span>${address}</span></div>
                              </div>
                              <div class="map-window-footer">
                                <a href="javascript:;" class="footer-btn trail-btn" id="trailBtn">${this.$t('loca.runningOfTrack')}</a>
                                <a href="javascript:;" class="footer-btn track-btn" id="trackBtn">${this.$t('loca.realtimeTrack')}</a>
                              </div>
                            </div>`
                infoWindow.setContent(info)
                infoWindow.open(map, e.target.getPosition())
                // 延时解决无法获取closeBtn元素
                setTimeout(() => {
                  let closeBtn = document.getElementById('closeBtn')
                  let trailBtn = document.getElementById('trailBtn')
                  let trackBtn = document.getElementById('trackBtn')
                  closeBtn.addEventListener('click', () => {
                    infoWindow.close()
                  })
                  trailBtn.addEventListener('click', () => {
                    this.$localStorage('trail', JSON.stringify(item))
                    window.open(pathname + '/home/trail')
                  })
                  trackBtn.addEventListener('click', () => {
                    this.$localStorage('track', JSON.stringify(item))
                    window.open(pathname + '/home/track')
                  })
                }, 13)
              })
            })
          }
        }
      } else {
        let GMap = window.google.maps
        map = new GMap.Map(document.getElementById('map'), {
          center: this.centerGPoint,
          clickableIcons: false,
          zoom: 12
        })
        if (firstPoint) {
          let overlay = null
          let powerSupplyMode = this.powerSupplyMode
          let point = this.centerGPoint = {lat: firstPoint.Latitude, lng: firstPoint.Longitude}
          map.panTo(point)
          for (let i = 0; i < data.length; i++) {
            let item = data[i]
            let latlng = {lat: item.Latitude, lng: item.Longitude}
            let marker = new GMap.Marker({
              position: latlng,
              icon: require(`@/assets/images/${this.markerIcon[item.value]}.png`),
              map: map
            })
            // 添加车辆信息提示
            let infoLay = new GMap.OverlayView()
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
            marker.addListener('click', e => {
              this.getAddress(latlng, address => {
                let info = `<div class="map-window google-map-window">
                              <div class="map-window-header">${this.$t('excel.licenseNumber')}: ${item['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                              <div class="map-window-body">
                                <div class="map-item"><label>${this.$t('common.organization')}:</label><span>${item['OrgName']}</span></div>
                                <div class="map-item"><label>${this.$t('common.state')}:</label><span>${item['status']}</span></div>
                                <div class="map-item"><label>${this.$t('loca.alarmType')}:</label><span>${item['AlarmType']}</span></div>
                                <div class="map-item"><label>${this.$t('common.speedKm')}:</label><span>${item['Speed']}</span></div>
                                <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${powerSupplyMode[item['PowerSupplyMode']]}</span></div>
                                <div class="map-item"><label>${this.$t('loca.dumpEnergy')}:</label><span>${item['SurplusElectricity']}%</span></div>
                                <div class="map-item"><label>${this.$t('loca.positionTime')}:</label><span>${item['ReportingTime']}</span></div>
                                <div class="map-item"><label>${this.$t('boxUp.position')}:</label><span>${address}</span></div>
                              </div>
                              <div class="map-window-footer">
                                <a href="javascript:;" class="footer-btn trail-btn" id="trailBtn">${this.$t('loca.runningOfTrack')}</a>
                                <a href="javascript:;" class="footer-btn track-btn" id="trackBtn">${this.$t('loca.realtimeTrack')}</a>
                              </div>
                            </div>`
                // 添加覆盖物
                if (overlay) {
                  overlay.setMap(null)
                }
                overlay = new GMap.OverlayView()
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
                // 延时解决无法获取closeBtn元素
                setTimeout(() => {
                  let closeBtn = document.getElementById('closeBtn')
                  let trailBtn = document.getElementById('trailBtn')
                  let trackBtn = document.getElementById('trackBtn')
                  closeBtn.addEventListener('click', () => {
                    overlay.setMap(null)
                  })
                  trailBtn.addEventListener('click', () => {
                    this.$localStorage('trail', JSON.stringify(item))
                    window.open(pathname + '/home/trail')
                  })
                  trackBtn.addEventListener('click', () => {
                    this.$localStorage('track', JSON.stringify(item))
                    window.open(pathname + '/home/track')
                  })
                }, 13)
              })
            })
          }
        }
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
    },
    // 获取机构信息
    queryOrganizate () {
      this.$get({
        url: '/assist/queryOrganizate',
        success: data => {
          this.zNodes = data.zNodes || []
        }
      })
    },
    // 表格收缩处理
    tableOpen () {
      this.isTableOpen = !this.isTableOpen
    },
    // 搜索收缩处理
    searchOpen () {
      this.isSearchOpen = !this.isSearchOpen
    },
    // 搜索结果处理
    searchHandle () {
      this.getListTree()
    },
    renderContent (h, {node, data}) {
      return h('span', {class: `el-tree-node__label ${this.markerIcon[data.value]}`}, data.LicensePlate)
    }
  }
}
</script>

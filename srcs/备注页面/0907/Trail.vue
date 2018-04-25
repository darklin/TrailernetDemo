<template>
  <div class="content-box monitor-content" :class="{'monitor-table-content': !isTableOpen, 'monitor-search-content': !isSearchOpen}">
    <div class="trace-licence">{{trail['LicensePlate'] + $t('loca.sTrack')}}</div>
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
          @row-click="rowHandle"
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
          <!-- <el-table-column
            prop="address"
            min-width="400"
            show-overflow-tooltip
            :label="$t('boxUp.position')">
          </el-table-column> -->
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
          <el-form-item :label="$t('loca.chooseCar')">
            <el-select v-model="searchForm.carID" filterable clearable placeholder="">
              <el-option v-for="item,index in carData" :label="item.LicensePlate" :value="item.CarID" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('loca.startTime')">
            <el-date-picker
              v-model="startDate"
              ref="startTime"
              format="yyyy-MM-dd HH:mm"
              type="datetime"
              :picker-options="startPicker"
              @change="startChange">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('loca.endTime')">
            <el-date-picker
              v-model="endDate"
              ref="endTime"
              format="yyyy-MM-dd HH:mm"
              type="datetime"
              :picker-options="endPicker">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('loca.parkingSpace')">
            <el-input type="number" v-model="parkGap"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="mapMove">{{$t('loca.follow')}}</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button :loading="isLoading" class="search-btn fl"  @click="playHandle(1)">{{$t('common.search')}}</el-button>
          </el-form-item>
          <el-form-item>
            <div class="trace-start-position">{{$t('loca.startPoint')}}: {{startPoint}}</div>
          </el-form-item>
          <el-form-item>
            <div class="trace-end-position">{{$t('loca.endPoint')}}: {{endPoint}}</div>
          </el-form-item>
          <el-form-item>
            <div class="trace-distance">{{$t('loca.totalMileage')}}: {{totalDistance | thousands}}km</div>
          </el-form-item>
          <el-form-item>
            <div class="trace-distance">{{$t('monitor.runTimeLen')}}: {{runTime}}</div>
          </el-form-item>
        </el-form>
        <!-- <el-button :loading="isLoading" class="search-btn fl" @click="searchHandle">播放</el-button> -->
      </div>
      <div class="trace-play-slider">
        <div class="clearfix">
          <div class="start-point-mark fl"></div>
          <el-slider v-model="progress" :show-tooltip="false" :max="sliderSize" @change="sliderChange"></el-slider>
          <div class="end-point-mark fr"></div>
        </div>
        <!-- <div class="trace-play-ctrl">
          <div class="rewind-btn"></div>
          <div class="play-btn" @click="playHandle"></div>
          <div class="forward-btn"></div>
        </div> -->
        <div class="trace-play-point clearfix">
          <div class="point-text start-point fl">{{$t('loca.startPoint')}}</div>
          <div class="point-text end-point fr">{{$t('loca.endPoint')}}</div>
        </div>
        <div class="trace-play-speed">{{'x' + playSpeed}}</div>
        <div class="trace-play-ctrl">
          <div class="rewind-btn" @click="backward"></div>
          <div class="play-btn" :class="{'pause-btn': playStatus !== 'play'}" @click="drawPath"></div>
          <div class="forward-btn" @click="forward"></div>
        </div>
      </div>
    </div>
    <div class="monitor-search-btn" @click.stop="searchOpen" v-show="!isSearchOpen"></div>
  </div>
</template>

<script>
import Maps from '@/utils/maps'
import gMap from '@/map/gmap'
import Transform from '@/utils/transform'
let markers = []
export default {
  name: 'trail',
  data () {
    let trail = JSON.parse(this.$localStorage('trail') || '')
    let [startDate, endDate] = [new Date(), new Date()]
    startDate.setHours(0)
    startDate.setMinutes(0)
    endDate.setHours(23)
    endDate.setMinutes(59)
    return {
      trail: trail,
      isLoading: false,
      isTableOpen: false,
      isSearchOpen: true,
      carData: [],
      checkRow: -1,
      searchForm: {
        carID: trail['CarID'],
        startTime: '',
        endTime: ''
      },
      startDate: startDate,
      endDate: endDate,
      playSpeed: 1,
      parkGap: 10,
      mapMove: true,
      startPoint: '',
      endPoint: '',
      totalDistance: 0,
      runTime: '',
      curTime: '',
      startTime: '',
      endTime: '',
      progress: 0,
      sliderSize: 0,
      startPicker: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      endPicker: {
        disabledDate (time) {
          return Date.now() - 8.64e7 > time.getTime() || time.getTime() > Date.now()
        }
      },
      powerSupplyMode: {0: this.$t('monitor.mainPower'), 1: this.$t('monitor.battery'), 2: this.$t('monitor.solarEnergy')},
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
      pathArr: [],
      stopArr: [],
      marker: null,
      timer: null,
      playStatus: 'ready'
    }
  },
  beforeCreate () {
    this.$parent.isOpen = false
  },
  created () {
    this.getListTree()
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
          map.addControl(new AMap.Geolocation())
          map.addControl(new AMap.MapType())
        })
        this.geocoder = new AMap.Geocoder()
        this.map = map
      })
    } else {
      gMap.loadMapJS('//maps.googleapis.com/maps/api/js?key=AIzaSyB2KjWfZMG_HJdCr3IBMqOIkQcGBzykuUI&language=en&libraries=geometry&callback=init', () => gMap.initMap())
    }
  },
  methods: {
    // 设置结束时间
    startChange (date) {
      let dataArr = date.match(/(\d+)-(\d+)-(\d+)/)
      let endDate = new Date(dataArr[1], dataArr[2] - 1, dataArr[3], 23, 59, 0)
      this.endPicker.disabledDate = time => {
        return new Date(date).getTime() > time.getTime() || time.getTime() > endDate.getTime() + 6.048e8 || time.getTime() > Date.now()
      }
      this.endDate = endDate
    },
    // 获取监控数据
    getListTree () {
      this.$get({
        url: '/location/listTree',
        success: data => {
          let datas = data.datas || []
          this.carData = datas
        }
      })
    },
    // 拖动播放滑块
    sliderChange (val) {},
    // 表格收缩处理
    tableOpen () {
      this.isTableOpen = !this.isTableOpen
    },
    // 搜索收缩处理
    searchOpen () {
      this.isSearchOpen = !this.isSearchOpen
    },
    // 高亮选择的状态
    highlightRow (row, index) {
      if (index === this.checkRow) {
        return 'monitor-check-row'
      }
    },
    // 某一行被点击
    rowHandle (row) {
      if (window.hoverOverlay) {
        gMap.removeOverlay(window.hoverOverlay)
        gMap.removeOverlay(window.hoverCircle)
      }
      let [item, index] = [row, row['index']]
      gMap.getAddress(this.pathArr[index], address => {
        let content = `<div class="map-window">
                        <div class="map-window-header">${this.trail['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                        <div class="map-window-body">
                          <div class="map-item"><label>${this.$t('common.organization')}:</label><span>${this.trail['OrgName']}</span></div>
                          <div class="map-item"><label>${this.$t('common.state')}:</label><span>${item['status']}</span></div>
                          <div class="map-item"><label>${this.$t('loca.alarmType')}:</label><span>${item['AlarmType']}</span></div>
                          <div class="map-item"><label>${this.$t('common.speedKm')}:</label><span>${item['Speed']}</span></div>
                          <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${this.powerSupplyMode[this.trail['PowerSupplyMode']]}</span></div>
                          <div class="map-item"><label>${this.$t('loca.dumpEnergy')}:</label><span>${this.trail['SurplusElectricity']}%</span></div>
                          <div class="map-item"><label>${this.$t('loca.positionTime')}:</label><span>${item['ReportingTime']}</span></div>
                          <div class="map-item"><label>${this.$t('boxUp.position')}:</label><span>${address}</span></div>
                        </div>
                      </div>`
        gMap.addHoverOverlay(this.pathArr[index], content)
        window.hoverCircle = gMap.addHoverMarker(this.pathArr[index], require(`@/assets/images/hover_marker.png`), this.tableData[index]['ReportingTime'])
        this.checkRow = index
      })
    },
    // 查询历史信息
    searchHandle (callback) {
      this.searchForm['startTime'] = this.$refs['startTime'].displayValue
      this.searchForm['endTime'] = this.$refs['endTime'].displayValue
      this.$get({
        url: '/location/carHistoryPosition',
        data: this.searchForm,
        success: data => {
          let info = data['info'] || {}
          let history = info['arrCarHistoryPosition'] || []
          callback(history)
        }
      })
    },
    // 快进
    forward () {
      if (this.playSpeed < 8) {
        this.playSpeed *= 2
        this.playStatus = 'pause'
        clearInterval(this.timer)
        this.drawPath()
      }
    },
    // 快退
    backward () {
      if (this.playSpeed > 1) {
        this.playSpeed /= 2
        this.playStatus = 'pause'
        clearInterval(this.timer)
        this.drawPath()
      }
    },
    // 播放处理
    playHandle (flags) {
      if (this.marker && flags === 1) {
        this.marker = null
        this.progress = 0
        if (window.overlays) {
          window.overlays.map(item => {
            item.setMap(null)
          })
        }
      }
      if (!this.marker) {
        this.searchHandle(data => {
          if (!data.length) {
            this.$message(this.$t('locu.noDate'))
          } else {
            let GMap = window.google.maps
            let [flag, startTime, len, firstTime, lastTime, firstMileage, lastMileage, pathArr, pointArr, stopPoint, stopArr, num] = [false, 0, data.length - 1, 0, 0, 0, 0, [], [], null, [], 0]
            data.forEach((item, index) => {
              let {lng, lat} = Transform.wgs2gcj(item.Latitude, item.Longitude)
              item.Latitude = lat
              item.Longitude = lng
              if (!item.Speed) {
                if (!flag) {
                  flag = true
                  startTime = item['ReportingTime']
                  stopPoint = item
                }
                // 最后一个点速度也为0
                if (index === len) {
                  flag = false
                  let endTime = item['ReportingTime']
                  // 轨迹点数组
                  pointArr.push(new GMap.LatLng(lat, lng))
                  stopPoint['index'] = num++
                  pathArr.push(stopPoint)
                  if (gMap.getTime(endTime) - gMap.getTime(startTime) > this.parkGap * 60 * 1000) {
                    stopPoint['time'] = gMap.periodMark(startTime, endTime)
                    stopArr.push(stopPoint)
                  }
                }
              } else {
                if (flag) {
                  flag = false
                  let endTime = item['ReportingTime']
                  // 轨迹点数组
                  pointArr.push(new GMap.LatLng(lat, lng))
                  stopPoint['index'] = num++
                  pathArr.push(stopPoint)
                  if (gMap.getTime(endTime) - gMap.getTime(startTime) > this.parkGap * 60 * 1000) {
                    stopPoint['time'] = gMap.periodMark(startTime, endTime)
                    stopArr.push(stopPoint)
                  }
                }
                // 轨迹点数组
                pointArr.push(new GMap.LatLng(lat, lng))
                item['index'] = num++
                pathArr.push(item)
              }
              if (index === 0) {
                firstTime = item.ReportingTime
                firstMileage = item.TotalMileage
                gMap.getAddress({lng, lat}, address => {
                  this.startPoint = address
                })
                window.map.panTo({lng, lat})
              }
              if (index === len) {
                lastTime = item.ReportingTime
                lastMileage = item.TotalMileage
                gMap.getAddress({lng, lat}, address => {
                  this.endPoint = address
                })
              }
            })
            this.startTime = firstTime
            this.endTime = lastTime
            this.runTime = gMap.getPeriod(firstTime, lastTime)
            this.totalDistance = (lastMileage - firstMileage).toFixed(2)
            this.stopArr = stopArr
            this.pathArr = pointArr
            this.sliderSize = pointArr.length
            this.initMap(pointArr)
            this.tableData = pathArr
            let defaultIndex = -1
            window.map.addListener('mousemove', e => {
              if (pathArr.length) {
                let {index, distance} = gMap.getMinDistance(e.latLng, pointArr)
                if (distance > gMap.getNearDistance()) {
                  if (window.hoverMarker) {
                    gMap.removeOverlay(window.hoverMarker)
                    window.hoverMarker = null
                  }
                } else {
                  if (!window.hoverMarker) {
                    let hoverMarker = window.hoverMarker = gMap.addHoverMarker(pointArr[index], require(`@/assets/images/hover_marker.png`), pathArr[index]['ReportingTime'])
                    hoverMarker.addListener('click', e => {
                      if (window.hoverOverlay) {
                        gMap.removeOverlay(window.hoverOverlay)
                        gMap.removeOverlay(window.hoverCircle)
                      }
                      let item = pathArr[index]
                      gMap.getAddress(pointArr[index], address => {
                        let content = `<div class="map-window">
                                        <div class="map-window-header">${this.trail['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                                        <div class="map-window-body">
                                          <div class="map-item"><label>${this.$t('common.organization')}:</label><span>${this.trail['OrgName']}</span></div>
                                          <div class="map-item"><label>${this.$t('common.state')}:</label><span>${item['status']}</span></div>
                                          <div class="map-item"><label>${this.$t('loca.alarmType')}:</label><span>${item['AlarmType']}</span></div>
                                          <div class="map-item"><label>${this.$t('common.speedKm')}:</label><span>${item['Speed']}</span></div>
                                          <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${this.powerSupplyMode[this.trail['PowerSupplyMode']]}</span></div>
                                          <div class="map-item"><label>${this.$t('loca.dumpEnergy')}:</label><span>${this.trail['SurplusElectricity']}%</span></div>
                                          <div class="map-item"><label>${this.$t('loca.positionTime')}:</label><span>${item['ReportingTime']}</span></div>
                                          <div class="map-item"><label>${this.$t('boxUp.position')}:</label><span>${address}</span></div>
                                        </div>
                                      </div>`
                        gMap.addHoverOverlay(pointArr[index], content)
                        window.hoverCircle = gMap.addHoverMarker(pointArr[index], require(`@/assets/images/hover_marker.png`), pathArr[index]['ReportingTime'])
                        this.checkRow = index
                      })
                    })
                  } else {
                    if (defaultIndex !== index) {
                      if (window.hoverMarker) gMap.removeOverlay(window.hoverMarker)
                      let hoverMarker = window.hoverMarker = gMap.addHoverMarker(pointArr[index], require(`@/assets/images/hover_marker.png`), pathArr[index]['ReportingTime'])
                      hoverMarker.addListener('click', e => {
                        if (window.hoverOverlay) {
                          gMap.removeOverlay(window.hoverOverlay)
                          gMap.removeOverlay(window.hoverCircle)
                        }
                        let item = pathArr[index]
                        gMap.getAddress(pointArr[index], address => {
                          let content = `<div class="map-window">
                                          <div class="map-window-header">${this.trail['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                                          <div class="map-window-body">
                                            <div class="map-item"><label>${this.$t('common.organization')}:</label><span>${this.trail['OrgName']}</span></div>
                                            <div class="map-item"><label>${this.$t('common.state')}:</label><span>${item['status']}</span></div>
                                            <div class="map-item"><label>${this.$t('loca.alarmType')}:</label><span>${item['AlarmType']}</span></div>
                                            <div class="map-item"><label>${this.$t('common.speedKm')}:</label><span>${item['Speed']}</span></div>
                                            <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${this.powerSupplyMode[this.trail['PowerSupplyMode']]}</span></div>
                                            <div class="map-item"><label>${this.$t('loca.dumpEnergy')}:</label><span>${this.trail['SurplusElectricity']}%</span></div>
                                            <div class="map-item"><label>${this.$t('loca.positionTime')}:</label><span>${item['ReportingTime']}</span></div>
                                            <div class="map-item"><label>${this.$t('boxUp.position')}:</label><span>${address}</span></div>
                                          </div>
                                        </div>`
                          gMap.addHoverOverlay({lat: pointArr[index].lat(), lng: pointArr[index].lng()}, content)
                          window.hoverCircle = gMap.addHoverMarker(pointArr[index], require(`@/assets/images/hover_marker.png`), pathArr[index]['ReportingTime'])
                          this.progress = index // 车位置移动到点击位置
                          this.checkRow = index
                        })
                      })
                    }
                  }
                  defaultIndex = index
                }
              }
            })
          }
        })
      } else {
        if (this.progress === this.sliderSize) {
          this.progress = 0
          this.drawPath()
        }
      }
    },
    initMap (data) {
      if (this.$i18n.locale === 'zh') {
        for (var i = 0; i < data.length; i++) {
          let temp = Transform.wgs2gcj(data[i].Latitude, data[i].Longitude)
          data[i].Longitude = temp.lng
          data[i].Latitude = temp.lat
        }
        let firstPoint = data[0]
        let lastPoint = data[data.length - 1]
        let firstTime = firstPoint.TotalRunTime
        let lastTime = lastPoint.TotalRunTime
        firstTime = new Date(firstTime).getTime()
        lastTime = new Date(lastTime).getTime()
        let runTime = lastTime - firstTime
        let day = Math.floor(runTime / 1440)
        runTime = runTime % 1440
        let hour = Math.floor(runTime / 60)
        runTime = runTime % 60
        let minute = runTime
        this.runTime = `${day}天${hour}时${minute}分`
        let map = this.map
        let AMap = window.AMap
        map.remove(markers)
        markers = []
        map.panTo([firstPoint.Longitude, firstPoint.Latitude])
        // 起点标记
        let startMaker = new AMap.Marker({
          icon: require('@/assets/images/locus_start.png'),
          position: [firstPoint.Longitude, firstPoint.Latitude],
          map: map
        })
        markers.push(startMaker)
        this.getAddress([firstPoint.Longitude, firstPoint.Latitude], address => {
          this.startPoint = address
        })
        // 终点标记
        let endMarker = new AMap.Marker({
          icon: require('@/assets/images/locus_end.png'),
          position: [lastPoint.Longitude, lastPoint.Latitude],
          map: map
        })
        markers.push(endMarker)
        this.getAddress([lastPoint.Longitude, lastPoint.Latitude], address => {
          this.endPoint = address
        })
        // 总里程
        this.totalDistance = lastPoint.TotalMileage - firstPoint.TotalMileage
        this.totalDistance = this.totalDistance.toFixed(2)
        // 行驶标记
        let marker = new AMap.Marker({
          icon: require('@/assets/images/car.png'),
          position: [firstPoint.Longitude, firstPoint.Latitude],
          offset: new AMap.Pixel(-26, -13),
          map: map,
          autoRotation: true
        })
        markers.push(marker)
        let pathArr = []
        data.forEach(item => {
          pathArr.push([item.Longitude, item.Latitude])
        })
        // 绘制轨迹
        /* eslint-disable no-new */
        new AMap.Polyline({
          map: map,
          path: pathArr,
          strokeColor: '#333',
          strokeOpacity: 0.5,
          strokeWeight: 4,
          strokeStyle: 'solid'
        })
        map.setFitView()
        marker.moveAlong(pathArr, this.playSpeed)
        marker.on('moving', () => {
          // 画面跟随
          if (this.mapMove) {
            let position = marker.getPosition()
            let mLng = position.lng
            let mLat = position.lat
            if (mLng < map.getBounds().getSouthWest().lng || mLng > map.getBounds().getNorthEast().lng || mLat < map.getBounds().getSouthWest().lat || mLat > map.getBounds().getNorthEast().lat) {
              map.panTo(marker.getPosition())
            }
          }
        })
      } else {
        let GMap = window.google.maps
        this.polyline = new GMap.Polyline({
          map: window.map,
          path: data,
          geodesic: true,
          strokeColor: '#333',
          strokeOpacity: 0.5,
          strokeWeight: 4
        })
        gMap.addMarker(data[0], require('@/assets/images/locus_start.png'))
        gMap.addMarker(data[this.sliderSize - 1], require('@/assets/images/locus_end.png'))
        this.stopArr.forEach(item => {
          gMap.addStopMarker(new GMap.Point(item.Longitude, item.Latitude), require('@/assets/images/stop.png'), item['time'])
        })
        this.marker = gMap.addLabelMarker(data[this.progress], require(`@/assets/images/car.png`), this.trail['LicensePlate'], 65, 23)
      }
    },
    drawPath () {
      if (this.playStatus === 'ready' || this.playStatus === 'pause') {
        this.timer = setInterval(() => {
          if (this.sliderSize === this.progress) {
            this.playStatus = 'end'
            clearInterval(this.timer)
          } else {
            if (this.playStatus === 'ready' || this.playStatus === 'pause') this.playStatus = 'play'
            this.progress++
            this.curTime = this.tableData[this.progress - 1]['ReportingTime']
            let [point, map] = [this.pathArr[this.progress - 1], window.map]
            // 旋转角度
            // let rotation = gMap.getRotation(point, this.pathArr[this.progress])
            this.marker.setPosition(point)
            // this.marker.setIcon({
            //   path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            //   rotation
            // })
            if (this.mapMove) {
              if (point.lng() < map.getBounds().getSouthWest().lng() || point.lng() > map.getBounds().getNorthEast().lng() || point.lat() < map.getBounds().getSouthWest().lat() || point.lat() > map.getBounds().getNorthEast().lat()) {
                map.panTo(point)
              }
            }
          }
        }, 200 / this.playSpeed)
      } else if (this.playStatus === 'play') {
        this.playStatus = 'pause'
        clearInterval(this.timer)
      } else if (this.playStatus === 'end') {
        this.playStatus = 'ready'
        this.progress = 0
        this.drawPath()
      }
    }
  }
}
</script>

<template>
  <div class="content-box monitor-content" :class="{'monitor-table-content': !isTableOpen, 'monitor-search-content': !isSearchOpen}">
    <div class="trace-licence">{{trail['LicensePlate'] + $t('loca.sTrack')}}</div>
    <div class="map-box" id="map"></div>
    <speed-canvas :canvasData="canvasData" :unit="unitStr" />
    <div class="monitor-table">
      <div class="monitor-table-header">
        <div class="title">{{$t('home.monitorList')}}</div>
        <div class="monitor-down-btn" @click="tableOpen"></div>
      </div>
      <div class="monitor-table-body" v-if="isTableOpen">
        <el-table
          :data="tableData"
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
            <el-button class="search-btn fl" icon="search"  @click="playHandle(1)">{{$t('common.search')}}</el-button>
          </el-form-item>
          <el-form-item class="search-addr">
            <div class="trace-start-position">{{$t('loca.startPoint')}}: {{startAddr}}</div>
          </el-form-item>
          <el-form-item class="search-addr">
            <div class="trace-end-position">{{$t('loca.endPoint')}}: {{endAddr}}</div>
          </el-form-item>
          <el-form-item>
            <div class="trace-distance">{{$t('loca.totalMileage')}}: {{totalDistance | thousands}} {{unitStr}}</div>
          </el-form-item>
          <el-form-item>
            <div class="trace-distance">{{$t('monitor.runTimeLen')}}: {{runTime}}</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="trace-play-slider clearfix">
      <div class="trace-play-ctrl fl">
        <div class="rewind-btn" @click="backward"></div>
        <div class="play-btn" :class="{'pause-btn': playStatus !== 'play'}" @click="drawPath"></div>
        <div class="forward-btn" @click="forward"></div>
      </div>
      <div class="fl">
        <el-slider v-model="progress" :show-tooltip="false" :max="sliderSize"></el-slider>
        <div class="trace-play-point clearfix">
          <div class="point-text start-point fl">{{$t('loca.startPoint')}}</div>
          <div class="point-text end-point fr">{{$t('loca.endPoint')}}</div>
        </div>
        <div class="trace-play-speed">{{'x' + playSpeed}}</div>
      </div>
    </div>
    <div class="monitor-search-btn" @click.stop="searchOpen" v-show="!isSearchOpen"></div>
  </div>
</template>

<script>
import gMap from '@/map/gmap'
import Transform from '@/utils/transform'
import mixin from '@/mixins/index'
import SpeedCanvas from '@/components/SpeedCanvas'
export default {
  name: 'g-trail',
  mixins: [mixin],
  data () {
    let trail = JSON.parse(this.$localStorage('trail') || '')
    let [startDate, endDate] = [new Date(), new Date()]
    startDate.setHours(0)
    startDate.setMinutes(0)
    endDate.setHours(23)
    endDate.setMinutes(59)
    return {
      trail,
      isTableOpen: false,
      isSearchOpen: true,
      carData: [],
      searchForm: {
        carID: trail['CarID'],
        startTime: '',
        endTime: ''
      },
      startDate,
      endDate,
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
      canvasData: [],
      first: true, // 第一次
      checkRow: -1, // 选中的行
      playSpeed: 1, // 播放速度
      parkGap: 10, // 停车间隔
      mapMove: true, // 是否画面跟随
      startAddr: '', // 起点位置
      endAddr: '', // 终点位置
      totalDistance: 0, // 总里程
      runTime: '', // 运行时长
      progress: 0, // 播放进度
      sliderSize: 0, // 总进度
      tableData: [],
      pathArr: [],
      stopArr: [],
      playStatus: 'ready', // 播放状态
      unitStr: ''
    }
  },
  created () {
    this.getListTree()
  },
  mounted () {
    gMap.loadMapJS('//maps.googleapis.com/maps/api/js?key=AIzaSyB2KjWfZMG_HJdCr3IBMqOIkQcGBzykuUI&language=en&libraries=geometry&callback=init', () => gMap.initMap())
  },
  beforeDestroy () {
    // 跳转页面前清除定时器
    clearInterval(this.timer)
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
          this.carData = data.datas || []
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
    // 高亮选择的状态
    highlightRow (row, index) {
      if (index === this.checkRow) {
        return 'monitor-check-row'
      }
    },
    // 某一行被点击
    rowHandle (row) {
      if (window.hoverWinLay) window.hoverWinLay.setMap(null)
      if (window.hoverWinMarker) window.hoverWinMarker.setMap(null)
      if (window.hoverOverlay) window.hoverOverlay.setMap(null)
      let [item, index] = [row, row['index']]
      gMap.getAddress(this.pathArr[index], address => {
        let content = `<div class="map-window">
                        <div class="map-window-header">${this.trail['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                        <div class="map-window-body">
                          <div class="map-item"><label>${this.$t('common.organization')}:</label><span>${this.trail['OrgName']}</span></div>
                          <div class="map-item"><label>${this.$t('common.state')}:</label><span>${item['status']}</span></div>
                          <div class="map-item"><label>${this.$t('loca.alarmType')}:</label><span>${item['AlarmType']}</span></div>
                          <div class="map-item"><label>${this.$t('common.speedKm')}:</label><span>${item['Speed']}</span></div>
                          <div class="map-item"><label>${this.$t('monitor.temperature')}:</label><span>${item['Temperature']}℃</span></div>
                          <div class="map-item"><label>PSI:</label><span>${item['PSIStatus']}</span></div>
                          <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${this.powerSupplyMode[row['PowerSupplyMode']]}</span></div>
                          <div class="map-item"><label>${this.$t('loca.dumpEnergy')}:</label><span>${this.trail['SurplusElectricity']}%</span></div>
                          <div class="map-item"><label>${this.$t('loca.positionTime')}:</label><span>${item['ReportingTime']}</span></div>
                          <div class="map-item"><label>${this.$t('boxUp.position')}:</label><span>${address}</span></div>
                        </div>
                      </div>`
        gMap.addHoverOverlay(this.pathArr[index], content)
        let {marker, infoLay} = gMap.addHoverMarker(this.pathArr[index], require(`@/assets/images/hover_marker.png`), this.tableData[index]['ReportingTime'])
        window.hoverWinLay = infoLay
        window.hoverWinMarker = marker
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
          // this.snapToRoads(history)
          let unit = info['Unit']
          this.canvasData = history
          callback(history, unit)
        }
      })
    },
    // 绑路  (有跨域问题及路径字段过长问题)
    snapToRoads (history) {
      let pathValues = ''
      history.forEach((item, index) => {
        pathValues = pathValues + item.Latitude + ',' + item.Longitude + '|'
      })
      pathValues = pathValues.substring(0, 209)
      this.$get({
        url: 'https://roads.googleapis.com/v1/snapToRoads',
        data: {
          interpolate: true,
          key: 'AIzaSyB2KjWfZMG_HJdCr3IBMqOIkQcGBzykuUI',
          path: pathValues
        },
        success: data => {
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
      // 搜索按钮且不是第一次初始化
      // 置空车辆标注物
      if (flags === 1) {
        this.first = false
        this.progress = 0
        if (window.overlays) gMap.removeOverlay(window.overlays)
        if (window.hoverWinLay) window.hoverWinLay.setMap(null)
        if (window.startMarker) window.startMarker.setMap(null)
        if (window.endMarker) window.endMarker.setMap(null)
        if (window.hoverWinMarker) window.hoverWinMarker.setMap(null)
        if (window.hoverOverlay) window.hoverOverlay.setMap(null)
      }
      if (!this.first) {
        this.searchHandle((data, unit) => {
          this.unitStr = (!unit ? ' km' : ' mile')
          if (!data.length) {
            this.$message(this.$t('locu.noDate'))
          } else {
            let [line, lineArr, startPoint, flag, startTime, len, firstTime, lastTime, firstMileage, lastMileage, pathArr, pointArr, stopPoint, stopArr, num] = [0, [], '', false, 0, data.length - 1, 0, 0, 0, 0, [], [], null, [], 0]
            for (let index = 0; index < data.length; index++) {
            // data.forEach((item, index) => {
              let item = data[index]
              let point = Transform.wgs2gcj(item.Latitude, item.Longitude)
              if (index === 0) {
                startPoint = point
              }
              item.Latitude = point.lat
              item.Longitude = point.lng
              // 针对美国位置漂移到中国
              if (startPoint.lng - point.lng < -60) {
                continue
              }
              // 将接挂和甩挂的点分开，增加CoorType属性进行区分 -1代表甩挂的点 其他代表接挂
              if (item.IsConnectingTrailer === 1) {
                if (lineArr.indexOf(line) === -1) {
                  lineArr.push(line)
                }
                item['CoorType'] = line
              } else {
                line++
                item['CoorType'] = -1
              }
              if (item['PSIStatus'] === 0) {
                item['PSIStatus'] = this.$t('psi.echart.unactivated')
              } else {
                item['PSIStatus'] = this.$t('psi.echart.activated')
              }
              if (item.Temperature === 205) {
                item.Temperature = 'N/A'
              }
              if (!parseInt(item.Speed)) {
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
                  pointArr.push(point)
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
                  pointArr.push(point)
                  stopPoint['index'] = num++
                  pathArr.push(stopPoint)
                  if (gMap.getTime(endTime) - gMap.getTime(startTime) > this.parkGap * 60 * 1000) {
                    stopPoint['time'] = gMap.periodMark(startTime, endTime)
                    stopArr.push(stopPoint)
                  }
                }
                // 轨迹点数组
                pointArr.push(point)
                item['index'] = num++
                pathArr.push(item)
              }
              if (index === 0) {
                firstTime = item.TotalRunTime
                firstMileage = item.TotalMileage
                gMap.getAddress(point, address => {
                  this.startAddr = address
                })
                window.map.panTo(point)
              }
              if (index === len) {
                lastTime = item.TotalRunTime
                lastMileage = item.TotalMileage
                gMap.getAddress(point, address => {
                  this.endAddr = address
                })
              }
              // 速度单位转换
              item.Speed = item.Speed + (!unit ? ' km/h' : ' mile/h')
            }
            this.startTime = firstTime
            this.endTime = lastTime
            this.runTime = gMap.getPeriod(firstTime, lastTime)
            this.totalDistance = (lastMileage - firstMileage).toFixed(2)
            this.stopArr = stopArr
            this.pathArr = pointArr
            this.sliderSize = pointArr.length
            this.rankPoint(data, lineArr)
            this.initMap(pointArr)
            this.tableData = pathArr
            let defaultIndex = -1
            window.map.addListener('mousemove', e => {
              if (pathArr.length) {
                let {index, distance} = gMap.getMinDistance(e.latLng, pointArr)
                if (window.hoverLay) window.hoverLay.setMap(null)
                if (window.hoverMarker) window.hoverMarker.setMap(null)
                if (distance <= gMap.getNearDistance()) {
                  let {marker, infoLay} = gMap.addHoverMarker(pointArr[index], require(`@/assets/images/hover_marker.png`), pathArr[index]['ReportingTime'])
                  window.hoverLay = infoLay
                  window.hoverMarker = marker
                  marker.addListener('click', e => {
                    if (window.hoverWinLay) window.hoverWinLay.setMap(null)
                    if (window.hoverWinMarker) window.hoverWinMarker.setMap(null)
                    if (window.hoverOverlay) window.hoverOverlay.setMap(null)
                    let item = pathArr[index]
                    gMap.getAddress(pointArr[index], address => {
                      let content = `<div class="map-window">
                                      <div class="map-window-header">${this.trail['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                                      <div class="map-window-body">
                                        <div class="map-item"><label>${this.$t('common.organization')}:</label><span>${this.trail['OrgName']}</span></div>
                                        <div class="map-item"><label>${this.$t('common.state')}:</label><span>${item['status']}</span></div>
                                        <div class="map-item"><label>${this.$t('loca.alarmType')}:</label><span>${item['AlarmType']}</span></div>
                                        <div class="map-item"><label>${this.$t('common.speedKm')}:</label><span>${item['Speed']}</span></div>
                                        <div class="map-item"><label>${this.$t('monitor.temperature')}:</label><span>${item['Temperature']}℃</span></div>
                                        <div class="map-item"><label>PSI:</label><span>${item['PSIStatus']}</span></div>
                                        <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${this.powerSupplyMode[item['PowerSupplyMode']]}</span></div>
                                        <div class="map-item"><label>${this.$t('loca.dumpEnergy')}:</label><span>${this.trail['SurplusElectricity']}%</span></div>
                                        <div class="map-item"><label>${this.$t('loca.positionTime')}:</label><span>${item['ReportingTime']}</span></div>
                                        <div class="map-item"><label>${this.$t('boxUp.position')}:</label><span>${address}</span></div>
                                      </div>
                                    </div>`
                      gMap.addHoverOverlay(pointArr[index], content)
                      let hoverObj = gMap.addHoverMarker(pointArr[index], require(`@/assets/images/hover_marker.png`), pathArr[index]['ReportingTime'])
                      window.hoverWinLay = hoverObj.infoLay
                      window.hoverWinMarker = hoverObj.marker
                      if (defaultIndex !== index) this.progress = index // 车位置移动到点击位置
                      this.checkRow = index
                    })
                  })
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
    rankPoint (data, lineArr) {
      let linePointArr = []
      let pointArr = []
      for (var i = 0; i < lineArr.length; i++) {
        data.forEach((item, index) => {
          if (item.CoorType === lineArr[i]) {
            linePointArr.push({lat: item.Latitude, lng: item.Longitude})
          }
          if (i === 0 && item.CoorType === -1) {
            pointArr.push(item)
          }
        })
        if (i === 0) {
          this.drawPoint(pointArr)
        }
        this.drawLine(linePointArr)
        linePointArr = []
      }
    },
    drawLine (linePointArr) {
      let GMap = window.google.maps
      let polyline = new GMap.Polyline({
        map: window.map,
        path: linePointArr,
        strokeColor: '#00EE00',
        strokeOpacity: 0.5,
        strokeWeight: 6
      })
      polyline.setMap(gMap)
      // window.map.addOverlay(polyline)
    },
    drawPoint (data) {
      data.forEach(item => {
        gMap.addMarker({lat: item.Latitude, lng: item.Longitude}, require('@/assets/images/hover_marker.png'), 15, 15)
      })
    },
    initMap (data) {
      window.startMarker = gMap.addMarker(data[0], require('@/assets/images/start.png'))
      window.endMarker = gMap.addMarker(data[this.sliderSize - 1], require('@/assets/images/stop1.png'))
      this.stopArr.forEach(item => {
        gMap.addStopMarker({lat: item.Latitude, lng: item.Longitude}, require('@/assets/images/stop.png'), item['time'])
      })
      if (this.marker) {
        this.marker.setPosition(data[0])
      } else {
        this.marker = gMap.addMoveMarker(data[this.progress], require(`@/assets/images/car_map.png`))
      }
      // this.infoLay = gMap.addMoveLabel(data[this.progress], this.trail['LicensePlate'])
      // this.marker = gMap.addLabelMarker(data[this.progress], require(`@/assets/images/car.png`), this.trail['LicensePlate'], 65, 23)
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
            if (this.marker) this.marker.setPosition(point)
            // if (this.infoLay) gMap.removeOverlay(this.infoLay)
            // this.infoLay = gMap.addMoveLabel(point, this.trail['LicensePlate'])
            // this.marker.setIcon({
            //   path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            //   rotation
            // })
            if (this.mapMove) {
              if (point.lng < map.getBounds().getSouthWest().lng() || point.lng > map.getBounds().getNorthEast().lng() || point.lat < map.getBounds().getSouthWest().lat() || point.lat > map.getBounds().getNorthEast().lat()) {
                map.panTo(point)
              }
            }
          }
        }, 300 / this.playSpeed)
      } else if (this.playStatus === 'play') {
        this.playStatus = 'pause'
        clearInterval(this.timer)
      } else if (this.playStatus === 'end') {
        this.playStatus = 'ready'
        this.progress = 0
        this.drawPath()
      }
    }
  },
  components: {
    SpeedCanvas
  }
}
</script>

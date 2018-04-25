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
        <!-- <div class="trace-play-time clearfix">
          <div class="time-text fl">{{progress + '/' + sliderSize}}</div>
          <div class="time-text fr">{{curTime || '0000-00-00 00:00:00'}}</div>
        </div> -->
        <div class="clearfix">
          <div class="start-point-mark fl"></div>
          <el-slider v-model="progress" :show-tooltip="false" :max="sliderSize" @change="sliderChange"></el-slider>
          <div class="end-point-mark fr"></div>
        </div>
        <!-- <div class="trace-play-time clearfix">
          <div class="time-text fl">{{startTime || '0000-00-00 00:00:00'}}</div>
          <div class="time-text fr">{{endTime || '0000-00-00 00:00:00'}}</div>
        </div> -->
        <!-- <div class="trace-play-time">
          <div class="time-text fl">{{'x' + playSpeed}}</div>
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
import bMap from '@/map/bmap'
import Transform from '@/utils/transform'
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
      bMap.loadMapJS('//api.map.baidu.com/api?v=2.0&ak=gQr6R39pYFt2Ofe35MqyUIsnS1ncSOD7&callback=init', () => bMap.initMap())
    } else {}
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
        window.map.removeOverlay(window.hoverOverlay)
        window.map.removeOverlay(window.hoverCircle)
      }
      let [item, index] = [row, row['index']]
      bMap.getAddress(this.pathArr[index], address => {
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
        bMap.addHoverOverlay(this.pathArr[index], content)
        window.hoverCircle = bMap.addHoverMarker(this.pathArr[index], require(`@/assets/images/hover_marker.png`), this.tableData[index]['ReportingTime'])
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
          // bMap.getConvertorPoints(history, callback)
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
        window.map.clearOverlays()
      }
      if (!this.marker) {
        this.searchHandle((data) => {
          if (!data.length) {
            this.$message(this.$t('locu.noDate'))
          } else {
            let [flag, startTime, len, firstTime, lastTime, firstMileage, lastMileage, pathArr, pointArr, stopPoint, stopArr, num] = [false, 0, data.length - 1, 0, 0, 0, 0, [], [], null, [], 0]
            data.forEach((item, index) => {
              let {lng, lat} = Transform.wgs2bd(item.Latitude, item.Longitude)
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
                  pointArr.push(new window.BMap.Point(lng, lat))
                  stopPoint['index'] = num++
                  pathArr.push(stopPoint)
                  if (bMap.getTime(endTime) - bMap.getTime(startTime) > this.parkGap * 60 * 1000) {
                    stopPoint['time'] = bMap.periodMark(startTime, endTime)
                    stopArr.push(stopPoint)
                  }
                }
              } else {
                if (flag) {
                  flag = false
                  let endTime = item['ReportingTime']
                  // 轨迹点数组
                  pointArr.push(new window.BMap.Point(lng, lat))
                  stopPoint['index'] = num++
                  pathArr.push(stopPoint)
                  if (bMap.getTime(endTime) - bMap.getTime(startTime) > this.parkGap * 60 * 1000) {
                    stopPoint['time'] = bMap.periodMark(startTime, endTime)
                    stopArr.push(stopPoint)
                  }
                }
                // 轨迹点数组
                pointArr.push(new window.BMap.Point(lng, lat))
                item['index'] = num++
                pathArr.push(item)
              }
              if (index === 0) {
                firstTime = item.ReportingTime
                firstMileage = item.TotalMileage
                bMap.getAddress(new window.BMap.Point(lng, lat), address => {
                  this.startPoint = address
                })
                window.map.panTo(new window.BMap.Point(lng, lat))
              }
              if (index === len) {
                lastTime = item.ReportingTime
                lastMileage = item.TotalMileage
                bMap.getAddress(new window.BMap.Point(lng, lat), address => {
                  this.endPoint = address
                })
              }
            })
            this.startTime = firstTime
            this.endTime = lastTime
            this.runTime = bMap.getPeriod(firstTime, lastTime)
            this.totalDistance = (lastMileage - firstMileage).toFixed(2)
            this.stopArr = stopArr
            this.pathArr = pointArr
            this.sliderSize = pointArr.length
            this.initMap(pointArr)
            this.tableData = pathArr
            let defaultIndex = -1
            window.map.addEventListener('mousemove', e => {
              if (pathArr.length) {
                let {index, distance} = bMap.getMinDistance(e.point, pointArr)
                if (distance > bMap.getNearDistance()) {
                  if (window.hoverMarker) {
                    window.map.removeOverlay(window.hoverMarker)
                    window.hoverMarker = null
                  }
                } else {
                  if (!window.hoverMarker) {
                    let hoverMarker = window.hoverMarker = bMap.addHoverMarker(pointArr[index], require(`@/assets/images/hover_marker.png`), pathArr[index]['ReportingTime'])
                    hoverMarker.addEventListener('click', e => {
                      if (window.hoverOverlay) {
                        window.map.removeOverlay(window.hoverOverlay)
                        window.map.removeOverlay(window.hoverCircle)
                      }
                      let item = pathArr[index]
                      bMap.getAddress(pointArr[index], address => {
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
                        bMap.addHoverOverlay(pointArr[index], content)
                        window.hoverCircle = bMap.addHoverMarker(pointArr[index], require(`@/assets/images/hover_marker.png`), pathArr[index]['ReportingTime'])
                        this.checkRow = index
                      })
                    })
                  } else {
                    if (defaultIndex !== index) {
                      if (window.hoverMarker) window.map.removeOverlay(window.hoverMarker)
                      let hoverMarker = window.hoverMarker = bMap.addHoverMarker(pointArr[index], require(`@/assets/images/hover_marker.png`), pathArr[index]['ReportingTime'])
                      hoverMarker.addEventListener('click', e => {
                        if (window.hoverOverlay) {
                          window.map.removeOverlay(window.hoverOverlay)
                          window.map.removeOverlay(window.hoverCircle)
                        }
                        let item = pathArr[index]
                        bMap.getAddress(pointArr[index], address => {
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
                          bMap.addHoverOverlay(pointArr[index], content)
                          window.hoverCircle = bMap.addHoverMarker(pointArr[index], require(`@/assets/images/hover_marker.png`), pathArr[index]['ReportingTime'])
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
        let polyline = this.polyline = new window.BMap.Polyline(data, {
          strokeColor: '#333',
          strokeWeight: 3,
          strokeOpacity: 0.5
        })
        window.map.addOverlay(polyline)
        bMap.addMarker(data[0], require('@/assets/images/locus_start.png'))
        bMap.addMarker(data[this.sliderSize - 1], require('@/assets/images/locus_end.png'))
        this.stopArr.forEach(item => {
          bMap.addStopMarker(new window.BMap.Point(item.Longitude, item.Latitude), require('@/assets/images/stop.png'), item['time'])
        })
        this.marker = bMap.addLabelMarker(data[this.progress], require(`@/assets/images/car.png`), this.trail['LicensePlate'], 65, 23)
        // this.drawPath()
      } else {}
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
            let rotation = bMap.getRotation(point, this.pathArr[this.progress])
            this.marker.setPosition(point)
            this.marker.setRotation(rotation)
            if (this.mapMove) {
              if (point.lng < map.getBounds().getSouthWest().lng || point.lng > map.getBounds().getNorthEast().lng || point.lat < map.getBounds().getSouthWest().lat || point.lat > map.getBounds().getNorthEast().lat) {
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

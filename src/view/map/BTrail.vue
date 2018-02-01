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
import bMap from '@/map/bmap'
import mixin from '@/mixins/index'
import SpeedCanvas from '@/components/SpeedCanvas'
export default {
  name: 'b-trail',
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
      absReportTime: [],
      absPointArr: [],
      playStatus: 'ready', // 播放状态
      unitStr: ''
    }
  },
  created () {
    this.getListTree()
  },
  mounted () {
    bMap.loadMapJS('//api.map.baidu.com/api?v=2.0&ak=gQr6R39pYFt2Ofe35MqyUIsnS1ncSOD7&callback=init', () => bMap.initMap())
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
                          <div class="map-item"><label>${this.$t('monitor.temperature')}:</label><span>${item['Temperature']}℃</span></div>
                          <div class="map-item"><label>PSI:</label><span>${item['PSIStatus']}</span></div>
                          <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${this.powerSupplyMode[item['PowerSupplyMode']]}</span></div>
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
      this.absPoint()
      this.$get({
        url: '/location/carHistoryPosition',
        data: this.searchForm,
        success: data => {
          let info = data['info'] || {}
          let history = info['arrCarHistoryPosition'] || []
          let unit = info['Unit']
          this.canvasData = history
          callback(history, unit)
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
        this.searchHandle((data, unit) => {
          this.unitStr = (!unit ? ' km' : ' mile')
          if (!data.length) {
            this.$message(this.$t('locu.noDate'))
          } else {
            let [prepoint, preTime, distance, timeLenForMin, line, lineArr, flag, startTime, len, firstTime, lastTime, firstMileage, lastMileage, pathArr, pointArr, stopPoint, stopArr, num] = ['', 0, 0, 0, 0, [], false, 0, data.length - 1, 0, 0, 0, 0, [], [], null, [], 0]
            data.forEach((item, index) => {
              if (item['PSIStatus'] === 0) {
                item['PSIStatus'] = this.$t('psi.echart.unactivated')
              } else {
                item['PSIStatus'] = this.$t('psi.echart.activated')
              }
              if (item.Temperature === 205) {
                item.Temperature = 'N/A'
              }
              let lat = item.Latitude
              let lng = item.Longitude
              if (index === 0) {
                prepoint = new window.BMap.Point(lng, lat)
                preTime = item['ReportingTime']
              }
              distance = window.map.getDistance(prepoint, new window.BMap.Point(lng, lat))
              timeLenForMin = bMap.getMin(preTime, item['ReportingTime'])
              this.getABSPointArr(preTime, item['ReportingTime'], item)
              prepoint = new window.BMap.Point(lng, lat)
              preTime = item['ReportingTime']
              // 将接挂和甩挂的点分开，增加CoorType属性进行区分 -1代表甩挂的点 其他代表接挂
              // 将距离大于10kM及上报时间大于10分钟的点分开
              if (item.IsConnectingTrailer === 1 && distance < 10000 && timeLenForMin < 10) {
                if (lineArr.indexOf(line) === -1) {
                  lineArr.push(line)
                }
                item['CoorType'] = line
              } else {
                line++
                item['CoorType'] = -1
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
                // firstTime = item.ReportingTime
                firstTime = item.TotalRunTime
                firstMileage = item.TotalMileage
                bMap.getAddress(new window.BMap.Point(lng, lat), address => {
                  this.startAddr = address
                })
                window.map.panTo(new window.BMap.Point(lng, lat))
              }
              if (index === len) {
                // lastTime = item.ReportingTime
                lastTime = item.TotalRunTime
                lastMileage = item.TotalMileage
                bMap.getAddress(new window.BMap.Point(lng, lat), address => {
                  this.endAddr = address
                })
              }
              // 速度单位转换
              item.Speed = item.Speed + (!unit ? ' km/h' : ' mile/h')
            })
            this.startTime = firstTime
            this.endTime = lastTime
            this.runTime = bMap.getPeriod(firstTime, lastTime)
            this.totalDistance = (lastMileage - firstMileage).toFixed(2)
            this.stopArr = stopArr
            this.pathArr = pointArr
            this.sliderSize = pointArr.length
            this.rankPoint(data, lineArr)
            this.drawABSPoint()
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
                                          <div class="map-item"><label>${this.$t('monitor.temperature')}:</label><span>${item['Temperature']}℃</span></div>
                                          <div class="map-item"><label>PSI:</label><span>${item['PSIStatus']}</span></div>
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
                                            <div class="map-item"><label>${this.$t('monitor.temperature')}:</label><span>${item['Temperature']}℃</span></div>
                                            <div class="map-item"><label>PSI:</label><span>${item['PSIStatus']}</span></div>
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
    absPoint () {
      this.$get({
        url: '/location/getABSReportTime',
        data: this.searchForm,
        success: data => {
          this.absReportTime = data['info'] || []
        }
      })
    },
    getABSPointArr (start, end, item) {
      while (this.absReportTime.length > 0) {
        let reportTime = this.absReportTime[0]['ReportingTime']
        if (start === reportTime) {
          this.absPointArr.push(item)
          this.absReportTime.splice(0, 1)
          return
        }
        if (end === reportTime) {
          this.absPointArr.push(item)
          this.absReportTime.splice(0, 1)
          return
        }
        if (start > reportTime) {
          this.absReportTime.splice(0, 1)
          return
        } else if (end < reportTime) {
          return
        } else if (start < reportTime && end > reportTime) {
          this.absPointArr.push(item)
          this.absReportTime.splice(0, 1)
          return
        }
      }
    },
    rankPoint (data, lineArr) {
      let linePointArr = []
      let pointArr = []
      for (var i = 0; i < lineArr.length; i++) {
        data.forEach((item, index) => {
          if (item.CoorType === lineArr[i]) {
            linePointArr.push(new window.BMap.Point(item.Longitude, item.Latitude))
          }
          if (item.CoorType === -1) {
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
      let polyline = this.polyline = new window.BMap.Polyline(linePointArr, {
        strokeColor: '#333',
        strokeWeight: 3,
        strokeOpacity: 0.5
      })
      window.map.addOverlay(polyline)
    },
    drawPoint (data) {
      data.forEach(item => {
        bMap.addMarker(new window.BMap.Point(item.Longitude, item.Latitude), require('@/assets/images/hover_marker.png'), 15, 15)
      })
    },
    drawABSPoint () {
      this.absPointArr.forEach(item => {
        bMap.addMarker(new window.BMap.Point(item.Longitude, item.Latitude), require('@/assets/images/abs.png'), 15, 15)
      })
    },
    initMap (data) {
      bMap.addMarker(data[0], require('@/assets/images/locus_start.png'))
      bMap.addMarker(data[this.sliderSize - 1], require('@/assets/images/locus_end.png'))
      this.stopArr.forEach(item => {
        bMap.addStopMarker(new window.BMap.Point(item.Longitude, item.Latitude), require('@/assets/images/stop.png'), item['time'])
      })
      this.marker = bMap.addLabelMarker(data[this.progress], require(`@/assets/images/car.png`), this.trail['LicensePlate'], 65, 23)
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

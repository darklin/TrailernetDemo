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
            <el-button class="search-btn fl" icon="search"  @click="searchHandle">{{$t('common.search')}}</el-button>
          </el-form-item>
          <el-form-item>
            <div class="trace-start-position">{{$t('loca.startPoint')}}: {{startAddr}}</div>
          </el-form-item>
          <el-form-item>
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
import aMap from '@/map/amap'
import Transform from '@/utils/transform'
import mixin from '@/mixins/index'
import SpeedCanvas from '@/components/SpeedCanvas'
export default {
  name: 'a-trail',
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
      circle: null, // 悬浮
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
    aMap.loadMapJS(aMap.mapURL, () => aMap.initMap.call(this))
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
    rowHandle (item) {
      aMap.getAddress([item.Longitude, item.Latitude], address => {
        item['address'] = address
        aMap.addHoverWin.call(this, item)
        this.checkRow = item['index']
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
          let unit = info['Unit']
          this.canvasData = history
          this.parseData(history, unit)
        }
      })
    },
    // 整理历史数据
    parseData (data, unit) {
      this.unitStr = (!unit ? ' km' : ' mile')
      if (!data.length) {
        this.$message(this.$t('locu.noDate'))
      } else {
        // 表格数据、轨迹点数组、停靠点数组
        let [tableData, pathArr, stopArr] = [[], [], []]
        // 起点时间、终点时间、起点距离、终点距离
        let [firstTime, lastTime, firstMileage, lastMileage] = [0, 0, 0, 0]
        // 标识、数据长度、开始时间、停靠点、计数
        let [flag, len, startTime, stopPoint, n] = [false, data.length - 1, 0, null, 0]
        data.forEach((item, index) => {
          let {lng, lat} = Transform.wgs2gcj(item.Latitude, item.Longitude)
          item.Longitude = lng
          item.Latitude = lat
          if (!item.Speed) {
            // 速度为0且第一个为0的点,记录时间和数据
            if (!flag) {
              flag = true
              startTime = item['ReportingTime']
              stopPoint = item
            }
            // 最后一个点速度也为0
            if (index === len) {
              let endTime = item['ReportingTime']
              pathArr.push([lng, lat])
              item['index'] = n++
              tableData.push(item)
              // 速度为0的结束时间和开始时间差大于设定时间差,则加入停靠点数组中
              if (aMap.getTime(endTime) - aMap.getTime(startTime) > this.parkGap * 60 * 1000) {
                stopPoint['time'] = aMap.periodMark(startTime, endTime)
                stopArr.push(stopPoint)
              }
            }
          } else {
            if (flag) {
              flag = false
              let endTime = item['ReportingTime']
              // 多个速度为0的点记录为一个点
              pathArr.push([stopPoint.Longitude, stopPoint.Latitude])
              stopPoint['index'] = n++
              tableData.push(stopPoint)
              if (aMap.getTime(endTime) - aMap.getTime(startTime) > this.parkGap * 60 * 1000) {
                stopPoint['time'] = aMap.periodMark(startTime, endTime)
                stopArr.push(stopPoint)
              }
            }
            // 轨迹点数组
            pathArr.push([lng, lat])
            item['index'] = n++
            tableData.push(item)
          }
          if (index === 0) {
            firstTime = item.TotalRunTime
            firstMileage = item.TotalMileage
            aMap.getAddress([lng, lat], address => {
              // 设置起点位置
              this.startAddr = address
            })
            // 地图中心点移至起点
            this.map.panTo([lng, lat])
          }
          if (index === len) {
            lastTime = item.TotalRunTime
            lastMileage = item.TotalMileage
            aMap.getAddress([lng, lat], address => {
              // 设置终点位置
              this.endAddr = address
            })
          }
          // aMap.getAddress([lng, lat], address => {
          //   data['address'] = address
          // })
          // 速度单位转换
          item.Speed = item.Speed + (!unit ? 'km/h' : 'mile/h')
        })
        // 运行时长
        this.runTime = aMap.getPeriod(firstTime, lastTime)
        // 总里程
        this.totalDistance = (lastMileage - firstMileage).toFixed(2)
        // 停靠点数组
        this.stopArr = stopArr
        // 轨迹路径数组
        this.pathArr = pathArr
        this.playStatus = 'ready'
        this.progress = 0
        this.sliderSize = pathArr.length
        if (this.timer) clearInterval(this.timer)
        aMap.drawCarPath.call(this)
        this.tableData = tableData
        // 监听鼠标移动到轨迹附近
        this.addListenerMarker()
      }
    },
    addListenerMarker () {
      this.map.on('mousemove', e => {
        let [{index, distance}, near] = [aMap.getMinDistance.call(this, e.lnglat), aMap.getNearDistance.call(this)]
        if (distance > near) {
          if (this.circle) this.circle.hide()
        } else {
          if (this.circle) this.circle.hide()
          aMap.addCircleMarker.call(this, this.tableData[index])
          this.checkRow = index
        }
      })
    },
    // 快进
    forward () {
      if (this.playSpeed < 8) {
        this.playSpeed *= 2
        this.playStatus = 'pause'
        clearInterval(this.timer)
        this.playHandle()
      }
    },
    // 快退
    backward () {
      if (this.playSpeed > 1) {
        this.playSpeed /= 2
        this.playStatus = 'pause'
        clearInterval(this.timer)
        this.playHandle()
      }
    },
    // 播放处理
    playHandle () {
      if (this.playStatus === 'ready' || this.playStatus === 'pause') {
        this.timer = setInterval(() => {
          if (this.sliderSize === this.progress) {
            this.playStatus = 'end'
            clearInterval(this.timer)
          } else {
            if (this.playStatus === 'ready' || this.playStatus === 'pause') this.playStatus = 'play'
            this.progress++
            this.curTime = this.tableData[this.progress - 1]['ReportingTime']
            let point = this.pathArr[this.progress - 1]
            // 旋转角度
            let rotation = aMap.getRotation.call(this, point, this.pathArr[this.progress])
            this.marker.setPosition(point)
            this.marker.setAngle(rotation)
            if (this.mapMove) {
              if (point.lng < this.map.getBounds().getSouthWest().lng || point.lng > this.map.getBounds().getNorthEast().lng || point.lat < this.map.getBounds().getSouthWest().lat || point.lat > this.map.getBounds().getNorthEast().lat) {
                this.map.panTo(point)
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
        this.playHandle()
      }
    }
  },
  components: {
    SpeedCanvas
  }
}
</script>

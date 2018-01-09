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
import bMap from '@/map/bmap'
import Transform from '@/utils/transform'
import mixin from '@/mixins/index'
export default {
  name: 'b-track',
  mixins: [mixin],
  data () {
    let track = JSON.parse(this.$localStorage('track') || '')
    return {
      time: 20,
      track,
      isTableOpen: false,
      pathArr: [],
      tableData: []
    }
  },
  mounted () {
    // loadMapJS: 加载地图
    // initMap: 初始化地图
    // refreshHandle: 刷新数据
    bMap.loadMapJS('//api.map.baidu.com/api?v=2.0&ak=gQr6R39pYFt2Ofe35MqyUIsnS1ncSOD7&callback=init', () => {
      bMap.initMap(false, () => this.refreshHandle())
    })
  },
  beforeDestroy () {
    // 跳转页面前清除定时器
    clearInterval(this.timer)
  },
  methods: {
    // 刷新数据
    refreshHandle () {
      this.getData()
      // 设置定时器
      this.timer = setInterval(() => {
        this.time--
        if (this.time === 0) {
          this.time = 20
          this.getData()
        }
      }, 1000)
    },
    // 获取数据
    getData () {
      this.$get({
        url: '/location/carRealtimePosition',
        data: {carID: this.track['CarID']},
        success: data => {
          if (data.PSIStatus === 0) {
            data.PSIStatus = this.$t('psi.echart.unactivated')
          } else {
            data.PSIStatus = this.$t('psi.echart.activated')
          }
          if (data.Temperature === 205) {
            data.Temperature = 'N/A'
          }
          let point = Transform.wgs2bd(data.Latitude, data.Longitude)
          bMap.getAddress(point, address => {
            window.map.clearOverlays()
            data['Latitude'] = point.lat
            data['Longitude'] = point.lng
            data['address'] = address
            this.tableData.push(data)
            let markerPoint = new window.BMap.Point(point.lng, point.lat)
            this.pathArr.push(markerPoint)
            let content = `<div class="map-window">
                            <div class="map-window-header">${data['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                            <div class="map-window-body">
                              <div class="map-item"><label>${this.$t('common.organization')}:</label><span>${this.track['OrgName']}</span></div>
                              <div class="map-item"><label>${this.$t('common.state')}:</label><span>${data['status']}</span></div>
                              <div class="map-item"><label>${this.$t('loca.alarmType')}:</label><span>${data['AlarmType']}</span></div>
                              <div class="map-item"><label>${this.$t('common.speedKm')}:</label><span>${data['Speed']}</span></div>
                              <div class="map-item"><label>${this.$t('monitor.temperature')}:</label><span>${data['Temperature']}℃</span></div>
                              <div class="map-item"><label>PSI:</label><span>${data['PSIStatus']}</span></div>
                              <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${this.powerSupplyMode[data['PowerSupplyMode']]}</span></div>
                              <div class="map-item"><label>${this.$t('loca.dumpEnergy')}:</label><span>${data['SurplusElectricity']}%</span></div>
                              <div class="map-item"><label>${this.$t('loca.positionTime')}:</label><span>${data['ReportingTime']}</span></div>
                              <div class="map-item"><label>${this.$t('boxUp.position')}:</label><span>${address}</span></div>
                            </div>
                          </div>`
            bMap.addCarMarker(markerPoint, require(`@/assets/images/car.png`), data['LicensePlate'], content, 65, 23)
            window.map.panTo(markerPoint)
            let polyline = new window.BMap.Polyline(this.pathArr, {
              strokeColor: '#333',
              strokeWeight: 3,
              strokeOpacity: 0.5
            })
            window.map.addOverlay(polyline)
          })
        }
      })
    },
    // 表格收缩处理
    tableOpen () {
      this.isTableOpen = !this.isTableOpen
    }
  }
}
</script>

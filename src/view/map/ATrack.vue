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
import aMap from '@/map/amap'
import Transform from '@/utils/transform'
import mixin from '@/mixins/index'
export default {
  name: 'a-track',
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
    aMap.loadMapJS(aMap.mapURL, () => aMap.initMap.call(this, false, () => this.refreshHandle()))
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
          let {lng, lat} = Transform.wgs2gcj(data.Latitude, data.Longitude)
          let point = [lng, lat]
          data.Longitude = lng
          data.Latitude = lat
          aMap.getAddress(point, address => {
            data['address'] = address
            this.tableData.push(data)
            this.pathArr.push(point)
            this.map.panTo(point)
            aMap.addCarMarker.call(this, data)
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

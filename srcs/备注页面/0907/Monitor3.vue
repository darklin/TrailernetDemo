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
          <el-form-item :label="$t('common.organization')">
            <el-select v-model="searchForm.orgIDs" clearable placeholder="">
              <el-option v-for="item,index in zNodes" :label="item.name" :value="item.id" :key="index" :checked="item.checked"></el-option>
            </el-select>
          </el-form-item>
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
    <b-monitor v-if="isSearchOpen" />
    <a-monitor v-else />
  </div>
</template>

<script>
import aMap from '@/map/amap'
import gMap from '@/map/gmap'
import Transform from '@/utils/transform'
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
      powerSupplyMode: {0: this.$t('monitor.mainPower'), 1: this.$t('monitor.battery'), 2: this.$t('monitor.solarEnergy')},
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
    this.queryOrganizate()
  },
  mounted () {
    // loadMapJS: 加载地图
    // initMap: 初始化地图
    // getListTree: 获取监控数据
    if (this.$i18n.locale === 'zh') {
      aMap.loadMapJS('//webapi.amap.com/maps?v=1.3&key=36bbb44aa97730cacd6025ea4f9f11cf&plugin=AMap.Geocoder&callback=init', () => {
        aMap.initMap(() => {
          this.getListTree()
        })
      })
    } else {
      gMap.loadMapJS('//maps.googleapis.com/maps/api/js?key=AIzaSyB2KjWfZMG_HJdCr3IBMqOIkQcGBzykuUI&language=en&callback=init', () => {
        gMap.initMap(() => {
          this.getListTree()
        })
      })
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
          let statusData = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []}
          let tableData = []
          datas.forEach(item => {
            let point = null
            if (this.$i18n.locale === 'zh') {
              // 坐标转换
              point = Transform.wgs2gcj(item.Latitude, item.Longitude)
              // 获取地理位置
              aMap.getAddress([point.lng, point.lat], address => {
                item['address'] = address
              })
            } else {
              // 坐标转换
              point = Transform.wgs2gcj(item.Latitude, item.Longitude)
              // 获取地理位置
              gMap.getAddress(point, address => {
                item['address'] = address
              })
            }
            item.Longitude = point.lng
            item.Latitude = point.lat
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
          // 首页跳转过来的选中状态
          window.setTimeout(() => {
            let status = this.$route.query.status
            if (status) this.statusCheck(Number(status))
          }, 500)
        }
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
              message: `${item.LicensePlate} ` + this.$t('monitor.notOnLoad'),
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
      if (this.$i18n.locale === 'zh') {
        window.map.clearMap()
        for (let [i, len] = [0, data.length - 1]; i <= len; i++) {
          let item = data[i]
          let content = `<div class="map-window">
                        <div class="map-window-header">${item['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                        <div class="map-window-body">
                          <div class="map-item"><label>${this.$t('common.organization')}:</label><span>${item['OrgName']}</span></div>
                          <div class="map-item"><label>${this.$t('common.state')}:</label><span>${item['status']}</span></div>
                          <div class="map-item"><label>${this.$t('loca.alarmType')}:</label><span>${item['AlarmType']}</span></div>
                          <div class="map-item"><label>${this.$t('common.speedKm')}:</label><span>${item['Speed']}</span></div>
                          <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${this.powerSupplyMode[item['PowerSupplyMode']]}</span></div>
                          <div class="map-item"><label>${this.$t('loca.dumpEnergy')}:</label><span>${item['SurplusElectricity']}%</span></div>
                          <div class="map-item"><label>${this.$t('loca.positionTime')}:</label><span>${item['ReportingTime']}</span></div>
                          <div class="map-item"><label>${this.$t('boxUp.position')}:</label><span>${item['address']}</span></div>
                        </div>
                        <div class="map-window-footer">
                          <a href="javascript:;" class="footer-btn trail-btn" id="trailBtn">${this.$t('loca.runningOfTrack')}</a>
                          <a href="javascript:;" class="footer-btn track-btn" id="trackBtn">${this.$t('loca.realtimeTrack')}</a>
                        </div>
                      </div>`
          let point = [item.Longitude, item.Latitude]
          if (len === i) {
            window.map.panTo(point)
          }
          aMap.addEventMarker(point, this.markerClass[item.value], item['LicensePlate'], content, {
            CarID: item['CarID'],
            LicensePlate: item['LicensePlate'],
            PowerSupplyMode: item['PowerSupplyMode'],
            SurplusElectricity: item['SurplusElectricity'],
            OrgName: item['OrgName'],
            value: item['value'],
            path: this.path
          })
        }
      } else {
        // 清理覆盖物
        let overlays = window.overlays || []
        overlays.map(item => {
          item.setMap(null)
        })
        window.overlays = []
        for (let [i, len] = [0, data.length - 1]; i <= len; i++) {
          let item = data[i]
          let content = `<div class="map-window google-map-window">
                        <div class="map-window-header">${item['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                        <div class="map-window-body">
                          <div class="map-item"><label>${this.$t('common.organization')}:</label><span>${item['OrgName']}</span></div>
                          <div class="map-item"><label>${this.$t('common.state')}:</label><span>${item['status']}</span></div>
                          <div class="map-item"><label>${this.$t('loca.alarmType')}:</label><span>${item['AlarmType']}</span></div>
                          <div class="map-item"><label>${this.$t('common.speedKm')}:</label><span>${item['Speed']}</span></div>
                          <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${this.powerSupplyMode[item['PowerSupplyMode']]}</span></div>
                          <div class="map-item"><label>${this.$t('loca.dumpEnergy')}:</label><span>${item['SurplusElectricity']}%</span></div>
                          <div class="map-item"><label>${this.$t('loca.positionTime')}:</label><span>${item['ReportingTime']}</span></div>
                          <div class="map-item"><label>${this.$t('boxUp.position')}:</label><span>${item['address']}</span></div>
                        </div>
                        <div class="map-window-footer">
                          <a href="javascript:;" class="footer-btn trail-btn" id="trailBtn">${this.$t('loca.runningOfTrack')}</a>
                          <a href="javascript:;" class="footer-btn track-btn" id="trackBtn">${this.$t('loca.realtimeTrack')}</a>
                        </div>
                      </div>`
          let point = {lat: item.Latitude, lng: item.Longitude}
          if (len === i) {
            window.map.panTo(point)
          }
          gMap.addEventMarker(point, require(`@/assets/images/${this.markerIcon[item.value]}.png`), item['LicensePlate'], content, {
            CarID: item['CarID'],
            LicensePlate: item['LicensePlate'],
            PowerSupplyMode: item['PowerSupplyMode'],
            SurplusElectricity: item['SurplusElectricity'],
            OrgName: item['OrgName'],
            value: item['value'],
            path: this.path
          })
        }
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
  },
  components: {
    BMonitor: require('./map/BMonitor'),
    AMonitor: require('./map/AMonitor')
  }
}
</script>

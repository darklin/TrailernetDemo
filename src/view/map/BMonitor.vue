<template>
  <div class="content-box monitor-content" :class="{'monitor-table-content': !isTableOpen, 'monitor-search-content': !isSearchOpen}">
    <!-- 车辆状态图标 -->
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
    <!-- 地图容器 -->
    <div class="map-box" id="map"></div>
    <!-- 车辆监控列表 -->
    <div class="monitor-table">
      <div class="monitor-table-header">
        <div class="title">{{$t('home.monitorList')}}</div>
        <div class="monitor-down-btn" @click="tableOpen"></div>
      </div>
      <div class="monitor-table-body" v-if="isTableOpen">
        <el-table
          :data="tableData"
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
            width="125"
            header-align="center"
            align="center"
            :label="$t('excel.licenseNumber')">
          </el-table-column>
          <el-table-column
            prop="status"
            min-width="255"
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
            min-width="180"
            header-align="center"
            align="center"
            :label="$t('loca.positionTime')">
          </el-table-column>
          <el-table-column
            prop="Speed"
            min-width="110"
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
          <el-table-column
            prop="Temperature"
            min-width="120"
            header-align="center"
            show-overflow-tooltip
            label="温度">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 车辆列表查询 -->
    <div class="monitor-search" v-show="isSearchOpen">
      <div class="search-header">
        <div class="title">{{$t('loca.chooseCar')}}</div>
        <div class="monitor-open-btn" @click.stop="searchOpen"></div>
      </div>
      <div class="search-box clearfix">
        <el-form :model="searchForm" class="search-form">
          <el-form-item :label="$t('common.organization')">
            <el-select class="search-from-multiple" v-model="orgIDs" multiple clearable placeholder="">
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
          <el-form-item>
            <el-button class="search-btn" icon="search" @click="searchHandle">{{$t('common.search')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 车辆列表(树结构) -->
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
import bMap from '@/map/bmap'
import Transform from '@/utils/transform'
import mixin from '@/mixins/index'
export default {
  name: 'b-monitor',
  mixins: [mixin],
  data () {
    let orgIDs = this.$route.query.orgIDs || ''
    let licensePlate = this.$route.query.licensePlate || ''
    return {
      isTableOpen: false,
      isSearchOpen: true,
      path: window.location.pathname + '#',
      zNodes: [],
      orgIDs: orgIDs ? orgIDs.split(',') : [],
      searchForm: {
        status: '', // 车辆状态
        licensePlate: licensePlate, // 车辆编号
        orgIDs // 机构
      },
      checkStatus: 0, // 选中的状态
      statusData: {
        1: [], // 停放(有箱无引)
        2: [], // 停放(无箱无引)
        3: [], // 行驶(有箱有引)
        4: [], // 行驶(无箱有引)
        5: [], // 停止(有箱有引)
        6: [], // 停止(无箱有引)
        7: [] // 离线
      },
      tableData: [],
      treeData: []
    }
  },
  created () {
    this.queryOrganizate()
  },
  mounted () {
    // loadMapJS: 加载地图
    // initMap: 初始化地图
    // getListTree: 获取监控数据
    let islocate = true
    if (this.searchForm.licensePlate) islocate = false
    bMap.loadMapJS('//api.map.baidu.com/api?v=2.0&ak=gQr6R39pYFt2Ofe35MqyUIsnS1ncSOD7&callback=init', () => {
      bMap.initMap(islocate, () => this.getListTree())
    })
  },
  methods: {
    // 获取监控数据
    getListTree () {
      this.searchForm.orgIDs = this.orgIDs.join(',')
      this.$get({
        url: '/location/listTree',
        data: this.searchForm,
        success: data => {
          let datas = data.datas || []
          let statusData = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []}
          let tableData = []
          datas.forEach(item => {
            let point = null
            point = Transform.wgs2bd(item.Latitude, item.Longitude)
            item.Longitude = point.lng
            item.Latitude = point.lat
            if (item.value !== 0) {
              if (item['PSIStatus'] === 0) {
                item['PSIStatus'] = this.$t('psi.echart.unactivated')
              } else {
                item['PSIStatus'] = this.$t('psi.echart.activated')
              }
              if (item.Temperature === 205) {
                item.Temperature = 'N/A'
              }
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
            let licensePlate = this.$route.query.licensePlate
            if (status) this.statusCheck(Number(status))
            if (licensePlate) this.$refs.listTree.setCheckedNodes(this.treeData)
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
      if (data.value === 0 || data.Latitude === 0 || data.Longitude === 0) {
      } else {
        let point = new window.BMap.Point(data.Longitude, data.Latitude)
        window.map.panTo(point)
      }
      this.$refs.listTree.setChecked(data, true)
    },
    // 选中的车辆处理
    handleCheckChange (item, status) {
      if (item.value === 0) {
        if (status) {
          this.$message({
            message: `${item.LicensePlate} ` + this.$t('monitor.notOnLoad'),
            customClass: 'monitor-message',
            iconClass: 'message-img',
            duration: 2000
          })
          this.$refs.listTree.setChecked(item, false)
        }
      } else if (item.Latitude === 0 || item.Longitude === 0) {
        this.$message({
          message: `${item.LicensePlate} ` + this.$t('monitor.notOnLocate'),
          customClass: 'monitor-message',
          iconClass: 'message-img',
          duration: 2000
        })
        this.$refs.listTree.setChecked(item, false)
      } else {
        let point = new window.BMap.Point(item.Longitude, item.Latitude)
        window.map.panTo(point)
        let checkedNodes = this.$refs.listTree.getCheckedNodes()
        this.initMap(checkedNodes)
      }
    },
    initMap (data) {
      bMap.removeOverlay(window.overlays)
      window.overlays = []
      for (let [i, len] = [0, data.length - 1]; i <= len; i++) {
        let item = data[i]
        this.handleAddress(item, len, i)
      }
    },
    // 搜索结果处理
    searchHandle () {
      this.getListTree()
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
    // 树结构渲染车标和车辆编号
    // 解决dom无法直接渲染车标
    renderContent (h, {node, data}) {
      return h('span', {class: `el-tree-node__label ${this.markerIcon[data.value]}`}, data.LicensePlate)
    },
    handleAddress (item, len, i) {
      let point = new window.BMap.Point(item.Longitude, item.Latitude)
      bMap.addEventMarker(point, require(`@/assets/images/${this.markerIcon[item.value]}.png`), item['LicensePlate'], address => {
        item['address'] = address
        let content = `<div class="map-window">
                      <div class="map-window-header">${item['LicensePlate']}<i class="close-btn" id="closeBtn"></i></div>
                      <div class="map-window-body">
                        <div class="map-item"><label>${this.$t('common.organization')}:</label><span>${item['OrgName']}</span></div>
                        <div class="map-item"><label>${this.$t('common.state')}:</label><span>${item['status']}</span></div>
                        <div class="map-item"><label>${this.$t('loca.alarmType')}:</label><span>${item['AlarmType']}</span></div>
                        <div class="map-item"><label>${this.$t('common.speedKm')}:</label><span>${item['Speed']}</span></div>
                        <div class="map-item"><label>${this.$t('monitor.temperature')}:</label><span>${item['Temperature']}℃</span></div>
                          <div class="map-item"><label>PSI:</label><span>${item['PSIStatus']}</span></div>
                        <div class="map-item"><label>${this.$t('loca.powerSupplyMode')}:</label><span>${this.powerSupplyMode[item['PowerSupplyMode']]}</span></div>
                        <div class="map-item"><label>${this.$t('loca.dumpEnergy')}:</label><span>${item['SurplusElectricity']}%</span></div>
                        <div class="map-item"><label>${this.$t('loca.positionTime')}:</label><span>${item['ReportingTime']}</span></div>
                        <div class="map-item"><label>${this.$t('boxUp.position')}:</label><span>${address}</span></div>
                      </div>
                      <div class="map-window-footer">
                        <a href="javascript:;" class="footer-btn trail-btn" id="trailBtn">${this.$t('loca.runningOfTrack')}</a>
                        <a href="javascript:;" class="footer-btn track-btn" id="trackBtn">${this.$t('loca.realtimeTrack')}</a>
                      </div>
                    </div>`
        bMap.addEventOverlay(point, content, {
          CarID: item['CarID'],
          LicensePlate: item['LicensePlate'],
          PowerSupplyMode: item['PowerSupplyMode'],
          SurplusElectricity: item['SurplusElectricity'],
          OrgName: item['OrgName'],
          value: item['value'],
          path: this.path
        })
      })
    }
  }
}
</script>

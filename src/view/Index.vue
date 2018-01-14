<template>
  <div class="content-box">
    <div class="index-query-box header-area clearfix">
      <el-form :inline="true" :model="searchForm" class="search-form fl">
        <el-form-item :label="$t('common.organization')">
          <el-select class="search-from-multiple" v-model="orgIDs" multiple clearable placeholder="" @change="changeHandle">
            <el-option v-for="item,index in zNodes" :label="item.name" :value="item.id" :key="index" :checked="item.checked"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button :loading="isLoading" class="refresh-btn fr"  @click="refreshHandle">{{$t('index.refreshBtn')}}</el-button>
      <!-- <el-button :loading="isLoading" class="search-btn fl"  @click="searchHandle">{{$t('common.search')}}</el-button> -->
    </div>
    <div class="index-count-box">
      <div class="index-title">{{$t('car.carStatisticBoard')}}</div>
      <div class="index-status-table">
        <el-row :gutter="16">
          <el-col :span="6">
            <div class="status-total">
              <div class="status-label">{{$t('monitor.totalcar')}}</div>
              <div class="status-text">{{carTotal}}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="status-item">
              <div class="status-label">{{$t('golbal.run')}}</div>
              <div class="status-text">{{runTotal}}</div>
              <div class="status-img">
                <img src="../assets/images/run_null_img.png" :title="$t('golbal.run') + ' ' + $t('golbal.notBoxUpAndConnect')">
              </div>
              <div class="status-num">
                <span @click="monitorHandle(carStatus.scnob, 4)">{{carStatus.scnob}}</span>
              </div>
              <div class="status-img">
                <img src="../assets/images/run_normal_img.png" :title="$t('golbal.run') + ' ' + $t('golbal.boxUpAndConnect')">
              </div>
              <div class="status-num">
                <span @click="monitorHandle(carStatus.scb, 3)">{{carStatus.scb}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="status-item">
              <div class="status-label">{{$t('golbal.stop')}}</div>
              <div class="status-text">{{stopTotal}}</div>
              <div class="status-img">
                <img src="../assets/images/stop_null_img.png" :title="$t('golbal.stop') + ' ' + $t('golbal.notBoxUpAndConnect')">
              </div>
              <div class="status-num">
                <span @click="monitorHandle(carStatus.noscnob, 6)">{{carStatus.noscnob}}</span>
              </div>
              <div class="status-img">
                <img src="../assets/images/stop_normal_img.png" :title="$t('golbal.stop') + ' ' + $t('golbal.boxUpAndConnect')">
              </div>
              <div class="status-num">
                <span @click="monitorHandle(carStatus.noscb, 5)">{{carStatus.noscb}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="status-item">
              <div class="status-label">{{$t('golbal.park')}}</div>
              <div class="status-text">{{parkTotal}}</div>
              <div class="status-img">
                <img src="../assets/images/park_null_img.png" :title="$t('golbal.park') + ' ' + $t('golbal.notBoxUpAndNotConnect')">
              </div>
              <div class="status-num">
                <span @click="monitorHandle(carStatus.nocnob, 2)">{{carStatus.nocnob}}</span>
              </div>
              <div class="status-img">
                <img src="../assets/images/park_normal_img.png" :title="$t('golbal.park') + ' ' + $t('golbal.boxUpAndNotConnect')">
              </div>
              <div class="status-num">
                <span @click="monitorHandle(carStatus.nocb, 1)">{{carStatus.nocb}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="index-count-box">
      <div class="index-title">{{$t('report.MonthReport')}}</div>
      <el-table
        :data="orgData"
        style="width: 100%">
        <el-table-column
          type="index"
          :label="$t('index.indexField')"
          width="80" 
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="attribute"
          :label="$t('index.attributeField')"
          header-align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="averageValue"
          :label="$t('index.averageField')"
          header-align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="totalValue"
          :label="$t('index.totalField')"
          header-align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          :label="$t('index.rankField')"
          width="180"
          header-align="center"
          align="center">
          <template scope="scope">
            <el-button class="underline-btn" @click="rankHandle(scope.$index, scope.row.attribute)" type="text" size="small">{{$t('index.rankBtn')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="index-count-box">
      <div class="index-title">{{$t('car.alarmStatic')}}</div>
      <el-table
        :data="alarmData"
        style="width: 100%">
        <el-table-column
          type="index"
          :label="$t('index.indexField')"
          align="center"
          width="80" 
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="orgName"
          :label="$t('common.organization')"
          align="center"
          min-width="120" 
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="count"
          :label="$t('index.totalTrailers')" 
          align="center"
          min-width="150"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="idle"
          :label="$t('carAlarm.idle')" 
          align="center"
          min-width="120"
          header-align="center">
          <template scope="scope">
            <div v-if="scope.row.idle > 0">
              <el-button type="text" @click="idleHandle(scope.row)" >{{scope.row.idle}}</el-button>
            </div>
            <div v-else>{{scope.row.idle}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="abstimes"
          :label="$t('carAlarm.ABSfault')"
          align="center"
          min-width="120"
          header-align="center">
          <template scope="scope">
            <div v-if="scope.row.abstimes > 0">
              <el-button type="text" @click="absHandle(scope.row)" >{{scope.row.abstimes}}</el-button>
            </div>
            <div v-else>0</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="psitimes"
          :label="$t('carAlarm.PSIState')"
          align="center"
          min-width="120"
          header-align="center">
          <template scope="scope">
            <div v-if="scope.row.psitimes > 0">
              <el-button type="text" @click="psiHandle(scope.row)" >{{scope.row.psitimes}}</el-button>
            </div>
            <div v-else>0</div>
          </template>
        </el-table-column>
        <!--
        <el-table-column
          prop="highTemp"
          :label="$t('carAlarm.highTemperatureTire')"
          min-width="190" 
          disable
          align="center"
          header-align="center">
          <template scope="scope">
            <div v-if="scope.row.highTemp > 0">
              <el-button type="text" @click="idleHandle(scope.row)" >{{scope.row.highTemp}}</el-button>
            </div>
            <div v-else>{{scope.row.highTemp}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="highPressure"
          :label="$t('carAlarm.highPressureTire')"
          min-width="190" 
          align="center"
          header-align="center">
          <template scope="scope">
            <div v-if="scope.row.highPressure > 0">
              <el-button type="text" @click="idleHandle(scope.row)" >{{scope.row.highPressure}}</el-button>
            </div>
            <div v-else>{{scope.row.highPressure}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="lowPressure"
          :label="$t('carAlarm.lowPressureTire')"
          min-width="190" 
          align="center"
          header-align="center">
          <template scope="scope">
            <div v-if="scope.row.lowPressure > 0">
              <el-button type="text" @click="idleHandle(scope.row)" >{{scope.row.lowPressure}}</el-button>
            </div>
            <div v-else>{{scope.row.lowPressure}}</div>
          </template>
        </el-table-column>
      -->
        <el-table-column
          prop="airLowPressure"
          :label="$t('carAlarm.lowAirPressure')"
          min-width="190" 
          align="center"
          header-align="center">
          <template scope="scope">
            <div v-if="scope.row.airLowPressure > 0">
              <el-button type="text" @click="idleHandle(scope.row)" >{{scope.row.airLowPressure}}</el-button>
            </div>
            <div v-else>{{scope.row.airLowPressure}}</div>
          </template>
        </el-table-column>
         <el-table-column
          prop="offline"
          :label="$t('trailer.offline')"
          min-width="120" 
          align="center"
          header-align="center">
          <template scope="scope">
            <div v-if="scope.row.offline > 0">
              <el-button type="text" @click="offlineHandle(scope.row)" >{{scope.row.offline}}</el-button>
            </div>
            <div v-else>{{scope.row.offline}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="index-count-more clearfix" v-if="moreVisible">
        <a class="more-btn fr" @click="moreHandle">{{$t('carAlarm.more')}}</a>
      </div>
      <div class="index-count-more clearfix" v-if="lessVisible">
        <a class="more-btn fr" @click="lessHandle">{{$t('carAlarm.less')}}</a>
      </div>
    </div>
    <report-data v-model="isShow" :rowNum="rowNum" :orgIDs="searchForm.orgIDs"></report-data>
    <idle-list v-model="isShow1" :orgId="orgId" :idleDays="idleDays"></idle-list>
    <offline-list v-model="isShow2" :orgId="orgId" :currStateType="currStateType"></offline-list>
    <abs-list v-model="isShow3" :orgId="orgId"></abs-list>
    <psi-list v-model="isShow4" :orgId="orgId"></psi-list>
  </div>
</template>

<script>
import ReportData from '@/components/ReportData'
import IdleList from '@/components/IdleList'
import OfflineList from '@/components/OfflineList'
import ABSList from '@/components/ABSList'
import PSIList from '@/components/PSIList'
export default {
  name: 'index',
  data () {
    return {
      zNodes: [],
      orgIDs: [],
      searchForm: {
        orgIDs: ''
      },
      carStatus: {
        nocb: 0,
        nocnob: 0,
        noscb: 0,
        noscnob: 0,
        scb: 0,
        scnob: 0
      },
      isLoading: false,
      orgData: [],
      alarmData: [],
      moreAlarmData: [],
      isShow: false,
      isShow1: false,
      isShow2: false,
      isShow3: false,
      isShow4: false,
      rowNum: '',
      orgId: '', // 查询列表中要使用的orgId
      idleDays: 15, // 闲置查询-闲置时长(天)
      currStateType: 7, // 离线查询-离线状态值
      moreVisible: true,
      lessVisible: false,
      moreSize: 5
    }
  },
  created () {
    this.carStyleList()
    this.getOrgData()
    this.getAlarmData()
    this.queryOrganizate()
  },
  computed: {
    runTotal () {
      return this.carStatus.scnob + this.carStatus.scb
    },
    stopTotal () {
      return this.carStatus.noscnob + this.carStatus.noscb
    },
    parkTotal () {
      return this.carStatus.nocnob + this.carStatus.nocb
    },
    carTotal () {
      let carStatus = this.carStatus
      return carStatus.scnob + carStatus.scb + carStatus.noscnob + carStatus.noscb + carStatus.nocnob + carStatus.nocb
    }
  },
  methods: {
    // 获取机构信息
    queryOrganizate () {
      this.$get({
        url: '/assist/queryOrganizate',
        success: data => {
          this.zNodes = data.zNodes || []
        }
      })
    },
    // 获取汽车状态信息
    carStyleList () {
      this.$get({
        url: '/monitor/carStyleList',
        data: this.searchForm,
        success: data => {
          this.carStatus['nocb'] = data['nocb']
          this.carStatus['nocnob'] = data['nocnob']
          this.carStatus['noscb'] = data['noscb']
          this.carStatus['noscnob'] = data['noscnob']
          this.carStatus['scb'] = data['scb']
          this.carStatus['scnob'] = data['scnob']
        }
      })
    },
    // 获取月度报表数据
    getOrgData () {
      this.$get({
        url: '/monthReport/orgData',
        data: {
          orgIDs: this.searchForm['orgIDs'] || '',
          startDate: this.$firstDate(new Date())
        },
        success: data => {
          this.orgData = data.statistic || []
        }
      })
    },
    // 获取报警数据
    getAlarmData () {
      this.$get({
        url: '/monitor/home/listData',
        data: this.searchForm,
        success: data => {
          this.alarmData = data.Rows.slice(0, this.moreSize) || []
          if (data.Rows.length > this.moreSize) {
            this.moreAlarmData = data.Rows.slice(this.moreSize)
            this.moreVisible = true
          } else {
            this.moreVisible = false
          }
        }
      })
    },
    // 刷新处理
    refreshHandle () {
      this.carStyleList()
      this.getAlarmData()
      this.getOrgData()
    },
    // 机构改变处理
    changeHandle () {
      this.searchForm.orgIDs = this.orgIDs.join(',')
      this.refreshHandle()
    },
    // 查询处理
    searchHandle () {
      this.refreshHandle()
    },
    // 跳转相应的状态
    monitorHandle (num, status) {
      if (num > 0) this.$router.push({path: 'monitor', query: {status: status, orgIDs: this.searchForm.orgIDs}})
    },
    // 详见排名
    rankHandle (index, attribute) {
      this.$localStorage('attribute', attribute)
      this.rowNum = index
      this.isShow = true
    },
    // 闲置的详细列表
    idleHandle (row) {
      this.orgId = row.orgID
      this.isShow1 = true
    },
    // 离线的详细列表
    offlineHandle (row) {
      this.orgId = row.orgID
      this.isShow2 = true
    },
    // ABS的详细列表
    absHandle (row) {
      this.orgId = row.orgID
      this.isShow3 = true
    },
    // PSI的详细列表
    psiHandle (row) {
      this.orgId = row.orgID
      this.isShow4 = true
    },
    moreHandle () {
      this.moreAlarmData.forEach(item => {
        this.alarmData.push(item)
      })
      this.moreVisible = false
      this.lessVisible = true
    },
    lessHandle () {
      this.alarmData = this.alarmData.slice(0, this.moreSize)
      this.moreVisible = true
      this.lessVisible = false
    }
  },
  components: {
    'report-data': ReportData,
    'idle-list': IdleList,
    'offline-list': OfflineList,
    'abs-list': ABSList,
    'psi-list': PSIList
  }
}
</script>

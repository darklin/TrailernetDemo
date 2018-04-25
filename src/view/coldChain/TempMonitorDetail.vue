<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('contentSubtitle.coldChain.tempMonitorDetail')}}</div>
    <div class="search-box clearfix">
      <el-form :model="searchForm" class="search-form">
        <el-form-item :label="$t('brakeRecord.from')" class="fl">
          <el-date-picker
            v-model="searchForm.startDate"
            ref="startDate"
            type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('brakeRecord.to')" class="fl">
          <el-date-picker
            v-model="searchForm.endDate"
            ref="endDate"
            type="datetime">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-button :loading="isLoading" class="search-btn fl" icon="search" @click="queryHandle">{{$t('common.search')}}</el-button>
      <!--<el-button class="search-export-btn fl">{{$t('car.export')}}</el-button>-->
    </div>
    <div style="text-align:center;">
      <el-radio-group style="margin-left: 20px" v-model="radioValue" @change="changeView()">
        <el-radio-button class="search-btn fl" label="车厢状态"></el-radio-button>
        <el-radio-button class="search-btn fl" label="车厢温度历史"></el-radio-button>
      </el-radio-group>
    </div>
    <br />
    <!-- <div class="vcharts-box">
      <div ref="echarts" class="echarts-box"></div>
    </div> -->
    <div class="table-box" v-show="vchartsBoxVisible">
      <el-table
        :data="countData"
        style="width: 100%">
        <el-table-column>
        </el-table-column>
         <el-table-column
          fixed="left"
          type="index"
          align="center"
          width="80"
          :label="$t('index.indexField')">
        </el-table-column>
        <el-table-column
          fixed="left"
          prop="OrgName"
          align="center"
          width="120"
          :label="$t('common.organization')">
        </el-table-column>
        <el-table-column
          fixed="left"
          prop="LicensePlate"
          align="center"
          width="180"
          :label="$t('boxUp.licensePlate')">
        </el-table-column>
        <el-table-column
          prop="Speed"
          align="center"
          width="120"
          :label="$t('common.speedKm')">
        </el-table-column>
        <el-table-column
          prop="data1"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '1'">
        </el-table-column>
        <el-table-column
          prop="data2"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '2'">
        </el-table-column>
        <el-table-column
          prop="data3"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '3'">
        </el-table-column>
        <el-table-column
          prop="data4"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '4'">
        </el-table-column>
        <el-table-column
          prop="data5"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '5'">
        </el-table-column>
        <el-table-column
          prop="data6"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '6'">
        </el-table-column>
        <el-table-column
          prop="data7"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '7'">
        </el-table-column>
        <el-table-column
          prop="data8"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '8'">
        </el-table-column>
        <el-table-column
          fixed="right"
          prop="RecordTime"
          align="center"
          min-width="170"
          :label="$t('trailer.lastReportTime')"
          :formatter="formatterReportingTime">
        </el-table-column>
      </el-table>
      <div class="page-box text-fr">
        <el-pagination
          @current-change="pageHandle"
          :current-page="searchForm.page"
          :page-size="searchForm.pagesize"
          layout="total, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <el-row v-show="photoListVisible" style="text-align:right">
      <el-col :span="12">
        <br />
        <img src="../../assets/images/temp_car_1.png" style="width:400px">
        <br />
        <img src="../../assets/images/temp_car_2.png" style="width:400px">
      </el-col>
      <el-col :span="12" style="text-align:left">
        <el-form label-width="80px">
          <el-form-item :label="$t('coldChain.no1')">
            <span style="color:red">{{data1}}℃</span>
          </el-form-item>
          <el-form-item :label="$t('coldChain.no2')">
            <span style="color:red">{{data2}}℃</span>
          </el-form-item>
          <el-form-item :label="$t('coldChain.no3')">
            <span style="color:red">{{data3}}℃</span>
          </el-form-item>
          <el-form-item :label="$t('coldChain.no4')">
            <span style="color:red">{{data4}}℃</span>
          </el-form-item>
          <el-form-item :label="$t('coldChain.no5')">
            <span style="color:red">{{data5}}℃</span>
          </el-form-item>
          <el-form-item :label="$t('coldChain.no6')">
            <span style="color:red">{{data6}}℃</span>
          </el-form-item>
          <el-form-item :label="$t('coldChain.no7')">
            <span style="color:red">{{data7}}℃</span>
          </el-form-item>
          <el-form-item :label="$t('coldChain.no8')">
            <span style="color:red">{{data8}}℃</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
let chart = null
export default {
  name: 'temp-monitor-detail',
  data () {
    let carID = this.$localStorage('tempMonitorDetail') || ''
    return {
      zNodes: [],
      searchForm: {
        carID: carID,
        startDate: '',
        endDate: '',
        page: 1,
        pagesize: 10
      },
      isLoading: false,
      totalRecord: 1,
      multipleSelection: [],
      countData: [],
      xDatas: [],
      datas1: [],
      datas2: [],
      datas3: [],
      datas4: [],
      datas5: [],
      datas6: [],
      datas7: [],
      datas8: [],
      data1: 0,
      data2: 0,
      data3: 0,
      data4: 0,
      data5: 0,
      data6: 0,
      data7: 0,
      data8: 0,
      radioValue: '车厢状态',
      vchartsBoxVisible: false,
      photoListVisible: true,
      timer: null
    }
  },
  created () {
    this.searchHandle()
    this.searchForChart()
    this.timer = setInterval(() => {
      if (this.vchartsBoxVisible) {
        this.searchForChart()
      }
      if (this.photoListVisible) {
        this.searchHandle()
      }
    }, 300000)
  },
  methods: {
    searchHandle () {
      this.$get({
        url: '/coldchain/getMonitorDetail',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.countData = data.Rows || []
          this.data1 = this.countData['data1'] || 0
          this.data2 = this.countData['data2'] || 0
          this.data3 = this.countData['data3'] || 0
          this.data4 = this.countData['data4'] || 0
          this.data5 = this.countData['data5'] || 0
          this.data6 = this.countData['data6'] || 0
          this.data7 = this.countData['data7'] || 0
          this.data8 = this.countData['data8'] || 0
          if (this.data1 === 6503 || this.data1 === 6503.0 || this.data1 === 6503.5) {
            this.data1 = 'N/A'
          }
          if (this.data2 === 6503 || this.data2 === 6503.0 || this.data2 === 6503.5) {
            this.data2 = 'N/A'
          }
          if (this.data3 === 6503 || this.data3 === 6503.0 || this.data3 === 6503.5) {
            this.data3 = 'N/A'
          }
          if (this.data4 === 6503 || this.data4 === 6503.0 || this.data4 === 6503.5) {
            this.data4 = 'N/A'
          }
          if (this.data5 === 6503 || this.data5 === 6503.0 || this.data5 === 6503.5) {
            this.data5 = 'N/A'
          }
          if (this.data6 === 6503 || this.data6 === 6503.0 || this.data6 === 6503.5) {
            this.data6 = 'N/A'
          }
          if (this.data7 === 6503 || this.data7 === 6503.0 || this.data7 === 6503.5) {
            this.data7 = 'N/A'
          }
          if (this.data8 === 6503 || this.data8 === 6503.0 || this.data8 === 6503.5) {
            this.data8 = 'N/A'
          }
        }
      })
    },
    searchForChart () {
      this.$get({
        url: '/coldchain/getMonitorDetailForChart',
        data: this.searchForm,
        loading: true,
        success: data => {
          let datas = data.Rows || []
          this.totalRecord = data.Total || 0
          let countData = []
          this.xDatas = []
          this.datas1 = []
          this.datas2 = []
          this.datas3 = []
          this.datas4 = []
          this.datas5 = []
          this.datas6 = []
          this.datas7 = []
          this.datas8 = []
          datas.map(item => {
            this.xDatas.push(item['RecordTime'])
            this.datas1.push(item['data1'] || 0)
            this.datas2.push(item['data2'] || 0)
            this.datas3.push(item['data3'] || 0)
            this.datas4.push(item['data4'] || 0)
            this.datas5.push(item['data5'] || 0)
            this.datas6.push(item['data6'] || 0)
            this.datas7.push(item['data7'] || 0)
            this.datas8.push(item['data8'] || 0)
            if (item['data1'] === 6503 || item['data1'] === 6503.0 || item['data1'] === 6503.5) {
              item['data1'] = 'N/A'
            }
            if (item['data2'] === 6503 || item['data2'] === 6503.0 || item['data2'] === 6503.5) {
              item['data2'] = 'N/A'
            }
            if (item['data3'] === 6503 || item['data3'] === 6503.0 || item['data3'] === 6503.5) {
              item['data3'] = 'N/A'
            }
            if (item['data4'] === 6503 || item['data4'] === 6503.0 || item['data4'] === 6503.5) {
              item['data4'] = 'N/A'
            }
            if (item['data5'] === 6503 || item['data5'] === 6503.0 || item['data5'] === 6503.5) {
              item['data5'] = 'N/A'
            }
            if (item['data6'] === 6503 || item['data6'] === 6503.0 || item['data6'] === 6503.5) {
              item['data6'] = 'N/A'
            }
            if (item['data7'] === 6503 || item['data7'] === 6503.0 || item['data7'] === 6503.5) {
              item['data7'] = 'N/A'
            }
            if (item['data8'] === 6503 || item['data8'] === 6503.0 || item['data8'] === 6503.5) {
              item['data8'] = 'N/A'
            }
            countData.push(item)
          })
          this.countData = countData
        }
      })
    },
    queryHandle () {
      if (this.vchartsBoxVisible) {
        this.searchForChart()
      }
      if (this.photoListVisible) {
        this.searchHandle()
      }
    },
    changeView () {
      this.vchartsBoxVisible = !this.vchartsBoxVisible
      this.photoListVisible = !this.photoListVisible
      if (this.vchartsBoxVisible) {
        this.searchForChart()
      }
    },
    formatterReportingTime (row, column) {
      if (!row.RecordTime) {
        return '-'
      } else {
        return row.RecordTime
      }
    },
    pageHandle (page) {
      this.searchForm.page = page
      this.searchForChart()
    },
    initCharts () {
      chart = this.$echarts.init(this.$refs['echarts'])
      let option = {
        title: {
          text: this.$t('coldChain.chartTitle'),
          textStyle: {
            color: '#97a3b4'
          }
        },
        legend: {
          data: [this.$t('coldChain.no1'), this.$t('coldChain.no2'), this.$t('coldChain.no3'), this.$t('coldChain.no4'), this.$t('coldChain.no5'), this.$t('coldChain.no6'), this.$t('coldChain.no7'), this.$t('coldChain.no8')],
          textStyle: {
            color: '#97a3b4'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          splitLine: {
            show: false
          },
          data: this.xDatas,
          axisLabel: {
            textStyle: {
              color: '#97a3b4'
            }
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#97a3b4'
            }
          }
        },
        series: [{
          name: this.$t('coldChain.no1'),
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: this.datas1
        }, {
          name: this.$t('coldChain.no2'),
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: this.datas2
        }, {
          name: this.$t('coldChain.no3'),
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: this.datas3
        }, {
          name: this.$t('coldChain.no4'),
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: this.datas4
        }, {
          name: this.$t('coldChain.no5'),
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: this.datas5
        }, {
          name: this.$t('coldChain.no6'),
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: this.datas6
        }, {
          name: this.$t('coldChain.no7'),
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: this.datas7
        }, {
          name: this.$t('coldChain.no8'),
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: this.datas8
        }]
      }
      chart.setOption(option)
    }
  }
}
</script>

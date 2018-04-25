<template>
  <div class="content-box">
    <div class="index-query-box clearfix">
      <el-button :loading="isLoading" class="search-btn fl"  @click="openMessage">打开详细数据加载</el-button>
      <el-button :loading="isLoading" class="search-btn fl"  @click="closeMessage">关闭详细数据加载</el-button>
    </div>
    <div class="content-subtitle">卫星定位信息</div>
    <div class="vcharts-box">
      <div ref="echarts" class="echarts-box"></div>
    </div>
    <div class="index-count-box">
      <div class="index-title">定位信息汇总</div>
      <el-table
        :data="orgData"
        style="width: 100%"
        >
        <el-table-column
          type="index"
          :label="$t('index.indexField')"
          width="80">
        </el-table-column>
        <el-table-column
          prop="satelliteNum"
          label="卫星可见总数"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="GPSNum"
          label="GPS可见总数"
          min-width="120"> 
        </el-table-column>
        <el-table-column
          prop="beidouNum"
          label="北斗可见总数"
          header-align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="reallySatelliteNum"
          label="实际有效卫星数量"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="reallyGPSNum"
          label="实际有效GPS数量"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="reallyBeidouNum"
          label="实际有效北斗数量"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="reportingTime"
          label="上报时间"
          min-width="120">
        </el-table-column>
      </el-table>
    </div>
    <div class="table-box">
      <div class="index-title">卫星定位信息详情</div>
      <el-table
        :data="countData"
        border
        style="width: 100%"
        @sort-change="sortChange">
        <el-table-column
          type="index"
          :label="$t('index.indexField')"
          width="80">
        </el-table-column>
        <el-table-column
          prop="SatelliteCode"
          label="卫星编号">
        </el-table-column>
        <el-table-column
          prop="SatelliteType"
          label="卫星类型">
          <template scope="scope">
            <div v-if="scope.row.SatelliteType === 0">GPS</div>
            <div v-else>北斗</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="SatelliteSNR"
          label="卫星信噪比 (%)"
          sortable='custom' >
          <template scope="scope">{{scope.row.SatelliteSNR | thousands}}</template>
        </el-table-column>
      </el-table>
      <div class="page-box text-fr">
        <el-pagination
          @current-change="pageHandle"
          :current-page="currentPage"
          layout="total, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
let tableData = []
export default {
  name: 'satellite-statistics',
  data () {
    let satellite = JSON.parse(this.$localStorage('satellite') || '')
    return {
      zNodes: [],
      satellite,
      searchForm: {
        page: 1,
        pagesize: 10
      },
      isLoading: false,
      currentPage: 1,
      totalRecord: 1,
      countData: [],
      orgData: []
    }
  },
  mounted () {
    this.searchHandle()
  },
  methods: {
    initcharts (data) {
      let SatelliteCode = []
      let GPS = []
      let GPSValue = 'GPS (%)'
      let beidou = []
      let beiDouValue = '北斗 (%)'
      data.forEach(item => {
        SatelliteCode.push(item['SatelliteCode'])
        if (item['SatelliteType'] === 0) {
          GPS.push(item['SatelliteSNR'])
          beidou.push('')
        } else {
          GPS.push('')
          beidou.push(item['SatelliteSNR'])
        }
      })
      let chart = this.$echarts.init(this.$refs['echarts'])
      var colors = ['#5793f3', '#d14a61']
      let option = {
        color: colors,
        title: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true
            }
          },
          formatter: function (params) {
            for (var i = 0; i < params.length; i++) {
              let va = params[i].data
              if (va) {
                return '信噪比: ' + va
              }
            }
          }
        },
        toolbox: {
          show: true,
          showTitle: false,
          feature: {
            mark: {show: true},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true, name: '卫星定位信息'}
          },
          iconStyle: {
            normal: {
              borderColor: '#95a2b3'
            },
            emphasis: {
              borderColor: '#d14a61'
            }
          }
        },
        calculable: true,
        legend: {
          textStyle: {
            color: '#97a3b4'
          },
          data: [GPSValue, beiDouValue],
          itemGap: 5
        },
        grid: {
          top: '12%',
          left: '5%',
          right: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: SatelliteCode
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              lineStyle: {
                color: ['#393f4b']
              }
            },
            axisLabel: {
              formatter: (a) => {
                a = +a
                return isFinite(a)
                  ? this.$echarts.format.addCommas(+a)
                  : ''
              }
            }
          }
        ],
        textStyle: {
          color: '#FFFFFF'
        },
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 90,
            height: 20
          },
          {
            type: 'inside',
            start: 94,
            end: 100
          },
          {
            show: true,
            yAxisIndex: 0,
            filterMode: 'empty',
            width: 20,
            height: '80%',
            showDataShadow: false,
            left: '93%'
          }
        ],
        series: [
          {
            name: GPSValue,
            type: 'bar',
            barMaxWidth: 60,
            data: GPS
          },
          {
            name: beiDouValue,
            type: 'bar',
            barMaxWidth: 60,
            data: beidou
          }
        ]
      }
      chart.setOption(option)
    },
    searchHandle () {
      this.$get({
        url: '/satellite/get',
        data: {'carID': this.satellite['CarID']},
        success: data => {
          tableData = data['Rows'] || []
          this.countData = tableData.slice(0, 10)
          this.totalRecord = tableData.length
          this.initcharts(tableData)
          let [GPSNum, beidouNum, reallySatelliteNum, reallyGPSNum, reallyBeidouNum, satelliteData, reportingTime] = [0, 0, 0, 0, 0, [], '']
          satelliteData['satelliteNum'] = tableData.length
          tableData.forEach(item => {
            reportingTime = item['ReportingTime']
            if (item['SatelliteType'] === 0) {
              if (item['SatelliteSNR'] > 0) {
                reallySatelliteNum++
                reallyGPSNum++
              }
              GPSNum++
            } else {
              if (item['SatelliteSNR'] > 0) {
                reallySatelliteNum++
                reallyBeidouNum++
              }
              beidouNum++
            }
          })
          satelliteData['GPSNum'] = GPSNum
          satelliteData['beidouNum'] = beidouNum
          satelliteData['reallySatelliteNum'] = reallySatelliteNum
          satelliteData['reallyGPSNum'] = reallyGPSNum
          satelliteData['reallyBeidouNum'] = reallyBeidouNum
          satelliteData['reportingTime'] = reportingTime
          this.orgData = []
          this.orgData.push(satelliteData)
        }
      })
    },
    openMessage () {
      this.$get({
        url: '/satellite/sendMessage',
        data: {'carID': this.satellite['CarID'], 'state': '2'}
      })
      this.searchHandle()
    },
    closeMessage () {
      this.$get({
        url: '/satellite/sendMessage',
        data: {'carID': this.satellite['CarID'], 'state': '0'}
      })
    },
    pageHandle (page) {
      this.countData = tableData.slice(10 * (page - 1), 10 * page)
      this.currentPage = page
    },
    sortChange (conditions) {
      if (conditions.prop === 'SatelliteSNR') {
        if (conditions.order === 'ascending') {
          tableData.sort(function (a, b) {
            return b.SatelliteSNR - a.SatelliteSNR
          })
        } else if (conditions.order === 'descending') {
          tableData.sort(function (a, b) {
            return a.SatelliteSNR - b.SatelliteSNR
          })
        }
      }
      this.countData = tableData.slice(10 * (this.currentPage - 1), 10 * this.currentPage)
      this.initcharts(tableData)
    }
  }
}
</script>

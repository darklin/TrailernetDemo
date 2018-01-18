<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('contentSubtitle.statisticsReport.boxingUploadingStastics')}}</div>
    <div class="search-box clearfix">
      <el-form :model="searchForm" class="search-form">
        <el-form-item :label="$t('common.organization')" class="fl">
          <el-select v-model="searchForm.orgIDs" clearable placeholder="">
            <el-option v-for="item,index in zNodes" :label="item.name" :value="item.id" :key="index" :checked="item.checked"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('car.carNo')" class="fl">
          <el-input v-model="searchForm.licensePlate"></el-input>
        </el-form-item>
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
      <el-button :loading="isLoading" class="search-btn fl" icon="search"  @click="searchHandle">{{$t('common.search')}}</el-button>
      <el-button class="search-export-btn fl"  @click="exportHandle">{{$t('car.export')}}</el-button>
    </div>
    <div class="vcharts-box">
      <div ref="echarts" class="echarts-box"></div>
    </div>
    <div class="table-box">
      <el-table
        :data="countData"
        style="width: 100%"
        @sort-change="sortChange">
        <el-table-column
          type="index"
          :label="$t('index.indexField')"
          width="80">
        </el-table-column>
        <el-table-column
          prop="LicensePlate"
          :label="$t('car.carNo')">
        </el-table-column>
        <el-table-column
          prop="OrgName"
          :label="$t('common.organization')">
        </el-table-column>
        <el-table-column
          prop="boxUP"
          sortable='custom'
          :label="$t('report.boxupTime')">
          <template scope="scope">{{scope.row.boxUP | thousands}}</template>
        </el-table-column>
        <el-table-column
          prop="boxDown"
          sortable='custom' 
          :label="$t('report.unBoxupTime')">
          <template scope="scope">{{scope.row.boxDown | thousands}}</template>
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
  name: 'boxing-unloading-statistics',
  data () {
    return {
      zNodes: [],
      searchForm: {
        startDate: '',
        endDate: '',
        orgIDs: '',
        licensePlate: '',
        status: '',
        page: 1,
        pagesize: 10
      },
      isLoading: false,
      currentPage: 1,
      totalRecord: 1,
      countData: []
    }
  },
  mounted () {
    this.searchHandle()
    this.queryOrganizate()
  },
  methods: {
    // 查询机构信息
    queryOrganizate () {
      this.$get({
        url: '/assist/queryOrganizate',
        success: data => {
          this.zNodes = data.zNodes || []
        }
      })
    },
    initcharts (data) {
      let LicensePlate = []
      let boxUP = []
      let boxUPValue = this.$t('report.boxupTime')
      let boxDown = []
      let boxDownValue = this.$t('report.unBoxupTime')
      data.forEach(item => {
        LicensePlate.push(item['LicensePlate'])
        boxUP.push(item['boxUP'])
        boxDown.push(item['boxDown'])
      })
      let chart = this.$echarts.init(this.$refs['echarts'])
      var colors = ['#f48532', '#03a9f3']
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
          }
        },
        toolbox: {
          show: true,
          showTitle: false,
          feature: {
            mark: {show: true},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true, name: this.$t('report.boxupStatistics')}
          },
          iconStyle: {
            normal: {
              borderColor: '#95a2b3'
            },
            emphasis: {
              borderColor: '#f48834'
            }
          }
        },
        calculable: true,
        legend: {
          textStyle: {
            color: '#97a3b4'
          },
          data: [boxUPValue, boxDownValue],
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
            data: LicensePlate,
            axisLine: {
              show: false
            }
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
            axisLine: {
              show: false
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
          color: '#87868b'
        },
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 90,
            borderColor: '#454a4d',
            textStyle: {
              color: '#87868b'
            },
            height: 20
          },
          {
            type: 'inside',
            start: 94,
            end: 100
          },
          {
            show: true,
            borderColor: '#454a4d',
            textStyle: {
              color: '#87868b'
            },
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
            name: boxUPValue,
            type: 'bar',
            barMaxWidth: 60,
            data: boxUP
          },
          {
            name: boxDownValue,
            type: 'bar',
            barMaxWidth: 60,
            data: boxDown
          }
        ]
      }
      chart.setOption(option)
    },
    searchHandle () {
      if (this.$refs['startDate'].displayValue) {
        this.searchForm['startDate'] = this.$refs['startDate'].displayValue
        this.searchForm['endDate'] = this.$refs['endDate'].displayValue
      } else {
        this.searchForm['startDate'] = this.$firstDate(new Date())
      }
      this.$get({
        url: '/boxReport/data',
        data: this.searchForm,
        success: data => {
          tableData = data['Rows'] || []
          this.countData = tableData.slice(0, 10)
          this.totalRecord = tableData.length
          this.initcharts(tableData)
        }
      })
    },
    pageHandle (page) {
      this.countData = tableData.slice(10 * (page - 1), 10 * page)
      this.currentPage = page
    },
    exportHandle () {
      window.location.href = `${this.$baseURL}boxReport/excel?${this.$serialize(this.searchForm)}`
    },
    sortChange (conditions) {
      if (conditions.prop === 'boxUP') {
        if (conditions.order === 'ascending') {
          tableData.sort(function (a, b) {
            return b.boxUP - a.boxUP
          })
        } else if (conditions.order === 'descending') {
          tableData.sort(function (a, b) {
            return a.boxUP - b.boxUP
          })
        }
      } else if (conditions.prop === 'boxDown') {
        if (conditions.order === 'ascending') {
          tableData.sort(function (a, b) {
            return b.boxDown - a.boxDown
          })
        } else if (conditions.order === 'descending') {
          tableData.sort(function (a, b) {
            return a.boxDown - b.boxDown
          })
        }
      }
      this.countData = tableData.slice(10 * (this.currentPage - 1), 10 * this.currentPage)
      this.initcharts(tableData)
    }
  }
}
</script>

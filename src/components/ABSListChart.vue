<template>
  <el-dialog title="" top="60px" class="dialog-gray-box" :visible.sync="dialogVisible">
    <el-button class="search-export-chart-btn fl"  @click="exportHandle">{{$t('car.export')}}</el-button>
    <div ref="echarts" class="echarts-box"></div>
  </el-dialog>
</template>

<script>
let chart = null
export default {
  name: 'chart-data',
  props: {
    carID: String,
    value: null
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = true
      // 第一次打开弹窗并没有初始化echarts，初始化echarts
      if (val) {
        this.$nextTick(() => {
          chart = this.$echarts.init(this.$refs['echarts'])
        })
      } else {
        this.initEcharts()
      }
    },
    dialogVisible (val) {
      this.$emit('input', false)
    }
  },
  methods: {
    // 绘制图表
    initEcharts () {
      this.$get({
        url: '/monitor/abs/listDataForChart',
        data: {
          carID: this.carID
        },
        success: data => {
          let Statistic = data['statistic'] || []
          let xAxisData = []
          let seriesData = []
          Statistic.forEach(item => {
            xAxisData.push(item['Xaxis'])
            seriesData.push(item['Num'])
          })
          chart.setOption({
            color: ['#FF0000'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: '5%',
              right: '4%',
              bottom: '10%',
              containLabel: true
            },
            xAxis: [
              {
                name: this.$t('abs.echart.reportTime'),
                nameLocation: 'middle',
                nameGap: 30,
                type: 'category',
                data: xAxisData,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: {
              type: 'value',
              name: this.$t('abs.echart.workTimes'),
              nameLocation: 'middle',
              nameGap: 30,
              minInterval: 1
            },
            series: [
              {
                name: this.$t('abs.echart.workTimes'),
                type: 'bar',
                barWidth: '60%',
                data: seriesData
              }
            ]
          })
        }
      })
    },
    exportHandle () {
      window.location.href = `${this.$baseURL}monitor/abs/days/excel?carID=${this.carID}`
    }
  }
}
</script>

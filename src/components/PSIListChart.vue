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
        url: '/monitor/psi/listDataForChart',
        data: {
          carID: this.carID
        },
        success: data => {
          var Statistic = data['statistic'] || []
          console.info(Statistic)
          console.info(data['max'])
          console.info(data['min'])
          var labelX = [this.$t('psi.echart.activated'), this.$t('psi.echart.unactivated')]
          let finalDatas = []
          for (let i in Statistic) {
            finalDatas.push({
              value: [
                Statistic[i]['startTime'], Statistic[i]['endTime'], Statistic[i]['PSIState'], Statistic[i]['state'], Statistic[i]['startTimeStr'], Statistic[i]['endTimeStr'], Statistic[i]['durationStr']
              ],
              itemStyle: {
                normal: {
                  color: '#c23531'
                }
              }
            })
          }
          console.info(finalDatas)
          const renderItem = (params, api) => {
            var yValue = api.value(2)
            var start = api.coord([api.value(0), yValue])
            var size = api.size([api.value(1) - api.value(0), yValue])
            var style = api.style()
            return {
              type: 'rect',
              shape: {
                x: start[0],
                y: start[1],
                width: size[0],
                height: size[1]
              },
              style: style
            }
          }
          chart.setOption({
            title: {
              text: this.$t('psi.echart.psiWorkStatus'),
              left: 'center'
            },
            tooltip: {},
            xAxis: {
              type: 'time',
              splitLine: {
                show: false
              },
              min: data['min'],
              max: data['max'],
              interval: 1000 * 24 * 3600,
              axisLabel: {
                formatter: function (value, index) {
                  var date = new Date(value)
                  var texts = [date.getFullYear(), (date.getMonth() + 1), date.getDate()]
                  return texts.join('-')
                }
              }
            },
            dataZoom: [{
              type: 'slider',
              filterMode: 'weakFilter',
              showDataShadow: false,
              top: 360,
              height: 10,
              borderColor: 'transparent',
              backgroundColor: '#e2e2e2',
              handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
              handleSize: 20,
              handleStyle: {
                shadowBlur: 6,
                shadowOffsetX: 1,
                shadowOffsetY: 2,
                shadowColor: '#aaa'
              },
              labelFormatter: ''
            }, {
              type: 'inside',
              filterMode: 'weakFilter'
            }],
            grid: {
              top: '15%',
              height: '30%'
            },
            yAxis: {
              splitNumber: 1,
              axisLabel: {
                formatter: function (value, index) {
                  if (value === 0) {
                    return labelX[1]
                  } else {
                    return labelX[0]
                  }
                }
              }
            },
            series: [{
              type: 'custom',
              renderItem: renderItem,
              dimensions: ['从1', '到2', 'status', '状态', this.$t('brakeRecord.from'), this.$t('brakeRecord.to'), this.$t('psi.echart.duration')],
              encode: {
                x: [0, 1],
                y: 2,
                tooltip: [4, 5, 6],
                itemName: 3
              },
              data: finalDatas
            }]
          })
        }
      })
    },
    exportHandle () {
      window.location.href = `${this.$baseURL}monitor/psi/listDataForChart/${this.carID}`
    }
  }
}
</script>

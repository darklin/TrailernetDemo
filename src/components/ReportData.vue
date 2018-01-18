<template>
  <el-dialog title="" top="60px" class="dialog-gray-box" :visible.sync="dialogVisible">
    <div ref="echarts" class="echarts-box"></div>
  </el-dialog>
</template>

<script>
let chart = null
let unit = ''
let chartText = ''
export default {
  name: 'report-data',
  props: {
    rowNum: [Number, String],
    orgIDs: String,
    value: null
  },
  data () {
    let date = new Date()
    let month = date.getMonth() + 1
    // month = month > 9 ? month : '0' + month
    return {
      dialogVisible: false,
      dateText: date.getFullYear() + '-' + month,
      dateTextZh: date.getFullYear() + ' 年 ' + month + ' 月 '
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
        if (chart !== null) {
          chart.clear()
        }
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
        url: '/monthReport/chartData',
        data: {
          orgIDs: this.orgIDs,
          startDate: this.dateText + '-01 00:00:00',
          rowNum: this.rowNum
        },
        success: data => {
          this.getChartTxet(this.rowNum)
          unit = this.getUnit(data['Unit'])
          let Statistic = data['statistic'] || []
          let xAxisData = []
          let seriesData = []
          if (this.rowNum === 5) {
            Statistic.forEach(item => {
              if (item['value'] >= 90) {
                item['value'] = 65.3
              }
              xAxisData.push(item['licensePlate'])
              seriesData.push(item['value'])
            })
          } else {
            Statistic.forEach(item => {
              xAxisData.push(item['licensePlate'])
              seriesData.push(item['value'])
            })
          }
          // 增加排序的功能
          for (let i = 0; i < seriesData.length - 1; i++) {
            for (let j = 0; j < seriesData.length - 1 - i; j++) {
              if (seriesData[j] < seriesData[j + 1]) {
                let tmp = seriesData[j]
                let tmp2 = xAxisData[j]
                seriesData[j] = seriesData[j + 1]
                seriesData[j + 1] = tmp
                xAxisData[j] = xAxisData[j + 1]
                xAxisData[j + 1] = tmp2
              }
            }
          }
          var colors = ['#f48532', '#03a9f3']
          chart.setOption({
            color: colors,
            title: {
              text: chartText,
              x: '50%',
              textAlign: 'center',
              textStyle: {
                color: '#97a3b4'
              }
            },
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
                saveAsImage: {show: true, name: chartText}
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
            grid: {
              top: '8%',
              left: '5%',
              right: '8%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisData,
                axisLine: {
                  show: false
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '',
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
                      ? this.$echarts.format.addCommas(+a) + unit
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
                type: 'bar',
                barMaxWidth: 60,
                data: seriesData
              }
            ]
          })
        }
      })
    },
    getUnit (value) {
      this.unit = ''
      if (this.rowNum === 0 || this.rowNum === 3 || this.rowNum === 7) {
        if (value === 'false') {
          this.unit = 'km'
        } else {
          this.unit = 'mile'
        }
      } else if (this.rowNum === 9 || this.rowNum === 10) {
        this.unit = '%'
      } else if (this.rowNum === 1 || this.rowNum === 2 || this.rowNum === 8 || this.rowNum === 12) {
        this.unit = 'h'
      } else if (this.rowNum === 5) {
        if (value === 'false') {
          this.unit = 'km/h'
        } else {
          this.unit = 'mile/h'
        }
      }
      return this.unit
    },
    getChartTxet (rowNum) {
      this.chartText = ''
      if (this.$i18n.locale === 'zh') {
        if (this.rowNum === 0) {
          chartText = this.dateTextZh + '行驶里程'
        } else if (this.rowNum === 1) {
          chartText = this.dateTextZh + '行驶时长'
        } else if (this.rowNum === 2) {
          chartText = this.dateTextZh + '停止时长'
        } else if (this.rowNum === 3) {
          chartText = this.dateTextZh + '超速里程'
        } else if (this.rowNum === 4) {
          chartText = this.dateTextZh + '超速次数'
        } else if (this.rowNum === 5) {
          chartText = this.dateTextZh + '平均车速'
        } else if (this.rowNum === 6) {
          chartText = this.dateTextZh + '装箱和卸箱次数'
        } else if (this.rowNum === 7) {
          chartText = this.dateTextZh + '累计行驶里程'
        } else if (this.rowNum === 8) {
          chartText = this.dateTextZh + '累计行驶时长'
        } else if (this.rowNum === 9) {
          chartText = this.dateTextZh + '空驶率'
        } else if (this.rowNum === 10) {
          chartText = this.dateTextZh + '车辆利用率'
        } else if (this.rowNum === 11) {
          chartText = this.dateTextZh + '万公里制动次数'
        } else if (this.rowNum === 12) {
          chartText = this.dateTextZh + 'PSI运行时长'
        }
      } else {
        if (this.rowNum === 0) {
          chartText = 'Mileage In ' + this.dateText
        } else if (this.rowNum === 1) {
          chartText = 'Runing Time In ' + this.dateText
        } else if (this.rowNum === 2) {
          chartText = 'Parklin Time In ' + this.dateText
        } else if (this.rowNum === 3) {
          chartText = 'Overspeed Mileage In ' + this.dateText
        } else if (this.rowNum === 4) {
          chartText = 'Overspeed Times In ' + this.dateText
        } else if (this.rowNum === 5) {
          chartText = 'Average Speed In ' + this.dateText
        } else if (this.rowNum === 6) {
          chartText = 'Load And UnLoad Times In ' + this.dateText
        } else if (this.rowNum === 7) {
          chartText = 'Total Mileage '
        } else if (this.rowNum === 8) {
          chartText = 'Accumulative Of Driving In ' + this.dateText
        } else if (this.rowNum === 9) {
          chartText = 'Empty Rate In ' + this.dateText
        } else if (this.rowNum === 10) {
          chartText = 'Vehicle Utilization Rate In ' + this.dateText
        } else if (this.rowNum === 11) {
          chartText = 'Ten Thousand KM Braking Times In ' + this.dateText
        } else if (this.rowNum === 12) {
          chartText = 'PSI Running Time In ' + this.dateText
        }
      }
    }
  }
}
</script>

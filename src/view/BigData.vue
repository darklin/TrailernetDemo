<template>
   <div class="content-box" style="padding:20px 20px 0px 20px">
    <h1 style="text-align:center;background-color:#cad5de"><span style="color:red">挂车帮大数据平台&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>实时总行驶里程：{{sumMileage}} km  在途车辆：{{sumCarNumber}}</h1>
    <div class="big-data-vcharts-box">
      <div ref="zoneSpeedEcharts" class="big-data-vcharts-box echarts-box"></div>
    </div>
    <div class="big-data-vcharts-box">
      <div ref="transportCapacityEcharts" class="big-data-vcharts-box echarts-box"></div>
    </div>
    <div class="big-data-vcharts-box">
      <div ref="driverExperienceEcharts" class="big-data-vcharts-box echarts-box"></div>
    </div>
    <div class="big-data-vcharts-box">
      <div ref="prosperIndexEcharts" class="big-data-vcharts-box echarts-box"></div>
    </div>
    <div class="big-data-vcharts-box">
      <div ref="logisticsIndexEcharts" class="big-data-vcharts-box echarts-box"></div>
    </div>
  </div>
</template>

<script>
let zoneSpeedChart = null
let zoneSpeedOption = null
let transportCapacityChart = null
let transportCapacityOption = null
let driverExperienceChart = null
let driverExperienceOption = null
let prosperIndexChart = null
let prosperIndexOption = null
let logisticsIndexChart = null
let logisticsIndexOption = null
let scale = 1
import {loadJS} from '../map/util'
import Transform from '@/utils/transform'
export default {
  name: 'big-data',
  data () {
    return {
      zoneSpeedData: [],
      transportCapacityData: [],
      driverExperienceData: [],
      prosperIndexData: [],
      logisticsIndexData: [],
      sumMileage: 0,
      sumCarNumber: 0,
      timer: null
    }
  },
  beforeDestory () {
    clearInterval(this.timer)
  },
  created () {
    window.echarts = this.$echarts
    loadJS('http://gallerybox.echartsjs.com/dep/echarts/map/js/china.js')
    // 延迟加载数据，防止china.js文件未加载完毕导致的中国地图只显示南海诸岛的bug出现
    setTimeout(() => {
      this.searchZoneSpeedHandle()
      this.searchSum()
      this.searchTransportCapacity()
      this.searchDriverExperience()
      this.searchProsperIndex()
      this.searchLogisticsIndex()
    }, 1000)
    this.timer = setInterval(() => {
      this.searchSum()
      this.searchZoneSpeedHandle()
    }, 20000)
  },
  methods: {
    // 总量
    searchSum () {
      this.$get({
        url: '/bigdata/getSum',
        success: data => {
          this.sumMileage = data['sumMileage'] || 0
          this.sumCarNumber = data['sumCarNumber'] || 0
        }
      })
    },
    // 获取区域物流效率指数
    searchZoneSpeedHandle () {
      this.$get({
        url: '/bigdata/getZoneSpeed',
        success: data => {
          data = data['Rows'] || []
          let currentData = []
          if (data.length > 10) {
            data.splice(10, data.length - 10)
          }
          data.forEach(item => {
            currentData.push({
              'name': item['name'],
              'value': [
                item['speed'],
                item['speed'],
                item['name']
              ]
            })
          })
          var date1 = new Date()
          var currentdate = date1.getHours() + ':' + date1.getMinutes()
          this.zoneSpeedData.push({
            'time': currentdate,
            'data': currentData
          })
          if (this.zoneSpeedData.length > 5) {
            this.zoneSpeedData.splice(0, 1)
          }
          this.initZoneSpeedCharts(this.zoneSpeedData)
        }
      })
    },
    // 获取运力榜
    searchTransportCapacity () {
      this.$get({
        url: '/bigdata/getTransportCapacity',
        success: data => {
          this.initTransportCapacity(data)
        }
      })
    },
    // 获取老司机经验排行榜
    searchDriverExperience () {
      this.$get({
        url: '/bigdata/getDriverExperience',
        success: data => {
          this.initDriverExperience(data)
        }
      })
    },
    // 获取中国物流景气度
    searchProsperIndex () {
      this.$get({
        url: '/bigdata/getProsperIndex',
        success: data => {
          this.initProsperIndex(data)
        }
      })
    },
    // 获取中国物流指数
    searchLogisticsIndex () {
      this.$get({
        url: '/bigdata/getLogisticsIndex',
        success: data => {
          this.initLogisticsIndex(data)
        }
      })
    },
    // 初始化区域物流效率指数图表
    initZoneSpeedCharts (echartData) {
      zoneSpeedChart = this.$echarts.init(this.$refs['zoneSpeedEcharts'])
      zoneSpeedChart.showLoading()
      zoneSpeedOption = {
        backgroundColor: '#0E2A43',
        baseOption: {
          animationDurationUpdate: 1000,
          animationEasingUpdate: 'quinticInOut',
          timeline: {
            axisType: 'category',
            orient: 'vertical',
            autoPlay: true,
            inverse: true,
            playInterval: 5000,
            left: null,
            right: 5,
            top: 20,
            bottom: 20,
            width: 46,
            height: null,
            label: {
              normal: {
                textStyle: {
                  color: '#ddd'
                }
              },
              emphasis: {
                textStyle: {
                  color: '#fff'
                }
              }
            },
            symbol: 'none',
            lineStyle: {
              color: '#555'
            },
            checkpointStyle: {
              color: '#bbb',
              borderColor: '#777',
              borderWidth: 1
            },
            controlStyle: {
              showNextBtn: false,
              showPrevBtn: false,
              normal: {
                color: '#666',
                borderColor: '#666'
              },
              emphasis: {
                color: '#aaa',
                borderColor: '#aaa'
              }
            },
            data: echartData.map(function (ele) {
              return ele.time
            })
          },
          backgroundColor: '#0E2A43',
          title: {
            text: '区域物流效率指数',
            left: 'center',
            top: 'top',
            textStyle: {
              fontSize: 25,
              color: 'rgba(255,255,255, 0.9)'
            }
          },
          tooltip: {
            formatter: function (params) {
              if (params.data['value']) {
                return params.data.value[2] + ': ' + params.data.value[0]
              }
            }
          },
          grid: {
            left: 10,
            right: '55%',
            top: '80%',
            bottom: 5
          },
          xAxis: {},
          yAxis: {},
          series: [{
            id: 'map',
            type: 'map',
            mapType: 'china',
            top: '10%',
            // bottom: '25%',
            // left: '5%',
            // right: '10%',
            itemStyle: {
              normal: {
                areaColor: '#323c48',
                borderColor: '#404a59'
              },
              emphasis: {
                label: {
                  show: true
                },
                areaColor: 'rgba(255,255,255, 0.5)'
              }
            },
            data: []
          }, {
            id: 'bar',
            type: 'bar',
            tooltip: {
              show: false
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                textStyle: {
                  color: '#ddd'
                }
              }
            },
            data: []
          }, {
            id: 'pie',
            type: 'pie',
            radius: ['12%', '20%'],
            center: ['75%', '85%'],
            // roseType: 'area',
            tooltip: {
              formatter: '{b} {d}%'
            },
            data: [],
            label: {
              normal: {
                textStyle: {
                  color: '#ddd'
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: '#ddd'
                }
              }
            },
            itemStyle: {
              normal: {
                borderColor: 'rgba(0,0,0,0.3)',
                borderSize: 1
              }
            }
          }]
        },
        options: []
      }
      for (var i = 0; i < echartData.length; i++) {
        zoneSpeedOption.options.push({
          visualMap: [{
            calculable: true,
            dimension: 0,
            left: 10,
            top: 'center',
            itemWidth: 12,
            min: echartData[i].data[echartData[i].data.length - 1].value[0],
            max: echartData[i].data[0].value[0],
            text: ['High', 'Low'],
            textStyle: {
              color: '#ddd'
            },
            inRange: {
              color: ['lightskyblue', 'yellow', 'orangered']
            }
          }],
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.1],
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'category',
            axisLabel: {
              show: false,
              textStyle: {
                color: '#ddd'
              }
            },
            data: echartData[i].data.map(function (ele) {
              return ele.value[2]
            }).reverse()
          },
          series: [{
            id: 'map',
            data: echartData[i].data
          }, {
            id: 'bar',
            label: {
              normal: {
                position: 'right',
                formatter: '{b} : {c}'
              }
            },
            data: echartData[i].data.map(function (ele) {
              return ele.value[0]
            }).reverse()
          }, {
            id: 'pie',
            data: echartData[i].data.map(function (ele) {
              return {
                name: ele.value[2],
                value: ele.value
              }
            })
          }]
        })
      }
      zoneSpeedChart.setOption(zoneSpeedOption)
      zoneSpeedChart.hideLoading()
    },
    // 初始化运力榜图表
    initTransportCapacity (echartData) {
      transportCapacityChart = this.$echarts.init(this.$refs['transportCapacityEcharts'])
      transportCapacityChart.showLoading()
      let yDatas = []
      let xDatas = []
      let maxValue = echartData['Max'] || 0
      this.transportCapacityData = echartData['Rows'] || []
      this.transportCapacityData.forEach(item => {
        yDatas.push(item['OrgName'])
        xDatas.push(item['averageSpeed'])
      })
      transportCapacityOption = {
        backgroundColor: '#0E2A43',
        title: {
          text: '公司运力榜',
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 25,
            color: 'rgba(255,255,255, 0.9)'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            return params[0]['name'] + '的运力值为: ' + params[0]['data']
          }
        },
        grid: {
          left: '4%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: [{
          type: 'category',
          data: yDatas,
          axisLabel: {
            // inside: true,
            padding: [0, 15, 0, 0],
            textStyle: {
              color: '#189cbb',
              fontSize: 16 * scale
            }
          },
          axisTick: {
            show: false,
            lineStyle: {
              color: '#189cbb'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#189cbb'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(80,224,255,0.3)',
              type: 'dashed'
            }
          },
          name: '公司',
          nameTextStyle: {
            color: '#fff',
            fontSize: 16 * scale,
            padding: [0, 0, 10, 0]
          }
        }],
        xAxis: [{
          type: 'value',
          max: maxValue,
          // boundaryGap: ['20%'],
          axisLabel: {
            textStyle: {
              color: '#189cbb',
              fontSize: 16 * scale
            }
          },
          axisTick: {
            show: false,
            lineStyle: {
              color: '#189cbb'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#189cbb'
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(80,224,255,0.3)',
              type: 'dashed'
            }
          },
          name: '运力值(km/h/辆)',
          nameLocation: 'middle',
          nameGap: 25,
          nameTextStyle: {
            color: '#fff',
            fontSize: 16 * scale,
            padding: [0, 0, 10, 0]
          }
        }],
        series: [{
          name: '通过率',
          type: 'bar',
          data: xDatas,
          barWidth: '50%',
          barCategoryGap: '35%',
          label: {
            normal: {
              show: true,
              position: 'right',
              distance: 20,
              formatter: function (params) {
                return params.data
              },
              textStyle: {
                color: '#ffc72b',
                fontSize: 16 * scale
              }
            }
          },
          itemStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: '#032b3e' // 0% 处的颜色
              }, {
                offset: 1,
                color: '#0d9abb' // 100% 处的颜色
              }], false)
            }
          }
        }]
      }
      transportCapacityChart.setOption(transportCapacityOption)
      transportCapacityChart.hideLoading()
    },
    // 初始化老司机经验排行榜
    initDriverExperience (echartData) {
      driverExperienceChart = this.$echarts.init(this.$refs['driverExperienceEcharts'])
      driverExperienceChart.showLoading()
      let yDatas = []
      let xDatas = []
      let maxValue = echartData['Max'] || 0
      this.driverExperienceData = echartData['Rows'] || []
      this.driverExperienceData.forEach(item => {
        yDatas.push(item['LicensePlate'])
        xDatas.push(item['sumMileage'])
      })
      driverExperienceOption = {
        backgroundColor: '#0E2A43',
        title: {
          text: '老司机经验榜',
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 25,
            color: 'rgba(255,255,255, 0.9)'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            return params[0]['name'] + '的经验值为: ' + params[0]['data']
          }
        },
        dataZoom: [{
          type: 'slider',
          yAxisIndex: 0,
          left: 10,
          start: 70,
          end: 100
        }],
        grid: {
          left: '4%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: [{
          type: 'category',
          data: yDatas,
          axisLabel: {
            // inside: true,
            padding: [0, 15, 0, 0],
            textStyle: {
              color: '#189cbb',
              fontSize: 16 * scale
            }
          },
          axisTick: {
            show: false,
            lineStyle: {
              color: '#189cbb'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#189cbb'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(80,224,255,0.3)',
              type: 'dashed'
            }
          },
          name: '司机',
          nameTextStyle: {
            color: '#fff',
            fontSize: 16 * scale,
            padding: [0, 0, 10, 0]
          }
        }],
        xAxis: [{
          type: 'value',
          max: maxValue,
          // boundaryGap: ['20%'],
          axisLabel: {
            textStyle: {
              color: '#189cbb',
              fontSize: 16 * scale
            }
          },
          axisTick: {
            show: false,
            lineStyle: {
              color: '#189cbb'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#189cbb'
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(80,224,255,0.3)',
              type: 'dashed'
            }
          },
          name: '经验值',
          nameLocation: 'middle',
          nameGap: 25,
          nameTextStyle: {
            color: '#fff',
            fontSize: 16 * scale,
            padding: [0, 0, 10, 0]
          }
        }],
        series: [{
          name: '车牌',
          type: 'bar',
          data: xDatas,
          barWidth: '50%',
          barCategoryGap: '35%',
          label: {
            normal: {
              show: true,
              position: 'right',
              distance: 20,
              formatter: function (params) {
                return params.data
              },
              textStyle: {
                color: '#ffc72b',
                fontSize: 16 * scale
              }
            }
          },
          itemStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: '#032b3e' // 0% 处的颜色
              }, {
                offset: 1,
                color: '#0d9abb' // 100% 处的颜色
              }], false)
            }
          }
        }]
      }
      driverExperienceChart.setOption(driverExperienceOption)
      driverExperienceChart.hideLoading()
    },
    // 初始化中国物流景气度
    initProsperIndex (echartData) {
      prosperIndexChart = this.$echarts.init(this.$refs['prosperIndexEcharts'])
      prosperIndexChart.showLoading()
      let yDatas = []
      let xDatas = []
      // let maxValue = echartData['Max'] || 0
      // let minValue = echartData['Min'] || 0
      let prosperIndexValue = 60
      this.prosperIndexData = echartData['Rows'] || []
      this.prosperIndexData.forEach(item => {
        yDatas.push(item['reportTime'])
        xDatas.push(item['average'] - prosperIndexValue)
      })
      prosperIndexOption = {
        backgroundColor: '#0E2A43',
        title: {
          text: '中国物流景气度',
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 25,
            color: 'rgba(255,255,255, 0.9)'
          }
        },
        xAxis: {
          data: yDatas,
          axisLabel: {
            textStyle: {
              color: '#189cbb',
              fontSize: 16 * scale
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            return params[0]['name'] + '的' + params[0]['seriesName'] + ': ' + (params[0]['data'] + 100)
          }
        },
        grid: {
          top: '13%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: [{
          name: '景气度',
          type: 'value',
          axisLabel: {
            formatter: function (value, index) {
              return value + prosperIndexValue
            },
            padding: [0, 15, 0, 0],
            textStyle: {
              color: '#189cbb',
              fontSize: 16 * scale
            }
          }
        }],
        series: [{
          name: '景气度',
          type: 'bar',
          data: xDatas,
          itemStyle: {
            normal: {
              color: function (params) {
                if (params.value < 0) {
                  return '#61a0a8'
                } else {
                  return '#d48265'
                }
              }
            }
          }
        }]
      }
      prosperIndexChart.setOption(prosperIndexOption)
      prosperIndexChart.hideLoading()
    },
    // 初始化中国物流指数
    initLogisticsIndex (echartData) {
      logisticsIndexChart = this.$echarts.init(this.$refs['logisticsIndexEcharts'])
      logisticsIndexChart.showLoading()
      let points = []
      this.logisticsIndexData = echartData['Rows'] || []
      this.logisticsIndexData.forEach(item => {
        let point = null
        if (!Transform.outOfChina(item['Latitude'], item['Longitude'])) {
          point = Transform.wgs2bd(item['Latitude'], item['Longitude'])
        }
        if (point) {
          points.push({
            name: '',
            value: [point['lng'], point['lat']]
          })
        }
      })
      logisticsIndexOption = {
        backgroundColor: '#0E2A43',
        title: {
          text: '中国物流指数',
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 25,
            color: 'rgba(255,255,255, 0.9)'
          }
        },
        geo: {
          map: 'china',
          label: {
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#323c48',
              borderColor: '#111'
            },
            emphasis: {
              areaColor: '#2a333d'
            }
          }
        },
        series: [{
          name: '点',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: points,
          symbolSize: 12,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              color: 'rgba(37, 140, 249, 0.8)'
            },
            emphasis: {
              borderColor: '#50a3ba',
              borderWidth: 1
            }
          }
        }]
      }
      logisticsIndexChart.setOption(logisticsIndexOption)
      logisticsIndexChart.hideLoading()
    }
  }
}
</script>

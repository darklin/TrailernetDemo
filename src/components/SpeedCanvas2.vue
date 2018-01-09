<template>
  <div class="canvas-box">
    <div class="canvas-content" v-if="isOpen">
      <div class="canvas-panel" style="background: #fff;" v-if="listLen">
        <div ref="echarts" style="width: 400px;height: 420px;"></div>
      </div>
      <div class="empty-text" v-else>暂无数据</div>
      <div class="canvas-ctrl clearfix">
        <div class="ctrl-item fl">
          <span class="item-color blue-color"></span>
          <span class="item-text">0-30km</span>
        </div>
        <div class="ctrl-item fl">
          <span class="item-color green-color"></span>
          <span class="item-text">30-60km</span>
        </div>
        <div class="ctrl-item fl">
          <span class="item-color yellow-color"></span>
          <span class="item-text">60-90km</span>
        </div>
        <div class="ctrl-item fl">
          <span class="item-color red-color"></span>
          <span class="item-text">90km以上</span>
        </div>
        <el-button class="close-btn fl" icon="close" @click="openHandle"></el-button>
      </div>
    </div>
    <el-button class="open-btn" icon="plus" v-else @click="openHandle"></el-button>
  </div>
</template>

<script>
export default {
  name: 'speed-canvas',
  props: {
    canvasData: Array
  },
  data () {
    return {
      isOpen: false,
      list: {},
      listLen: 0,
      colors: ['#fff', '#437ac0', '#20a13c', '#d47108', '#d82828']
    }
  },
  watch: {
    canvasData (val) {
      val.forEach(item => {
        let date = item.ReportingDate
        let speed = item.Speed.replace(/[^\d.\d]/ig, '')
        if (this.list[date]) {
          this.list[date].push(speed)
        } else {
          this.list[date] = [speed]
        }
      })
      this.listLen = Object.keys(this.list).length
      this.renderData(this.list)
    }
  },
  methods: {
    openHandle () {
      this.isOpen = !this.isOpen
      this.renderData(this.list)
    },
    renderData (obj) {
      if (this.listLen && this.isOpen) {
        this.$nextTick(() => {
          let echarts = this.$echarts.init(this.$refs['echarts'])
          var data = []
          var startTime = +new Date()
          var categories = Object.keys(this.list)
          // Generate mock data
          this.$echarts.util.each(categories, (key, index) => {
            let item = this.list[key]
            let [len, i, val, color] = [item.length, 0, 0, this.colors[0]]
            var baseTime = startTime
            for (i = 0; i < len; i++) {
              val = Number(item[i])
              if (val === 0) {
                color = this.colors[0]
              } else if (val <= 30) {
                color = this.colors[1]
              } else if (val <= 60) {
                color = this.colors[2]
              } else if (val <= 90) {
                color = this.colors[3]
              } else {
                color = this.colors[4]
              }
              var duration = 1
              data.push({
                name: val,
                value: [
                  index,
                  baseTime,
                  baseTime += duration,
                  duration
                ],
                itemStyle: {
                  normal: {
                    color
                  }
                }
              })
              baseTime += 1
            }
          })
          let renderItem = (params, api) => {
            var categoryIndex = api.value(0)
            var start = api.coord([api.value(1), categoryIndex])
            var end = api.coord([api.value(2), categoryIndex])
            var height = api.size([0, 1])[1] * 0.6
            return {
              type: 'rect',
              shape: this.$echarts.graphic.clipRectByRect({
                x: start[0],
                y: start[1] - height / 2,
                width: end[0] - start[0],
                height: height
              }, {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
              }),
              style: api.style()
            }
          }
          let option = {
            tooltip: {
              formatter: function (params) {
                return params.marker + params.name + ': ' + params.value[3] + ' ms'
              }
            },
            legend: {
              data: ['bar', 'error']
            },
            dataZoom: [{
              type: 'slider',
              filterMode: 'weakFilter',
              showDataShadow: false,
              top: 400,
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
              top: 20,
              left: 85
              // height: 300
            },
            xAxis: {
              min: startTime,
              scale: true,
              axisLabel: {
                formatter: function (val) {
                  return Math.max(0, val - startTime) + ' ms'
                }
              }
            },
            yAxis: {
              data: categories
            },
            series: [{
              type: 'custom',
              renderItem: renderItem,
              // itemStyle: {
              //   normal: {
              //     opacity: 0.8
              //   }
              // },
              encode: {
                x: [1, 2],
                y: 0
              },
              data: data
            }]
          }
          echarts.setOption(option)
        })
      }
    }
  }
}
</script>

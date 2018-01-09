<template>
  <div class="canvas-box">
    <div class="canvas-content" v-if="isOpen">
      <div class="canvas-panel" style="background: #fff;" v-if="listLen">
        <div ref="echarts" :style="`width: 600px;height: ${(dateArr.length * 50) + 60}px;`"></div>
      </div>
      <div class="empty-text" v-else>{{$t('locu.noDate')}}</div>
      <div class="canvas-ctrl clearfix">
        <div class="ctrl-item fl">
          <span class="item-color blue-color"></span>
          <span class="item-text"> 0-30 {{unit}}/h</span>
        </div>
        <div class="ctrl-item fl">
          <span class="item-color green-color"></span>
          <span class="item-text"> 30-60 {{unit}}/h</span>
        </div>
        <div class="ctrl-item fl">
          <span class="item-color yellow-color"></span>
          <span class="item-text"> 60-90 {{unit}}/h</span>
        </div>
        <div class="ctrl-item fl">
          <span class="item-color red-color"></span>
          <span class="item-text"> >90 {{unit}}/h</span>
        </div>
        <el-button class="close-btn fr" icon="close" @click="openHandle"></el-button>
      </div>
    </div>
    <el-button class="open-btn" icon="plus" v-else @click="openHandle"></el-button>
  </div>
</template>

<script>
export default {
  name: 'speed-canvas',
  props: {
    canvasData: Array,
    unit: String
  },
  data () {
    return {
      isOpen: false,
      list: {},
      dateArr: [],
      listLen: 0,
      colors: ['#fff', '#437ac0', '#20a13c', '#d47108', '#d82828']
    }
  },
  watch: {
    canvasData (val) {
      let dateObj = {}
      val.forEach(item => {
        let date = item.ReportingTime.substr(0, 10)
        if (!dateObj[date]) dateObj[date] = true
      })
      this.listLen = Object.keys(val).length
      this.list = val
      this.dateArr = Object.keys(dateObj)
      this.renderData()
    }
  },
  methods: {
    openHandle () {
      this.isOpen = !this.isOpen
      this.renderData(this.list)
    },
    renderData () {
      if (this.listLen && this.isOpen) {
        this.$nextTick(() => {
          let echarts = this.$echarts.init(this.$refs['echarts'])
          let poistions = this.list
          let datesTemp = []
          let datesTemp1 = []
          let categories1 = new Map()
          function handlePoistions () {
            let speedTemp = -1
            let dateTemp = ''
            for (let i = 0, j = poistions.length; i < j; i++) {
              let speedkkk = handleSpeed(poistions[i].Speed.replace(/[^\d.\d]/ig, ''))
              let datekkk = poistions[i].ReportingTime.substring(0, 10)
              if (speedkkk !== speedTemp || datekkk !== dateTemp) {
                let poistionTemp = {}
                poistionTemp.date = datekkk
                poistionTemp.time = poistions[i].ReportingTime.substring(11)
                poistionTemp.speed = poistions[i].Speed
                poistionTemp.speedkkk = speedkkk
                datesTemp.push(poistionTemp)
                speedTemp = speedkkk
                dateTemp = poistionTemp.date
              }
            }
            for (let i = 0, j = datesTemp.length; i < j; i++) {
              categories1.put(datesTemp[i].date)
            }
            categories1 = categories1.keys()
            for (let i = 0, j = categories1.length; i < j; i++) {
              let key1 = categories1[i]
              let value1 = []
              for (let k = 0, l = datesTemp.length; k < l; k++) {
                let value2 = {}
                if (key1 === datesTemp[k].date) {
                  value2.time = datesTemp[k].time
                  value2.speed = datesTemp[k].speed
                  value2.timeD = handleTime(datesTemp[k].time)
                  value2.speedT = datesTemp[k].speedkkk
                  value1.push(value2)
                }
              }
              let kkkk = {}
              kkkk[key1] = value1
              datesTemp1.push(kkkk)
            }
          }
          handlePoistions()
          function handleTime (time1) {
            let kkk = time1.split(':')
            return Math.floor(kkk[0] * 60 + kkk[1] * 1 + kkk[2] / 60)
          }
          function handleSpeed (speed) {
            if (speed === 0) {
              return 0
            } else if (speed >= 0 && speed < 10) {
              return 1
            } else if (speed >= 10 && speed < 20) {
              return 2
            } else if (speed >= 20 && speed < 30) {
              return 3
            } else if (speed >= 30 && speed < 40) {
              return 4
            } else if (speed >= 40 && speed < 50) {
              return 5
            } else if (speed >= 50 && speed < 60) {
              return 6
            } else if (speed >= 60 && speed < 70) {
              return 7
            } else if (speed >= 70 && speed < 80) {
              return 8
            } else if (speed >= 80 && speed < 90) {
              return 9
            } else if (speed >= 90 && speed < 100) {
              return 10
            } else if (speed >= 100 && speed < 110) {
              return 11
            } else if (speed >= 110 && speed < 120) {
              return 12
            } else if (speed >= 120 && speed < 130) {
              return 13
            } else if (speed >= 130 && speed < 140) {
              return 14
            } else if (speed >= 140 && speed < 150) {
              return 15
            } else if (speed >= 150 && speed < 160) {
              return 16
            } else if (speed >= 160 && speed < 170) {
              return 17
            } else if (speed >= 170 && speed < 180) {
              return 18
            } else if (speed >= 180 && speed < 190) {
              return 19
            } else if (speed >= 190 && speed < 200) {
              return 20
            } else if (speed >= 200 && speed < 210) {
              return 21
            }
          }
          let data = []
          let dataCount = 10
          let startTime = 0
          let categories = this.dateArr
          let types = []
          if (this.unit === 'km') {
            types = [
              {name: '0km/h', color: '#ffffff'},
              {name: '0~10km/h', color: '#C0C0C0'},
              {name: '10~20km/h', color: '#E1FFFF'},
              {name: '20~30km/h', color: '#00FFFF'},
              {name: '30~40km/h', color: '#7b9ce1'},
              {name: '40~50km/h', color: '#bd6d6c'},
              {name: '50~60km/h', color: '#75d874'},
              {name: '60~70km/h', color: '#e0bc78'},
              {name: '70~80km/h', color: '#dc77dc'},
              {name: '80~90km/h', color: '#72b362'},
              {name: '90~100km/h', color: '#E9967A'},
              {name: '100~110km/h', color: '#FF6347'},
              {name: '110~120km/h', color: '#FFE4E1'},
              {name: '120~130km/h', color: '#FA8072'},
              {name: '130~140km/h', color: '#F08080'},
              {name: '140~150km/h', color: '#BC8F8F'},
              {name: '150~160km/h', color: '#CD5C5C'},
              {name: '160~170km/h', color: '#FF0000'},
              {name: '170~180km/h', color: '#A52A2A'},
              {name: '180~190km/h', color: '#B22222'},
              {name: '190~200km/h', color: '#8B0000'},
              {name: '200~210km/h', color: '#800000'}
            ]
          } else {
            types = [
              {name: '0mile/h', color: '#ffffff'},
              {name: '0~10mile/h', color: '#C0C0C0'},
              {name: '10~20mile/h', color: '#E1FFFF'},
              {name: '20~30mile/h', color: '#00FFFF'},
              {name: '30~40mile/h', color: '#7b9ce1'},
              {name: '40~50km/h', color: '#bd6d6c'},
              {name: '50~60mile/h', color: '#75d874'},
              {name: '60~70mile/h', color: '#e0bc78'},
              {name: '70~80mile/h', color: '#dc77dc'},
              {name: '80~90mile/h', color: '#72b362'},
              {name: '90~100mile/h', color: '#E9967A'},
              {name: '100~110mile/h', color: '#FF6347'},
              {name: '110~120mile/h', color: '#FFE4E1'},
              {name: '120~130mile/h', color: '#FA8072'},
              {name: '130~140mile/h', color: '#F08080'},
              {name: '140~150mile/h', color: '#BC8F8F'},
              {name: '150~160mile/h', color: '#CD5C5C'},
              {name: '160~170mile/h', color: '#FF0000'},
              {name: '170~180mile/h', color: '#A52A2A'},
              {name: '180~190mile/h', color: '#B22222'},
              {name: '190~200mile/h', color: '#8B0000'},
              {name: '200~210mile/h', color: '#800000'}
            ]
          }
          let finalDatas = []
          for (let i in datesTemp1) {
            let baseT = 0
            for (let item in datesTemp1[i]) {
              for (let j = 0, k = datesTemp1[i][item].length; j < k; j++) {
                let dateT = datesTemp1[i][item][j]
                let typeItem = types[dateT.speedT]
                finalDatas.push({
                  name: typeItem.name,
                  value: [
                    i * 1,
                    baseT,
                    dateT.timeD,
                    typeItem.name
                  ],
                  itemStyle: {
                    normal: {
                      color: typeItem.color
                    }
                  }
                })
                baseT = dateT.timeD
              }
            }
          }
          this.$echarts.util.each(categories, function (category, index) {
            let baseTime = startTime
            let randoms = createRandom(10, 1440)
            for (let i = 0; i < dataCount; i++) {
              let typeItem = types[Math.round(Math.random() * (types.length - 1))]
              let duration = randoms[i]
              data.push({
                name: typeItem.name,
                value: [
                  index,
                  baseTime,
                  baseTime += duration,
                  duration
                ],
                itemStyle: {
                  normal: {
                    color: typeItem.color
                  }
                }
              })
            }
          })
          function createRandom (count, total) {
            let randoms = []
            let totalcurr = total
            let totaltemp = 0.0
            for (let i = 0; i < count - 1; i++) {
              let random = Math.random()
              randoms[i] = Math.round(random * totalcurr / 2) + 1
              totalcurr = totalcurr - randoms[i]
              totaltemp += randoms[i]
            }
            randoms[count - 1] = total - totaltemp
            return randoms
          }
          const renderItem = (params, api) => {
            let categoryIndex = api.value(0)
            let start = api.coord([api.value(1), categoryIndex])
            let end = api.coord([api.value(2), categoryIndex])
            let height = api.size([0, 1])[1] * 0.6
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
                return params.marker + params.name + ': ' + params.value[3] + ' min'
              }
            },
            grid: {
              top: 20,
              left: 85,
              height: this.dateArr.length * 50
            },
            xAxis: {
              type: 'value',
              max: 1440,
              interval: 60,
              axisLabel: {
                formatter: function (val, index) {
                  let sss = val / 60 + 'h'
                  return sss
                }
              }
            },
            yAxis: {
              data: categories1
            },
            series: [{
              type: 'custom',
              renderItem: renderItem,
              itemStyle: {
                normal: {
                  opacity: 0.8
                }
              },
              encode: {
                x: [1, 2],
                y: 0
              },
              data: finalDatas
            }]
          }
          function Map () {
            this.elements = []
            this.size = function () {
              return this.elements.length
            }
            this.isEmpty = function () {
              return this.elements.length < 1
            }
            this.clear = function () {
              this.elements = []
            }
            this.put = function (_key, _value) {
              if (!this.containsKey(_key)) {
                this.elements.push({
                  key: _key,
                  value: _value
                })
              }
            }
            this.remove = function (_key) {
              var bln = false
              try {
                for (let i = 0; i < this.elements.length; i++) {
                  if (this.elements[i].key === _key) {
                    this.elements.splice(i, 1)
                    return true
                  }
                }
              } catch (e) {
                bln = false
              }
              return bln
            }
            this.get = function (_key) {
              try {
                for (let i = 0; i < this.elements.length; i++) {
                  if (this.elements[i].key === _key) {
                    return this.elements[i].value
                  }
                }
              } catch (e) {
                return null
              }
            }
            this.element = function (_index) {
              if (_index < 0 || _index >= this.elements.length) {
                return null
              }
              return this.elements[_index]
            }
            this.containsKey = function (_key) {
              var bln = false
              try {
                for (let i = 0; i < this.elements.length; i++) {
                  if (this.elements[i].key === _key) {
                    bln = true
                  }
                }
              } catch (e) {
                bln = false
              }
              return bln
            }
            this.containsValue = function (_value) {
              var bln = false
              try {
                for (let i = 0; i < this.elements.length; i++) {
                  if (this.elements[i].value === _value) {
                    bln = true
                  }
                }
              } catch (e) {
                bln = false
              }
              return bln
            }
            this.values = function () {
              var arr = []
              for (let i = 0; i < this.elements.length; i++) {
                arr.push(this.elements[i].value)
              }
              return arr
            }
            this.keys = function () {
              var arr = []
              for (let i = 0; i < this.elements.length; i++) {
                arr.push(this.elements[i].key)
              }
              return arr
            }
          }
          echarts.setOption(option)
        })
      }
    }
  }
}
</script>

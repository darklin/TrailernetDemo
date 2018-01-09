<template>
  <div class="canvas-box">
    <div class="canvas-content" v-if="isOpen">
      <div class="canvas-panel" v-if="listLen">
        <div class="panel-row clearfix" v-for="val,key,index in list" :key="index">
          <div class="date-text fl">
            <div>{{key | dayText}}</div>
            <div>{{key}}</div>
          </div>
          <canvas class="canvas fl" :ref="key"></canvas>
        </div>
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
      colors: ['#437ac0', '#20a13c', '#d47108', '#d82828']
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
      let max = this.maxLen(obj)
      let wid = Number((320 / max).toFixed(4))
      for (let key in obj) {
        this.$nextTick(() => {
          if (this.$refs[key] && this.$refs[key][0]) {
            let canvas = this.$refs[key][0]
            let ctx = canvas.getContext('2d')
            let x = 0
            obj[key].forEach(item => {
              x += wid
              this.drawCanvas(ctx, item, x, wid)
            })
          }
        })
      }
    },
    drawCanvas (ctx, speed, x, wid) {
      speed = Number(speed)
      if (speed <= 30) {
        ctx.fillStyle = this.colors[0]
      } else if (speed <= 60) {
        ctx.fillStyle = this.colors[1]
      } else if (speed <= 90) {
        ctx.fillStyle = this.colors[2]
      } else {
        ctx.fillStyle = this.colors[3]
      }
      ctx.fillRect(x, 0, wid, 150)
    },
    maxLen (obj) {
      let arr = []
      for (let key in obj) {
        arr.push(obj[key].length)
      }
      return Math.max.apply({}, arr)
    }
  }
}
</script>

<template>
  <a-monitor v-if="type === 'a'" />
  <b-monitor v-else-if="type === 'b'" />
  <g-monitor v-else />
</template>

<script>
import AMonitor from '@/view/map/AMonitor' // 高德地图组件
import BMonitor from '@/view/map/BMonitor' // 百度地图组件
import GMonitor from '@/view/map/GMonitor' // 谷歌地图组件
export default {
  name: 'monitor',
  data () {
    // 判断语言类型
    // 中文加载高德地图
    // 否则加载google地图
    let type = this.$i18n.locale === 'zh' ? 'b' : 'g'
    return {
      type
    }
  },
  beforeCreate () {
    this.$parent.isOpen = false
  },
  components: {
    AMonitor,
    BMonitor,
    GMonitor
  }
}
</script>

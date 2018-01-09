export default {
  data () {
    return {
      map: null, // 地图实例
      infoWin: null, // 信息窗体
      marker: null, // 标注点
      hover: null, // 悬浮覆盖物
      polyline: null, // 轨迹路线
      timer: null, // 定时器
      powerSupplyMode: {
        0: this.$t('monitor.mainPower'),
        1: this.$t('monitor.battery'),
        2: this.$t('monitor.battery')
      },
      solarEnergyMode: {
        0: this.$t('common.yes'),
        1: this.$t('common.no')
      },
      markerIcon: {
        3: 'monitor_run_icon',
        4: 'monitor_run_null_icon',
        5: 'monitor_stop_icon',
        6: 'monitor_stop_null_icon',
        1: 'monitor_park_icon',
        2: 'monitor_park_null_icon',
        7: 'monitor_offline_icon'
      }
    }
  }
}

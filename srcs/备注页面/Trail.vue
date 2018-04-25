<template>
  <div class="content-box monitor-content" :class="{'monitor-table-content': !isTableOpen, 'monitor-search-content': !isSearchOpen}">
    <div class="trace-licence">{{trail['LicensePlate'] + $t('loca.sTrack')}}</div>
    <div class="map-box" id="map"></div>
    <div class="monitor-table">
      <div class="monitor-table-header">
        <div class="title">{{$t('home.monitorList')}}</div>
        <div class="monitor-down-btn" @click="tableOpen"></div>
      </div>
      <div class="monitor-table-body" v-if="isTableOpen">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            width="80"
            :label="$t('index.indexField')">
          </el-table-column>
          <el-table-column
            prop="status"
            width="120"
            :label="$t('common.state')">
          </el-table-column>
          <el-table-column
            prop="AlarmType"
            width="240"
            :label="$t('loca.alarmType')">
          </el-table-column>
          <el-table-column
            prop="ReportingTime"
            width="150"
            :label="$t('loca.positionTime')">
          </el-table-column>
          <el-table-column
            prop="Speed"
            width="120"
            :label="$t('common.speedKm')">
          </el-table-column>
          <el-table-column
            prop="address"
            min-width="400"
            show-overflow-tooltip
            :label="$t('boxUp.position')">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="monitor-search" v-show="isSearchOpen">
      <div class="search-header">
        <div class="title">{{$t('loca.chooseCar')}}</div>
        <div class="monitor-open-btn" @click.stop="searchOpen"></div>
      </div>
      <div class="search-box clearfix">
        <el-form :model="searchForm" class="search-form">
          <el-form-item :label="$t('loca.chooseCar')">
            <el-select v-model="searchForm.carID" filterable clearable placeholder="">
              <el-option v-for="item,index in carData" :label="item.LicensePlate" :value="item.CarID" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('loca.startTime')">
            <el-date-picker
              v-model="searchForm.startTime"
              ref="startTime"
              format="yyyy-MM-dd HH:mm"
              type="datetime"
              :picker-options="startPicker"
              @change="startChange">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('loca.endTime')">
            <el-date-picker
              v-model="searchForm.endTime"
              ref="endTime"
              format="yyyy-MM-dd HH:mm"
              type="datetime"
              :picker-options="endPicker">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('loca.playSpeed')">
            <el-select v-model="playSpeed">
              <el-option label="正常速度" :value="1000"></el-option>
              <el-option label="两倍速度" :value="2000"></el-option>
              <el-option label="四倍速度" :value="4000"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('loca.parkingSpace')">
            <el-input type="number" v-model="parkGap"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="mapMove">{{$t('loca.follow')}}</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button :loading="isLoading" class="search-btn fl"  @click="playHandle">{{$t('common.search')}}</el-button>
          </el-form-item>
          <el-form-item>
            <div class="trace-start-position">{{$t('loca.startPoint')}}: {{startPoint}}</div>
          </el-form-item>
          <el-form-item>
            <div class="trace-end-position">{{$t('loca.endPoint')}}: {{endPoint}}</div>
          </el-form-item>
          <el-form-item>
            <div class="trace-distance">{{$t('loca.totalMileage')}}: {{totalDistance}}km</div>
          </el-form-item>
          <el-form-item>
            <div class="trace-distance">运行时长: {{runTime}}</div>
          </el-form-item>
        </el-form>
        <!-- <el-button :loading="isLoading" class="search-btn fl" @click="searchHandle">播放</el-button> -->
      </div>
      <div class="trace-play-slider">
        <el-slider v-model="progress" :show-tooltip="false" :max="sliderSize" @change="sliderChange"></el-slider>
        <div class="trace-play-ctrl">
          <div class="rewind-btn"></div>
          <div class="play-btn" @click="playHandle"></div>
          <div class="forward-btn"></div>
        </div>
      </div>
    </div>
    <div class="monitor-search-btn" @click.stop="searchOpen" v-show="!isSearchOpen"></div>
  </div>
</template>

<script>
import Maps from '@/utils/maps'
import Transform from '@/utils/transform'
let markers = []
export default {
  name: 'trail',
  data () {
    let trail = JSON.parse(this.$localStorage('trail') || '')
    let date = new Date()
    let month = date.getMonth() + 1
    month = month > 9 ? month : '0' + month
    let day = date.getDate()
    day = day > 9 ? day : '0' + day
    let dateText = date.getFullYear() + '-' + month + '-' + day
    // dateText = '2017-05-04'
    // trail['CarID'] = '01d19b06270a44058741ab4b00e73965'
    let datePickerOptions = {
      shortcuts: [{
        text: '今天',
        onClick (picker) {
          picker.$emit('pick', new Date())
        }
      }, {
        text: '昨天',
        onClick (picker) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24)
          picker.$emit('pick', date)
        }
      }, {
        text: '一周前',
        onClick (picker) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', date)
        }
      }],
      disabledDate (time) {
        return time.getTime() > Date.now()
      }
    }
    return {
      trail: trail,
      isLoading: false,
      isTableOpen: false,
      isSearchOpen: true,
      carData: [],
      searchForm: {
        carID: trail['CarID'],
        startTime: dateText + ' 00:00',
        endTime: dateText + ' 23:59'
      },
      playSpeed: 1000,
      parkGap: 0,
      mapMove: false,
      startPoint: '',
      endPoint: '',
      totalDistance: 0,
      runTime: '',
      progress: 0,
      sliderSize: 0,
      startPicker: datePickerOptions,
      endPicker: datePickerOptions,
      map: null,
      geocoder: null,
      centerAPoint: [116.397428, 39.90923],
      centerGPoint: {lat: 39.90923, lng: 116.397428},
      powerSupplyMode: {0: '主电', 1: '电池', 2: '太阳能'},
      tableData: []
    }
  },
  beforeCreate () {
    this.$parent.isOpen = false
  },
  created () {
    this.getListTree()
    // this.searchHandle()
  },
  mounted () {
    if (this.$i18n.locale === 'zh') {
      Maps.loadMapJS('//webapi.amap.com/maps?v=1.3&key=36bbb44aa97730cacd6025ea4f9f11cf&plugin=AMap.Geocoder&callback=init', 'AMap', () => {
        let AMap = window.AMap
        let map = new AMap.Map('map', {
          resizeEnable: true,
          zoom: 12,
          center: this.centerAPoint
        })
        AMap.plugin(['AMap.Scale', 'AMap.Geolocation', 'AMap.MapType'], function () {
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: false // 显示定位按钮，默认：true
          })
          geolocation.getCityInfo(function (status, result) {
            if (status === 'complete') {
              map.setCenter([result.center[0], result.center[1]])
            }
          })
          map.addControl(new AMap.Scale())
          map.addControl(new AMap.Geolocation())
          map.addControl(new AMap.MapType())
        })
        this.geocoder = new AMap.Geocoder()
        this.map = map
      })
    } else {
      Maps.loadMapJS('//maps.googleapis.com/maps/api/js?key=AIzaSyB2KjWfZMG_HJdCr3IBMqOIkQcGBzykuUI&callback=init', 'GMap', () => {
        let GMap = window.google.maps
        let map = new GMap.Map(document.getElementById('map'), {
          center: this.centerGPoint,
          clickableIcons: false,
          zoom: 12
        })
        this.geocoder = new GMap.Geocoder()
        this.map = map
      })
    }
  },
  methods: {
    // 设置结束时间
    startChange (val) {
      val = val.split(' ')
      this.searchForm['endTime'] = val[0] + ' 23:59'
    },
    // 获取监控数据
    getListTree () {
      this.$get({
        url: '/location/listTree',
        success: data => {
          let datas = data.datas || []
          this.carData = datas
        }
      })
    },
    // 拖动播放滑块
    sliderChange (val) {
      console.log(val)
    },
    // 表格收缩处理
    tableOpen () {
      this.isTableOpen = !this.isTableOpen
    },
    // 搜索收缩处理
    searchOpen () {
      this.isSearchOpen = !this.isSearchOpen
    },
    // 查询历史信息
    searchHandle (callback) {
      if (typeof this.searchForm['startTime'] !== 'string') this.searchForm['startTime'] = this.$refs['startTime'].displayValue
      if (typeof this.searchForm['endTime'] !== 'string') this.searchForm['endTime'] = this.$refs['endTime'].displayValue
      this.$get({
        url: '/location/carHistoryPosition',
        data: this.searchForm,
        success: data => {
          let info = data['info'] || {}
          let history = this.tableData = info['arrCarHistoryPosition'] || []
          this.sliderSize = history.length
          callback()
        }
      })
    },
    // 播放处理
    playHandle () {
      this.searchHandle(() => {
        if (!this.tableData.length) {
          this.$message(this.$t('locu.noDate'))
        } else {
          this.initMap(this.tableData)
        }
      })
    },
    initMap (data) {
      for (var i = 0; i < data.length; i++) {
        let temp = Transform.wgs2gcj(data[i].Latitude, data[i].Longitude)
        data[i].Longitude = temp.lng
        data[i].Latitude = temp.lat
      }
      let firstPoint = data[0]
      let lastPoint = data[data.length - 1]
      let firstTime = firstPoint.TotalRunTime
      let lastTime = lastPoint.TotalRunTime
      firstTime = new Date(firstTime).getTime()
      lastTime = new Date(lastTime).getTime()
      let runTime = lastTime - firstTime
      let day = Math.floor(runTime / 1440)
      runTime = runTime % 1440
      let hour = Math.floor(runTime / 60)
      runTime = runTime % 60
      let minute = runTime
      this.runTime = `${day}天${hour}时${minute}分`
      let map = this.map
      if (this.$i18n.locale === 'zh') {
        let AMap = window.AMap
        map.remove(markers)
        markers = []
        map.panTo([firstPoint.Longitude, firstPoint.Latitude])
        // 起点标记
        let startMaker = new AMap.Marker({
          icon: require('@/assets/images/locus_start.png'),
          position: [firstPoint.Longitude, firstPoint.Latitude],
          map: map
        })
        markers.push(startMaker)
        this.getAddress([firstPoint.Longitude, firstPoint.Latitude], address => {
          this.startPoint = address
        })
        // 终点标记
        let endMarker = new AMap.Marker({
          icon: require('@/assets/images/locus_end.png'),
          position: [lastPoint.Longitude, lastPoint.Latitude],
          map: map
        })
        markers.push(endMarker)
        this.getAddress([lastPoint.Longitude, lastPoint.Latitude], address => {
          this.endPoint = address
        })
        // 总里程
        console.log(lastPoint.TotalMileage)
        console.log(firstPoint.TotalMileage)
        console.log(lastPoint.TotalMileage - firstPoint.TotalMileage)
        this.totalDistance = lastPoint.TotalMileage - firstPoint.TotalMileage
        this.totalDistance = this.totalDistance.toFixed(2)
        // 行驶标记
        let marker = new AMap.Marker({
          icon: require('@/assets/images/car.png'),
          position: [firstPoint.Longitude, firstPoint.Latitude],
          offset: new AMap.Pixel(-26, -13),
          map: map,
          autoRotation: true
        })
        markers.push(marker)
        let pathArr = []
        data.forEach(item => {
          pathArr.push([item.Longitude, item.Latitude])
        })
        // 绘制轨迹
        /* eslint-disable no-new */
        new AMap.Polyline({
          map: map,
          path: pathArr,
          strokeColor: '#333',
          strokeOpacity: 0.5,
          strokeWeight: 4,
          strokeStyle: 'solid'
        })
        map.setFitView()
        marker.moveAlong(pathArr, this.playSpeed)
        marker.on('moving', () => {
          // 画面跟随
          if (this.mapMove) {
            let position = marker.getPosition()
            let mLng = position.lng
            let mLat = position.lat
            if (mLng < map.getBounds().getSouthWest().lng || mLng > map.getBounds().getNorthEast().lng || mLat < map.getBounds().getSouthWest().lat || mLat > map.getBounds().getNorthEast().lat) {
              map.panTo(marker.getPosition())
            }
          }
        })
      } else {
        let GMap = window.google.maps
        map.panTo({lat: firstPoint.Latitude, lng: firstPoint.Longitude})
        // 起点标记
        /* eslint-disable no-new */
        new GMap.Marker({
          icon: {
            url: require('@/assets/images/locus_start.png'),
            size: new GMap.Size(31, 35)
          },
          position: {lat: firstPoint.Latitude, lng: firstPoint.Longitude},
          map: map
        })
        this.getAddress({lat: firstPoint.Latitude, lng: firstPoint.Longitude}, address => {
          this.startPoint = address
        })
        // 终点标记
        /* eslint-disable no-new */
        new GMap.Marker({
          icon: {
            url: require('@/assets/images/locus_end.png'),
            size: new GMap.Size(31, 35)
          },
          position: {lat: lastPoint.Latitude, lng: lastPoint.Longitude},
          map: map
        })
        this.getAddress({lat: lastPoint.Latitude, lng: lastPoint.Longitude}, address => {
          this.endPoint = address
        })
        // 总里程
        this.totalDistance = lastPoint.TotalMileage - firstPoint.TotalMileage
        this.totalDistance = this.totalDistance.toFixed(2)
        // 行驶标记
        let marker = new GMap.Marker({
          icon: {
            url: require('@/assets/images/car.png'),
            size: new GMap.Size(50, 30)
          },
          position: {lat: firstPoint.Latitude, lng: firstPoint.Longitude},
          map: map
        })
        let pathArr = []
        data.forEach(item => {
          pathArr.push(new GMap.LatLng(item.Latitude, item.Longitude))
        })
        // 绘制轨迹
        /* eslint-disable no-new */
        new GMap.Polyline({
          map: map,
          path: pathArr,
          geodesic: true,
          strokeColor: '#333',
          strokeOpacity: 0.5,
          strokeWeight: 4
        })
        let index = 0
        let timer = window.setInterval(() => {
          index++
          if (index >= data.length) {
            window.clearInterval(timer)
          } else {
            let item = data[index]
            marker.setPosition({lat: item.Latitude, lng: item.Longitude})
          }
        }, 100000 / this.playSpeed)
      }
    },
    // 获取地理位置
    getAddress (lnglat, callback) {
      if (this.$i18n.locale === 'zh') {
        window.AMap.convertFrom(lnglat, 'gps', (status, result) => {
          this.geocoder.getAddress(result.locations, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              callback(result.regeocodes[0].formattedAddress)
            }
          })
        })
      } else {
        this.geocoder.geocode({'location': lnglat}, (result, status) => {
          if (status === 'OK') {
            callback(result[0].formatted_address)
          }
        })
      }
    }
  }
}
</script>

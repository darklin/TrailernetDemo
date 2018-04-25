<template>
  <div class="content-box monitor-content" :class="{'monitor-table-content': !isTableOpen, 'monitor-search-content': !isSearchOpen}">
    <div class="monitor-status-list">
      <div class="item fl">
        <div class="title">{{$t('golbal.run')}}</div>
        <div class="text">9999</div>
      </div>
      <div class="item fl">
        <div class="title">{{$t('golbal.run')}}</div>
        <div class="text">0</div>
      </div>
      <div class="item fl">
        <div class="title">{{$t('golbal.stop')}}</div>
        <div class="text">0</div>
      </div>
      <div class="item fl">
        <div class="title">{{$t('golbal.stop')}}</div>
        <div class="text">0</div>
      </div>
      <div class="item fl">
        <div class="title">{{$t('golbal.park')}}</div>
        <div class="text">0</div>
      </div>
      <div class="item fl">
        <div class="title">{{$t('golbal.park')}}</div>
        <div class="text">0</div>
      </div>
      <div class="item fl">
        <div class="title">{{$t('golbal.offline')}}</div>
        <div class="text">0</div>
      </div>
    </div>
    <div class="map-box" id="map"></div>
    <div class="monitor-table">
      <div class="monitor-table-header">
        <div class="title">{{$t('home.monitorList')}}</div>
        <div class="monitor-down-btn" @click="tableOpen"></div>
      </div>
      <div class="monitor-table-body">
        <el-table
          :data="countData"
          border
          style="width: 100%" v-if="isTableOpen">
          <el-table-column
            type="index"
            :label="$t('index.indexField')"
            width="120">
          </el-table-column>
          <el-table-column
            prop="OrgName"
            label="机构">
          </el-table-column>
          <el-table-column
            prop="LicensePlate"
            label="车牌号">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
          </el-table-column>
          <el-table-column
            prop="AlarmType"
            label="报警类型">
          </el-table-column>
          <el-table-column
            prop="ReportingTime"
            label="定位时间">
          </el-table-column>
          <el-table-column
            prop="Speed"
            label="车速">
          </el-table-column>
          <el-table-column
            prop=""
            label="车辆类型">
          </el-table-column>
          <el-table-column
            prop=""
            label="位置">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="monitor-search" v-if="isSearchOpen">
      <div class="search-header">
        <div class="title">{{$t('loca.chooseCar')}}</div>
        <div class="monitor-open-btn" @click.stop="searchOpen"></div>
      </div>
      <div class="search-box clearfix">
        <el-form :model="searchForm" class="search-form">
          <el-form-item :label="$t('car.carNo')">
            <el-input v-model="searchForm.licensePlate" :placeholder="$t('car.typeCarNo')"></el-input>
          </el-form-item>
          <el-form-item label="车辆状态">
            <el-select v-model="searchForm.status" clearable placeholder="请选择车辆状态">
              <el-option label="不限" value="0"></el-option>
              <el-option label="停放(有箱无引)" value="1"></el-option>
              <el-option label="停放(无箱无引)" value="2"></el-option>
              <el-option label="行驶(有箱有引)" value="3"></el-option>
              <el-option label="行驶(无箱有引)" value="4"></el-option>
              <el-option label="停止(有箱有引)" value="5"></el-option>
              <el-option label="停止(无箱有引)" value="6"></el-option>
              <el-option label="离线" value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机构">
            <el-select v-model="searchForm.orgID" clearable placeholder="请选择机构">
              <el-option v-for="item,index in zNodes" :label="item.name" :value="item.id" :key="index" :checked="item.checked"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button :loading="isLoading" class="search-btn fl" @click="searchHandle">查询</el-button>
      </div>
      <el-tree
        :data="countData"
        :props="{label: 'LicensePlate'}"
        show-checkbox
        @check-change="handleCheckChange">
      </el-tree>
    </div>
    <template v-else>
      <div class="monitor-search-btn" @click.stop="searchOpen"></div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'monitor',
  data () {
    return {
      zNodes: [],
      searchForm: {
        status: '',
        licensePlate: '',
        orgID: ''
      },
      isLoading: false,
      isTableOpen: false,
      isSearchOpen: true,
      countData: []
    }
  },
  beforeCreate () {
    this.$parent.isOpen = false
  },
  created () {
    this.listTree()
    this.queryOrganizate()
    // 实时监控
    this.$get({
      url: '/location/carRealtimePosition',
      data: {carID: '01d19b06270a44058741ab4b00e73965'},
      success: data => {
        console.log(data)
      }
    })
    // 查询历史信息
    this.$get({
      url: '/location/carHistoryPosition',
      data: {
        carID: '01d19b06270a44058741ab4b00e73965',
        startTime: '2017-07-01 00:00:00',
        endTime: '2017-07-01 23:00:00'
      },
      success: data => {
        console.log(data)
      }
    })
  },
  mounted () {
    if (this.$i18n.locale === 'zh') {
      this.loadAMapJS()
    } else {
      this.loadGMapJS()
    }
  },
  methods: {
    // 加载JS库
    loadJS (url) {
      let script = document.createElement('script')
      script.setAttribute('src', url)
      document.getElementsByTagName('head')[0].appendChild(script)
    },
    // 异步加载高德地图JS库
    loadAMapJS () {
      if (!window.AMap) {
        this.loadJS('//webapi.amap.com/maps?v=1.3&key=36bbb44aa97730cacd6025ea4f9f11cf&callback=init')
        window.init = () => {
          // 加载高级UI组件库
          this.loadJS('//webapi.amap.com/ui/1.0/main.js')
          // 初始化高德地图
          this.initAMap()
        }
      } else {
        this.initAMap()
      }
    },
    // 异步加载Google地图JS库
    loadGMapJS () {
      if (!window.google) {
        this.loadJS('//maps.googleapis.com/maps/api/js?key=AIzaSyB2KjWfZMG_HJdCr3IBMqOIkQcGBzykuUI&callback=init')
        // 初始化Google地图
        window.init = () => this.initGMap()
      } else {
        this.initGMap()
      }
    },
    // 初始化高德地图
    initAMap () {
      // 初始化
      let AMap = window.AMap
      let markers = []
      let map = new AMap.Map('map', {
        resizeEnable: true,
        zoom: 13,
        center: [116.39, 39.9] // 可注释
      })
      // 加载插件
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation', 'AMap.MapType'], function () {
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.Scale())
        map.addControl(new AMap.Geolocation())
        map.addControl(new AMap.MapType())
      })
      // 添加标注点
      let lnglats = [
        [116.368904, 39.923423],
        [116.382122, 39.921176],
        [116.387271, 39.922501],
        [116.398258, 39.914600]
      ]
      let carInfo = [
        {
          carCard: '粤B 00901',
          org: '安煋公司',
          status: '停放',
          type: '无',
          speed: '0',
          mode: '主电',
          electric: '70%',
          date: '2017-07-12 12:45:21',
          location: '广东省深圳市龙华区福庭工竹村西区'
        },
        {
          carCard: '粤B 00902',
          org: '安煋公司',
          status: '停放',
          type: '无',
          speed: '0',
          mode: '主电',
          electric: '70%',
          date: '2017-07-12 12:45:21',
          location: '广东省深圳市龙华区福庭工竹村西区'
        },
        {
          carCard: '粤B 00903',
          org: '安煋公司',
          status: '停放',
          type: '无',
          speed: '0',
          mode: '主电',
          electric: '70%',
          date: '2017-07-12 12:45:21',
          location: '广东省深圳市龙华区福庭工竹村西区'
        },
        {
          carCard: '粤B 00905',
          org: '安煋公司',
          status: '停放',
          type: '无',
          speed: '0',
          mode: '主电',
          electric: '70%',
          date: '2017-07-12 12:45:21',
          location: '广东省深圳市龙华区福庭工竹村西区'
        }
      ]
      // 信息窗口
      let infoWindow = new AMap.InfoWindow({
        isCustom: true
        // closeWhenClickMap: true // 点击地图关闭信息窗体
      })
      for (let i = 0; i < lnglats.length; i++) {
        let marker = new AMap.Marker({
          content: '<div class="map-marker"><i>粤B 5KF28</i></div>',
          position: lnglats[i],
          map: map
        })
        markers.push(marker)
        marker.on('click', e => {
          let carItem = carInfo[i]
          let info = `<div class="map-window">
                        <div class="map-window-header">车牌号: ${carItem['carCard']}<i class="close-btn" id="closeBtn"></i></div>
                        <div class="map-window-body">
                          <div class="map-item"><label>所属机构:</label><span>${carItem['org']}</span></div>
                          <div class="map-item"><label>状<em></em>态:</label><span>${carItem['type']}</span></div>
                          <div class="map-item"><label>报警类型:</label><span>${carItem['status']}</span></div>
                          <div class="map-item"><label>车<em></em>速:</label><span>${carItem['speed']}km/h</span></div>
                          <div class="map-item"><label>供电方式:</label><span>${carItem['mode']}</span></div>
                          <div class="map-item"><label>剩余电量:</label><span>${carItem['electric']}</span></div>
                          <div class="map-item"><label>定位时间:</label><span>${carItem['date']}</span></div>
                          <div class="map-item"><label>位<em></em>置:</label><span>${carItem['location']}</span></div>
                        </div>
                        <div class="map-window-footer">
                          <a href="javascript:;" class="footer-btn trail-btn" id="trailBtn">历史轨迹</a>
                          <a href="javascript:;" class="footer-btn track-btn" id="trackBtn">实时跟踪</a>
                        </div>
                      </div>`
          infoWindow.setContent(info)
          infoWindow.open(map, e.target.getPosition())

          // 延时解决无法获取closeBtn元素
          setTimeout(() => {
            let closeBtn = document.getElementById('closeBtn')
            let trailBtn = document.getElementById('trailBtn')
            let trackBtn = document.getElementById('trackBtn')
            closeBtn.addEventListener('click', () => {
              infoWindow.close()
            })
            trailBtn.addEventListener('click', () => {
              // 删除所有标记点
              // map.remove(markers)
              map.clearMap()
              // 关闭信息窗体
              infoWindow.close()
              // 绘制轨迹
              this.drawALine(AMap, map)
            })
            trackBtn.addEventListener('click', () => {
              window.open('/trace')
              infoWindow.close()
            })
          }, 13)
        })
      }
      // 加载高级UI组件库(PathSimplifier)
      // window.initAMapUI()
      // window.AMapUI.load(['ui/misc/PathSimplifier'], function (PathSimplifier) {
      //   console.log(PathSimplifier)
      // })
    },
    drawALine (AMap, map) {
      let markers = [
        [116.368904, 39.923423],
        [116.382122, 39.921176],
        [116.387271, 39.922501],
        [116.398258, 39.914600]
      ]
      let polyline = new AMap.Polyline({
        map: map,
        path: markers
      })
      let marker = new AMap.Marker({
        map: map,
        position: new AMap.LngLat(116.398258, 39.914600),
        icon: require('@/assets/images/monitor_run_icon.png'),
        autoRotation: true
      })
      let lng = 116.398258
      let lat = 39.914600
      window.setInterval(() => {
        lng = lng + 0.001481
        lat = lat - 0.002256
        map.panTo([lng, lat])
        markers.push([lng, lat])
        polyline.setPath(markers)
        marker.moveAlong([[lng, lat]], 1000)
      }, 500)
    },
    // 初始化Google地图
    initGMap () {
      let GMap = window.google.maps
      let markers = []
      let overlay = null
      let map = new GMap.Map(document.getElementById('map'), {
        center: {lat: 39.9, lng: 116.39},
        clickableIcons: false,
        zoom: 13
      })
      let latlngs = [
        [39.923423, 116.368904],
        [39.921176, 116.382122],
        [39.922501, 116.387271],
        [39.914600, 116.398258]
      ]
      let carInfo = [
        {
          carCard: '粤B 00901',
          org: '安煋公司',
          status: '停放',
          type: '无',
          speed: '0',
          mode: '主电',
          electric: '70%',
          date: '2017-07-12 12:45:21',
          location: '广东省深圳市龙华区福庭工竹村西区'
        },
        {
          carCard: '粤B 00902',
          org: '安煋公司',
          status: '停放',
          type: '无',
          speed: '0',
          mode: '主电',
          electric: '70%',
          date: '2017-07-12 12:45:21',
          location: '广东省深圳市龙华区福庭工竹村西区'
        },
        {
          carCard: '粤B 00903',
          org: '安煋公司',
          status: '停放',
          type: '无',
          speed: '0',
          mode: '主电',
          electric: '70%',
          date: '2017-07-12 12:45:21',
          location: '广东省深圳市龙华区福庭工竹村西区'
        },
        {
          carCard: '粤B 00905',
          org: '安煋公司',
          status: '停放',
          type: '无',
          speed: '0',
          mode: '主电',
          electric: '70%',
          date: '2017-07-12 12:45:21',
          location: '广东省深圳市龙华区福庭工竹村西区'
        }
      ]
      for (let i = 0; i < latlngs.length; i++) {
        let lat = latlngs[i][0]
        let lng = latlngs[i][1]
        let marker = new GMap.Marker({
          position: {lat: lat, lng: lng},
          icon: require('@/assets/images/car_marker_icon.png'),
          map: map
        })
        // 添加车辆信息提示
        let infoLay = new GMap.OverlayView()
        infoLay.setMap(map)
        infoLay.onAdd = () => {
          let el = document.createElement('div')
          el.style.border = 'none'
          el.style.position = 'absolute'
          el.style.zIndex = 10
          el.innerHTML = '<div class="map-marker"><i>粤B 5KF28</i></div>'
          infoLay.el = el
          let panes = infoLay.getPanes()
          let overlayLayer = panes.overlayLayer
          overlayLayer.appendChild(el)
        }
        infoLay.draw = () => {
          let el = infoLay.el
          let projection = infoLay.getProjection()
          let pixel = projection.fromLatLngToDivPixel(new GMap.LatLng(lat, lng))
          let content = el.children[0]
          let height = content.clientHeight
          let width = content.clientWidth
          el.style.top = (pixel.y - height) + 'px'
          el.style.left = (pixel.x - (width / 2)) + 'px'
        }
        markers.push(marker)
        marker.addListener('click', e => {
          let carItem = carInfo[i]
          let info = `<div class="map-window">
                        <div class="map-window-header">车牌号: ${carItem['carCard']}<i class="close-btn" id="closeBtn"></i></div>
                        <div class="map-window-body">
                          <div class="map-item"><label>所属机构:</label><span>${carItem['org']}</span></div>
                          <div class="map-item"><label>状<em></em>态:</label><span>${carItem['type']}</span></div>
                          <div class="map-item"><label>报警类型:</label><span>${carItem['status']}</span></div>
                          <div class="map-item"><label>车<em></em>速:</label><span>${carItem['speed']}km/h</span></div>
                          <div class="map-item"><label>供电方式:</label><span>${carItem['mode']}</span></div>
                          <div class="map-item"><label>剩余电量:</label><span>${carItem['electric']}</span></div>
                          <div class="map-item"><label>定位时间:</label><span>${carItem['date']}</span></div>
                          <div class="map-item"><label>位<em></em>置:</label><span>${carItem['location']}</span></div>
                        </div>
                        <div class="map-window-footer">
                          <a href="javascript:;" class="footer-btn trail-btn" id="trailBtn">历史轨迹</a>
                          <a href="javascript:;" class="footer-btn track-btn" id="trackBtn">实时跟踪</a>
                        </div>
                      </div>`
          // 添加覆盖物
          if (overlay) {
            overlay.setMap(null)
          }
          overlay = new GMap.OverlayView()
          overlay.setMap(map)
          overlay.onAdd = () => {
            let el = document.createElement('div')
            el.style.border = 'none'
            el.style.position = 'absolute'
            el.style.zIndex = 10
            el.innerHTML = info
            overlay.el = el
            let panes = overlay.getPanes()
            // overlayImage层级可以接受DOM事件
            let overlayImage = panes.overlayImage
            overlayImage.appendChild(el)
          }
          overlay.draw = () => {
            let el = overlay.el
            let projection = overlay.getProjection()
            let pixel = projection.fromLatLngToDivPixel(new GMap.LatLng(lat, lng))
            let content = el.children[0]
            let height = content.clientHeight
            let width = content.clientWidth
            el.style.top = (pixel.y - height) + 'px'
            el.style.left = (pixel.x - (width / 2)) + 'px'
          }
          overlay.onRemove = () => {
            overlay.el.parentNode.removeChild(overlay.el)
            overlay.el = null
            return overlay
          }
          // 延时解决无法获取closeBtn元素
          setTimeout(() => {
            let closeBtn = document.getElementById('closeBtn')
            let trailBtn = document.getElementById('trailBtn')
            let trackBtn = document.getElementById('trackBtn')
            closeBtn.addEventListener('click', () => {
              overlay.setMap(null)
            })
            trailBtn.addEventListener('click', () => {
              overlay.setMap(null)
              // 绘制轨迹
              this.drawGLine(GMap, map)
            })
            trackBtn.addEventListener('click', () => {
              window.open('/trace')
              overlay.setMap(null)
            })
          }, 13)
          // 点击地图关闭信息弹窗
          map.addListener('click', () => {
            overlay.setMap(null)
          })
        })
      }
    },
    drawGLine (GMap, map) {
      let lng = 116.398258
      let lat = 39.914600
      let poly = new GMap.Polyline({
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3
      })
      poly.setMap(map)
      let marker = new GMap.Marker({
        position: {lat: lat, lng: lng},
        icon: require('@/assets/images/monitor_run_icon.png'),
        map: map
      })
      window.setInterval(() => {
        lng = lng + 0.001481
        lat = lat - 0.002256
        let path = poly.getPath()
        let point = new GMap.LatLng(lat, lng)
        path.push(point)
        marker.setPosition(point)
        map.setCenter(point)
      }, 500)
    },
    // 获取机构信息
    queryOrganizate () {
      this.$get({
        url: '/assist/queryOrganizate',
        success: data => {
          this.zNodes = data.zNodes || []
        }
      })
    },
    // 获取监控数据
    listTree () {
      this.$ajax({
        url: '/location/listTree',
        data: this.searchForm,
        success: data => {
          console.log(data.datas)
          this.countData = data.datas || []
        }
      })
    },
    tableOpen () {
      this.isTableOpen = !this.isTableOpen
    },
    searchOpen () {
      this.isSearchOpen = !this.isSearchOpen
    },
    searchHandle () {
      this.listTree()
    },
    handleCheckChange (val) {
      console.log(val)
    }
  }
}
</script>

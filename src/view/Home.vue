<template>
  <div class="wrap-box" :class="{'shrink-wrap': !isOpen, 'no-wrap': hideMenu}">
    <div class="header-box clearfix" v-if="!hideHead">
      <div class="account fr">
        <span class="account-user">{{$t("top.hello")}} <i>{{userName}}</i></span>
        <a class="account-item password-item" @click="changePass"></a><a class="account-item logout-item" @click="logoutHandle"></a>
      </div>
    </div>
    <div class="menu-box" v-if="!hideMenu">
      <div class="header-logo">
        <img :src="logoPath">
      </div>
      <div class="shrink-area clearfix">
        <el-button class="shrink-btn" @click="openHandle"></el-button>
      </div>
      <el-menu :default-active="menuActive" :default-openeds="openeds" router v-if="isOpen">
        <template v-for="item,key in menus">
          <!-- 仅一级菜单 -->
          <el-menu-item :index="key" v-if="!item['subMenu']"><i class="menu-icon" :class="key+'-icon'"></i>{{item['name']}}</el-menu-item>
          <el-submenu :index="key" v-else>
            <template slot="title"><i class="menu-icon" :class="key+'-icon'"></i><el-badge v-if="key === 'alarm'" :value="num" />{{item['name']}}</template>
            <template v-for="subItem,subKey in item['subMenu']">
              <!-- 仅二级菜单 -->
              <el-menu-item :index="subKey" v-if="!subItem['childMenu']">{{subItem['name']}}</el-menu-item>
              <el-menu-item-group v-else>
                <template slot="title">{{subItem['name']}}</template>
                <!-- 三级菜单 -->
                <el-menu-item v-for="childItem,childKey in subItem['childMenu']" :index="childKey" :key="childKey">{{childItem['name']}}</el-menu-item>
              </el-menu-item-group>
            </template>
          </el-submenu>
        </template>
      </el-menu>
      <div v-else>
        <div v-for="item,key in menus" class="menu-icon" :class="setMenuClass(item, key)" @click="menuHandle(item['name'])"><el-badge v-if="key === 'alarm'" :value="num" /></div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    // 设置用户名
    let userName = this.$localStorage('userName') || ''
    // 首字符小写
    let routeName = this.$route.name.replace(/^\w{1}/, L => L.toLowerCase())
    let menu = JSON.parse(this.$sessionStorage('menus'))
    // 隐藏左侧菜单栏
    let menuArr = new Set(['trail', 'track', 'trail1', 'track1', 'aTrail', 'aTrack', 'bTrail', 'bTrack', 'gTrail', 'gTrack', 'satellite', 'bigData', 'bigData1'])
    // 隐藏头部栏
    let menuHeadArr = new Set(['bigData', 'bigData1'])
    let num = this.$localStorage('alarmNum') || 0
    return {
      userName: userName,
      isOpen: true,
      openeds: [],
      hideMenu: menuArr.has(routeName),
      hideHead: menuHeadArr.has(routeName),
      menuActive: routeName,
      menus: menu,
      logoPath: require('@/assets/images/brand_logo_icon.png'),
      num: Number(num),
      timer: null,
      endTime: this.$date(new Date())
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (to.name === 'BigData') {
      window.open(window.location.pathname + '#' + '/home/bigData')
    } else {
      next()
    }
  },
  created () {
    this.getMenus()
    this.getTopInfo()
    this.getNote()
  },
  beforeDestory () {
    clearInterval(this.timer)
  },
  watch: {
    $route (val, old) {
      this.menuActive = val.name.replace(/^\w{1}/, L => L.toLowerCase())
    }
  },
  methods: {
    // 获取报警提醒
    getNote () {
      this.getAlarmParam()
      this.timer = setInterval(() => {
        this.getAlarmParam()
      }, 60000)
    },
    getAlarmParam () {
      let alarmIds = this.$localStorage('alarmIds')
      if (alarmIds) {
        this.setNode(alarmIds)
      } else {
        this.$get({
          url: '/usersetting/get',
          success: data => {
            let userSettingEdit = data.userSetting || {}
            let arr = []
            if (userSettingEdit.overspeedAlarm) arr.push(30)
            if (userSettingEdit.lowBatteryAlarm) arr.push(16)
            if (userSettingEdit.collisionAlarm) arr.push(15)
            if (userSettingEdit.rolloverAlarm) arr.push(1)
            let alarmIds = arr.join(',')
            this.$localStorage('alarmIds', alarmIds)
            this.setNode(alarmIds)
          }
        })
      }
    },
    setNode (alarmIds) {
      let end = this.$date(new Date())
      this.$get({
        url: '/assist/getNotification',
        data: {
          AlarmParam: alarmIds,
          start: this.endTime,
          end
        },
        success: data => {
          let info = data.info || []
          info.map(item => {
            this.num += item['COUNT(AlarmParam)']
          })
          this.$localStorage('alarmNum', this.num)
          this.endTime = end
        }
      })
    },
    // 获取菜单信息
    getMenus () {
      // 如果没有菜单缓存就去获取菜单信息
      if (!this.$sessionStorage('menus')) {
        let loading = this.$loading()
        this.$get({
          url: '/assist/queryMenus',
          success: data => {
            this.$sessionStorage('menus', JSON.stringify(data.menus))
            loading.close()
            this.$router.go()
          }
        })
      }
    },
    // 获取logo等信息
    getTopInfo () {
      this.$get({
        url: '/assist/queryTopInfo',
        success: data => {
          if (data.LogoPath) this.logoPath = this.$baseURL + data.LogoPath
        }
      })
    },
    // 修改密码
    changePass () {
      this.$router.push('changePassword')
    },
    // 退出
    logoutHandle () {
      this.$get({
        url: '/user/logout',
        success: data => {
          this.$router.replace('/login')
        }
      })
    },
    // 菜单收缩和展开
    menuHandle (type) {
      this.menuActive = type
      this.openeds = [type]
      this.isOpen = true
      if (type === 'Index' || type === 'Monitor') {
        this.$router.push(type)
      }
    },
    // 菜单展开和收缩
    openHandle () {
      this.isOpen = !this.isOpen
    },
    setMenuClass (item, key) {
      let active = this.menuActive
      let subMenu = item.subMenu
      let activeClass = `${key}-icon ${key}-active-icon`
      if (key === active) {
        return activeClass
      } else if (subMenu) {
        for (let subKey in subMenu) {
          if (subKey === active) {
            return activeClass
          } else if (subMenu[subKey]['childMenu']) {
            if (subMenu[subKey]['childMenu'][active]) return activeClass
          }
        }
      }
      return `${key}-icon`
    }
  }
}
</script>

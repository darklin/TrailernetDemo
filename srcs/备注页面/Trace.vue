<template>
  <div class="wrap-box">
    <div class="header-box clearfix">
      <div class="logo fl">{{$t('header.brand')}}</div>
      <div class="account fr">
        <span class="account-user">{{$t("top.hello")}}！ <i>{{userName}}</i></span>
        <a class="account-item">{{$t('sys.modifyPassword')}}</a><a class="account-item" @click="logoutHandle">{{$t('top.exit')}}</a>
      </div>
    </div>
    <div class="trace-content">
      <div class="map-box" id="map"></div>
    </div>
  </div>
</template>

<script>
import Maps from '@/utils/maps'
export default {
  name: 'trace',
  data () {
    let userName = this.$localStorage('userName') || ''
    return {
      userName: userName
    }
  },
  mounted () {
    if (this.$i18n.locale === 'zh') {
      Maps.loadAMapJS('//webapi.amap.com/maps?v=1.3&key=36bbb44aa97730cacd6025ea4f9f11cf&callback=init')
    } else {
      Maps.loadGMapJS('//maps.googleapis.com/maps/api/js?key=AIzaSyB2KjWfZMG_HJdCr3IBMqOIkQcGBzykuUI&callback=init')
    }
  },
  methods: {
    // 退出
    logoutHandle () {
      this.$get({
        url: '/user/logout',
        success: data => {
          this.$router.replace('/login')
        }
      })
    }
  }
}
</script>

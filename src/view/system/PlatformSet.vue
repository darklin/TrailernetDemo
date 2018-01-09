<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('contentSubtitle.setting.platformSet')}}</div>
    <div class="content-form-box margin-top">
      <div class="content-form">
        <el-form class="classify-form-box" :model="form" ref="form">
          <div class="classify-radio-group classify-radio-center">
            <el-form-item :label="$t('sys.languageSetting')" label-width="130px">
              <el-radio-group v-model="form.defaultLanguage">
                <el-radio-button label="0">中文</el-radio-button>
                <el-radio-button label="1">English</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <!--
            <el-form-item :label="$t('sys.mileageUnit')" label-width="130px">
              <el-radio-group v-model="form.mileageUnit">
                <el-radio-button label="0">{{$t('sys.KM')}}</el-radio-button>
                <el-radio-button label="1">{{$t('sys.mile')}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('sys.timeZone')" label-width="130px">
              <el-radio-group v-model="form.timeZone">
                <el-radio-button label="0">{{$t('sys.GMT8')}}</el-radio-button>
                <el-radio-button label="1">{{$t('sys.GMT')}}</el-radio-button>
              </el-radio-group>
            </el-form-item>-->
            <div class="info-ctrl-btn padding-top-50">
              <el-button :loading="isLoading" class="info-confirm-btn"  @click="globalSetHandle">{{$t('car.submit')}}</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'platform-set',
  data () {
    return {
      isLoading: false,
      form: {
        defaultLanguage: '',
        mileageUnit: '',
        timeZone: ''
      }
    }
  },
  created () {
    this.globalGetHandle()
  },
  methods: {
    globalSetHandle () {
      this.$post({
        url: '/globalSetting/edit',
        data: this.form,
        loading: true,
        success: data => {
          this.form = data.globalSettingEdit || []
          this.$localStorage('lang', this.form.defaultLanguage ? 'en' : 'zh')
          this.$get({
            url: '/assist/queryMenus',
            success: data => {
              this.$sessionStorage('menus', JSON.stringify(data.menus))
              this.$router.go()
            }
          })
        }
      })
    },
    globalGetHandle () {
      this.$get({
        url: '/globalSetting/get',
        loading: true,
        success: data => {
          this.form = data.globalSetting || []
        }
      })
    }
  }
}
</script>

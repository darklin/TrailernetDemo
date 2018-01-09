<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('sys.orgManagement')}}</div>
    <div class="content-ctrl">
      <el-button class="table-normal-btn" @click="backHandle">{{$t('common.goback')}}</el-button>
    </div>
    <div class="content-form-box">
      <div class="content-form">
        <div class="content-form-title">{{$t('common.edit') + ' ' + $t('sys.org')}}</div>
        <el-form :inline="true" label-position="right" class="info-form-box" label-width="160px" :model="form" ref="form">
          <el-form-item :label="$t('sys.orgName')" prop="orgName" :rules="{required: true, message: $t('sys.orgName') + $t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model="form.orgName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('boxUp.position')" prop="address" :rules="{required: true, message: $t('boxUp.position') + $t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model.number="form.address"></el-input>
          </el-form-item>
          <el-form-item :label="$t('car.remark')" prop="memo" :rules="{required: true, message: $t('car.remark') + $t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model="form.memo"></el-input>
          </el-form-item>
          <div class="info-ctrl-btn">
            <el-button :loading="isLoading" class="info-confirm-btn" @click="confirmHandle">{{$t('common.confirm')}}</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'edit-org',
  data () {
    let orgID = this.$localStorage('editOrg') || ''
    return {
      flag: false,
      orgID: orgID,
      isLoading: false,
      zNodes: [],
      provinces: [],
      citys: [],
      districts: [],
      form: {
        orgID: '',
        companyID: '',
        address: '',
        orgName: '',
        memo: '',
        provinceID: '',
        cityID: '',
        districtID: '',
        level: '',
        topID: '',
        parentID: '',
        iDPath: '',
        sortOrder: ''
      }
    }
  },
  created () {
    this.getOrganizate()
    this.queryOrganizate()
    this.queryAddress()
  },
  methods: {
    // 获取机构信息
    queryOrganizate () {
      this.$get({
        url: '/assist/queryOrganizate',
        success: data => {
          this.zNodes = data.zNodes || []
        }
      })
    },
    // 获取机构管理信息
    getOrganizate () {
      this.$get({
        url: '/organization/singleOrgan',
        data: {orgID: this.orgID},
        success: data => {
          this.form = data.organization || []
        }
      })
    },
    // 获取省市区区域信息
    queryAddress () {
      this.$get({
        url: '/assist/queryAddressLevel',
        success: data => {
          let info = data['info'] || {}
          this.provinces = info['province'] || []
          this.citys = info['city'] || []
          this.districts = info['district'] || []
          window.setTimeout(() => {
            this.flag = true
          }, 10)
        }
      })
    },
    // 更换省份
    provinceHandle (val) {
      this.$get({
        url: '/area/get',
        data: {parentId: val},
        success: data => {
          let info = data['info'] || {}
          this.citys = info['Areas'] || []
          this.districts = info['District'] || []
          if (this.flag) {
            this.form['cityID'] = ''
            this.form['districtID'] = ''
          }
        }
      })
    },
    // 更换城市
    cityHandle (val) {
      this.$get({
        url: '/area/get',
        data: {parentId: val},
        success: data => {
          let info = data['info'] || {}
          this.districts = info['Areas'] || []
          if (this.flag) {
            this.form['districtID'] = ''
          }
        }
      })
    },
    // 返回处理
    backHandle () {
      this.$router.back()
    },
    // 提交表单处理
    confirmHandle () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$put({
            url: '/organization',
            data: this.form,
            success: data => {
              this.$router.push('organizationalManagement')
            }
          })
        }
      })
    }
  }
}
</script>

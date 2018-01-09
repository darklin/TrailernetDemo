<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('sys.orgManagement')}}</div>
    <div class="content-ctrl">
      <el-button class="table-normal-btn" @click="backHandle">{{$t('common.goback')}}</el-button>
    </div>
    <div class="content-form-box">
      <div class="content-form">
        <div class="content-form-title">{{$t('common.add') + ' ' + $t('sys.subOrg')}}</div>
        <el-form :inline="true" label-position="right" class="info-form-box" label-width="160px" :model="form" ref="form">
          <el-form-item :label="$t('sys.orgName')" prop="OrgName" :rules="{required: true, message: $t('sys.orgName')+$t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model="form.OrgName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('boxUp.position')" prop="Address" :rules="{required: true, message: $t('boxUp.position')+$t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model="form.Address"></el-input>
          </el-form-item>
          <el-form-item :label="$t('car.remark')" prop="Memo" :rules="{required: true, message: $t('car.remark')+$t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model="form.Memo"></el-input>
          </el-form-item>
          <div class="info-ctrl-btn">
            <el-button :loading="isLoading" class="info-confirm-btn"  @click="confirmHandle">{{$t('common.confirm')}}</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add-org',
  data () {
    let orgID = this.$localStorage('addOrg') || ''
    return {
      isLoading: false,
      orgID: orgID,
      zNodes: [],
      provinces: [],
      citys: [],
      districts: [],
      form: {
        ParentID: '',
        OrgName: '',
        Address: '',
        Memo: ''
      }
    }
  },
  created () {
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
    // 获取省市区区域信息
    queryAddress () {
      this.$get({
        url: '/assist/queryAddressLevel',
        success: data => {
          let info = data['info'] || {}
          this.provinces = info['province'] || []
          this.citys = info['city'] || []
          this.districts = info['district'] || []
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
          this.form['ParentID'] = this.orgID
          this.$post({
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

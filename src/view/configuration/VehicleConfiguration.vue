<template>
  <div class="content-box">
    <div class="content-subtitle">车辆配置</div>
    <div class="content-form-box margin-top">
      <div class="content-form">
        <el-form class="classify-form-box clearfix" :model="form" ref="form">
          <div class="classify-radio-group fl">
            <el-form-item label="超速报警" label-width="110px" prop="language" :rules="[{required: true, message: '机构名称不能为空'}]">
              <el-radio-group v-model="form.language" size="small">
                <el-radio-button label="ON"></el-radio-button>
                <el-radio-button label="OFF"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="设备低电报警" label-width="110px" prop="language" :rules="[{required: true, message: '机构名称不能为空'}]">
              <el-radio-group v-model="form.language" size="small">
                <el-radio-button label="ON"></el-radio-button>
                <el-radio-button label="OFF"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="碰撞报警" label-width="110px" prop="language" :rules="[{required: true, message: '机构名称不能为空'}]">
              <el-radio-group v-model="form.language" size="small">
                <el-radio-button label="ON"></el-radio-button>
                <el-radio-button label="OFF"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="侧翻报警" label-width="110px" prop="language" :rules="[{required: true, message: '机构名称不能为空'}]">
              <el-radio-group v-model="form.language" size="small">
                <el-radio-button label="ON"></el-radio-button>
                <el-radio-button label="OFF"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <div class="info-ctrl-btn padding-top-50">
              <el-button :loading="isLoading" class="info-confirm-btn"  @click="confirmHandle">保存设置</el-button>
            </div>
          </div>
          <div class="classify-box fl">
            <div class="classify-item clearfix">
              <div class="classify-title fl">高速路:</div>
              <el-form-item label="超速定义(公里/小时)" class="fl">
                <el-input v-model="form.OrgName"></el-input>
              </el-form-item>
              <el-form-item label="超速持续时间(秒)" class="fl">
                <el-input v-model="form.OrgName"></el-input>
              </el-form-item>
            </div>
            <div class="classify-item clearfix">
              <div class="classify-title fl">快速路:</div>
              <el-form-item label="超速定义(公里/小时)" class="fl">
                <el-input v-model="form.OrgName"></el-input>
              </el-form-item>
              <el-form-item label="超速持续时间(秒)" class="fl">
                <el-input v-model="form.OrgName"></el-input>
              </el-form-item>
            </div>
            <div class="classify-item clearfix">
              <div class="classify-title fl">普通路:</div>
              <el-form-item label="超速定义(公里/小时)" class="fl">
                <el-input v-model="form.OrgName"></el-input>
              </el-form-item>
              <el-form-item label="超速持续时间(秒)" class="fl">
                <el-input v-model="form.OrgName"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'remind-detail',
  data () {
    return {
      isLoading: false,
      zNodes: [],
      provinces: [],
      citys: [],
      districts: [],
      form: {
        OrgID: '',
        language: '',
        CompanyID: '',
        OrgName: '',
        Memo: '',
        ProvinceID: '',
        CityID: '',
        DistrictID: '',
        Level: '',
        TopID: '',
        ParentID: '',
        IDPath: '',
        SortOrder: ''
      }
    }
  },
  methods: {
    searchHandle () {
      this.$post({
        url: '/cust/login',
        data: this.searchForm,
        loading: true,
        success: data => {
          console.log(data)
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    pageHandle () {}
  }
}
</script>

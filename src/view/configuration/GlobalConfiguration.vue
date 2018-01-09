<template>
  <div class="content-box">
    <div class="content-subtitle">全局设置</div>
    <div class="content-form-box margin-top">
      <div class="content-form">
        <el-form inline class="info-form-box large-label" label-width="150px" :model="form" ref="form">
          <el-form-item label="车辆闲置通知阀(>1)" prop="CompanyID" :rules="[{required: true, message: '车辆闲置通知阀不能为空'}]">
            <el-input v-model="form.CompanyID"></el-input>
          </el-form-item>
          <el-form-item label="语言设置" prop="language" :rules="[{required: true, message: '机构名称不能为空'}]">
            <el-radio-group v-model="form.language">
              <el-radio-button label="中文"></el-radio-button>
              <el-radio-button label="English"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="休眠甩挂上报频率" prop="OrgName" :rules="[{required: true, message: '休眠甩挂上报频率不能为空'}]">
            <el-input v-model="form.OrgName"></el-input>
          </el-form-item>
          <el-form-item label="里程单位" prop="Memo" :rules="[{required: true, message: '备注不能为空'}]">
            <el-input v-model="form.Memo"></el-input>
          </el-form-item>
          <el-form-item label="时区设置" prop="Memo" :rules="[{required: true, message: '备注不能为空'}]">
            <el-input v-model="form.Memo"></el-input>
          </el-form-item>
          <div class="info-ctrl-btn">
            <el-button :loading="isLoading" class="info-confirm-btn"  @click="confirmHandle">确定</el-button>
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

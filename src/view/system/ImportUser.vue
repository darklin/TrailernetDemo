<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('sys.userManagement')}}</div>
    <div class="content-ctrl">
      <el-button class="table-normal-btn" @click="backHandle">{{$t('common.goback')}}</el-button>
    </div>
    <div class="content-form-box">
      <div class="content-form">
        <div class="content-form-title">{{$t('excel.importUser')}}</div>
        <div class="vehicle-content-wrap">
          <div class="vehicle-import clearfix">
            <div class="vehicle-title fl">{{$t('excel.selectFiles')}}</div>
            <div class="fl">
              <el-upload
                drag
                ref="upload"
                :action="uploadURL"
                name="myfile"
                :auto-upload="false">
                <i class="el-icon-upload"></i>
                <div class="el-upload-title">{{$t('excel.clickOrDrag')}}</div>
                <div class="el-upload-text">{{$t('excel.supportFormat')}}:xlsx</div>
              </el-upload>
              <el-button class="vehicle-download-btn" @click="downloadTemplate">{{$t('excel.excleDownloadTemplateForm')}}</el-button>
            </div>
          </div>
        </div>
        <div class="vehicle-content-wrap">
          <div class="vehicle-tips clearfix">
            <div class="vehicle-title fl">{{$t('excel.importTips')}}:</div>
            <div class="vehicle-tips-content fl">
              <p>1.{{$t('excel.firstLineAsFieldName')}}.</p>
              <p>2.{{$t('excel.unexpectedErrorForXLSX')}}.</p>
              <p>3.{{$t('excel.formatDate')}}.</p>
              <p>4.{{$t('excel.formatDatetime')}}.</p>
            </div>
          </div>
        </div>
        <div class="vehicle-ctrl">
          <el-button @click="importVehicle">{{$t('excel.startImport')}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'import-vehicle',
  data () {
    return {
      dataType: 1,
      uploadURL: this.$baseURL + 'user/importExcel'
    }
  },
  created () {},
  methods: {
    // 下载车辆信息导入模板
    downloadTemplate () {
      window.location.href = `${this.$baseURL}user/templateExcel`
    },
    importVehicle () {
      this.$refs.upload.submit()
    },
    // 返回处理
    backHandle () {
      this.$router.back()
    }
  }
}
</script>

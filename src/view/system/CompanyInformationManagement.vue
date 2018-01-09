<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('sys.companyInfoManage')}}</div>
    <div class="edit-box clearfix">
      <el-form label-position="right" class="edit-form-box" label-width="135px" :model="searchForm" ref="searchForm">
        <el-form-item :label="$t('sys.companyName') + ':'" prop="companyName" :rules="[{required: true, message: $t('sys.companyName') + $t('common.beRequired')}]">
          <el-input v-model="searchForm.companyName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('sys.address') + ':'" prop="address" :rules="[{required: true, message: $t('sys.address')+$t('common.beRequired')}]">
          <el-input v-model="searchForm.address"></el-input>
        </el-form-item>
        <el-form-item :label="$t('sys.contacts') + ':'" prop="contacts" :rules="[{required: true, message: $t('sys.contacts') + $t('common.beRequired')}]">
          <el-input v-model="searchForm.contacts"></el-input>
        </el-form-item>
        <el-form-item :label="$t('sys.phone') + ':'" prop="phone" :rules="[{required: true, message: $t('sys.phone') + $t('common.beRequired')}]">
          <el-input v-model="searchForm.phone"></el-input>
        </el-form-item>
        <el-form-item :label="$t('sys.memo') + ':'" prop="memo">
          <el-input v-model="searchForm.memo"></el-input>
        </el-form-item>
        <el-form-item :label="$t('sys.companyLogo') + ':'" required>
          <el-upload
            class="upload-box"
            ref="upload"
            :action="uploadURL"
            :data="searchForm"
            name="logoFile"
            list-type="picture-card"
            :show-file-list="false"
            :on-change="changeHandle"
            :on-success="successHandle"
            :on-error="errorHandle"
            :auto-upload="false">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <div class="logo-uploader" v-else>
              <i class="el-icon-plus"></i>
              <div class="uploader-text">{{$t('common.choose') + ' ' + $t('sys.companyLogo')}}</div>
            </div>
            <div slot="tip" class="el-upload__tip">{{$t('sys.chooseLogoCondition')}}</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="">
          <el-button :loading="isLoading" class="edit-confirm-btn"  @click="confirmHandle">{{$t('common.submit')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'remind-detail',
  data () {
    return {
      uploadURL: this.$baseURL + 'company',
      isLogo: false,
      searchForm: {
        companyName: '',
        address: '',
        contacts: '',
        phone: '',
        memo: ''
      },
      imageUrl: '',
      isLoading: false
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 获取公司信息
    searchHandle () {
      this.$get({
        url: '/company',
        success: data => {
          this.searchForm = data['info'] || []
          this.imageUrl = data['info'].logoPath ? this.$baseURL + data['info'].logoPath : ''
        }
      })
    },
    confirmHandle () {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          if (this.isLogo) {
            this.$refs.upload.submit()
          } else {
            this.$put({
              url: '/company',
              data: this.searchForm,
              loading: true,
              success: data => {
                this.$router.go()
              }
            })
          }
        }
      })
    },
    changeHandle (file, fileList) {
      this.isLogo = true
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    successHandle (response, file, fileList) {
      this.$router.go()
    },
    errorHandle (err, file, fileList) {
      console.error(err)
    }
  }
}
</script>

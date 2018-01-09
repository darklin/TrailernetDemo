<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('sys.modifyPassword')}}</div>
    <div class="edit-box clearfix">
      <el-form label-position="right" class="edit-form-box" label-width="150px" :model="userForm" ref="userForm">
        <el-form-item :label="$t('sys.originalPassword') + ':'" prop="OldPassword" :rules="[{required: true, message: $t('sys.originalPassword') + $t('common.beRequired')}]">
          <el-input type="password" v-model="userForm.OldPassword"></el-input>
        </el-form-item>
        <el-form-item :label="$t('sys.newPassword') + ':'" prop="NewPassowrd" :rules="[{required: true, message: $t('sys.newPassword') + $t('common.beRequired')}]">
          <el-input type="password" v-model="userForm.NewPassowrd"></el-input>
        </el-form-item>
        <el-form-item :label="$t('sys.newPassword') + ':'" prop="ConfirmPassword" :rules="[{required: true, message: $t('sys.newPassword') + $t('common.beRequired')}]">
          <el-input type="password" v-model="userForm.ConfirmPassword"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button :loading="isLoading" class="edit-confirm-btn"  @click="confirmHandle">{{$t('common.confirm')}}</el-button>
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
      userForm: {
        OldPassword: '',
        NewPassowrd: '',
        ConfirmPassword: ''
      },
      isLoading: false
    }
  },
  methods: {
    confirmHandle () {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          let userForm = this.userForm
          if (userForm.NewPassowrd !== userForm.ConfirmPassword) {
            // this.$msg(this.$t('user.twicePwdDiff'))
            this.$alert(this.$t('user.twicePwdDiff'), '提示', {
              showConfirmButton: false,
              type: 'warning'
            })
            return
          }
          this.$post({
            url: '/user/changePassword',
            data: {
              OldPassword: userForm['OldPassword'],
              NewPassowrd: userForm['NewPassowrd']
            },
            loading: true,
            success: data => {
              this.$alert(this.$t('user.changePassword'), '提示', {
                showConfirmButton: false,
                type: 'success'
              })
            }
          })
        }
      })
    }
  }
}
</script>

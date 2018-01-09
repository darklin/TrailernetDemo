<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('sys.roleManagement')}}</div>
    <div class="content-ctrl">
      <el-button class="table-normal-btn" @click="backHandle">{{$t('common.goback')}}</el-button>
    </div>
    <div class="content-form-box">
      <div class="content-form">
        <div class="content-form-title">{{$t('common.add') + ' ' + $t('sys.role')}}</div>
        <el-form label-position="right" class="info-form-box single-form-box" label-width="130px" :model="userForm" ref="userForm">
          <el-form-item :label="$t('sys.groupName')" prop="GroupName" :rules="{required: true, message: $t('sys.groupName')+$t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model="userForm.GroupName" ></el-input>
          </el-form-item>
          <el-form-item :label="$t('car.remark')" prop="Memo" :rules="{required: true, message: $t('car.remark')+$t('common.beRequired'), trigger: 'blur'}">
            <el-input type="textarea" :rows="3" resize="none" v-model="userForm.Memo"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button :loading="isLoading" class="info-confirm-btn"  @click="confirmHandle">{{$t('common.confirm')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add-role',
  data () {
    return {
      isLoading: false,
      userForm: {
        OrgID: '',
        GroupName: '',
        Memo: ''
      }
    }
  },
  created () {
    this.queryOrganizate()
  },
  methods: {
    // 返回处理
    backHandle () {
      this.$router.back()
    },
    // 提交表单处理
    confirmHandle () {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.$post({
            url: '/usergroup',
            data: this.userForm,
            loading: true,
            success: data => {
              this.$router.push('roleManagement')
            }
          })
        }
      })
    }
  }
}
</script>

<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('sys.userManagement')}}</div>
    <div class="content-ctrl">
      <el-button class="table-normal-btn" @click="backHandle">{{$t('common.goback')}}</el-button>
    </div>
    <div class="content-form-box">
      <div class="content-form">
        <div class="content-form-title">{{$t('common.edit') + ' ' + $t('sys.user')}}</div>
        <el-form :inline="true" label-position="right" class="info-form-box" label-width="130px" :model="userForm" ref="userForm">
          <el-form-item :label="$t('sys.roleName')" prop="groupID" :rules="{type: 'number', required: true, message: $t('sys.role') + $t('common.beRequired'), trigger: 'blur'}">
            <el-select v-model.number="userForm.groupID" placeholder="">
              <el-option v-for="item,index in roles" :label="item.GroupName" :value="Number(item.GroupID)" :key="index"></el-option>
            </el-select>
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
  name: 'set-role',
  data () {
    let userID = this.$localStorage('setRole') || ''
    return {
      isLoading: false,
      roles: [],
      userForm: {
        userID: userID,
        groupID: ''
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取角色信息列表
    getRoleList () {
      this.$get({
        url: '/userusergroup/set',
        data: {
          userID: this.userForm.userID
        },
        success: data => {
          this.roles = data.arrAdminGroup || []
          this.userForm.groupID = data.currGroupID || 0
        }
      })
    },
    // 返回处理
    backHandle () {
      this.$router.back()
    },
    // 提交表单处理
    confirmHandle () {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.$post({
            url: '/userusergroup/set',
            data: this.userForm,
            success: data => {
              this.$router.push('userManagement')
            }
          })
        }
      })
    }
  }
}
</script>

<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('sys.userManagement')}}</div>
    <div class="content-ctrl">
      <el-button class="table-normal-btn" @click="backHandle">{{$t('common.goback')}}</el-button>
    </div>
    <div class="content-form-box">
      <div class="content-form">
        <div class="content-form-title">{{$t('common.edit') + ' ' + $t('sys.user')}}</div>
        <el-form :inline="true" label-position="right" class="info-form-box" label-width="160px" :model="userForm" ref="userForm">
          <el-form-item :label="$t('sys.orgName')" prop="orgID" :rules="{type: 'number', required: true, message: $t('sys.orgName') + $t('common.beRequired'), trigger: 'blur'}">
            <el-select v-model.number="userForm.orgID">
              <el-option v-for="item,index in zNodes" :label="item.name" :value="Number(item.id)" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('sys.userName')" prop="userName" :rules="{required: true, message: $t('sys.userName') + $t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model="userForm.userName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('sys.name')" prop="name" :rules="{required: true, message: $t('sys.name') + $t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model="userForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('sys.postion')" prop="post" :rules="{required: true, message: $t('sys.postion') + $t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model="userForm.post"></el-input>
          </el-form-item>
          <el-form-item :label="$t('sys.roleName')" prop="groupID" :rules="{type: 'number', required: true, message: $t('sys.role') + $t('common.beRequired'), trigger: 'blur'}">
            <el-select v-model.number="userForm.groupID" placeholder="">
              <el-option v-for="item,index in roles" :label="item.GroupName" :value="Number(item.GroupID)" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('sys.phone')" prop="phone" :rules="{required: true, message: $t('sys.phone') + $t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model="userForm.phone"></el-input>
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
  name: 'edit-user',
  data () {
    let userID = this.$localStorage('editUser') || ''
    return {
      userID: userID,
      isLoading: false,
      zNodes: [],
      roles: [],
      userForm: {
        userID: '',
        orgID: '',
        userName: '',
        name: '',
        post: '',
        roleName: '',
        groupID: '',
        password: '123456',
        phone: ''
      }
    }
  },
  created () {
    this.queryOrganizate()
    this.getUserInfo()
    this.getRoleList()
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
    // 获取角色信息列表
    getRoleList () {
      this.$get({
        url: '/userusergroup/set',
        data: {
          userID: this.userID
        },
        success: data => {
          this.roles = data.arrAdminGroup || []
          this.userForm.groupID = data.currGroupID || 0
        }
      })
    },
    // 获取编辑的用户信息
    getUserInfo () {
      this.$get({
        url: '/user/singleUser',
        data: {
          userID: this.userID
        },
        success: data => {
          let info = data.info || {}
          let user = info['user'] || {}
          // this.userForm = info['user'] || {}
          this.userForm['orgID'] = user['orgID'] || ''
          this.userForm['userName'] = user['userName'] || ''
          this.userForm['name'] = user['name'] || ''
          this.userForm['post'] = user['post'] || ''
          this.userForm['roleName'] = user['roleName'] || ''
          this.userForm['password'] = user['password'] || '123456'
          this.userForm['phone'] = user['phone'] || ''
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
          this.userForm['userID'] = this.userID
          this.$put({
            url: '/user/edit',
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

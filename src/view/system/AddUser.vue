<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('sys.userManagement')}}</div>
    <div class="content-ctrl">
      <el-button class="table-normal-btn" @click="backHandle">{{$t('common.goback')}}</el-button>
    </div>
    <div class="content-form-box">
      <div class="content-form">
        <div class="content-form-title">{{$t('common.add') + ' ' + $t('sys.user')}}</div>
        <el-form :inline="true" label-position="right" class="info-form-box" label-width="160px" :model="userForm" ref="userForm">
          <el-form-item :label="$t('sys.orgName')" prop="OrgID" :rules="{required: true, message: $t('sys.orgName') + $t('common.beRequired'), trigger: 'blur'}">
            <el-select v-model="userForm.OrgID" placeholder="">
              <el-option v-for="item,index in zNodes" :label="item.name" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('sys.userName')" prop="UserName" :rules="{required: true, message: $t('sys.userName') + $t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model="userForm.UserName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('sys.name')" prop="Name" :rules="{required: true, message: $t('sys.name') + $t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model="userForm.Name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('sys.postion')" prop="Post" :rules="{required: true, message: $t('sys.postion') + $t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model="userForm.Post"></el-input>
          </el-form-item>
          <el-form-item :label="$t('sys.roleName')" prop="groupID" :rules="{type: 'number', required: true, message: $t('sys.role') + $t('common.beRequired'), trigger: 'blur'}">
            <el-select v-model.number="userForm.groupID" placeholder="">
              <el-option v-for="item,index in roles" :label="item.GroupName" :value="Number(item.GroupID)" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('login.password')" prop="Password" :rules="{required: true, message: $t('login.password') + $t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model="userForm.Password"></el-input>
          </el-form-item>
          <el-form-item :label="$t('sys.phone')" prop="Phone" :rules="{required: true, message: $t('sys.phone') + $t('common.beRequired'), trigger: 'blur'}">
            <el-input v-model="userForm.Phone"></el-input>
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
  name: 'add-user',
  data () {
    return {
      isLoading: false,
      zNodes: [],
      roles: [],
      userForm: {
        OrgID: '',
        UserName: '',
        Name: '',
        Post: '',
        RoleName: '',
        groupID: '',
        Password: '123456',
        Phone: ''
      }
    }
  },
  created () {
    this.queryOrganizate()
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
        url: '/usergroup',
        success: data => {
          this.roles = data.Rows || []
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
            url: '/user',
            data: this.userForm,
            success: data => {
              this.$router.push('UserManagement')
            }
          })
        }
      })
    }
  }
}
</script>

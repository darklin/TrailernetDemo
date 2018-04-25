<template>
  <el-dialog title="添加用户" class="dialog-black-box" :visible.sync="dialogVisible">
    <el-form label-position="right" label-width="100px" :model="userForm" ref="userForm">
      <el-form-item label="机构名称" prop="OrgID" :rules="[{required: true, message: '机构名称不能为空'}]">
        <el-select v-model="userForm.OrgID" clearable placeholder="请选择机构名称">
          <el-option v-for="item,index in zNodes" :label="item.name" :value="item.id" :key="index" :checked="item.checked"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="UserName" :rules="[{required: true, message: '用户名不能为空'}]">
        <el-input v-model="userForm.UserName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="Name" :rules="[{required: true, message: '姓名不能为空'}]">
        <el-input v-model="userForm.Name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="职务" prop="Post" :rules="[{required: true, message: '职务不能为空'}]">
        <el-input v-model="userForm.Post" placeholder="请输入职务"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="RoleName" :rules="[{required: true, message: '角色不能为空'}]">
        <el-input v-model="userForm.RoleName" placeholder="请输入角色"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="Password" :rules="[{required: true, message: '密码不能为空'}]">
        <el-input v-model="userForm.Password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="Phone" :rules="[{required: true, message: '联系电话不能为空'}]">
        <el-input v-model="userForm.Phone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="cancelHandle">取 消</el-button>
      <el-button class="comfirm-btn" @click="comfirmHandle">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'add-user',
  props: {
    show: Boolean,
    userId: [Number, String]
  },
  data () {
    return {
      dialogVisible: false,
      zNodes: [],
      userForm: {
        OrgID: '',
        UserName: '',
        Name: '',
        Post: '',
        RoleName: '',
        groupID: '1',
        Password: '123456',
        Phone: ''
      }
    }
  },
  created () {
    this.queryOrganizate()
  },
  watch: {
    show (val) {
      this.dialogVisible = true
    },
    dialogVisible (val) {
      this.$emit('visibleChange', false)
    }
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
    // 取消操作
    cancelHandle () {
      this.dialogVisible = false
    },
    // 确定操作
    comfirmHandle () {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.$ajax({
            url: '/user/add',
            data: this.userForm,
            success: data => {
              console.log(data)
              this.$emit('successHandle', true)
              this.cancelHandle()
            }
          })
        }
      })
    }
  }
}
</script>

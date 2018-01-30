<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('sys.userManagement')}}</div>
    <div class="search-box clearfix">
      <el-form :model="searchForm" class="search-form fl">
        <el-form-item :label="$t('sys.userName')">
          <el-input v-model="searchForm.userName" clearable></el-input>
        </el-form-item>
      </el-form>
      <el-button :loading="isLoading" class="search-btn fl" icon="search" @click="searchHandle">{{$t('common.search')}}</el-button>
    </div>
    <div class="table-box">
      <el-button class="table-add-btn" @click="addHandle">{{$t('common.add')}}</el-button>
      <el-button class="table-import-btn" @click="importHandle">{{$t('excel.import')}}</el-button>
      <el-button class="table-export-btn" @click="exportHandle">{{$t('car.export')}}</el-button>
      <el-table
        :data="countData"
        style="width: 100%">
        <el-table-column
          type="index"
          align="center"
          :label="$t('index.indexField')"
          width="80">
        </el-table-column>
        <el-table-column
          prop="UserName"
          align="center"
          :label="$t('sys.userName')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="OrgName"
          align="center"
          :label="$t('common.organization')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="Name"
          align="center"
          :label="$t('sys.name')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="Post"
          align="center"
          :label="$t('sys.postion')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="RoleName"
          align="center"
          :label="$t('sys.roleName')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="Email"
          align="center"
          :label="$t('user.email')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="Phone"
          align="center"
          :label="$t('sys.phone')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="CreateTime"
          align="center"
          :label="$t('golbal.createTime')"
          min-width="180">
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('common.operate')"
          width="270">
          <template scope="scope">
            <el-button icon="edit" size="small" type="text" @click="editHandle(scope.row.UserID)">{{$t('common.edit')}}</el-button>
            <!--<el-button size="small" type="text" @click="roleHandle(scope.row.UserID)">{{$t('sys.role')}}</el-button>-->
            <el-button icon="setting" size="small" type="text" @click="resetHandle(scope.row.UserID)">{{$t('sys.resetPassword')}}</el-button>
            <el-button icon="delete" size="small" type="text" class="table-delete-btn" @click="deleteHandle(scope.row.UserID)">{{$t('common.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box text-fr">
        <el-pagination
          @current-change="pageHandle"
          :current-page="searchForm.page"
          :page-size="searchForm.pagesize"
          layout="total, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'remind-detail',
  data () {
    return {
      searchForm: {
        userName: '',
        page: 1,
        pagesize: 10
      },
      isLoading: false,
      currentPage: 1,
      totalRecord: 1,
      countData: []
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 查询用户数据
    searchHandle () {
      this.$get({
        url: '/user',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.countData = data.Rows || []
          this.totalRecord = data.Total || 0
        }
      })
    },
    pageHandle (page) {
      this.searchForm.page = page
      this.searchHandle()
    },
    // 添加用户
    addHandle () {
      this.$router.push('addUser')
    },
    editHandle (userID) {
      this.$localStorage('editUser', userID)
      this.$router.push('editUser')
    },
    roleHandle (userID) {
      this.$localStorage('setRole', userID)
      this.$router.push('setRole')
    },
    // 重置密码处理
    resetHandle (UserID) {
      this.$alert(this.$t('sys.isResetPassword') + '?', this.$t('common.gentlehint'), {
        showCancelButton: true,
        customClass: 'delete-warn-box',
        callback: action => {
          if (action === 'confirm') {
            this.$post({
              url: '/user/resetPassword',
              data: {userID: UserID},
              success: data => {
                this.searchHandle()
                this.$message(this.$t('user.resetPasswordSuccess') + '!')
              }
            })
          }
        }
      })
    },
    // 删除处理
    deleteHandle (UserID) {
      this.$alert(this.$t('common.sureDelete') + '?', this.$t('common.gentlehint'), {
        showCancelButton: true,
        customClass: 'delete-warn-box',
        callback: action => {
          if (action === 'confirm') {
            this.$delete({
              url: '/user',
              data: {
                userID: UserID
              },
              success: data => {
                this.searchHandle()
              }
            })
          }
        }
      })
    },
    // 批量导入用户
    importHandle () {
      this.$router.push('importUser')
    },
    // 批量导出用户
    exportHandle () {
      window.location.href = `${this.$baseURL}user/excel?${this.$serialize(this.searchForm)}`
    }
  }
}
</script>

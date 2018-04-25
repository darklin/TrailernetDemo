<template>
  <div class="content-box">
    <el-breadcrumb separator="/" class="v-bread-crumb">
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content-subtitle">用户管理</div>
    <div class="index-query-box clearfix">
      <el-form :inline="true" :model="searchForm" class="search-form fl">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.keywords" clearable placeholder="请输入用户名"></el-input>
        </el-form-item>
      </el-form>
      <el-button :loading="isLoading" class="search-btn fl"  @click="searchHandle">查询</el-button>
    </div>
    <div class="table-box">
      <el-button class="table-ctrl-btn" @click="addHandle">添加</el-button>
      <el-table
        :data="countData"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="UserName"
          label="用户名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="OrgName"
          label="机构名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="Name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="Post"
          label="职务">
        </el-table-column>
        <el-table-column
          prop="RoleName"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="Phone"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="CreateTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="180">
          <template scope="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.row.UserID)">编辑</el-button>
            <el-button size="small" type="text" @click="handleRest(scope.row.UserID)">重置密码</el-button>
            <el-button size="small" type="text" @click="handleDelete(scope.row.UserID)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box text-fr">
        <el-pagination
          @current-change="pageHandle"
          :current-page="currentPage"
          layout="total, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <add-user :show="isAddShow" :userId="userId" @visibleChange="addVisibleChange" @successHandle="addSuccessHandle"></add-user>
  </div>
</template>

<script>
import AddUser from '@/components/AddUser'
export default {
  name: 'remind-detail',
  data () {
    return {
      searchForm: {
        keywords: '',
        page: 1,
        pagesize: 20
      },
      isLoading: false,
      currentPage: 1,
      totalRecord: 1,
      countData: [],
      userId: '',
      isAddShow: false
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    searchHandle () {
      this.$ajax({
        url: '/user/listData',
        data: this.searchForm,
        loading: true,
        success: data => {
          console.log(data)
          this.countData = data.Rows || []
        }
      })
    },
    // 打开添加操作弹窗
    addHandle () {
      this.isAddShow = true
    },
    // 添加弹窗组件关闭监听
    addVisibleChange (val) {
      this.isAddShow = val
    },
    // 添加用户成功处理
    addSuccessHandle (val) {
      this.searchHandle()
    },
    handleEdit () {
      this.$ajax({
        url: '/user/edit',
        success: data => {
          console.log(data)
          // 显示表格进行修改
        }
      })
    },
    handleRest () {
      this.$ajax({
        url: '/user/resetPassword',
        success: data => {
          console.log(data)
          // 显示重置是否成功信息
        }
      })
    },
    handleDelete () {
      this.$ajax({
        url: '/user/delete',
        success: data => {
          console.log(data)
          // 显示是否删除成功信息
        }
      })
    },
    pageHandle () {}
  },
  components: {
    'add-user': AddUser
  }
}
</script>

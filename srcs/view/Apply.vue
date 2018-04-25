<template>
  <div class="main-box">
    <div class="content-box">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>申请客户</el-breadcrumb-item>
      </el-breadcrumb>
      <el-form :inline="true" :model="searchForm" class="search-form-box">
        <div @keyup.enter="searchHandle(1)">
          <el-form-item label="客户姓名">
            <el-input v-model="searchForm.realName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="searchForm.idCard" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="searchForm.telephone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="isLoading" @click="searchHandle(1)">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-table
        :data="tableData">
        <el-table-column
          min-width="150"
          prop="applicationId"
          label="申请id">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="customerId"
          label="用户编号">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="recodeTime"
          label="录入时间">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="realName"
          label="姓名">
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="idCard"
          label="身份证">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="cityName"
          label="城市">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="applyAmount"
          label="申请金额">
        </el-table-column>
      </el-table>
      <!-- <div class="clearfix">
        <el-pagination
          class="fr"
          @current-change="pageHandle"
          :current-page="currentPage"
          layout="total, prev, pager, next"
          :total="totalRecord">
        </el-pagination>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'apply',
  data () {
    let form = this.$formStore('apply')
    return {
      searchForm: {
        realName: form['realName'] || '',
        idCard: form['idCard'] || '',
        telephone: form['telephone'] || '',
        status: 0
      },
      isLoading: false,
      tableData: [],
      currentPage: 1,
      totalRecord: 1
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    searchHandle (type) {
      var loading = type === 1
      this.searchForm['currentPage'] = this.currentPage
      this.$ajax({
        url: '/account/apply/getApplyList',
        data: this.searchForm,
        loading: loading,
        success: data => {
          this.$formStore('apply', this.searchForm)
          this.totalRecord = data.page.totalRecords
          this.tableData = data.rows
        }
      })
    },
    pageHandle (page) {
      // 分页处理
      this.currentPage = page
      this.searchHandle()
    }
  }
}
</script>

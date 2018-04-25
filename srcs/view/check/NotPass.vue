<template>
  <div class="content-box">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>复核处理</el-breadcrumb-item>
      <el-breadcrumb-item>复核不通过</el-breadcrumb-item>
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
        prop="recodeTime"
        label="录入时间">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="orgCode"
        label="代号">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="realName"
        label="客户姓名">
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="telephone"
        label="手机号">
      </el-table-column>
      <el-table-column
        min-width="180"
        prop="idCard"
        label="身份证">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="education"
        label="学历">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="cityName"
        label="城市">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="income"
        label="月收入(元)">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="organization"
        label="申请机构">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="havSocial"
        label="社保">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="havHouse"
        label="房产">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="havCar"
        label="车产">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="fileCount"
        label="上传材料">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="loanAmount"
        label="放款(元)">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="loanDeadline"
        label="放款期限">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template scope="scope">
          <el-button @click="checkHandle(scope.row.customerId)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="clearfix">
      <el-pagination
        class="fr"
        @current-change="pageHandle"
        :current-page="currentPage"
        layout="total, prev, pager, next"
        :total="totalRecord">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'not-pass',
  data () {
    let form = this.$formStore('notPass')
    return {
      searchForm: {
        realName: form['realName'] || '',
        idCard: form['idCard'] || '',
        telephone: form['telephone'] || '',
        status: 3
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
        url: '/account/check/reviewhandle/query',
        data: this.searchForm,
        loading: loading,
        success: data => {
          this.$formStore('notPass', this.searchForm)
          this.totalRecord = data.page.totalRecords
          this.tableData = data.rows
        }
      })
    },
    pageHandle (page) {
      // 分页处理
      this.currentPage = page
      this.searchHandle()
    },
    checkHandle (id) {
      this.$router.push('notPassDesc' + id)
    }
  }
}
</script>

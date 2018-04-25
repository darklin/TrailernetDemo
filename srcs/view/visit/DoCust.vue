<template>
  <div class="content-box">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>上门客户</el-breadcrumb-item>
      <el-breadcrumb-item>采集中</el-breadcrumb-item>
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
        min-width="180"
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
      <el-table-column
        min-width="120"
        prop="loanUse"
        label="贷款用途">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="cityName"
        label="城市">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="income"
        label="月收入">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="education"
        label="学历">
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="graSchool"
        label="毕业学校">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="140">
        <template scope="scope">
          <el-button @click="editHandle(scope.row.customerId)" type="text" size="small">编辑</el-button>
          <el-button @click="addHandle(scope.row.customerId)" type="text" size="small" v-if="scope.row.havCard === 0">添加银行卡</el-button>
          <el-button @click="checkHandle(scope.row.customerId,scope.row.applicationId)" type="text" size="small" v-else>审核</el-button>
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
    <el-dialog class="v-dialog-small" title="添加银行卡" @close="closeDialog" v-model="cardModal">
      <el-form :inline="true" :model="cardForm" label-width="150px">
        <div @keyup.enter="confirmDialog" required>
          <el-form-item label="银行号">
            <el-input v-model="cardForm.bankCode" placeholder="请输入银行号"></el-input>
          </el-form-item>
          <el-form-item label="银行卡省份" required>
            <el-input v-model="cardForm.province" placeholder="请输入银行卡省份"></el-input>
          </el-form-item>
          <el-form-item label="所属城市" required>
            <el-input v-model="cardForm.cityName" placeholder="请输入所属城市"></el-input>
          </el-form-item>
          <el-form-item label="所属分行" required>
            <el-input v-model="cardForm.branchName" placeholder="请输入所属分行"></el-input>
          </el-form-item>
          <el-form-item class="v-dialog-btn">
            <el-button @click="confirmDialog">确定</el-button>
            <el-button @click="cancelDialog">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'do-cust',
  data () {
    let form = this.$formStore('doCust')
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
      totalRecord: 1,
      cardForm: {
        customerId: '',
        bankCode: '',
        province: '',
        cityName: '',
        branchName: ''
      },
      cardModal: false
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
        url: '/account/visit/application/queryApplicationList',
        data: this.searchForm,
        loading: loading,
        success: data => {
          this.$formStore('doCust', this.searchForm)
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
    addHandle (id) {
      this.cardForm.customerId = id
      this.cardModal = true
    },
    editHandle (customerId) {
      this.$router.push('backEdit' + customerId)
    },
    // 提交审核
    checkHandle (id, applicationId) {
      this.$alert('通过审核', '审核', {
        confirmButtonText: '确定',
        callback: action => {
          if (action === 'confirm') {
            this.$ajax({
              url: '/account/visit/application/sysReview',
              data: {
                customerId: id,
                applicationId: applicationId
              },
              success: data => {
                this.searchHandle()
              }
            })
          }
        }
      })
    },
    closeDialog () {
      this.cardModal = false
    },
    confirmDialog () {
      this.$ajax({
        url: '/account/visit/application/saveBankCard',
        data: this.cardForm,
        success: data => {
          this.closeDialog()
          this.searchHandle()
        }
      })
    },
    cancelDialog () {
      this.closeDialog()
    }
  }
}
</script>

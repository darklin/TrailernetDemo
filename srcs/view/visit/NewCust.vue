<template>
  <div class="content-box">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>上门客户</el-breadcrumb-item>
      <el-breadcrumb-item>新客户</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="query-box">
      <el-form ref="queryForm" :model="queryForm" label-width="100px" class="query-form-box">
        <el-form-item label="姓名">
          <el-input v-model="queryForm.name" placeholder="请输入您的姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="cardNo" :rules="{required: true, message: '身份证号码不能为空', trigger: 'blur'}">
          <el-input v-model="queryForm.cardNo" placeholder="请输入您的身份证号码（必填）"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="queryForm.mobile" placeholder="请输入您的手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="isLoading" class="query-btn" @click="queryHandle">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="query-result-box" v-if="isShow">
        <div class="query-result-table" v-if="tableData.length > 0">
          <el-table
            :data="tableData">
            <el-table-column
              min-width="120"
              prop="name"
              label="名字">
            </el-table-column>
            <el-table-column
              min-width="120"
              prop="cardNo"
              label="身份证号">
            </el-table-column>
            <el-table-column
              min-width="120"
              prop="mobile"
              label="电话">
            </el-table-column>
            <el-table-column
              min-width="120"
              prop="applicatSum"
              label="申请金额">
            </el-table-column>
            <el-table-column
              min-width="120"
              prop="loanUse"
              label="贷款用途">
            </el-table-column>
            <el-table-column
              min-width="120"
              prop="applicantCity"
              label="申请人城市">
            </el-table-column>
            <el-table-column
              min-width="120"
              prop="income"
              label="收入">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template scope="scope">
                <el-button @click="showHandle(scope.row.customerId)" type="text" size="small">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="query-result-null" v-else>
          <div class="result-null">
            <div class="result-null-text">无此人信息！</div>
            <div class="result-null-desc">您可以添加信息以便查询</div>
          </div>
          <el-button class="add-btn" @click="addHandle">添加</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'new-cust',
  data () {
    return {
      queryForm: {
        name: '',
        cardNo: '',
        mobile: ''
      },
      isLoading: false,
      isShow: false,
      tableData: []
    }
  },
  methods: {
    queryHandle () {
      this.$refs['queryForm'].validate((valid) => {
        if (valid) {
          this.$ajax({
            url: '/account/visit/application/queryCustInfo',
            data: this.queryForm,
            loading: true,
            success: data => {
              this.isShow = true
              this.totalRecord = data.page.totalRecords
              this.tableData = data.rows
            }
          })
        }
      })
    },
    showHandle (customerId) {
      this.$router.push('editData' + customerId)
    },
    addHandle () {
      this.$router.push('writeData')
    }
  }
}
</script>

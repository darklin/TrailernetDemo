<template>
  <div class="conf-content-box">
    <div class="content-box">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>系统配置</el-breadcrumb-item>
        <el-breadcrumb-item>贷款产品配置</el-breadcrumb-item>
        <el-breadcrumb-item>基本配置</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table
        :data="tableData">
        <el-table-column
          min-width="120"
          prop="institutionId"
          label="机构id">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="productName"
          label="产品名称">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="lendInstitution"
          label="放款机构">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="maxLoanAmount"
          label="最大贷款金额">
        </el-table-column>
        <el-table-column
          min-width="180"
          prop="startDate"
          label="有效日期起">
        </el-table-column>
        <el-table-column
          min-width="180"
          prop="endDate"
          label="有效日期止">
        </el-table-column>
        <el-table-column
          min-width="120"
          label="当前状态">
          <template scope="scope">{{status[scope.row.status]}}</template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="maxRate"
          label="最大贷款利率">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="minRate"
          label="最小贷款利率">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="loanCity"
          label="可贷款城市">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="loanTerm"
          label="可贷款期限">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template scope="scope">
            <el-button @click="editHandle(scope.row.applyId)" type="text" size="small">编辑</el-button>
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
  </div>
</template>

<script>
export default {
  name: 'base-conf',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      status: {
        1: '失效',
        2: '生效'
      }
    }
  },
  created () {
    this.initTable()
  },
  methods: {
    initTable () {
      this.$ajax({
        url: '/account/conf/product/getProductByPage',
        data: {
          currentPage: this.currentPage
        },
        success: data => {
          this.totalRecord = data.page.totalRecords
          this.tableData = data.rows
        }
      })
    },
    pageHandle (page) {
      this.currentPage = page
      this.initTable()
    }
  }
}
</script>


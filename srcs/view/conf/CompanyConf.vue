<template>
  <div class="conf-content-box">
    <div class="content-box">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>系统配置</el-breadcrumb-item>
        <el-breadcrumb-item>基础资料</el-breadcrumb-item>
        <el-breadcrumb-item>特殊企业配置</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table
        :data="tableData">
        <el-table-column
          min-width="120"
          prop="compName"
          label="企业名称">
        </el-table-column>
        <el-table-column
          min-width="120"
          label="企业类型">
          <template scope="scope">{{types[scope.row.compType]}}</template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="createDate"
          label="成立年月">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="annualSales"
          label="年销售额">
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
  name: 'company-conf',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      types: {
        0: '独资',
        1: '合资'
      }
    }
  },
  created () {
    this.initTable()
  },
  methods: {
    initTable () {
      this.$ajax({
        url: '/account/conf/company/getCompanyByPage',
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

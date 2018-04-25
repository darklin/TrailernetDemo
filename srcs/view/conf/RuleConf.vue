<template>
  <div class="conf-content-box">
    <div class="content-box">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>系统配置</el-breadcrumb-item>
        <el-breadcrumb-item>基础资料</el-breadcrumb-item>
        <el-breadcrumb-item>规则配置</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table
        :data="tableData">
        <el-table-column
          min-width="120"
          prop="ruleId"
          label="规则ID">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="productId"
          label="产品ID">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="ruleType"
          label="规则类型">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="ruleIndex"
          label="规则顺序">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="ruleDesc"
          label="规则描述">
        </el-table-column>
        <el-table-column
          min-width="120"
          label="状态">
          <template scope="scope">{{status[scope.row.status]}}</template>
        </el-table-column>
        <el-table-column
          min-width="200"
          prop="calKey"
          label="计算贷款金额key">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="calMultiple"
          label="计算倍数">
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
  name: 'rule-conf',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      status: {
        0: '失效',
        1: '生效'
      }
    }
  },
  created () {
    this.initTable()
  },
  methods: {
    initTable () {
      this.$ajax({
        url: '/account/conf/rule/getRuleByPage',
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

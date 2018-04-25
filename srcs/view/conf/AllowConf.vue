<template>
  <div class="conf-content-box">
    <div class="content-box">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>系统配置</el-breadcrumb-item>
        <el-breadcrumb-item>贷款产品配置</el-breadcrumb-item>
        <el-breadcrumb-item>准贷条件</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table
        :data="tableData">
        <el-table-column
          min-width="120"
          prop="conditionId"
          label="编号">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="productId"
          label="产品ID">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="conditionIndex"
          label="条件序列">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="paramKey"
          label="参数key">
        </el-table-column>
        <el-table-column
          min-width="200"
          label="判断方式">
          <template scope="scope">{{paramJudys[scope.row.paramJudy]}}</template>
        </el-table-column>
        <el-table-column
          min-width="180"
          prop="paramValue"
          label="参数值">
        </el-table-column>
        <el-table-column
          min-width="120"
          label="与后续条件">
          <template scope="scope">{{paramAppends[scope.row.paramAppend]}}</template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="conditionDesc"
          label="描述">
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
  name: 'allow-conf',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      paramJudys: {
        1: '等于',
        2: '大于',
        3: '大于等于',
        4: '小于',
        5: '小于等于',
        6: '包含',
        7: '不包含'
      },
      paramAppends: {
        0: '无后续操作',
        1: 'and与操作',
        2: 'or或操作'
      }
    }
  },
  created () {
    this.initTable()
  },
  methods: {
    initTable () {
      this.$ajax({
        url: '/account/conf/loanCondition/getLoanConditionByPage',
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


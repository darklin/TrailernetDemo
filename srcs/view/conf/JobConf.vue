<template>
  <div class="conf-content-box">
    <div class="content-box">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>系统配置</el-breadcrumb-item>
        <el-breadcrumb-item>基础资料</el-breadcrumb-item>
        <el-breadcrumb-item>职业配置</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table
        :data="tableData">
        <el-table-column
          min-width="120"
          prop="occupationId"
          label="编号">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="occupationCode"
          label="职业代号">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="occupationDescribe"
          label="职业描述">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="occupationName"
          label="职业名称">
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
  name: 'job-conf',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1
    }
  },
  created () {
    this.initTable()
  },
  methods: {
    initTable () {
      this.$ajax({
        url: '/account/conf/occupation/getOccupationByPage',
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

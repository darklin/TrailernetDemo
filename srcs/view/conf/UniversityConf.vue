<template>
  <div class="conf-content-box">
    <div class="content-box">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>系统配置</el-breadcrumb-item>
        <el-breadcrumb-item>基础资料</el-breadcrumb-item>
        <el-breadcrumb-item>重点大学配置</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table
        :data="tableData">
        <el-table-column
          min-width="120"
          prop="universityId"
          label="编号">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="name"
          label="大学名称">
        </el-table-column>
        <el-table-column
          min-width="120"
          label="985大学">
          <template scope="scope">{{types[scope.row.is985]}}</template>
        </el-table-column>
        <el-table-column
          min-width="120"
          label="211大学">
          <template scope="scope">{{types[scope.row.is211]}}</template>
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
  name: 'university-conf',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      types: {
        0: '不是',
        1: '是'
      }
    }
  },
  created () {
    this.initTable()
  },
  methods: {
    initTable () {
      this.$ajax({
        url: '/account/conf/university/getUniversityByPage',
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

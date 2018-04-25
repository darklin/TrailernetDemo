<template>
  <div class="conf-content-box">
    <div class="content-box">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>系统配置</el-breadcrumb-item>
        <el-breadcrumb-item>基础资料</el-breadcrumb-item>
        <el-breadcrumb-item>金融机构配置</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table
        :data="tableData">
        <el-table-column
          min-width="120"
          prop="code"
          label="机构代号">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="name"
          label="机构名称">
        </el-table-column>
        <el-table-column
          min-width="120"
          label="机构类型">
          <template scope="scope">{{types[scope.row.type]}}</template>
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="contact"
          label="机构联系人">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="address"
          label="联系地址">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="telephone"
          label="联系电话">
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
  name: 'financial-conf',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalRecord: 1,
      types: {
        1: '银行',
        2: 'P2P',
        3: '小贷公司'
      }
    }
  },
  created () {
    this.initTable()
  },
  methods: {
    initTable () {
      this.$ajax({
        url: '/account/conf/institution/getInstitutionByPage',
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

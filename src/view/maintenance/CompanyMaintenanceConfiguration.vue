<template>
  <div class="content-box">
    <div class="content-subtitle">公司保养方案配置</div>
    <div class="search-box clearfix">
      <el-form :model="searchForm" class="search-form">
        <el-form-item label="报警开始时间" class="fl">
          <el-date-picker
            v-model="searchForm.time"
            type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报警结束时间" class="fl">
          <el-date-picker
            v-model="searchForm.time"
            type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属机构" class="fl">
          <el-select v-model="searchForm.org" clearable placeholder="">
            <el-option label="星火总部 深圳南山分公司" value="xinghuo"></el-option>
            <el-option label="星火分部 深圳南山分公司" value="fenbu"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报警类型" class="fl">
          <el-select v-model="searchForm.org" clearable placeholder="">
            <el-option label="星火总部 深圳南山分公司" value="xinghuo"></el-option>
            <el-option label="星火分部 深圳南山分公司" value="fenbu"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" class="fl">
          <el-select v-model="searchForm.org" clearable placeholder="">
            <el-option label="星火总部 深圳南山分公司" value="xinghuo"></el-option>
            <el-option label="星火分部 深圳南山分公司" value="fenbu"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否处理" class="fl">
          <el-select v-model="searchForm.org" clearable placeholder="">
            <el-option label="星火总部 深圳南山分公司" value="xinghuo"></el-option>
            <el-option label="星火分部 深圳南山分公司" value="fenbu"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button :loading="isLoading" class="search-btn fl" icon="search"  @click="searchHandle">查询</el-button>
    </div>
    <div class="table-box">
      <el-button class="table-normal-btn">已读</el-button>
      <el-table
        :data="countData"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          prop="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
      <div class="page-box text-fr">
        <el-pagination
          @current-change="pageHandle"
          :current-page="currentPage"
          layout="total, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'remind-detail',
  data () {
    return {
      searchForm: {
        time: '',
        org: ''
      },
      isLoading: false,
      currentPage: 1,
      totalRecord: 1,
      multipleSelection: [],
      countData: []
    }
  },
  methods: {
    searchHandle () {
      this.$post({
        url: '/cust/login',
        data: this.searchForm,
        loading: true,
        success: data => {
          console.log(data)
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    pageHandle () {}
  }
}
</script>

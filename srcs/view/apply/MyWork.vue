<template>
  <div class="content-box">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>申请客户</el-breadcrumb-item>
      <el-breadcrumb-item>我的工作台</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" :model="searchForm" class="search-form-box">
      <div @keyup.enter="searchHandle()">
        <el-form-item>
          <el-date-picker
            class="search-date"
            v-model="startTime"
            type="date"
            :editable="true"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.cityName" filterable clearable placeholder="请选择门店">
            <el-option v-for="(city,index) in citys" :label="city" :value="city" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.applyType" clearable placeholder="请选择客服">
            <el-option label="优质单" value="1"></el-option>
            <el-option label="普通单" value="2"></el-option>
            <el-option label="垃圾单" value="3"></el-option>
            <el-option label="不押车贷" value="4"></el-option>
            <el-option label="微店单" value="5"></el-option>
            <el-option label="准优质单" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.applyName" placeholder="输入贷款人姓名或手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="searchLoading" @click="searchHandle()">查询</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      @selection-change="handleSelectionChange"
      :data="tableData">
      <el-table-column
        fixed="left"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        min-width="80"
        prop="applyId"
        label="申请ID">
      </el-table-column>
      <el-table-column
        min-width="100"
        label="门店状态">
        <template scope="scope">
          <el-tag :type="scope.row.storeStatus === '未跟进' ? 'primary' : 'gray'">{{scope.row.storeStatus}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="assetInfo"
        label="资产描述"
        :show-overflow-tooltip="true">
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
</template>

<script>
export default {
  name: 'my-work',
  data () {
    return {
      searchForm: {},
      startTime: '',
      citys: [],
      searchLoading: false,
      tableData: [],
      currentPage: 1,
      totalRecord: 1
    }
  },
  methods: {
    searchHandle () {
      this.searchLoading = true
      console.log(11)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    pageHandle () {}
  }
}
</script>

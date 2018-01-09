<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('contentSubtitle.history.loadMonitor')}}</div>
    <div class="search-box clearfix">
      <el-form :model="searchForm" class="search-form">
        <el-form-item :label="$t('common.organization')" class="fl">
            <el-select v-model="searchForm.orgIDs" clearable placeholder="">
              <el-option v-for="item,index in zNodes" :label="item.name" :value="item.id" :key="index" :checked="item.checked"></el-option>
            </el-select>
          </el-form-item>
        <el-form-item :label="$t('boxUp.licensePlate')" class="fl">
          <el-input v-model="searchForm.licensePlate" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.state')" class="fl">
          <el-select v-model="searchForm.loadState" clearable placeholder="">
            <el-option :label="$t('load.normal')" value="1"></el-option>
            <el-option :label="$t('carAlarm.overload')" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button :loading="isLoading" class="search-btn fl" icon="search"  @click="queryHandle">{{$t('common.search')}}</el-button>
    </div>
    <div class="table-box">
      <el-table
        :data="countData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
         <el-table-column
          type="index"
          align="center"
          :label="$t('index.indexField')"
          width="80">
        </el-table-column>
        <el-table-column
          prop="OrgName"
          align="center"
          :label="$t('common.organization')"
          width="180">
        </el-table-column>
        <el-table-column
          prop="LicensePlate"
          align="center"
          :label="$t('boxUp.licensePlate')"
          width="180">
        </el-table-column>
        <el-table-column
          prop="RatedLoad"
          align="center"
          :label="$t('load.allowWeight')"
          width="180">
        </el-table-column>
        <el-table-column
          prop="CurrLoad"
          align="center"
          :label="$t('load.weight')">
        </el-table-column>
        <el-table-column
          prop=""
          align="center"
          :label="$t('load.overWeight')"
          :formatter="formatterLoad">
        </el-table-column>
        <el-table-column
          prop="RecordTime"
          align="center"
          :label="$t('boxUp.reportTime')"
          :formatter="formatterReportTime">
        </el-table-column>
      </el-table>
      <div class="page-box text-fr">
        <el-pagination
          @current-change="pageHandle"
          :current-page="searchForm.page"
          :page-size="searchForm.pagesize"
          layout="total, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tire-monitor',
  data () {
    return {
      zNodes: [],
      searchForm: {
        licensePlate: '',
        orgIDs: '',
        loadState: '',
        page: 1,
        pagesize: 10
      },
      isLoading: false,
      totalRecord: 1,
      multipleSelection: [],
      countData: []
    }
  },
  created () {
    this.getListData()
    this.queryOrganizate()
  },
  methods: {
    // 获取。。信息
    getListData () {
      this.$get({
        url: '/monitor/load/listData',
        data: this.searchForm,
        success: data => {
          this.countData = data.Rows || []
          this.totalRecord = data.Total || 0
        }
      })
    },
    queryHandle () {
      this.searchForm.page = 1
      this.getListData()
    },
    formatterLoad (row, column) {
      if (row.OverLoad === 1) {
        return this.$t('load.normal')
      } else if (row.OverLoad === 2) {
        return this.$t('carAlarm.overload')
      }
      return '-'
    },
    formatterReportTime (row, column) {
      if (!row.RecordTime) {
        return '-'
      } else {
        return row.RecordTime
      }
    },
    searchHandle () {
      this.getListData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    pageHandle (page) {
      this.searchForm.page = page
      this.searchHandle()
    },
    // 获取机构信息
    queryOrganizate () {
      this.$get({
        url: '/assist/queryOrganizate',
        success: data => {
          this.zNodes = data.zNodes || []
        }
      })
    }
  }
}
</script>

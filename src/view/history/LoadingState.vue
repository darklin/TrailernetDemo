<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('contentSubtitle.history.loadingState')}}</div>
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
        <el-form-item :label="$t('boxUp.boxUpState')" class="fl">
          <el-select v-model="searchForm.boxUpState" clearable placeholder="">
            <el-option value="1" :label="$t('stevedore.boxUp')"></el-option>
            <el-option value="0" :label="$t('stevedore.unBoxUp')"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button :loading="isLoading" class="search-btn fl" icon="search"  @click="queryHandle">{{$t('common.search')}}</el-button>
    </div>
    <div class="table-box">
      <el-table
        :data="countData"
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
          prop="IsBoxUp"
          align="center"
          :label="$t('boxUp.isBoxUp')"
          min-width="80">
          <template scope="scope">
            <span style="color: green" v-if="scope.row.IsBoxUp === 1">{{$t('common.yes')}}</span>
            <span style="color: red" v-else-if="scope.row.IsBoxUp === 0">{{$t('common.no')}}</span>
            <span style="color: black" v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ReportingTime"
          align="center"
          :label="$t('boxUp.reportTime')"
          :formatter="formatterReportingTime">
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
        page: 1,
        pagesize: 10,
        boxUpState: ''
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
        url: '/monitor/boxup/listData',
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
    formatterReportingTime (row, column) {
      if (!row.ReportingTime) {
        return '-'
      } else {
        return row.ReportingTime
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
    },
    formatterStatus (row, column) {
      if (row.status === 1) {
        return this.$t('golbal.park') + ' ' + this.$t('golbal.boxUpAndNotConnect')
      }
      if (row.status === 2) {
        return this.$t('golbal.park') + ' ' + this.$t('golbal.notBoxUpAndNotConnect')
      }
      if (row.status === 3) {
        return this.$t('golbal.run') + ' ' + this.$t('golbal.boxUpAndConnect')
      }
      if (row.status === 4) {
        return this.$t('golbal.run') + ' ' + this.$t('golbal.notBoxUpAndConnect')
      }
      if (row.status === 5) {
        return this.$t('golbal.stop') + ' ' + this.$t('golbal.boxUpAndConnect')
      }
      if (row.status === 6) {
        return this.$t('golbal.park') + ' ' + this.$t('golbal.notBoxUpAndConnect')
      }
      if (row.status === 7) {
        return this.$t('golbal.offline')
      }
    }
  }
}
</script>

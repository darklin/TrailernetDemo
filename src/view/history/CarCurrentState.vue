<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('contentSubtitle.history.carCurrentState')}}</div>
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
          <el-select v-model="searchForm.currStateType" clearable placeholder="">
            <el-option value="1" :label="$t('golbal.park') +' ' + $t('golbal.boxUpAndNotConnect')"></el-option>
            <el-option value="2" :label="$t('golbal.park') +' ' + $t('golbal.notBoxUpAndNotConnect')"></el-option>
            <el-option value="3" :label="$t('golbal.run')  +' ' + $t('golbal.boxUpAndConnect')"></el-option>
            <el-option value="4" :label="$t('golbal.run')  +' ' + $t('golbal.notBoxUpAndConnect')"></el-option>
            <el-option value="5" :label="$t('golbal.stop') +' ' + $t('golbal.boxUpAndConnect')"></el-option>
            <el-option value="6" :label="$t('golbal.stop') +' ' + $t('golbal.notBoxUpAndConnect')"></el-option>
            <el-option value="7" :label="$t('golbal.offline')"></el-option>
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
          type="selection">
        </el-table-column>
         <el-table-column
          type="index"
          align="center"
          width="80"
          :label="$t('index.indexField')">
        </el-table-column>
        <el-table-column
          prop="OrgName"
          align="center"
          width="120"
          :label="$t('common.organization')">
        </el-table-column>
        <el-table-column
          prop="LicensePlate"
          align="center"
          width="180"
          :label="$t('boxUp.licensePlate')">
        </el-table-column>
        <el-table-column
          prop="Speed"
          align="center"
          width="120"
          :label="$t('common.speedKm')">
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          min-width="200"
          :label="$t('common.state')"
          :formatter="formatterStatus">
        </el-table-column>
        <el-table-column
          prop="ReportingTime"
          align="center"
          min-width="120"
          :label="$t('trailer.lastReportTime')"
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
        currStateType: '',
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
    this.searchHandle()
    this.queryOrganizate()
  },
  methods: {// 获取机构信息
    queryOrganizate () {
      this.$get({
        url: '/assist/queryOrganizate',
        success: data => {
          this.zNodes = data.zNodes || []
        }
      })
    },
    queryHandle () {
      this.searchForm.page = 1
      this.searchHandle()
    },
    searchHandle () {
      this.$post({
        url: '/monitor/currentState/listData',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.countData = data.Rows || []
          this.totalRecord = data.Total || 0
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    pageHandle (page) {
      this.searchForm.page = page
      this.searchHandle()
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
        return this.$t('golbal.stop') + ' ' + this.$t('golbal.notBoxUpAndConnect')
      }
      if (row.status === 7) {
        return this.$t('golbal.offline')
      }
    },
    formatterReportingTime (row, column) {
      if (!row.ReportingTime) {
        return '-'
      } else {
        return row.ReportingTime
      }
    }
  }
}
</script>

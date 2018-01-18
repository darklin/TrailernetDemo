<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('contentSubtitle.history.emergencyBrakeRecord')}}</div>
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
        <el-form-item :label="$t('brakeRecord.brakeType')" class="fl">
          <el-select v-model="searchForm.brakeType" clearable placeholder="">
            <el-option label="ABS" value="1"></el-option>
            <el-option label="RSS" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('brakeRecord.from')" class="fl">
          <el-date-picker
            v-model="searchForm.startTime"
            type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('brakeRecord.to')" class="fl">
          <el-date-picker
            v-model="searchForm.endTime"
            type="datetime">
          </el-date-picker>
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
          prop="LicensePlate"
          align="center"
          :label="$t('boxUp.licensePlate')"
          width="180">
        </el-table-column>
        <el-table-column
          prop="BrakingType"
          align="center"
          :label="$t('brakeRecord.brakeType')"
          width="180"
          :formatter="formatterType">
        </el-table-column>
        <el-table-column
          prop="Pressure"
          align="center"
          :label="$t('brakeRecord.pressure')"
          :formatter="formatterPressure">
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
        startTime: '',
        endTime: '',
        orgIDs: '',
        licensePlate: '',
        brakeType: '',
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
        url: '/monitor/braking/listData',
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
    formatterType (row, column) {
      if (row.BrakingType === 1) {
        return 'ABS'
      } else if (row.BrakingType === 2) {
        return 'RSS'
      } else if (row.BrakingType === 3) {
        return this.$t('brakeRecord.ESPGS')
      }
      return '-'
    },
    formatterPressure (row, column) {
      if (row.Pressure) {
        return row.Pressure + 'pa'
      }
      return '-'
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
    }
  }
}
</script>

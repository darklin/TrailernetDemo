<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('contentSubtitle.history.tireMonitor')}}</div>
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
          <el-select v-model="searchForm.status" clearable placeholder="">
            <el-option :label="$t('carAlarm.highTemperatureTire')" value="1"></el-option>
            <el-option :label="$t('carAlarm.highPressureTire')" value="2"></el-option>
            <el-option :label="$t('carAlarm.lowPressureTire')" value="3"></el-option>
            <el-option :label="$t('carAlarm.lowBattery')" value="4"></el-option>
            <el-option :label="$t('tire.airLeak')" value="5"></el-option>
            <el-option :label="$t('tire.overTime')" value="6"></el-option>
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
          prop="HighTemperature"
          align="center"
          :label="$t('carAlarm.highPressureTire')"
          width="200">
        </el-table-column>
        <el-table-column
          prop="LowPressure"
          align="center"
          :label="$t('carAlarm.lowPressureTire')"
          width="200">
        </el-table-column>
        <el-table-column
          prop="LowVoltage"
          align="center"
          :label="$t('carAlarm.lowBattery')"
          width="200">
        </el-table-column>
        <el-table-column
          prop=""
          align="center"
          :label="$t('tire.overTime')"
          width="180">
        </el-table-column>
        <el-table-column
          prop="UpdateTime"
          align="center"
          :label="$t('boxUp.reportTime')"
          :formatter="formatterUpdateTime"
          width="180">
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
        status: '',
        orgIDs: '',
        licensePlate: '',
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
        url: '/monitor/tireCurrAll/listData',
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
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    pageHandle (page) {
      this.searchForm.page = page
      this.getListData()
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
    formatterUpdateTime (row, column) {
      if (!row.UpdateTime) {
        return '-'
      } else {
        return row.UpdateTime
      }
    }
  }
}
</script>

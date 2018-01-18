<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('contentSubtitle.history.psiRecord')}}</div>
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
      </el-form>
      <el-button :loading="isLoading" class="search-btn fl" icon="search"  @click="queryHandle">{{$t('common.search')}}</el-button>
    </div>
    <div class="table-box">
      <el-table
        :data="countData"
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
          prop="PSIState"
          align="center"
          width="120"
          :label="$t('common.state')"
          :formatter="formatterState">
        </el-table-column>
        <el-table-column
          prop="RecordTime"
          align="center"
          min-width="120"
          :label="$t('trailer.lastReportTime')"
          :formatter="formatterRecordTime">
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('common.operate')"
          width="120">
          <template scope="scope">
            <el-button size="small" type="text" @click="moreHandle(scope.row.CarID)">{{$t('abs.more')}}</el-button>
          </template>
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
    <chart-data v-model="isShow" :carID="carID"></chart-data>
  </div>
</template>

<script>
import PSIChart from '@/components/PSIListChart'
export default {
  name: 'abs-record',
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
      countData: [],
      isShow: false,
      carID: ''
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
        url: '/monitor/psi/history/listData',
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
    formatterRecordTime (row, column) {
      if (!row.RecordTime) {
        return '-'
      } else {
        return row.RecordTime
      }
    },
    formatterState (row, column) {
      if (row.PSIState === 0) {
        return this.$t('psi.echart.unactivated')
      } else {
        return this.$t('psi.echart.activated')
      }
    },
    // 更多操作
    moreHandle (CarID) {
      console.info(CarID)
      this.carID = CarID
      this.isShow = true
    }
  },
  components: {
    'chart-data': PSIChart
  }
}
</script>

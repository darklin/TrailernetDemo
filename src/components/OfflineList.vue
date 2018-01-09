<template>
  <el-dialog title="" top="60px" class="dialog-gray-box" :visible.sync="dialogVisible">
    <el-button class="search-export-chart-btn fl"  @click="exportHandle">{{$t('car.export')}}</el-button>
    <div class="table-box">
      <el-table
        :data="countData"
        border
        style="width: 100%">
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
          <template scope="scope">
            <el-button type="text" @click="positionHandle(scope.row)" >{{scope.row.LicensePlate}}</el-button>
          </template>
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
          :current-page="page"
          :page-size="pagesize"
          layout="total, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'offline-list',
  props: {
    currStateType: Number,
    orgId: String,
    value: null
  },
  data () {
    return {
      dialogVisible: false,
      totalRecord: 1,
      page: 1,
      pagesize: 10,
      countData: []
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = true
      this.page = 1
      this.pagesize = 10
      this.countData = []
      if (val) {
        this.searchHandle()
      }
    },
    dialogVisible (val) {
      this.$emit('input', false)
    }
  },
  methods: {
    searchHandle () {
      this.$get({
        url: '/monitor/currentState/listData',
        data: {
          orgIDs: this.orgId,
          page: this.page,
          pagesize: this.pagesize,
          currStateType: this.currStateType
        },
        loading: true,
        success: data => {
          this.countData = data.Rows || []
          this.totalRecord = data.Total || 0
        }
      })
    },
    pageHandle (page) {
      this.page = page
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
    },
    positionHandle (row, scope) {
      console.info(scope)
      this.$router.push({path: 'monitor', query: {licensePlate: row.LicensePlate}})
    },
    exportHandle () {
      window.location.href = `${this.$baseURL}monitor/currentState/excel?orgIDs=${this.orgId}&currStateType=7&tag=offline`
    }
  }
}
</script>

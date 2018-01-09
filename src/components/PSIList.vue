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
          <template scope="scope">
            <el-button type="text" @click="positionHandle(scope.row)" >{{scope.row.LicensePlate}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="Num"
          align="center"
          :label="$t('psi.PSIActivatedTimes')"
          width="190">
        </el-table-column>
        <el-table-column
          prop="PSIDurationTime"
          align="center"
          :label="$t('psi.PSILastDuration')"
          width="180">
        </el-table-column>
        <el-table-column
          prop="PSIRunTime"
          align="center"
          :label="$t('psi.PSIRunTime')"
          width="180">
        </el-table-column>
        <el-table-column
          prop="RecordTime"
          align="center"
          min-width="180"
          :label="$t('trailer.lastReportTime')"
          :formatter="formatterRecordTime">
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
  </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'idle-list',
  props: {
    idleDays: Number,
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
        url: '/monitor/psi/listData',
        data: {
          orgIDs: this.orgId,
          page: this.page,
          pagesize: this.pagesize
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
    formatterRecordTime (row, column) {
      if (!row.RecordTime) {
        return '-'
      } else {
        return row.RecordTime
      }
    },
    positionHandle (row) {
      this.$router.push({path: 'monitor', query: {licensePlate: row.LicensePlate}})
    },
    exportHandle () {
      window.location.href = `${this.$baseURL}monitor/psi/excel?orgIDs=${this.orgId}`
    }
  }
}
</script>

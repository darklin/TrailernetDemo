<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('contentSubtitle.coldChain.tempAlarm')}}</div>
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
        <el-form-item :label="$t('brakeRecord.from')" class="fl">
          <el-date-picker
            v-model="searchForm.startDate"
            ref="startDate"
            type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('brakeRecord.to')" class="fl">
          <el-date-picker
            v-model="searchForm.endDate"
            ref="endDate"
            type="datetime">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-button :loading="isLoading" class="search-btn fl" icon="search"  @click="queryHandle">{{$t('common.search')}}</el-button>
      <!--<el-button class="search-export-btn fl">{{$t('car.export')}}</el-button>-->
    </div>
    <div class="table-box">
    <!--<el-button class="table-set-btn" @click="tempHandle">温湿度报警设置</el-button>-->
      <el-table
        :data="countData"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection">
        </el-table-column>
         <el-table-column
          fixed="left"
          type="index"
          align="center"
          width="80"
          :label="$t('index.indexField')">
        </el-table-column>
        <el-table-column
          fixed="left"
          prop="OrgName"
          align="center"
          width="180"
          :label="$t('common.organization')">
        </el-table-column>
        <el-table-column
          fixed="left"
          prop="LicensePlate"
          align="center"
          width="180"
          :label="$t('boxUp.licensePlate')">
        </el-table-column>
        <el-table-column
          prop="HighTempAlarmNum"
          align="center"
          width="180"
          label="高温报警次数">
        </el-table-column>
        <el-table-column
          prop="highTime"
          align="center"
          width="180"
          label="高温报警时长">
        </el-table-column>
        <el-table-column
          prop="LowTempAlarmNum"
          align="center"
          width="180"
          label="低温报警次数">
        </el-table-column>
        <el-table-column
          prop="lowTime"
          align="center"
          width="180"
          label="低温报警时长">
        </el-table-column>
        <el-table-column
          prop="LastReportTime"
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
    <el-dialog title="温湿度报警设置" :visible.sync="visible" :show-close="false" custom-class="dialog-set">
      <el-form :inline="true" class="dialog-set-form" labelWidth="babelWid" :model="setForm" ref="setForm">
        <el-form-item label="高温报警" label-width="130px">
          <el-radio-group v-model="setForm.HighTemperAlarm">
            <el-radio-button label="0">ON</el-radio-button>
            <el-radio-button label="1">OFF</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="低温报警" label-width="130px">
          <el-radio-group v-model="setForm.LowTemperAlarm">
            <el-radio-button label="0">ON</el-radio-button>
            <el-radio-button label="1">OFF</el-radio-button>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="微信通知" label-width="130px">
          <el-radio-group v-model="setForm.WeChart">
            <el-radio-button label="0">ON</el-radio-button>
            <el-radio-button label="1">OFF</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="短信通知" label-width="130px">
          <el-radio-group v-model="setForm.SMS">
            <el-radio-button label="0">ON</el-radio-button>
            <el-radio-button label="1">OFF</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="dialog-set-footer">
        <el-button @click="confirmHandle">{{$t('common.confirm')}}</el-button>
        <el-button @click="cancelHandle">{{$t('common.close')}}</el-button>
      </div>
    </el-dialog>
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
        startDate: '',
        endDate: '',
        page: 1,
        pagesize: 10
      },
      visible: false,
      babelWid: this.$i18n.locale === 'zh' ? '240px' : '300px',
      setForm: {
        HighTemperAlarm: '',
        LowTemperAlarm: '',
        WeChart: '',
        SMS: ''
      },
      isLoading: false,
      totalRecord: 1,
      multipleSelection: [],
      countData: []
    }
  },
  mounted () {
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
      if (this.$refs['startDate'].displayValue) {
        this.searchForm['startDate'] = this.$refs['startDate'].displayValue
        this.searchForm['endDate'] = this.$refs['endDate'].displayValue
      }
      this.$get({
        url: '/coldchain/getTempAlarmList',
        data: this.searchForm,
        loading: true,
        success: data => {
          let datas = data.Rows || []
          let countData = []
          datas.map(item => {
            if (item['HighTempAlarmNum'] === '0') {
              item['TotalHighTemperTime'] = '-'
              item['HighTempAlarmNum'] = '-'
              if (item['LowTempAlarmNum'] === '0') {
                item['LastReportTime'] = '-'
              }
            }
            if (item['LowTempAlarmNum'] === '0') {
              item['TotalLowTemperTime'] = '-'
              item['LowTempAlarmNum'] = '-'
            }
            countData.push(item)
          })
          this.countData = datas.slice(0, 10)
          this.totalRecord = datas.length || 0
          this.countData = countData
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
    // 温湿度报警设置
    tempHandle () {
      if (!this.multipleSelection.length) {
        this.$msg(this.$t('device.selectContentOfopera'))
      } else {
        this.setForm = {
          tempReportInterval: 5,
          highTempSet: 8,
          lowTempSet: -8
        }
        this.visible = true
      }
    },
    // 温湿度报警设置确定
    confirmHandle () {
      let ids = ''
      this.multipleSelection.forEach(item => {
        ids = ids + item.DeviceNO + ','
      })
      this.$refs['setForm'].validate((valid) => {
        if (valid) {
          this.$post({
            url: '/coldchain/temperature/setParameter',
            data: {
              'deviceNOs': ids,
              'tempReportInterval': this.setForm['tempReportInterval'],
              'highTempSet': this.setForm['highTempSet'],
              'lowTempSet': this.setForm['lowTempSet']
            },
            success: data => {
              this.$msg(this.$t('common.setSuccess'))
            }
          })
          this.visible = false
        }
      })
    },
    // 温湿度报警设置取消
    cancelHandle () {
      this.visible = false
    },
    formatterReportingTime (row, column) {
      if (!row.LastReportTime) {
        return '-'
      } else {
        return row.LastReportTime
      }
    }
  }
}
</script>

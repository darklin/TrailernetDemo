<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('contentSubtitle.archives.deviceManagement')}}</div>
    <div class="search-box clearfix">
      <el-form :model="searchForm" class="search-form">
        <el-form-item :label="$t('common.organization')" class="fl">
          <el-select v-model="searchForm.orgIDs" clearable placeholder="">
            <el-option v-for="item,index in zNodes" :label="item.name" :value="item.id" :key="index" :checked="item.checked"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('car.carNo')" class="fl">
          <el-input v-model="searchForm.licensePlate"></el-input>
        </el-form-item>
        <el-form-item :label="$t('car.deviceNo')" class="fl">
          <el-input v-model="searchForm.deviceNo"></el-input>
        </el-form-item>
      </el-form>
      <el-button :loading="isLoading" class="search-btn fl" icon="search"  @click="searchHandle">{{$t('common.search')}}</el-button>
    </div>
    <div class="table-box">
      <el-button class="table-export-btn" @click="exportHandle">{{$t('car.export')}}</el-button>
      <el-button class="table-set-btn" @click="deviceHandle">{{$t('device.deviceSetting')}}</el-button>
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
          prop="DeviceNO"
          :label="$t('car.deviceNo')"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="SurplusElectricity"
          :label="$t('loca.dumpEnergy')"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="OrgName"
          :label="$t('common.organization')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="DeviceType"
          :label="$t('loca.deviceType')"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="VersionNo"
          :label="$t('excel.versionNo')"
          min-width="220">
        </el-table-column>
        <el-table-column
          prop="DeviceIMEI"
          :label="$t('excel.IMEI')"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="DeviceSIM"
          :label="$t('excel.SIM')"
          min-width="200">
        </el-table-column>
        <el-table-column
          :label="$t('load.currentState')"
          min-width="100">
          <template scope="scope">
            <div v-if="scope.row.CurrentType === 0">{{$t('golbal.notActivate')}}</div>
            <div v-else-if="scope.row.CurrentType === 1">{{$t('golbal.offline')}}</div>
            <div v-else>{{$t('golbal.notOffline')}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="ActiveTime"
          :label="$t('golbal.activateTime')"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="ReportingTime"
          :label="$t('golbal.offlineTime')"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="offlinDate"
          :label="$t('golbal.offlineLen')"
          min-width="250">
        </el-table-column>
      </el-table>
      <div class="page-box text-fr">
        <el-pagination
          @current-change="pageHandle"
          :current-page="currentPage"
          layout="total, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="$t('device.deviceSetting')" :visible.sync="visible" :show-close="false" custom-class="dialog-set dialog-device-set">
      <el-form class="dialog-set-form" :labelWidth="babelWid" :model="setForm" ref="setForm">
        <el-form-item :label="$t('car.overspeed')" prop="overspeed" :rules="{type: 'number', min: 1, max: 160, required: true, message: this.$t('index.optionalScope') + '1-160', trigger: 'blur'}">
          <el-input v-model.number="setForm.overspeed" :maxlength="3">
            <template slot="append">km/h</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('car.overspeedDuration')" prop="overspeedLen" :rules="{type: 'number', min: 10, max: 600, required: true, message: this.$t('index.optionalScope') + '10-600', trigger: 'blur'}">
          <el-input v-model.number="setForm.overspeedLen" :maxlength="3">
            <template slot="append">S</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('golbal.idleThreshold')" prop="ildeLen" :rules="{type: 'number', min: 1, max: 720, required: true, message: this.$t('index.optionalScope') + '1-720', trigger: 'blur'}">
          <el-input v-model.number="setForm.ildeLen" :maxlength="3">
            <template slot="append">H</template>
          </el-input>
          <!-- <el-select v-model="setForm.ildeLen" filterable placeholder="">
            <el-option v-for="n in 99" :value="n" :key="n"></el-option>
          </el-select>
          <span>H</span> -->
        </el-form-item>
        <el-form-item :label="$t('golbal.reportFrequencyOfDormant')" prop="offlineReportTimes" :rules="{type: 'number', min: 1, max: 240, required: true, message: this.$t('index.optionalScope') + '1-240', trigger: 'blur'}">
          <el-input v-model.number="setForm.offlineReportTimes" :maxlength="3">
            <template slot="append">H</template>
          </el-input>
          <!-- <el-select v-model="setForm.offlineReportTimes" filterable placeholder="">
            <el-option v-for="n in 7" :value="n" :key="n"></el-option>
          </el-select>
          <span>天</span> -->
        </el-form-item>
        <el-form-item :label="$t('golbal.psiAlarmTime')" prop="psiAlarmTime" :rules="{type: 'number', min: 1, max: 60, required: true, message: this.$t('index.optionalScope') + '1-60', trigger: 'blur'}">
          <el-input v-model.number="setForm.psiAlarmTime" :maxlength="2">
            <template slot="append">Min</template>
          </el-input>
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
  name: 'remind-detail',
  data () {
    return {
      zNodes: [],
      searchForm: {
        orgIDs: '',
        deviceNo: '',
        licensePlate: '',
        currentType: '',
        page: 1,
        pagesize: 10
      },
      visible: false,
      babelWid: this.$i18n.locale === 'zh' ? '240px' : '300px',
      setForm: {
        overspeed: 90,
        overspeedLen: 10,
        offlineReportTimes: 24,
        ildeLen: 7,
        psiAlarmTime: 10
      },
      isLoading: false,
      currentPage: 1,
      totalRecord: 1,
      multipleSelection: [],
      countData: []
    }
  },
  created () {
    this.searchHandle()
    this.queryOrganizate()
  },
  methods: {
    // 获取机构信息
    queryOrganizate () {
      this.$get({
        url: '/assist/queryOrganizate',
        success: data => {
          this.zNodes = data.zNodes || []
        }
      })
    },
    // 获取设备信息
    searchHandle () {
      this.$get({
        url: '/device',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.countData = data['deviceInfo'] || []
          this.totalRecord = data['Total'] || 1
        }
      })
    },
    // 设备设置
    deviceHandle () {
      if (!this.multipleSelection.length) {
        this.$msg(this.$t('device.selectContentOfopera'))
      } else {
        this.setForm = {
          overspeed: 90,
          overspeedLen: 10,
          offlineReportTimes: 24,
          ildeLen: 168
        }
        this.visible = true
      }
    },
    // 设备设置确定
    confirmHandle () {
      let ids = ''
      this.multipleSelection.forEach(item => {
        ids = ids + item.DeviceID + ','
      })
      this.$refs['setForm'].validate((valid) => {
        if (valid) {
          this.$post({
            url: '/device/setParameter',
            data: {
              'ids': ids,
              'overspeed': this.setForm['overspeed'],
              'overspeedLen': this.setForm['overspeedLen'],
              'offlineReportTimes': this.setForm['offlineReportTimes'],
              'ildeLen': this.setForm['ildeLen'],
              'psiAlarmTime': this.setForm['psiAlarmTime']
            },
            success: data => {
              this.$msg(this.$t('common.setSuccess'))
            }
          })
          this.visible = false
        }
      })
    },
    // 设备设置取消
    cancelHandle () {
      this.visible = false
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.page = page
      this.searchHandle()
    },
    // 多选处理
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 导出车辆档案
    exportHandle () {
      window.location.href = `${this.$baseURL}device/excel?${this.$serialize(this.searchForm)}`
    }
  }
}
</script>

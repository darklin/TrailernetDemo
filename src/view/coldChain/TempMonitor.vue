<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('contentSubtitle.coldChain.tempMonitor')}}</div>
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
    <el-button class="table-set-btn" @click="tempHandle">{{$t('contentSubtitle.coldChain.tempSet')}}</el-button>
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
          width="120"
          :label="$t('common.organization')">
        </el-table-column>
        <el-table-column
          fixed="left"
          prop="LicensePlate"
          align="center"
          width="180"
          :label="$t('boxUp.licensePlate')">
          <template scope="scope">
            <el-button type="text" @click="LicensePlateHandle(scope.row)">{{scope.row.LicensePlate}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="Speed"
          align="center"
          width="120"
          :label="$t('common.speedKm')">
        </el-table-column>
        <el-table-column
          prop="Temperature1"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '1'">
        </el-table-column>
        <el-table-column
          prop="Temperature2"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '2'">
        </el-table-column>
        <el-table-column
          prop="Temperature3"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '3'">
        </el-table-column>
        <el-table-column
          prop="Temperature4"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '4'">
        </el-table-column>
        <el-table-column
          prop="Temperature5"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '5'">
        </el-table-column>
        <el-table-column
          prop="Temperature6"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '6'">
        </el-table-column>
        <el-table-column
          prop="Temperature7"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '7'">
        </el-table-column>
        <el-table-column
          prop="Temperature8"
          align="center"
          width="120"
          :label="$t('monitor.temperature') + '8'">
        </el-table-column>
        <el-table-column
          prop="TempReportInterval"
          align="center"
          width="120"
          :label="$t('coldChain.tempReportInterval')">
        </el-table-column>
        <el-table-column
          prop="HighTempSet"
          align="center"
          width="120"
          :label="$t('coldChain.highTempSet')">
        </el-table-column>
        <el-table-column
          prop="LowTempSet"
          align="center"
          width="120"
          :label="$t('coldChain.lowTempSet')">
        </el-table-column>
        <el-table-column
          prop="Content"
          align="center"
          width="240"
          :label="$t('boxUp.position')">
          <template scope="scope">
            {{scope.row.Content}}
            <el-button type="text" @click="editHandle(scope.row)" v-if="scope.row.Content===' '">{{$t('carAlarm.detaile')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          prop="RecordTime"
          align="center"
          min-width="170"
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
    <el-dialog :title="$t('device.deviceSetting')" :visible.sync="visible" :show-close="false" custom-class="dialog-set dialog-device-set">
      <el-form class="dialog-set-form" :labelWidth="babelWid" :model="setForm" ref="setForm">
        <el-form-item :label="$t('coldChain.tempReportInterval')" prop="tempReportInterval" :rules="{type: 'number', min: 3, max: 15, required: true, message: this.$t('index.optionalScope') + '3~15', trigger: 'blur'}">
          <el-input v-model.number="setForm.tempReportInterval" :maxlength="2">
            <template slot="append">min</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('coldChain.highTempSet')" prop="highTempSet" :rules="{type: 'number', min: 2, max: 12, required: true, message: this.$t('index.optionalScope') + '2~12', trigger: 'blur'}">
          <el-input v-model.number="setForm.highTempSet" :maxlength="2">
            <template slot="append">℃</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('coldChain.lowTempSet')" prop="lowTempSet" :rules="{type: 'number', min: -12, max: -1, required: true, message: this.$t('index.optionalScope') + '-12~-1', trigger: 'blur'}">
          <el-input v-model.number="setForm.lowTempSet" :maxlength="3">
            <template slot="append">℃</template>
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
import Transform from '@/utils/transform'
import gMap from '@/map/gmap'
import bMap from '@/map/bmap'
export default {
  name: 'tire-monitor',
  data () {
    return {
      zNodes: [],
      searchForm: {
        licensePlate: '',
        orgIDs: '',
        page: 1,
        pagesize: 10
      },
      visible: false,
      babelWid: this.$i18n.locale === 'zh' ? '240px' : '300px',
      setForm: {
        tempReportInterval: 5,
        highTempSet: 8,
        lowTempSet: -8
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
  mounted () {
    if (this.$i18n.locale === 'zh') {
      this.searchHandle()
      bMap.loadMapJS('//api.map.baidu.com/api?v=2.0&ak=gQr6R39pYFt2Ofe35MqyUIsnS1ncSOD7&callback=init', () => bMap.initMap())
    } else {
      this.searchHandle()
      gMap.loadMapJS('//maps.googleapis.com/maps/api/js?key=AIzaSyB2KjWfZMG_HJdCr3IBMqOIkQcGBzykuUI&language=en&callback=init', () => {
        gMap.initMap(() => {
        })
      })
    }
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
      this.$get({
        url: '/coldchain/getMonitorList',
        data: this.searchForm,
        loading: true,
        success: data => {
          let datas = data.temperInfo || []
          let countData = []
          datas.map(item => {
            if (item['Temperature1'] === 6503 || item['Temperature1'] === 6503.0 || item['Temperature1'] === 6503.5) {
              item['Temperature1'] = 'N/A'
            }
            if (item['Temperature2'] === 6503 || item['Temperature2'] === 6503.0 || item['Temperature2'] === 6503.5) {
              item['Temperature2'] = 'N/A'
            }
            if (item['Temperature3'] === 6503 || item['Temperature3'] === 6503.0 || item['Temperature3'] === 6503.5) {
              item['Temperature3'] = 'N/A'
            }
            if (item['Temperature4'] === 6503 || item['Temperature4'] === 6503.0 || item['Temperature4'] === 6503.5) {
              item['Temperature4'] = 'N/A'
            }
            if (item['Temperature5'] === 6503 || item['Temperature5'] === 6503.0 || item['Temperature5'] === 6503.5) {
              item['Temperature5'] = 'N/A'
            }
            if (item['Temperature6'] === 6503 || item['Temperature6'] === 6503.0 || item['Temperature6'] === 6503.5) {
              item['Temperature6'] = 'N/A'
            }
            if (item['Temperature7'] === 6503 || item['Temperature7'] === 6503.0 || item['Temperature7'] === 6503.5) {
              item['Temperature7'] = 'N/A'
            }
            if (item['Temperature8'] === 6503 || item['Temperature8'] === 6503.0 || item['Temperature8'] === 6503.5) {
              item['Temperature8'] = 'N/A'
            }
            countData.push(item)
          })
          this.countData = countData
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
    // 温湿度设置
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
    // 温湿度设置确定
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
    // 温湿度设置取消
    cancelHandle () {
      this.visible = false
    },
    editHandle (row) {
      let point = ''
      if (this.$i18n.locale === 'zh') {
        if (Transform.outOfChina(row.Latitude, row.Longitude)) {
          this.$alert('该坐标不在中国内', '提示', {
            showConfirmButton: false,
            type: 'info'
          })
        } else {
          point = Transform.wgs2bd(row.Latitude, row.Longitude)
          this.transBaiduAddress(point, row)
        }
      } else {
        let point = Transform.wgs2gcj(row.Latitude, row.Longitude)
        this.transGoogleAddress(point, row)
      }
    },
    transGoogleAddress (point, row) {
      gMap.getAddress(point, address => {
        row['Content'] = address
      })
    },
    transBaiduAddress (point, row) {
      bMap.getAddress(point, address => {
        row['Content'] = address
      })
    },
    formatterReportingTime (row, column) {
      if (!row.RecordTime) {
        return '-'
      } else {
        return row.RecordTime
      }
    },
    LicensePlateHandle (row) {
      this.$localStorage('tempMonitorDetail', row.CarID)
      this.$router.push('tempMonitorDetail')
    }
  }
}
</script>

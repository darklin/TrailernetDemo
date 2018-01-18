<template>
  <el-dialog title="" top="60px" class="dialog-gray-box" :visible.sync="dialogVisible">
  <div class="search-box clearfix">
      <el-form :model="searchForm" class="search-form">
        <el-form-item :label="$t('loca.alarmType')" class="fl">
          <el-select v-model="searchForm.alarmType" clearable placeholder="">
            <el-option :label="$t('carAlarm.alarmEquipment')" value="5"></el-option>
            <el-option :label="$t('carAlarm.rolloverAlarm')" value="1"></el-option>
            <el-option :label="$t('carAlarm.idleAlarm')" value="14"></el-option>
            <!--<el-option :label="$t('carAlarm.collisionAlarm')" value="15"></el-option>-->
            <el-option :label="$t('carAlarm.lowBatteryAlarm')" value="16"></el-option>
            <el-option :label="$t('carAlarm.overspeedAlarm')" value="30"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button :loading="isLoading" class="search-btn fl" icon="search"  @click="searchHandle">{{$t('common.search')}}</el-button>
    </div>
    <div class="table-box">
      <el-button class="table-police-btn" @click="readHandle">{{$t('carAlarm.setIsRead')}}</el-button>
      <el-table
        :data="countData"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          type="index"
          align="center"
          :label="$t('index.indexField')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="LicensePlate"
          align="center"
          :label="$t('car.carNo')"
          width="150">
        </el-table-column>
        <el-table-column
          :label="$t('loca.alarmType')"
          align="center"
          width="180">
          <template scope="scope">
            <div v-if="scope.row.AlarmParam === '5'">{{$t('carAlarm.alarmEquipment')}}</div>
            <div v-else-if="scope.row.AlarmParam === '1'">{{$t('carAlarm.rolloverAlarm')}}</div>
            <div v-else-if="scope.row.AlarmParam === '14'">{{$t('carAlarm.idleAlarm')}}</div>
            <div v-else-if="scope.row.AlarmParam === '15'">{{$t('carAlarm.collisionAlarm')}}</div>
            <div v-else-if="scope.row.AlarmParam === '16'">{{$t('carAlarm.lowBatteryAlarm')}}</div>
            <div v-else-if="scope.row.AlarmParam === '30'">{{$t('carAlarm.overspeedAlarm')}}</div>
            <div v-else>{{$t('carAlarm.other')}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="Content"
          align="center"
          :label="$t('carAlarm.messageContent')">
          <template scope="scope">
            {{scope.row.Content}}
            <el-button type="text" @click="editHandle(scope.row)" v-if="!scope.row.address">{{$t('carAlarm.addressSearch')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('carAlarm.isRead')"
          align="center"
          width="140">
          <template scope="scope">{{scope.row.IsRead ? $t('common.yes') : $t('common.no')}}</template>
        </el-table-column>
        <el-table-column
          prop="ReportingTime"
          align="center"
          :label="$t('carAlarm.alarmTime')"
          width="180">
        </el-table-column>
      </el-table>
      <div class="page-box text-fr">
        <el-pagination
          @current-change="pageHandle"
          :current-page="searchForm.page"
          layout="total, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div> 
  </div>
  </el-dialog>
</template>

<script>
import Transform from '@/utils/transform'
import gMap from '@/map/gmap'
export default {
  name: 'idle-list',
  props: {
    carID: String,
    beginTime: String,
    endTime: String,
    value: null
  },
  data () {
    return {
      searchForm: {
        beginTime: '',
        endTime: '',
        alarmType: '',
        carID: '',
        page: 1,
        pagesize: 10
      },
      dialogVisible: false,
      totalRecord: 1,
      isLoading: false,
      multipleSelection: [],
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
      this.searchForm['carID'] = this.carID
      this.searchForm['beginTime'] = this.beginTime
      this.searchForm['endTime'] = this.endTime
      this.$get({
        url: '/caralarm/listDetailData',
        data: this.searchForm,
        loading: true,
        success: data => {
          let datas = data.Rows || []
          let countData = []
          let unit = data['Unit']
          datas.map(item => {
            if (this.$i18n.locale === 'zh') {
              let contentText = item['Content'].split('所在位置')
              item['Content'] = contentText[0] + '所在位置:'
              item['Address'] = contentText[1]
              countData.push(item)
            } else {
              this.handleContent(item, unit)
              countData.push(item)
            }
          })
          this.countData = data.Rows || []
          this.totalRecord = data.Total || 0
        }
      })
    },
    // 设为已读处理
    readHandle () {
      let ids = ''
      this.multipleSelection.forEach(item => {
        ids = ids + item.AlarmID + ','
      })
      this.$post({
        url: '/caralarm/setIsRead',
        data: {'alarmIDs': ids},
        loading: true,
        success: data => {
          this.searchHandle()
        }
      })
    },
    // 列表多选
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    editHandle (row) {
      if (this.$i18n.locale === 'zh') {
        if (Transform.outOfChina(row.Latitude, row.Longitude)) {
          let point = Transform.wgs2gcj(row.Latitude, row.Longitude)
          this.transAddress(point, row)
        } else {
          row['Content'] = row['Content'] + row['Address']
          row['address'] = row['Address']
        }
      } else {
        row.Longitude = row.Longitude * -1
        let point = Transform.wgs2gcj(row.Latitude, row.Longitude)
        this.transAddress(point, row)
      }
    },
    transAddress (point, row) {
      gMap.getAddress(point, address => {
        row['address'] = address
        row['Content'] = row['Content'] + address
      })
    },
    pageHandle (page) {
      this.searchForm.page = page
      this.searchHandle()
    },
    exportHandle () {
      window.location.href = `${this.$baseURL}monitor/idle/excel?orgIDs=${this.orgId}&idleDays=7`
    },
    handleContent (item, unit) {
      if (item.AlarmParam === '5') {
        item['Content'] = 'Address: '
      } else if (item.AlarmParam === '1') {
        item['Content'] = 'Address: '
      } else if (item.AlarmParam === '14') {
        let contents = item['Content'].split(',闲置时间：')
        contents = contents[1].split('天')
        item['Content'] = contents[0] + 'day(s), Address: '
      } else if (item.AlarmParam === '15') {
        let contents = item['Content'].split(',剩余电量：')
        contents = contents[1].split('%')
        item['Content'] = contents[0] + '%, Address: '
      } else if (item.AlarmParam === '16') {
        item['Content'] = 'Address: '
      } else if (item.AlarmParam === '30') {
        item['Content'] = 'Speed: ' + item['Speed'] + (!unit ? ' km/h' : ' mile/h') + ', Address: '
      } else {
        item['Content'] = this.$t('carAlarm.other') + ', Address: '
      }
    }
  }
}
</script>

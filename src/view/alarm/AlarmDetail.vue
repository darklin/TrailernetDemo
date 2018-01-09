<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('carAlarm.alarmDetail')}}</div>
    <div class="search-box clearfix">
      <el-form :model="searchForm" class="search-form">
        <el-form-item :label="$t('common.organization')" class="fl">
          <el-select v-model="searchForm.orgIDs" clearable placeholder="">
            <el-option v-for="item,index in zNodes" :label="item.name" :value="item.id" :key="index" :checked="item.checked"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('brakeRecord.from')" class="fl">
          <el-date-picker
            v-model="searchForm.beginTime"
            ref="beginTime"
            type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('brakeRecord.to')" class="fl">
          <el-date-picker
            v-model="searchForm.endTime"
            ref="endTime"
            type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('loca.alarmType')" class="fl">
          <el-select v-model="searchForm.alarmType" clearable placeholder="">
            <el-option :label="$t('carAlarm.idleAlarm')" value="14"></el-option>
            <el-option :label="$t('carAlarm.rolloverAlarm')" value="1"></el-option>
            <!--<el-option :label="$t('carAlarm.collisionAlarm')" value="15"></el-option>-->
            <el-option :label="$t('carAlarm.overspeedAlarm')" value="30"></el-option>
            <el-option :label="$t('carAlarm.lowBatteryAlarm')" value="16"></el-option>
            <el-option :label="$t('carAlarm.alarmEquipment')" value="5"></el-option>
            <el-option :label="$t('carAlarm.ABSfault')" value="-1"></el-option>
            <el-option :label="$t('carAlarm.PSIState')" value="-2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('car.carNo')" class="fl">
          <el-input v-model="searchForm.carNo" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('carAlarm.isRead')" class="fl">
          <el-select v-model="searchForm.isRead" clearable placeholder="">
            <el-option :label="$t('common.yes')" value="1"></el-option>
            <el-option :label="$t('common.no')" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button :loading="isLoading" class="search-btn fl" icon="search"  @click="searchHandle">{{$t('common.search')}}</el-button>
    </div>
    <div class="table-box">
      <el-button class="table-police-btn" @click="readHandle">{{$t('carAlarm.setIsRead')}}</el-button>
      <el-button class="table-set-btn" @click="alarmHandle">{{$t('carAlarm.alarmSetting')}}</el-button>
      <el-table
        :data="countData"
        border
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
          <template scope="scope">
            <el-button type="text" @click="alarmDetailHandle(scope.row)" >{{scope.row.LicensePlate}}</el-button>
          </template>
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
    <el-dialog :title="$t('carAlarm.alarmSetting')" :visible.sync="visible" :show-close="false" custom-class="dialog-set">
      <el-form inline class="dialog-set-form" labelWidth="130px" :model="setForm" ref="setForm">
        <el-form-item :label="$t('carAlarm.overspeedAlarm')">
          <el-radio-group v-model="setForm.overspeedAlarm" size="small">
            <el-radio-button label="1">ON</el-radio-button>
            <el-radio-button label="0">OFF</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('carAlarm.lowBatteryAlarm')">
          <el-radio-group v-model="setForm.lowBatteryAlarm" size="small">
            <el-radio-button label="1">ON</el-radio-button>
            <el-radio-button label="0">OFF</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('carAlarm.collisionAlarm')">
          <el-radio-group v-model="setForm.collisionAlarm" size="small">
            <el-radio-button label="1">ON</el-radio-button>
            <el-radio-button label="0">OFF</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('carAlarm.rolloverAlarm')">
          <el-radio-group v-model="setForm.rolloverAlarm" size="small">
            <el-radio-button label="1">ON</el-radio-button>
            <el-radio-button label="0">OFF</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="dialog-set-footer">
        <el-button @click="alarmSetHandle">{{$t('common.confirm')}}</el-button>
        <el-button @click="visible = false">{{$t('common.cancel')}}</el-button>
      </div>
    </el-dialog>
    <div id="map" style="display:none"></div>
    <alarm-data v-model="isShow" :carID="carID" :beginTime="searchForm.beginTime" :endTime="searchForm.endTime"></alarm-data>
  </div>
</template>

<script>
import Transform from '@/utils/transform'
import AlarmData from '@/components/AlarmData'
import gMap from '@/map/gmap'
export default {
  name: 'remind-detail',
  data () {
    return {
      zNodes: [],
      alarmTypes: [],
      searchForm: {
        beginTime: '',
        endTime: '',
        orgIDs: '',
        alarmType: '',
        carNo: '',
        isRead: '',
        page: 1,
        pagesize: 10
      },
      visible: false,
      setForm: {
        overspeedAlarm: '',
        lowBatteryAlarm: '',
        collisionAlarm: '',
        rolloverAlarm: ''
      },
      isLoading: false,
      totalRecord: 1,
      isShow: false,
      carID: '',
      multipleSelection: [],
      countData: []
    }
  },
  created () {
    this.queryOrganizate()
  },
  mounted () {
    if (this.$i18n.locale === 'zh') {
      this.searchHandle()
      gMap.loadMapJS('//maps.googleapis.com/maps/api/js?key=AIzaSyB2KjWfZMG_HJdCr3IBMqOIkQcGBzykuUI&callback=init', () => {
        gMap.initMap(() => {
        })
      })
    } else {
      this.searchHandle()
      gMap.loadMapJS('//maps.googleapis.com/maps/api/js?key=AIzaSyB2KjWfZMG_HJdCr3IBMqOIkQcGBzykuUI&language=en&callback=init', () => {
        gMap.initMap(() => {
        })
      })
    }
  },
  methods: {
    // 查询机构信息
    queryOrganizate () {
      this.$get({
        url: '/assist/queryOrganizate',
        success: data => {
          this.zNodes = data.zNodes || []
        }
      })
    },
    // 获取报警数据信息
    searchHandle () {
      if (this.$refs['beginTime']) {
        this.searchForm['beginTime'] = this.$refs['beginTime'].displayValue
        this.searchForm['endTime'] = this.$refs['endTime'].displayValue
      } else {
        this.searchForm['beginTime'] = this.$firstDate(new Date())
      }
      this.$get({
        url: '/caralarm/listData',
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
          this.countData = countData
          this.totalRecord = data.Total || 0
        }
      })
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
        if (Transform.outOfChina(row.Latitude, row.Longitude)) {
          row.Longitude = row.Longitude * -1
        }
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
    // 报警设置
    alarmHandle () {
      this.alarmGetHandle()
      this.visible = true
    },
    // 点击车牌号展示车辆报警相关信息
    alarmDetailHandle (row) {
      this.carID = row.CarID
      this.isShow = true
    },
    // 列表多选
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 分页处理
    pageHandle (page) {
      this.searchForm.page = page
      this.searchHandle()
    },
    alarmSetHandle () {
      this.$post({
        url: '/usersetting/edit',
        data: this.setForm,
        loading: true,
        success: data => {
          let userSettingEdit = data.userSettingEdit || {}
          let arr = []
          if (userSettingEdit.overspeedAlarm) arr.push(30)
          if (userSettingEdit.lowBatteryAlarm) arr.push(16)
          if (userSettingEdit.collisionAlarm) arr.push(15)
          if (userSettingEdit.rolloverAlarm) arr.push(1)
          this.$localStorage('alarmIds', arr.join(','))
          this.searchHandle()
          this.visible = false
        }
      })
    },
    alarmGetHandle () {
      this.$get({
        url: '/usersetting/get',
        loading: true,
        success: data => {
          this.setForm = data.userSetting || []
        }
      })
    },
    handleContent (item, unit) {
      if (item.AlarmParam === '5') {
        item['Content'] = 'Address: '
      } else if (item.AlarmParam === '1') {
        item['Content'] = 'Address: '
      } else if (item.AlarmParam === '14') {
        let contents = item['Content'].split(',闲置时间：')
        let contentss = contents[1].split('天')
        item['Content'] = contentss[0] + ' day(s), Address: '
      } else if (item.AlarmParam === '15') {
        let contents = item['Content'].split(',剩余电量：')
        contents = contents[1].split('%')
        item['Content'] = contents[0] + ' %, Address: '
      } else if (item.AlarmParam === '16') {
        item['Content'] = 'Address: '
      } else if (item.AlarmParam === '30') {
        item['Content'] = 'Speed: ' + item['Speed'] + (!unit ? ' km/h' : ' mile/h') + ', Address: '
      } else {
        item['Content'] = 'Address: '
      }
    }
  },
  components: {
    'alarm-data': AlarmData
  }
}
</script>

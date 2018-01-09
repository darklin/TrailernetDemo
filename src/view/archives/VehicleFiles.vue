<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('contentSubtitle.archives.vehicleFiles')}}</div>
    <div class="search-box clearfix">
      <el-form :model="searchForm" class="search-form">
        <el-form-item :label="$t('common.organization')" class="fl">
          <el-select v-model="searchForm.orgIds" clearable placeholder="">
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
      <el-button :loading="isLoading" class="search-btn fl" icon="search" @click="searchHandle">{{$t('common.search')}}</el-button>
    </div>
    <div class="table-box">
      <el-button class="table-add-btn" @click="addHandle">{{$t('common.add')}}</el-button>
      <el-button class="table-del-btn" @click="deleteAllHandle">{{$t('common.delete')}}</el-button>
      <el-button class="table-import-btn" @click="importHandle">{{$t('excel.import')}}</el-button>
      <el-button class="table-export-btn" @click="exportHandle">{{$t('car.export')}}</el-button>
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
          prop="LicensePlate"
          align="center"
          :label="$t('car.carNo')"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="OrgName"
          align="center"
          :label="$t('common.organization')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="DeviceNO"
          align="center"
          :label="$t('car.deviceNo')"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="TrailerType"
          align="center"
          :label="$t('loca.carType')"
          min-width="130">
        </el-table-column>
        <el-table-column
          prop="VIN"
          align="center"
          :label="$t('car.VIN')"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="RatedLoad"
          align="center"
          :label="$t('car.maximumLoad')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="RegisteredTon"
          align="center"
          :label="$t('car.vehicleDeadweight')"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="TireNumber"
          align="center"
          :label="$t('car.wheelNumber')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="TyreSpec"
          align="center"
          :label="$t('car.tyreSpec')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="AxisNumber"
          align="center"
          :label="$t('car.axleNumber')"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="AxisDistance"
          align="center"
          :label="$t('sysmanage.axialDistance')"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="AxleBrand"
          align="center"
          :label="$t('sysmanage.axleBrand')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="AxleLoad"
          align="center"
          :label="$t('car.AxleLoad')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="TractionPinSpec"
          align="center"
          :label="$t('car.tractionPinSpecificate')"
          min-width="250">
        </el-table-column>
        <el-table-column
          prop="LegType"
          align="center"
          :label="$t('car.legType')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="ManufacturedDate"
          align="center"
          :label="$t('sysmanage.productDate')"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="Manufacturer"
          align="center"
          :label="$t('car.manufacturer')"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="ManufacturedLand"
          align="center"
          :label="$t('car.placeOfManufacture')"
          min-width="220">
        </el-table-column>
        <el-table-column
          prop="ProductionSequence"
          align="center"
          :label="$t('car.productNumber')"
          min-width="250">
        </el-table-column>
        <el-table-column
          prop="FrontSuspension"
          align="center"
          :label="$t('car.frontSuspension')"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="VericleAlias"
          align="center"
          :label="$t('car.vericleAlias')"
          min-width="150">
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          :label="$t('common.operate')"
          width="150">
          <template scope="scope">
            <!-- <i class="el-icon-edit" @click="editHandle(scope.row.CarID)"></i>&nbsp;&nbsp;
            <i class="el-icon-delete" @click="deleteHandle(scope.row.CarID)"></i>-->
            <el-button size="small" type="text" @click="editHandle(scope.row.CarID)">{{$t('common.edit')}}</el-button>
            <el-button size="small" type="text" @click="deleteHandle(scope.row.CarID)">{{$t('common.delete')}}</el-button>
          </template>
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
  </div>
</template>

<script>
export default {
  name: 'remind-detail',
  data () {
    return {
      // visible: false,
      // exportType: 1,
      zNodes: [],
      searchForm: {
        orgIds: '',
        licensePlate: '',
        deviceNo: '',
        page: 1,
        pagesize: 10
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
    // 获取车辆信息
    searchHandle () {
      this.$get({
        url: '/car',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.countData = data['Rows'] || []
          this.totalRecord = data['Total'] || 1
        }
      })
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
    // 新增车辆
    addHandle () {
      this.$router.push('addVehicle')
    },
    // 删除车辆
    deleteHandle (CarID) {
      this.$alert(this.$t('common.sureDelete') + '?', this.$t('common.gentlehint'), {
        showCancelButton: true,
        customClass: 'delete-warn-box',
        callback: action => {
          if (action === 'confirm') {
            this.$delete({
              url: '/car',
              data: {
                carID: CarID
              },
              success: data => {
                this.searchHandle()
              }
            })
          }
        }
      })
    },
    // 批量删除车辆信息
    deleteAllHandle () {
      let ids = ''
      this.multipleSelection.forEach(item => {
        ids = ids + item.CarID + ','
      })
      this.$alert(this.$t('common.sureDelete') + '?', this.$t('common.gentlehint'), {
        showCancelButton: true,
        customClass: 'delete-warn-box',
        callback: action => {
          if (action === 'confirm') {
            this.$delete({
              url: '/car/deleteAll',
              data: {'carIDs': ids},
              loading: true,
              success: data => {
                this.searchHandle()
              }
            })
          }
        }
      })
    },
    // 批量导入车辆
    importHandle () {
      this.$router.push('importVehicle')
    },
    // 导出车辆档案
    exportHandle () {
      window.location.href = `${this.$baseURL}car/exportExcel?${this.$serialize(this.searchForm)}`
    },
    // 编辑车辆
    editHandle (CarID) {
      this.$localStorage('editVehicle', CarID)
      this.$router.push('editVehicle')
    }
  }
}
</script>

<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('excel.carFile')}}</div>
    <div class="content-ctrl">
      <el-button class="table-normal-btn" @click="backHandle">{{$t('common.goback')}}</el-button>
    </div>
    <div class="content-form-box">
      <div class="content-form">
        <div class="content-form-title">{{$t('sys.baseInfoManage')}}</div>
        <el-form :inline="true" label-position="left" class="info-form-box" label-width="220px" :model="form" ref="form">
          <div class="info-form-item">
            <div class="info-form-title">{{$t('car.vehicleInformation')}}</div>
            <el-form-item :label="$t('sys.org') + ':'" prop="OrgID">
              <el-select v-model="form.OrgID" placeholder="">
                <el-option v-for="item,index in zNodes" :label="item.name" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('car.boxNo') + ':'" prop="BoxNo" >
              <el-input v-model="form.BoxNo"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.carNo') + ':'" prop="LicensePlate" :rules="{required: true, message: this.$t('car.carNo') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.LicensePlate"></el-input>
            </el-form-item>
            <el-form-item :label="$t('loca.carType') + ':'" prop="TrailerType" :rules="{required: true, message: this.$t('loca.carType') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.TrailerType"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.vericleAlias') + ':'" prop="VericleAlias" :rules="{required: true, message: this.$t('car.vericleAlias') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.VericleAlias"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.VIN') + ':'" prop="VIN" :rules="{required: true, message: this.$t('car.VIN') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.VIN"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.frontSuspension') + ':'" prop="FrontSuspension" :rules="{required: true, message: this.$t('car.frontSuspension') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.FrontSuspension"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.tyreSpec') + ':'" prop="TyreSpec" :rules="{required: true, message: this.$t('car.tyreSpec') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.TyreSpec"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.legType') + ':'" prop="LegType" :rules="{required: true, message: this.$t('car.legType') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.LegType"></el-input>
            </el-form-item>
          </div>
          <div class="info-form-item">
            <div class="info-form-title">{{$t('car.partInformation')}}</div>
            <el-form-item :label="$t('car.manufacturer') + ':'" prop="Manufacturer" :rules="{required: true, message: this.$t('car.manufacturer') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.Manufacturer"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.deviceNo') + ':'" prop="DeviceNO" :rules="{required: true, message: $t('car.deviceNo') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.DeviceNO"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.placeOfManufacture') + ':'" prop="ManufacturedLand" :rules="{required: true, message: this.$t('car.placeOfManufacture') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.ManufacturedLand"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.productNumber') + ':'" prop="ProductionSequence" :rules="{required: true, message: this.$t('car.productNumber') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.ProductionSequence"></el-input>
            </el-form-item>
            <el-form-item :label="$t('sysmanage.axialDistance') + ':'" prop="AxisDistance" :rules="{required: true, message: this.$t('sysmanage.axialDistance') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.AxisDistance"></el-input>
            </el-form-item>
            <el-form-item :label="$t('sysmanage.productDate') + ':'" prop="ManufacturedDate" :rules="{type: 'date', required: true, message: this.$t('sysmanage.productDate') + this.$t('common.beRequired'), trigger: 'change'}">
              <el-date-picker v-model="form.ManufacturedDate" ref="ManufacturedDate" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('car.rateLoad') + ':'" prop="RatedLoad" :rules="{type: 'number', required: true, message: this.$t('car.rateLoad') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model.number="form.RatedLoad"></el-input>
            </el-form-item>
          </div>
          <div class="info-form-item">
            <div class="info-form-title">{{$t('car.productionInformation')}}</div>
            <el-form-item :label="$t('car.equipmentManufacturer') + 'ID:'" prop="ManufacturerID" >
              <el-input v-model="form.ManufacturerID"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.registrationTonnage') + ':'" prop="RegisteredTon" >
              <el-input v-model="form.RegisteredTon"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.wheelNumber') + ':'" prop="TireNumber" >
              <el-input v-model="form.TireNumber"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.axleNumber') + ':'" prop="AxisNumber" >
              <el-input v-model="form.AxisNumber"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.tractionPinSpecificate') + ':'" prop="TractionPinSpec" >
              <el-input v-model="form.TractionPinSpec"></el-input>
            </el-form-item>
          </div>
          <div class="info-ctrl-btn">
            <el-button :loading="isLoading" class="info-confirm-btn"  @click="confirmHandle">{{$t('common.confirm')}}</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add-vehicle',
  data () {
    return {
      isLoading: false,
      zNodes: [],
      form: {
        OrgID: '',
        BoxNo: '',
        TrailerType: '',
        VericleAlias: '',
        VIN: '',
        FrontSuspension: '',
        TyreSpec: '',
        LegType: '',
        LicensePlate: '',
        Manufacturer: '',
        DeviceNO: '',
        ManufacturedLand: '',
        ProductionSequence: '',
        AxisDistance: '',
        ManufacturedDate: '',
        RatedLoad: '',
        ManufacturerID: '',
        RegisteredTon: '',
        TireNumber: '',
        AxisNumber: '',
        TractionPinSpec: ''
      }
    }
  },
  created () {
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
    // 返回处理
    backHandle () {
      this.$router.back()
    },
    // 提交表单处理
    confirmHandle () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form['ManufacturedDate'] = this.$refs['ManufacturedDate'].displayValue || ''
          this.$post({
            url: '/car',
            data: this.form,
            loading: true,
            success: data => {
              this.$router.push('vehicleFiles')
            }
          })
        }
      })
    }
  }
}
</script>

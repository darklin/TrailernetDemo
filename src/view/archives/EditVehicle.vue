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
            <el-form-item :label="$t('sys.org') + ':'" prop="orgID" >
              <el-select v-model.number="form.orgID" placeholder="">
                <el-option v-for="item,index in zNodes" :label="item.name" :value="Number(item.id)" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('car.carBrand') + ':'" prop="vehicleBrand" >
              <el-input v-model="form.vehicleBrand"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.carNo') + ':'" prop="licensePlate" :rules="{required: true, message: this.$t('car.carNo') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.licensePlate"></el-input>
            </el-form-item>
            <el-form-item :label="$t('loca.carType') + ':'" prop="trailerType" :rules="{required: true, message: this.$t('loca.carType') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.trailerType"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.vericleAlias') + ':'" prop="vericleAlias" :rules="{required: true, message: this.$t('car.vericleAlias') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.vericleAlias"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.VIN') + ':'" prop="vIN" :rules="{required: true, message: this.$t('car.VIN') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.vIN"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.frontSuspension') + ':'" prop="frontSuspension" :rules="{required: true, message: this.$t('car.frontSuspension') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.frontSuspension"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.tyreSpec') + ':'" prop="tyreSpec" :rules="{required: true, message: this.$t('car.tyreSpec') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.tyreSpec"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.legType') + ':'" prop="legType" :rules="{required: true, message: this.$t('car.legType') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.legType"></el-input>
            </el-form-item>
          </div>
          <div class="info-form-item">
            <div class="info-form-title">{{$t('car.partInformation')}}</div>
            <el-form-item :label="$t('car.manufacturer') + ':'" prop="manufacturer" :rules="{required: true, message: this.$t('car.manufacturer') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.manufacturer"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.deviceNo') + ':'" prop="deviceNO" :rules="{required: true, message: $t('car.deviceNo') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.deviceNO"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.placeOfManufacture') + ':'" prop="manufacturedLand" :rules="{required: true, message: this.$t('car.placeOfManufacture') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.manufacturedLand"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.productNumber') + ':'" prop="productionSequence" :rules="{required: true, message: this.$t('car.productNumber') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model="form.productionSequence"></el-input>
            </el-form-item>
            <el-form-item :label="$t('sysmanage.axialDistance') + ':'" prop="axisDistance" :rules="{type: 'number', required: true, message: this.$t('sysmanage.axialDistance') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model.number="form.axisDistance"></el-input>
            </el-form-item>
            <el-form-item :label="$t('sysmanage.productDate') + ':'" prop="manufacturedDate" :rules="{type: 'date', required: true, message: this.$t('sysmanage.productDate') + this.$t('common.beRequired'), trigger: 'change'}">
              <el-date-picker 
                v-model="form.manufacturedDate" 
                ref="manufacturedDate" 
                type="date">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('car.rateLoad') + ':'" prop="ratedLoad" :rules="{type: 'number', required: true, message: this.$t('car.rateLoad') + this.$t('common.beRequired'), trigger: 'blur'}">
              <el-input v-model.number="form.ratedLoad"></el-input>
            </el-form-item>
          </div>
          <div class="info-form-item">
            <div class="info-form-title">{{$t('car.productionInformation')}}</div>
            <el-form-item :label="$t('car.equipmentManufacturer') + 'ID:'" prop="manufacturerID" >
              <el-input v-model="form.manufacturerID"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.registrationTonnage') + ':'" prop="registeredTon" >
              <el-input v-model="form.registeredTon"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.wheelNumber') + ':'" prop="tireNumber" >
              <el-input v-model="form.tireNumber"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.axleNumber') + ':'" prop="axisNumber" >
              <el-input v-model="form.axisNumber"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.tractionPinSpecificate') + ':'" prop="tractionPinSpec" >
              <el-input v-model="form.tractionPinSpec"></el-input>
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
  name: 'edit-vehicle',
  data () {
    let carID = this.$localStorage('editVehicle') || ''
    return {
      carID: carID,
      isLoading: false,
      zNodes: [],
      ScrapStates: {
      },
      form: {
        carID: '',
        orgID: '',
        orgName: '',
        vehicleBrand: '',
        licensePlate: '',
        manufacturer: '',
        vericleAlias: '',
        vIN: '',
        frontSuspension: '',
        tyreSpec: '',
        legType: '',
        deviceNO: '',
        trailerType: '',
        manufacturedLand: '',
        simCode: '',
        productionSequence: '',
        axisDistance: '',
        manufacturedDate: '',
        ratedLoad: '',
        manufacturerID: '',
        registeredTon: '',
        tireNumber: '',
        axisNumber: '',
        tractionPinSpec: ''
      }
    }
  },
  created () {
    this.getVihicle()
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
    // 车辆档案基本信息
    getVihicle () {
      this.$get({
        url: '/car/singleCar',
        data: {carID: this.carID},
        success: data => {
          let info = data['info'] || {}
          this.form = info['car'] || {}
          let car = info['car'] || {}
          let manufacturedDate = car['manufacturedDate']
          this.form['manufacturedDate'] = manufacturedDate ? new Date(manufacturedDate) : new Date()
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
          this.form['manufacturedDate'] = this.$refs['manufacturedDate'].displayValue
          this.$put({
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

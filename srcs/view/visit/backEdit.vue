<template>
  <div class="content-box">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>上门客户</el-breadcrumb-item>
      <el-breadcrumb-item>新客户</el-breadcrumb-item>
      <el-breadcrumb-item>基本信息详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="info-box">
      <el-tabs v-model="activePane" type="card">
        <el-tab-pane label="录单基本信息处理" name="first" class="write-info-box inner-box">
          <div class="clearfix">
            <div class="write-info-col fl">
              <el-form ref="applyForm" :model="applyForm" label-width="100px" class="write-info-form">
                <div class="item-title"><span class="item-title-text">申请信息</span></div>
                <el-form-item label="申请人城市">
                  <el-input v-model="applyForm.applicantCity" disabled></el-input>
                </el-form-item>
                <el-form-item label="申请金额" prop="applicatSum" :rules="{ required: true, message: '请输入申请金额', trigger: 'blur' }">
                  <el-input v-model="applyForm.applicatSum" placeholder="请输入申请金额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="申请期限" prop="applicatlimit" :rules="{ required: true, message: '请输入申请期限', trigger: 'blur' }">
                  <el-input v-model="applyForm.applicatlimit" placeholder="请输入申请期限">
                    <template slot="append">个月</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="贷款用途" prop="loanUse" :rules="{ required: true, message: '请输入贷款用途', trigger: 'blur' }">
                  <el-input v-model="applyForm.loanUse" placeholder="请输入贷款用途"></el-input>
                </el-form-item>
                <el-form-item label="家庭是否知悉此项贷款" label-width="168px" prop="flag" :rules="{ required: true, message: '请选择是否知悉', trigger: 'blur' }">
                  <el-radio-group v-model="applyForm.flag">
                    <el-radio :label="0">是</el-radio>
                    <el-radio :label="1">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <el-form ref="custForm" :model="custForm" label-width="100px" class="write-info-form">
                <div class="item-title"><span class="item-title-text">个人资料</span></div>
                <el-form-item label="姓名" prop="name" :rules="{ required: true, message: '请输入姓名', trigger: 'blur' }">
                  <el-input v-model="custForm.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex" :rules="{ required: true, message: '请选择性别', trigger: 'blur' }">
                  <el-radio-group v-model="custForm.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="0">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile" :rules="{ required: true, message: '请输入手机号码', trigger: 'blur' }">
                  <el-input v-model="custForm.mobile" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="age" :rules="{ required: true, message: '请输入年龄', trigger: 'blur' }">
                  <el-input v-model="custForm.age" placeholder="请输入年龄"></el-input>
                </el-form-item>
                <el-form-item label="婚姻状况" prop="weddStatus" :rules="{ required: true, message: '请选择婚姻状况', trigger: 'blur' }">
                  <el-radio-group v-model="custForm.weddStatus">
                    <el-radio :label="0">未婚</el-radio>
                    <el-radio :label="1">已婚</el-radio>
                    <el-radio :label="2">离婚</el-radio>
                    <el-radio :label="3">分居</el-radio>
                    <el-radio :label="4">丧偶</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="身份证号" prop="cardNo" :rules="{ required: true, message: '请输入身份证号', trigger: 'blur' }">
                  <el-input v-model="custForm.cardNo" placeholder="请输入身份证号"></el-input>
                </el-form-item>
                <el-form-item label="社保号" prop="socialNo" :rules="{ required: true, message: '请输入社保号', trigger: 'blur' }">
                  <el-input v-model="custForm.socialNo" placeholder="请输入社保号"></el-input>
                </el-form-item>
                <el-form-item label="籍贯" prop="nativePlace" :rules="{ required: true, message: '请输入籍贯', trigger: 'blur' }">
                  <el-input v-model="custForm.nativePlace" placeholder="请输入籍贯"></el-input>
                </el-form-item>
                <el-form-item label="现住地" prop="address" :rules="{ required: true, message: '请输入现住地', trigger: 'blur' }">
                  <el-input v-model="custForm.address" placeholder="请输入现住地"></el-input>
                </el-form-item>
                <el-form-item label="住宅类型" prop="houseType" :rules="{ required: true, message: '请选择住宅类型', trigger: 'blur' }">
                  <el-radio-group v-model="custForm.houseType">
                    <el-radio :label="0">自购</el-radio>
                    <el-radio :label="1">家庭拥有</el-radio>
                    <el-radio :label="2">宿舍</el-radio>
                    <el-radio :label="3">租用</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="租用金额" v-if="custForm.houseType === 3" prop="rentMoney" :rules="{ required: true, message: '请输入租用金额', trigger: 'blur' }">
                  <el-input v-model="custForm.rentMoney" placeholder="请输入租用金额"></el-input>
                </el-form-item>
                <el-form-item label="居住开始时间" prop="liveDate" required label-width="110px">
                  <el-date-picker
                    ref="custLiveDate"
                    v-model="custForm.liveDate"
                    type="date"
                    placeholder="请选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="电邮/QQ">
                  <el-input v-model="custForm.email" placeholder="请输入电邮/QQ"></el-input>
                </el-form-item>
                <el-form-item label="学历" prop="education" :rules="{ required: true, message: '请输入学历', trigger: 'blur' }">
                  <el-input v-model="custForm.education" placeholder="请输入学历"></el-input>
                </el-form-item>
                <el-form-item label="毕业学校">
                  <el-input v-model="custForm.graSchool" placeholder="请输入毕业学校"></el-input>
                </el-form-item>
                <el-form-item label="毕业年份">
                  <el-input v-model="custForm.graYear" placeholder="请输入毕业年份"></el-input>
                </el-form-item>
              </el-form>
              <el-form ref="companyForm" :model="companyForm" label-width="100px" class="write-info-form">
                <div class="item-title"><span class="item-title-text">公司信息</span></div>
                <el-form-item label="公司全称">
                  <el-input v-model="companyForm.compName" placeholder="请输入公司全称"></el-input>
                </el-form-item>
                <el-form-item label="公司地址">
                  <el-input v-model="companyForm.address" placeholder="请输入公司地址"></el-input>
                </el-form-item>
                <el-form-item label="工作年限">
                  <el-input v-model="companyForm.jobLimit" placeholder="请输入工作年限"></el-input>
                </el-form-item>
                <el-form-item label="公司电话">
                  <el-input v-model="companyForm.telephone" placeholder="请输入公司电话"></el-input>
                </el-form-item>
                <el-form-item label="工作职位">
                  <el-input v-model="companyForm.position" placeholder="请输入工作职位"></el-input>
                </el-form-item>
                <el-form-item label="所属行业">
                  <el-input v-model="companyForm.profession" placeholder="请输入所属行业"></el-input>
                </el-form-item>
                <el-form-item label="是否企业主">
                  <el-radio-group v-model="companyForm.flag">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">个体户</el-radio>
                    <el-radio :label="2">企业主</el-radio>
                  </el-radio-group>
                </el-form-item>
                <template v-if="companyForm.flag === 2">
                  <el-form-item label="经营场所">
                    <el-radio-group v-model="companyForm.operatePlace">
                      <el-radio :label="0">自有</el-radio>
                      <el-radio :label="1">租用</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <template v-if="companyForm.operatePlace === 1">
                    <el-form-item label="租金">
                      <el-input v-model="companyForm.rentMoney" placeholder="请输入租金" class="small-input"></el-input>
                      <el-radio-group v-model="companyForm.rentType" class="small-radio">
                        <el-radio :label="1">月</el-radio>
                        <el-radio :label="2">季</el-radio>
                        <el-radio :label="3">年</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </template>
                  <el-form-item label="企业类型">
                    <el-radio-group v-model="companyForm.companyType">
                      <el-radio :label="0">独资</el-radio>
                      <el-radio :label="1">合资</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="占股比例" v-if="companyForm.companyType === 1">
                    <el-input v-model="companyForm.proportion" placeholder="请输入占股比例">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="员工人数">
                    <el-input v-model="companyForm.employeeNum" placeholder="请输入员工人数">
                      <template slot="append">人</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="年营业额">
                    <el-input v-model="companyForm.businessSum" placeholder="请输入年营业额">
                      <template slot="append">万</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-form>
            </div>
            <div class="write-info-col fl">
              <el-form ref="estateForm" :model="estateForm" label-width="100px" class="write-info-form">
                <div class="item-title"><span class="item-title-text">房产资料</span></div>
                <el-form-item label="房产地址">
                  <el-input v-model="estateForm.address" placeholder="请输入房产地址"></el-input>
                </el-form-item>
                <el-form-item label="建筑年份">
                  <el-input v-model="estateForm.buildyear" placeholder="请输入建筑年份"></el-input>
                </el-form-item>
                <el-form-item label="购买日期">
                  <el-date-picker
                    ref="estateBuyDate"
                    v-model="estateForm.buyDate"
                    type="date"
                    placeholder="请选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="建筑面积">
                  <el-input v-model="estateForm.area" placeholder="请输入建筑面积">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="购买价格">
                  <el-input v-model="estateForm.buyPrice" placeholder="请输入购买价格">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="购买方式">
                  <el-radio-group v-model="estateForm.buyType">
                    <el-radio :label="1">全款</el-radio>
                    <el-radio :label="2">贷款</el-radio>
                    <el-radio :label="3">合资</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="所占份额" v-if="estateForm.buyType === 3">
                  <el-input v-model="estateForm.ownPercent" placeholder="请输入所占份额"></el-input>
                </el-form-item>
                <template v-if="estateForm.buyType === 2">
                  <el-form-item label="每月供款">
                    <el-input v-model="estateForm.monSupply" placeholder="请输入每月供款">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="按揭银行">
                    <el-input v-model="estateForm.bankCode" placeholder="请输入按揭银行"></el-input>
                  </el-form-item>
                  <el-form-item label="贷款年限">
                    <el-input v-model="estateForm.loanLimit" placeholder="请输入贷款年限">
                      <template slot="append">年</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="贷款余额">
                    <el-input v-model="estateForm.loanOver" placeholder="请输入贷款余额">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="贷款总额">
                    <el-input v-model="estateForm.loanTotal" placeholder="请输入贷款总额">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-form>
              <el-form ref="carForm" :model="carForm" label-width="100px" class="write-info-form">
                <div class="item-title"><span class="item-title-text">车产资料</span></div>
                <el-form-item label="品牌">
                  <el-input v-model="carForm.brand" placeholder="请输入品牌"></el-input>
                </el-form-item>
                <el-form-item label="型号">
                  <el-input v-model="carForm.type" placeholder="请输入型号"></el-input>
                </el-form-item>
                <el-form-item label="车牌号码">
                  <el-input v-model="carForm.carNo" placeholder="请输入车牌号码"></el-input>
                </el-form-item>
                <el-form-item label="购买年月">
                  <el-date-picker
                    ref="carBuyYearMon"
                    v-model="carForm.buyYearMon"
                    type="date"
                    placeholder="请选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="购买金额">
                  <el-input v-model="carForm.buyPrice" placeholder="请输入购买金额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="购入方式">
                  <el-radio-group v-model="carForm.buyType">
                    <el-radio :label="1">全款</el-radio>
                    <el-radio :label="2">贷款</el-radio>
                    <el-radio :label="3">合资</el-radio>
                  </el-radio-group>
                </el-form-item>
                <template v-if="carForm.buyType === 2">
                  <el-form-item label="每月供款">
                    <el-input v-model="carForm.monSupply" placeholder="请输入每月供款">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="贷款总额">
                    <el-input v-model="carForm.loanTotal" placeholder="请输入贷款总额">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-form>
              <el-form ref="spouseForm" :model="spouseForm" label-width="100px" class="write-info-form">
                <div class="item-title"><span class="item-title-text">配偶资料</span></div>
                <el-form-item label="姓名">
                  <el-input v-model="spouseForm.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                  <el-input v-model="spouseForm.mobile" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="身份证号">
                  <el-input v-model="spouseForm.cardNo" placeholder="请输入身份证号"></el-input>
                </el-form-item>
                <el-form-item label="是否知晓贷款">
                  <el-radio-group v-model="spouseForm.flag">
                    <el-radio :label="0">是</el-radio>
                    <el-radio :label="1">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="单位名称">
                  <el-input v-model="spouseForm.unitName" placeholder="请输入单位名称"></el-input>
                </el-form-item>
                <el-form-item label="单位地址">
                  <el-input v-model="spouseForm.address" placeholder="请输入单位地址"></el-input>
                </el-form-item>
                <el-form-item label="工作部门">
                  <el-input v-model="spouseForm.department" placeholder="请输入工作部门"></el-input>
                </el-form-item>
                <el-form-item label="工作职位">
                  <el-input v-model="spouseForm.position" placeholder="请输入工作职位"></el-input>
                </el-form-item>
                <el-form-item label="月收入">
                  <el-input v-model="spouseForm.salary" placeholder="请输入月收入">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="单位电话">
                  <el-input v-model="spouseForm.telephone" placeholder="请输入单位电话"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="write-info-col fl">
              <el-form ref="assertsForm" :model="assertsForm" label-width="100px" class="write-info-form">
                <div class="item-title"><span class="item-title-text">个人资产及负债情况</span></div>
                <el-form-item label="固定月收入金额（税后）" label-width="180px" prop="income" :rules="{ required: true, message: '请输入固定月收入金额', trigger: 'blur' }">
                  <el-input v-model="assertsForm.income" placeholder="请输入金额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="其他收入金额（税后）" label-width="180px" prop="otherIncome" :rules="{ required: true, message: '请输入其他收入金额', trigger: 'blur' }">
                  <el-input v-model="assertsForm.otherIncome" placeholder="请输入金额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label-width="20px">
                  <el-checkbox-group v-model="assertsForm.otherType">
                    <el-checkbox label="0" name="type">奖金</el-checkbox>
                    <el-checkbox label="1" name="type">租金</el-checkbox>
                    <el-checkbox label="2" name="type">利息</el-checkbox>
                    <el-checkbox label="3" name="type">其他</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <div class="write-subitem write-subitem-bg">
                  <div class="write-subtitle">抵押贷款:</div>
                  <div class="write-subtype clearfix">
                    <div class="write-subtext">房产贷款:</div>
                    <el-form-item label="数量" class="fl" label-width="45px" prop="houloanNum" :rules="{ required: true, message: '请输入数量', trigger: 'blur' }">
                      <el-input v-model="assertsForm.houloanNum" placeholder="输入"></el-input>
                    </el-form-item>
                    <el-form-item label="月供" class="fl" label-width="45px" prop="houloanMonSup" :rules="{ required: true, message: '请输入月供', trigger: 'blur' }">
                      <el-input v-model="assertsForm.houloanMonSup" placeholder="输入">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="总贷款余额" class="fl" label-width="90px" prop="houloanToOver" :rules="{ required: true, message: '请输入总贷款余额', trigger: 'blur' }">
                      <el-input v-model="assertsForm.houloanToOver" placeholder="输入">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="write-subtype clearfix">
                    <div class="write-subtext">车产贷款:</div>
                    <el-form-item label="数量" class="fl" label-width="45px" prop="carloanNum" :rules="{ required: true, message: '请输入数量', trigger: 'blur' }">
                      <el-input v-model="assertsForm.carloanNum" placeholder="输入"></el-input>
                    </el-form-item>
                    <el-form-item label="月供" class="fl" label-width="45px" prop="carloanMonSup" :rules="{ required: true, message: '请输入月供', trigger: 'blur' }">
                      <el-input v-model="assertsForm.carloanMonSup" placeholder="输入">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="总贷款余额" class="fl" label-width="90px" prop="carloanToOver" :rules="{ required: true, message: '请输入总贷款余额', trigger: 'blur' }">
                      <el-input v-model="assertsForm.carloanToOver" placeholder="输入">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="write-subtype clearfix">
                    <div class="write-subtext">其他贷款:</div>
                    <el-form-item label="数量" class="fl" label-width="45px" prop="othloanNum" :rules="{ required: true, message: '请输入数量', trigger: 'blur' }">
                      <el-input v-model="assertsForm.othloanNum" placeholder="输入"></el-input>
                    </el-form-item>
                    <el-form-item label="月供" class="fl" label-width="45px" prop="othloanMonSup" :rules="{ required: true, message: '请输入月供', trigger: 'blur' }">
                      <el-input v-model="assertsForm.othloanMonSup" placeholder="输入">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="总贷款余额" class="fl" label-width="90px" prop="othloanToOver" :rules="{ required: true, message: '请输入总贷款余额', trigger: 'blur' }">
                      <el-input v-model="assertsForm.othloanToOver" placeholder="输入">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="write-subitem">
                  <div class="write-subtype clearfix">
                    <div class="write-subtext">无抵押贷款:</div>
                    <el-form-item label="数量" class="fl" label-width="45px" prop="unloanNum" :rules="{ required: true, message: '请输入数量', trigger: 'blur' }">
                      <el-input v-model="assertsForm.unloanNum" placeholder="输入"></el-input>
                    </el-form-item>
                    <el-form-item label="月供" class="fl" label-width="45px" prop="unloanMonSup" :rules="{ required: true, message: '请输入月供', trigger: 'blur' }">
                      <el-input v-model="assertsForm.unloanMonSup" placeholder="输入">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="总贷款余额" class="fl" label-width="90px" prop="unloanToOver" :rules="{ required: true, message: '请输入总贷款余额', trigger: 'blur' }">
                      <el-input v-model="assertsForm.unloanToOver" placeholder="输入">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="write-subitem">
                  <div class="write-subtype clearfix">
                    <div class="write-subtext">信用卡:</div>
                    <el-form-item label="数量" class="fl" label-width="45px" prop="creCardNum" :rules="{ required: true, message: '请输入数量', trigger: 'blur' }">
                      <el-input v-model="assertsForm.creCardNum" placeholder="输入"></el-input>
                    </el-form-item>
                    <el-form-item label="月供" class="fl" label-width="45px" prop="creCardMonSup" :rules="{ required: true, message: '请输入月供', trigger: 'blur' }">
                      <el-input v-model="assertsForm.creCardMonSup" placeholder="输入">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="总额度" class="fl" label-width="60px" prop="creCardToAmo" :rules="{ required: true, message: '请输入总额度', trigger: 'blur' }">
                      <el-input v-model="assertsForm.creCardToAmo" placeholder="输入">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
              <div class="write-info-form">
                <el-form ref="contactForm1" :model="contactForm1" label-width="100px">
                  <div class="item-title"><span class="item-title-text">联系人</span></div>
                  <div class="write-subitem write-subitem-bg">
                    <div class="write-subtitle">直系亲属:</div>
                    <div class="write-subcate">
                      <div class="clearfix">
                        <el-form-item label="姓名" class="fl" label-width="60px" prop="name" :rules="{ required: true, message: '请输入姓名', trigger: 'blur' }">
                          <el-input v-model="contactForm1.name" placeholder="输入" class="write-subinput"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" class="fl" label-width="70px" prop="mobile" :rules="{ required: true, message: '请输入手机号', trigger: 'blur' }">
                          <el-input v-model="contactForm1.mobile" placeholder="输入" class="write-subinput"></el-input>
                        </el-form-item>
                        <el-form-item label="关系" class="fl" label-width="60px" prop="relation" :rules="{ required: true, message: '请输入关系', trigger: 'blur' }">
                          <el-input v-model="contactForm1.relation" placeholder="输入" class="write-subinput"></el-input>
                        </el-form-item>
                        <el-form-item label="年龄" class="fl" label-width="70px">
                          <el-input v-model="contactForm1.age" placeholder="输入" class="write-subinput"></el-input>
                        </el-form-item>
                      </div>
                      <el-form-item label="单位" label-width="50px">
                        <el-input v-model="contactForm1.unitName" placeholder="请输入年龄"></el-input>
                      </el-form-item>
                      <el-form-item label="职位" label-width="50px">
                        <el-input v-model="contactForm1.position" placeholder="请输入职务"></el-input>
                      </el-form-item>
                      <el-form-item label="是否知晓贷款">
                        <el-radio-group v-model="contactForm1.flag">
                          <el-radio :label="0">是</el-radio>
                          <el-radio :label="1">否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </div>
                  </div>
                </el-form>
                <el-form ref="contactForm2" :model="contactForm2" label-width="100px">
                  <div class="write-subitem write-subitem-bg">
                    <div class="write-subtitle">同事或朋友:</div>
                    <div class="write-subcate clearfix">
                      <div class="clearfix">
                        <el-form-item label="姓名" class="fl" label-width="60px" prop="name" :rules="{ required: true, message: '请输入姓名', trigger: 'blur' }">
                          <el-input v-model="contactForm2.name" placeholder="输入" class="write-subinput"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" class="fl" label-width="70px" prop="mobile" :rules="{ required: true, message: '请输入手机号', trigger: 'blur' }">
                          <el-input v-model="contactForm2.mobile" placeholder="输入" class="write-subinput"></el-input>
                        </el-form-item>
                        <el-form-item label="关系" class="fl" label-width="60px" prop="relation" :rules="{ required: true, message: '请输入关系', trigger: 'blur' }">
                          <el-input v-model="contactForm2.relation" placeholder="输入" class="write-subinput"></el-input>
                        </el-form-item>
                        <el-form-item label="年龄" class="fl" label-width="70px">
                          <el-input v-model="contactForm2.age" placeholder="输入" class="write-subinput"></el-input>
                        </el-form-item>
                      </div>
                      <el-form-item label="单位" label-width="50px">
                        <el-input v-model="contactForm2.unitName" placeholder="请输入年龄"></el-input>
                      </el-form-item>
                      <el-form-item label="职位" label-width="50px">
                        <el-input v-model="contactForm2.position" placeholder="请输入职务"></el-input>
                      </el-form-item>
                      <el-form-item label="是否知晓贷款">
                        <el-radio-group v-model="contactForm2.flag">
                          <el-radio :label="0">是</el-radio>
                          <el-radio :label="1">否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </div>
                  </div>
                </el-form>
                <el-form ref="contactForm3" :model="contactForm3" label-width="100px">
                  <div class="write-subitem write-subitem-bg">
                    <div class="write-subtitle">同事或朋友:</div>
                    <div class="write-subcate clearfix">
                      <div class="clearfix">
                        <el-form-item label="姓名" class="fl" label-width="60px" prop="name" :rules="{ required: true, message: '请输入姓名', trigger: 'blur' }">
                          <el-input v-model="contactForm3.name" placeholder="输入" class="write-subinput"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" class="fl" label-width="70px" prop="mobile" :rules="{ required: true, message: '请输入手机号', trigger: 'blur' }">
                          <el-input v-model="contactForm3.mobile" placeholder="输入" class="write-subinput"></el-input>
                        </el-form-item>
                        <el-form-item label="关系" class="fl" label-width="60px" prop="relation" :rules="{ required: true, message: '请输入关系', trigger: 'blur' }">
                          <el-input v-model="contactForm3.relation" placeholder="输入" class="write-subinput"></el-input>
                        </el-form-item>
                        <el-form-item label="年龄" class="fl" label-width="70px">
                          <el-input v-model="contactForm3.age" placeholder="输入" class="write-subinput"></el-input>
                        </el-form-item>
                      </div>
                      <el-form-item label="单位" label-width="50px">
                        <el-input v-model="contactForm3.unitName" placeholder="请输入年龄"></el-input>
                      </el-form-item>
                      <el-form-item label="职位" label-width="50px">
                        <el-input v-model="contactForm3.position" placeholder="请输入职务"></el-input>
                      </el-form-item>
                      <el-form-item label="是否知晓贷款">
                        <el-radio-group v-model="contactForm3.flag">
                          <el-radio :label="0">是</el-radio>
                          <el-radio :label="1">否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </div>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
          <el-button class="info-btn" :loading="isLoading" @click="saveHandle">下一步</el-button>
        </el-tab-pane>
        <el-tab-pane label="上传资料" name="second" class="upload-info-box">
          <div class="upload-info clearfix" v-if="!isShowInfo">
            <div class="upload-info-item fl" :class="fileInfo['zhengxin'].count && 'active'" @click="showInfoHandle('credit')">征信资料</div>
            <div class="upload-info-item fl" :class="fileInfo['shenfenzheng'].count && 'active'" @click="showInfoHandle('card')">身份证</div>
            <div class="upload-info-item fl" :class="fileInfo['shouruzhengming'].count && 'active'" @click="showInfoHandle('income')">收入证明</div>
            <div class="upload-info-item fl" :class="fileInfo['gongzuozhengming'].count && 'active'" @click="showInfoHandle('job')">工作证明</div>
            <div class="upload-info-item upload-apply fr" :class="fileInfo['shenqingbiao'].count && 'active'" @click="showInfoHandle('apply')">申请表</div>
            <div class="upload-info-item fl" :class="fileInfo['juzhuzhengming'].count && 'active'" @click="showInfoHandle('live')">居住证明</div>
            <div class="upload-info-item fl" :class="fileInfo['fangchanziliao'].count && 'active'" @click="showInfoHandle('house')">房产资料</div>
            <div class="upload-info-item fl" :class="fileInfo['baodan'].count && 'active'" @click="showInfoHandle('policy')">保单资料</div>
            <div class="upload-info-item fl" :class="fileInfo['gongsiziliao'].count && 'active'" @click="showInfoHandle('compony')">公司资料</div>
            <div class="upload-info-item upload-social fl" :class="fileInfo['shebao'].count && 'active'" @click="showInfoHandle('social')">社保公积金资料</div>
            <div class="upload-info-item fl" :class="fileInfo['cheliang'].count && 'active'" @click="showInfoHandle('car')">车辆资料</div>
            <div class="upload-info-item fl" :class="fileInfo['qita'].count && 'active'" @click="showInfoHandle('other')">其他资料</div>
            <div class="upload-info-item fl" :class="fileInfo['buchongziliao'].count && 'active'" @click="showInfoHandle('extra')">补充资料</div>
            <el-button class="info-btn" @click="checkHandle">审核</el-button>
          </div>
          <div v-else>
            <div class="l-info-upload">
              <div class="device-wrap">
                <canvas id="myCanvas" v-show=""></canvas>
                <div class="device-title">{{infoTypes[infoType]}}-资料拍摄预览</div>
                <object id="show" classid="clsid:E77E4CC8-E879-4A72-850A-B824742EC5B7" width="500" height="350"></object>
              </div>
              <div class="upload-wrap">
                <div class="upload-item clearfix" v-for="(curItem, index1) in fileArr">
                  <div class="img-item" v-for="(curFile, index2) in curItem.files">
                    <span class="close" @click="delPhoto(index1, index2, curFile.fileId)"></span>
                    <img :src="curFile.path+'&signId='+signId" alt="图片上传">
                  </div>
                  <div class="upload-area" @click="ToPhoto(index1)">
                    <i class="el-icon-plus"></i>
                    <span class="text">{{curItem.materialName}}</span>
                  </div>
                </div>
              </div>
              <el-button class="info-btn" @click="hideInfoHandle">返回</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'back-edit',
  data () {
    let customerId = this.$route.params[0]
    let signId = this.$sessionStorage('signId')
    return {
      activePane: 'first',
      customerId: customerId,
      signId: signId,
      applyForm: {
        applicantCity: '',
        applicatSum: '',
        applicatlimit: '',
        loanUse: '',
        flag: ''
      },
      custForm: {
        name: '',
        sex: '',
        mobile: '',
        age: '',
        weddStatus: '',
        cardNo: '',
        socialNo: '',
        nativePlace: '',
        address: '',
        houseType: '',
        rentMoney: '',
        liveDate: '',
        email: '',
        education: '',
        graSchool: '',
        graYear: ''
      },
      spouseForm: {
        name: '',
        mobile: '',
        cardNo: '',
        flag: '',
        unitName: '',
        address: '',
        department: '',
        position: '',
        salary: '',
        telephone: ''
      },
      companyForm: {
        compName: '',
        address: '',
        jobLimit: '',
        telephone: '',
        position: '',
        profession: '',
        flag: '',
        operatePlace: '',
        rentMoney: '',
        rentType: '',
        companyType: '',
        proportion: '',
        employeeNum: '',
        businessSum: ''
      },
      estateForm: {
        address: '',
        buyType: '',
        ownPercent: '',
        buildyear: '',
        buyDate: '',
        area: '',
        buyPrice: '',
        monSupply: '',
        bankCode: '',
        loanLimit: '',
        loanOver: '',
        loanTotal: ''
      },
      carForm: {
        brand: '',
        type: '',
        buyPrice: '',
        carNo: '',
        buyYearMon: '',
        buyType: '',
        monSupply: '',
        loanTotal: ''
      },
      assertsForm: {
        income: '',
        otherIncome: '',
        otherType: [],
        houloanNum: '',
        houloanMonSup: '',
        houloanToOver: '',
        carloanNum: '',
        carloanMonSup: '',
        carloanToOver: '',
        othloanNum: '',
        othloanMonSup: '',
        othloanToOver: '',
        unloanNum: '',
        unloanMonSup: '',
        unloanToOver: '',
        creCardNum: '',
        creCardMonSup: '',
        creCardToAmo: ''
      },
      contactForm1: {
        name: '',
        mobile: '',
        relation: '',
        age: '',
        unitName: '',
        position: '',
        flag: ''
      },
      contactForm2: {
        name: '',
        mobile: '',
        relation: '',
        age: '',
        unitName: '',
        position: '',
        flag: ''
      },
      contactForm3: {
        name: '',
        mobile: '',
        relation: '',
        age: '',
        unitName: '',
        position: '',
        flag: ''
      },
      isLoading: false,
      isShowInfo: false,
      fileInfo: {
        'zhengxin': {},
        'shenfenzheng': {},
        'shouruzhengming': {},
        'gongzuozhengming': {},
        'shenqingbiao': {},
        'juzhuzhengming': {},
        'fangchanziliao': {},
        'baodan': {},
        'gongsiziliao': {},
        'shebao': {},
        'cheliang': {},
        'qita': {},
        'buchongziliao': {}
      },
      infoTypes: {
        'credit': '征信资料',
        'card': '身份证',
        'income': '收入证明',
        'job': '工作证明',
        'apply': '申请表',
        'live': '居住证明',
        'house': '房产资料',
        'policy': '保单资料',
        'compony': '公司资料',
        'social': '社保公积金资料',
        'car': '车辆资料',
        'other': '其他资料',
        'extra': '补充资料'
      },
      infoType: '',
      fileWord: {
        'credit': 'zhengxin',
        'card': 'shenfenzheng',
        'income': 'shouruzhengming',
        'job': 'gongzuozhengming',
        'apply': 'shenqingbiao',
        'live': 'juzhuzhengming',
        'house': 'fangchanziliao',
        'policy': 'baodan',
        'compony': 'gongsiziliao',
        'social': 'shebao',
        'car': 'cheliang',
        'other': 'qita',
        'extra': 'buchongziliao'
      }
    }
  },
  created () {
    let customerId = this.customerId
    // 获取录单基本信息
    this.$ajax({
      url: '/account/visit/application/queryBasicInfo',
      data: {
        customerId: customerId
      },
      success: data => {
        let attr = data.attr || {}
        let applicationInfo = attr['applicationInfo'] || {}
        let custInfo = attr['custInfo'] || {}
        let spouseInfo = attr['spouseInfo'] || {}
        let companyInfo = attr['companyInfo'] || {}
        let estateInfo = attr['estateInfo'] || {}
        let carInfo = attr['carInfo'] || {}
        let assertsDebtInfo = attr['assertsDebtInfo'] || {}
        let contactInfo = attr['contactInfo'] || []
        let contactInfo1 = contactInfo[0] || {}
        let contactInfo2 = contactInfo[1] || {}
        let contactInfo3 = contactInfo[2] || {}
        for (let key in applicationInfo) {
          this.applyForm[key] = applicationInfo[key]
        }
        for (let key in custInfo) {
          this.custForm[key] = custInfo[key]
        }
        for (let key in spouseInfo) {
          this.spouseForm[key] = spouseInfo[key]
        }
        for (let key in companyInfo) {
          this.companyForm[key] = companyInfo[key]
        }
        for (let key in estateInfo) {
          this.estateForm[key] = estateInfo[key]
        }
        for (let key in carInfo) {
          this.carForm[key] = carInfo[key]
        }
        for (let key in assertsDebtInfo) {
          this.assertsForm[key] = assertsDebtInfo[key]
        }
        for (let key in contactInfo1) {
          this.contactForm1[key] = contactInfo1[key]
        }
        for (let key in contactInfo2) {
          this.contactForm2[key] = contactInfo2[key]
        }
        for (let key in contactInfo3) {
          this.contactForm3[key] = contactInfo3[key]
        }
      }
    })
    // 获取大类资料
    this.getMaterialGroup()
  },
  methods: {
    // 获取大类资料
    getMaterialGroup () {
      this.$ajax({
        url: '/account/visit/material/querymaterialGroup',
        data: {
          customerId: this.customerId
        },
        success: data => {
          let fileInfo = data.rows[0] || {}
          this.fileInfo = {
            'zhengxin': fileInfo['zhengxin'] || {},
            'shenfenzheng': fileInfo['shenfenzheng'] || {},
            'shouruzhengming': fileInfo['shouruzhengming'] || {},
            'gongzuozhengming': fileInfo['gongzuozhengming'] || {},
            'shenqingbiao': fileInfo['shenqingbiao'] || {},
            'juzhuzhengming': fileInfo['juzhuzhengming'] || {},
            'fangchanziliao': fileInfo['fangchanziliao'] || {},
            'baodan': fileInfo['baodan'] || {},
            'gongsiziliao': fileInfo['gongsiziliao'] || {},
            'shebao': fileInfo['shebao'] || {},
            'cheliang': fileInfo['cheliang'] || {},
            'qita': fileInfo['qita'] || {},
            'buchongziliao': fileInfo['buchongziliao'] || {}
          }
        }
      })
    },
    // 保存资料处理
    saveHandle () {
      // 转化时间格式
      this.custForm['liveDate'] = this.$refs['custLiveDate'].displayValue
      this.estateForm['buyDate'] = this.$refs['estateBuyDate'].displayValue
      this.carForm['buyYearMon'] = this.$refs['carBuyYearMon'].displayValue
      let contactForm = [this.contactForm1, this.contactForm2, this.contactForm3]
      let saveForm = {
        applicationInfo: this.applyForm,
        custInfo: this.custForm,
        spouseInfo: this.spouseForm,
        companyInfo: this.companyForm,
        estateInfo: this.estateForm,
        carInfo: this.carForm,
        assertsDebtInfo: this.assertsForm,
        contactInfo: contactForm
      }
      this.$ajax({
        url: '/account/visit/application/saveBasicInfo',
        data: {
          baseInfo: JSON.stringify(saveForm)
        },
        loading: true,
        success: data => {
          this.activePane = 'second'
          let customerId = data.attr['customerId']
          this.customerId = customerId
          this.$sessionStorage('customerId', customerId)
        }
      })
    },
    // 删除图片处理
    delPhoto (index1, index2, fileId) {
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
          url: '/account/visit/material/delFile',
          data: {
            fileId: fileId
          },
          success: data => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            console.log(index1, index2, fileId)
            console.log(this.fileArr)
            this.fileArr[index1].files.splice(index2, 1)
            console.log(this.fileArr[0].files[0])
          }
        })
      })
    },
    // 上传图片处理
    ToPhoto (index1) {
      let name = window.show.GetTempFileName('.jpg')
      window.show.Capture(name)
      let tempCanvas = document.getElementById('myCanvas')
      let etc = tempCanvas.getContext('2d')
      let tempImg = new Image()
      tempImg.src = 'data:image/jpeg;base64,' + window.show.GetBase64(name)
      tempCanvas.width = 1024
      tempCanvas.height = 768
      etc.drawImage(tempImg, 0, 0, tempImg.width, tempImg.height, 0, 0, 1204, 768)
      this.CaptureImg = tempCanvas.toDataURL('image/jpeg', 0.7)
      window.show.DeleteFile(name)
      let materialType = this.fileArr[index1].materialType
      this.$ajax({
        url: '/account/visit/material/uploadImage',
        data: {
          materialType: materialType,
          customerId: this.customerId,
          imgFile: this.CaptureImg
        },
        success: data => {
          let newImgObj = data.rows[0]
          this.fileArr[index1].files.push(newImgObj)
        }
      })
    },
    // 显示小类资料
    showInfoHandle (type) {
      let fileObj = this.fileInfo[this.fileWord[type]]
      if (fileObj) {
        let groupCode = fileObj['groupCode'] || ''
        this.$ajax({
          url: '/account/visit/material/querymaterial',
          data: {
            groupCode: groupCode,
            customerId: this.customerId
          },
          success: data => {
            this.fileArr = data.rows || []
            console.log(this.fileArr)
            this.infoType = type
            this.isShowInfo = true
            window.setTimeout(function () {
              window.show.InitFingerMgr()
              window.show.InitFaceMgr()
              window.show.OpenIdCard()
              window.show.SetGetFingerTemplTimes(1)
              window.show.CloseDevice()
              window.show.OpenDevice(1)
              window.show.OpenVideo()
            }, 1000)
          }
        })
      }
    },
    // 隐藏小类，显示大类
    hideInfoHandle () {
      this.getMaterialGroup()
      this.isShowInfo = false
      window.show.CloseDevice()
      window.show.CloseIdCard()
      window.show.DeinitFaceMgr()
      window.show.DeinitFingerMgr()
    },
    checkHandle () {
      this.$ajax({
        url: '/account/visit/application/sysReview',
        data: {
          customerId: this.customerId,
          applicationId: this.applyForm.applicationId
        },
        success: data => {
          this.$router.back()
        }
      })
    }
  }
}
</script>

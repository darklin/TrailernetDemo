<template>
  <div class="content-box">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>上门客户</el-breadcrumb-item>
      <el-breadcrumb-item>所有客户</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="info-box info-desc-box">
      <div class="info-desc-pane">
        <el-tabs v-model="activePane" type="card">
          <el-tab-pane label="录单信息" name="first" class="info-credit-box">
            <div class="info-credit-record">
              <div class="credit-item">
                <div class="item-title">个人资料</div>
                <div class="item-box">
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">姓名</div>
                    <div class="subitem-right fl">{{baseInfo.custInfo['name']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">性别</div>
                    <div class="subitem-right fl">{{sexs[baseInfo.custInfo['sex']]}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">年龄</div>
                    <div class="subitem-right fl">{{baseInfo.custInfo['age']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">联系手机号</div>
                    <div class="subitem-right fl">{{baseInfo.custInfo['mobile']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">婚姻状态</div>
                    <div class="subitem-right fl">{{weddStatus[baseInfo.custInfo['weddStatus']]}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">身份证</div>
                    <div class="subitem-right fl">{{baseInfo.custInfo['cardNo']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">社保号</div>
                    <div class="subitem-right fl">{{baseInfo.custInfo['socialNo']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">籍贯</div>
                    <div class="subitem-right fl">{{baseInfo.custInfo['nativePlace']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">现住地</div>
                    <div class="subitem-right fl">{{baseInfo.custInfo['address']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">住宅类型</div>
                    <div class="subitem-right fl">{{houseTypes[baseInfo.custInfo['houseType']]}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">居住开始时间</div>
                    <div class="subitem-right fl">{{baseInfo.custInfo['liveDate']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">电邮/QQ</div>
                    <div class="subitem-right fl">{{baseInfo.custInfo['email']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">学历</div>
                    <div class="subitem-right fl">{{baseInfo.custInfo['education']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">毕业年份</div>
                    <div class="subitem-right fl">{{baseInfo.custInfo['graSchool']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">租金</div>
                    <div class="subitem-right fl">{{baseInfo.custInfo['rentMoney']}}</div>
                  </div>
                </div>
              </div>
              <div class="credit-item">
                <div class="item-title">录单信息</div>
                <div class="item-box">
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">申请城市</div>
                    <div class="subitem-right fl">{{baseInfo.applicationInfo['applicantCity']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">申请金额</div>
                    <div class="subitem-right fl">{{baseInfo.applicationInfo['applicatSum']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">申请期限</div>
                    <div class="subitem-right fl">{{baseInfo.applicationInfo['applicatlimit']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">贷款用途</div>
                    <div class="subitem-right fl">{{baseInfo.applicationInfo['loanUse']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">家庭是否知悉贷款</div>
                    <div class="subitem-right fl">{{flags[baseInfo.applicationInfo['flag']]}}</div>
                  </div>
                </div>
              </div>
              <div class="credit-item">
                <div class="item-title">车产信息</div>
                <div class="item-box">
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">品牌</div>
                    <div class="subitem-right fl">{{baseInfo.carInfo['brand']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">型号</div>
                    <div class="subitem-right fl">{{baseInfo.carInfo['type']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">购买金额</div>
                    <div class="subitem-right fl">{{baseInfo.carInfo['buyPrice']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">车牌号码</div>
                    <div class="subitem-right fl">{{baseInfo.carInfo['carNo']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">购买年月</div>
                    <div class="subitem-right fl">{{baseInfo.carInfo['buyYearMon']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">购入方式</div>
                    <div class="subitem-right fl">{{buyTypes[baseInfo.carInfo['buyType']]}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">每月供款</div>
                    <div class="subitem-right fl">{{baseInfo.carInfo['monSupply']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">贷款总额</div>
                    <div class="subitem-right fl">{{baseInfo.carInfo['loanTotal']}}</div>
                  </div>
                </div>
              </div>
              <div class="credit-item">
                <div class="item-title">公司信息</div>
                <div class="item-box">
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">公司全称</div>
                    <div class="subitem-right fl">{{baseInfo.companyInfo['compName']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">公司地址</div>
                    <div class="subitem-right fl">{{baseInfo.companyInfo['address']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">工作年限</div>
                    <div class="subitem-right fl">{{baseInfo.companyInfo['jobLimit']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">公司电话</div>
                    <div class="subitem-right fl">{{baseInfo.companyInfo['telephone']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">工作职位</div>
                    <div class="subitem-right fl">{{baseInfo.companyInfo['position']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">所属行业</div>
                    <div class="subitem-right fl">{{baseInfo.companyInfo['profession']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">是否企业主/个体户</div>
                    <div class="subitem-right fl">{{firms[baseInfo.companyInfo['flag']]}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">经营场所</div>
                    <div class="subitem-right fl">{{operatePlaces[baseInfo.companyInfo['operatePlace']]}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">租金</div>
                    <div class="subitem-right fl">{{baseInfo.companyInfo['rentMoney']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">租金类型</div>
                    <div class="subitem-right fl">{{rentTypes[baseInfo.companyInfo['rentType']]}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">企业类型</div>
                    <div class="subitem-right fl">{{companyTypes[baseInfo.companyInfo['companyType']]}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">占股比例</div>
                    <div class="subitem-right fl">{{baseInfo.companyInfo['proportion']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">员工人数</div>
                    <div class="subitem-right fl">{{baseInfo.companyInfo['employeeNum']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">年营业额</div>
                    <div class="subitem-right fl">{{baseInfo.companyInfo['businessSum']}}</div>
                  </div>
                </div>
              </div>
              <div class="credit-item">
                <div class="item-title">联系人信息</div>
                <div class="item-box">
                  <template v-for="item,key in baseInfo.contactInfo">
                    <div class="subitem clearfix">
                      <div class="subtitle fl">联系人{{key+1}}</div>
                    </div>
                    <div class="subitem clearfix">
                      <div class="subitem-left fl">姓名</div>
                      <div class="subitem-right fl">{{item['name']}}</div>
                    </div>
                    <div class="subitem clearfix">
                      <div class="subitem-left fl">手机号码</div>
                      <div class="subitem-right fl">{{item['mobile']}}</div>
                    </div>
                    <div class="subitem clearfix">
                      <div class="subitem-left fl">关系</div>
                      <div class="subitem-right fl">{{item['relation']}}</div>
                    </div>
                    <div class="subitem clearfix">
                      <div class="subitem-left fl">年龄</div>
                      <div class="subitem-right fl">{{item['age']}}</div>
                    </div>
                    <div class="subitem clearfix">
                      <div class="subitem-left fl">单位名称</div>
                      <div class="subitem-right fl">{{item['unitName']}}</div>
                    </div>
                    <div class="subitem clearfix">
                      <div class="subitem-left fl">职务</div>
                      <div class="subitem-right fl">{{item['position']}}</div>
                    </div>
                    <div class="subitem clearfix">
                      <div class="subitem-left fl">是否知晓贷款</div>
                      <div class="subitem-right fl">{{flags[item['flag']]}}</div>
                    </div>
                  </template>
                </div>
              </div>
              <div class="credit-item">
                <div class="item-title">配偶信息</div>
                <div class="item-box">
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">姓名</div>
                    <div class="subitem-right fl">{{baseInfo.spouseInfo['name']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">手机号码</div>
                    <div class="subitem-right fl">{{baseInfo.spouseInfo['mobile']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">身份证号</div>
                    <div class="subitem-right fl">{{baseInfo.spouseInfo['cardNo']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">是否知晓贷款</div>
                    <div class="subitem-right fl">{{flags[baseInfo.spouseInfo['flag']]}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">单位名称</div>
                    <div class="subitem-right fl">{{baseInfo.spouseInfo['unitName']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">单位地址</div>
                    <div class="subitem-right fl">{{baseInfo.spouseInfo['address']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">工作部门</div>
                    <div class="subitem-right fl">{{baseInfo.spouseInfo['department']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">工作职位</div>
                    <div class="subitem-right fl">{{baseInfo.spouseInfo['position']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">月收入</div>
                    <div class="subitem-right fl">{{baseInfo.spouseInfo['salary']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">单位电话</div>
                    <div class="subitem-right fl">{{baseInfo.spouseInfo['telephone']}}</div>
                  </div>
                </div>
              </div>
              <div class="credit-item">
                <div class="item-title">房产信息</div>
                <div class="item-box">
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">房产地址</div>
                    <div class="subitem-right fl">{{baseInfo.estateInfo['address']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">购买方式</div>
                    <div class="subitem-right fl">{{buyTypes[baseInfo.estateInfo['buyType']]}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">所占份额</div>
                    <div class="subitem-right fl">{{baseInfo.estateInfo['ownPercent']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">建筑年份</div>
                    <div class="subitem-right fl">{{baseInfo.estateInfo['buildyear']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">购买日期</div>
                    <div class="subitem-right fl">{{baseInfo.estateInfo['buyDate']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">建筑面积</div>
                    <div class="subitem-right fl">{{baseInfo.estateInfo['area']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">购买价格</div>
                    <div class="subitem-right fl">{{baseInfo.estateInfo['buyPrice']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">每月供款</div>
                    <div class="subitem-right fl">{{baseInfo.estateInfo['monSupply']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">按揭银行</div>
                    <div class="subitem-right fl">{{baseInfo.estateInfo['bankCode']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">贷款年限</div>
                    <div class="subitem-right fl">{{baseInfo.estateInfo['loanLimit']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">贷款余额</div>
                    <div class="subitem-right fl">{{baseInfo.estateInfo['loanOver']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">贷款总额</div>
                    <div class="subitem-right fl">{{baseInfo.estateInfo['loanTotal']}}</div>
                  </div>
                </div>
              </div>
              <div class="credit-item">
                <div class="item-title">个人资产及负债情况</div>
                <div class="item-box">
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">固定月收入金额</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['income']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">其他收入金额</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['otherIncome']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">其他收入类型</div>
                    <div class="subitem-right fl">{{otherTypes[baseInfo.assertsDebtInfo['otherType']]}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">房产贷款数量</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['houloanNum']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">房产贷款月供</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['houloanMonSup']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">房产贷款总贷款余额</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['houloanToOver']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">车产贷款数量</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['carloanNum']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">车产贷款月供</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['carloanMonSup']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">车产贷款总贷款余额</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['carloanToOver']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">其他贷款数量</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['othloanNum']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">其他贷款月供</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['othloanMonSup']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">其他贷款总贷款余额</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['othloanToOver']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">无抵押贷款数量</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['unloanNum']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">无抵押贷款月供</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['unloanMonSup']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">无抵押贷款总贷款余额</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['unloanToOver']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">信用卡数量</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['creCardNum']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">信用卡月供</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['creCardMonSup']}}</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">信用卡总额度</div>
                    <div class="subitem-right fl">{{baseInfo.assertsDebtInfo['creCardToAmo']}}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="资料信息" name="second" class="info-file-box">
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
            </div>
            <div v-else>
              <template v-for="item in fileArr">
                <el-breadcrumb>
                  <el-breadcrumb-item>{{infoTypes[infoType]}}</el-breadcrumb-item>
                  <el-breadcrumb-item>{{item['materialName']}}</el-breadcrumb-item>
                </el-breadcrumb>
                <el-row>
                  <el-col :span="6" v-for="file,key in item['files']" :key="key">
                    <div class="info-col-img">
                      <img :src="file['path']+'&signId='+signId">
                    </div>
                  </el-col>
                </el-row>
              </template>
              <el-button class="info-btn" @click="hideInfoHandle">返回</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="视频信息" name="third">
            <div class="info-video">
              <video src="http://www.w3school.com.cn/i/movie.ogg"  width="500" height="400" controls="controls">
                Your browser does not support the video tag.
              </video>
            </div>
          </el-tab-pane>
          <el-tab-pane label="复核信息" name="fourth">
            <el-table
              :data="recordTableData">
              <el-table-column
                min-width="150"
                prop="customerId"
                label="申请人id">
              </el-table-column>
              <el-table-column
                min-width="120"
                label="复核类型">
                <template scope="scope">{{reviewTypes[scope.row.reviewType]}}</template>
              </el-table-column>
              <el-table-column
                min-width="120"
                prop="realName"
                label="复核人">
              </el-table-column>
              <el-table-column
                min-width="150"
                prop="reviewDate"
                label="复核时间">
              </el-table-column>
              <el-table-column
                min-width="120"
                label="复核状态">
                <template scope="scope">{{reviewStatus[scope.row.reviewStatus]}}</template>
              </el-table-column>
              <el-table-column
                min-width="120"
                prop="loanAmount"
                label="贷款金额">
              </el-table-column>
              <el-table-column
                min-width="120"
                prop="loanDeadline"
                label="贷款期限">
              </el-table-column>
              <el-table-column
                min-width="120"
                prop="loanRate"
                label="贷款利率">
              </el-table-column>
              <el-table-column
                min-width="120"
                label="还款方式">
                <template scope="scope">{{repayTypes[scope.row.repayType]}}</template>
              </el-table-column>
              <el-table-column
                min-width="120"
                prop="monRepAmo"
                label="每月还款金额">
              </el-table-column>
              <el-table-column
                min-width="150"
                prop="firMonRepAmo"
                label="第一个月还款金额">
              </el-table-column>
              <el-table-column
                min-width="120"
                prop="monCutAmo"
                label="每月递减金额">
              </el-table-column>
              <el-table-column
                min-width="120"
                prop="reviewDes"
                label="复核描述"
                :show-overflow-tooltip="true">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cust-desc',
  data () {
    let customerId = this.$route.params[0]
    let signId = this.$sessionStorage('signId')
    return {
      customerId: customerId,
      activePane: 'first',
      signId: signId,
      baseInfo: {
        custInfo: {},
        applicationInfo: {},
        carInfo: {},
        companyInfo: {},
        contactInfo: [],
        spouseInfo: {},
        estateInfo: {},
        assertsDebtInfo: {}
      },
      fileInfo: {},
      videoTableData: [],
      recordTableData: [],
      isShowInfo: false,
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
      },
      productId: '',
      fileArr: [],
      deadlineList: [],
      sexs: {
        0: '女',
        1: '男'
      },
      weddStatus: {
        0: '未婚',
        1: '已婚',
        2: '离婚',
        3: '分居',
        4: '丧偶'
      },
      houseTypes: {
        0: '自购',
        1: '家庭拥有',
        2: '宿舍',
        3: '租用'
      },
      flags: {
        0: '是',
        1: '否'
      },
      buyTypes: {
        1: '全款',
        2: '贷款',
        3: '合资'
      },
      firms: {
        0: '是',
        1: '不是'
      },
      operatePlaces: {
        0: '自有',
        1: '租用'
      },
      rentTypes: {
        0: '月',
        1: '季',
        2: '年'
      },
      companyTypes: {
        0: '独资',
        1: '合资'
      },
      otherTypes: {
        0: '奖金',
        1: '租金',
        2: '利息',
        3: '其他'
      },
      relations: {
        0: '直系亲属',
        1: '同事',
        2: '朋友'
      },
      buyType: {
        1: '文件',
        2: '视频'
      },
      fileTypes: {
        1: '全款购买',
        2: '贷款购买'
      },
      reviewTypes: {
        0: '系统',
        1: '人工'
      },
      reviewStatus: {
        0: '通过',
        1: '不通过',
        2: '退回'
      },
      repayTypes: {
        1: '等额本息',
        2: '等额本金'
      }
    }
  },
  created () {
    this.$ajax({
      url: '/account/check/reviewhandle/getLoanDetail',
      data: {customerId: this.customerId},
      success: data => {
        let baseInfo = data.attr['baseInfo'] || {}
        let fileInfo = data.attr['fileInfo'] || {}
        let videoInfo = data.attr['videoInfo'] || []
        let recordInfo = data.attr['recordInfo'] || []
        this.productId = baseInfo.applicationInfo['productId']
        for (let item in baseInfo) {
          if (item === 'contactInfo') {
            this.baseInfo[item] = baseInfo[item] || []
          } else {
            this.baseInfo[item] = baseInfo[item] || {}
          }
        }
        this.fileInfo = fileInfo
        this.videoTableData = videoInfo
        this.recordTableData = recordInfo
      }
    })
  },
  methods: {
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
            this.infoType = type
            this.isShowInfo = true
          }
        })
      }
    },
    hideInfoHandle () {
      this.isShowInfo = false
    }
  }
}
</script>

<template>
  <div class="content-box">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>上门客户</el-breadcrumb-item>
      <el-breadcrumb-item>新客户</el-breadcrumb-item>
      <el-breadcrumb-item>上传资料</el-breadcrumb-item>
      <el-breadcrumb-item>申请表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="info-box">
      <el-tabs v-model="activePane" type="card">
        <el-tab-pane label="录单基本信息处理" name="first" class="base-info-box">
          <div class="info-item-box">
            <div class="info-item-title">个人信息</div>
            <el-form ref="queryForm" :model="queryForm" label-width="120px" class="info-item-form">
              <el-form-item label="申请金额">
                <el-input v-model="queryForm.name" placeholder="请输入申请金额">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="email" :rules="{required: true, message: '姓名不能为空', trigger: 'blur'}">
                <el-input v-model="queryForm.cardId" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="queryForm.phone" placeholder="请输入手机号码"></el-input>
              </el-form-item>
              <el-form-item label="身份证">
                <el-input v-model="queryForm.phone" placeholder="请输入身份证"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="queryForm.phone" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item label="所在城市">
                <el-select v-model="queryForm.city" clearable placeholder="请选择所在城市">
                  <el-option label="11" value="11"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="月收入金额">
                <el-input v-model="queryForm.phone" placeholder="请输入月收入金额"></el-input>
              </el-form-item>
              <el-form-item label="学历">
                <el-select v-model="queryForm.city" clearable placeholder="请选择学历">
                  <el-option label="11" value="11"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="毕业学校">
                <el-input v-model="queryForm.phone" placeholder="请输入毕业学校"></el-input>
              </el-form-item>
              <el-form-item label="毕业年月">
                <el-select v-model="queryForm.city" clearable placeholder="请选择毕业年月">
                  <el-option label="11" value="11"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="贷款用途">
                <el-select v-model="queryForm.city" clearable placeholder="请选择贷款用途">
                  <el-option label="11" value="11"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="info-item-box">
            <div class="info-item-title">居住信息</div>
            <el-form ref="queryForm" :model="queryForm" label-width="120px" class="info-item-form">
              <el-form-item label="居住类型">
                <el-select v-model="queryForm.city" clearable placeholder="请选择居住类型">
                  <el-option label="11" value="11"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="居住地点">
                <el-input v-model="queryForm.name" placeholder="请输入居住地点"></el-input>
              </el-form-item>
              <el-form-item label="居住开始日期">
                <el-date-picker
                  v-model="queryForm.startTime"
                  type="date"
                  :editable="true"
                  placeholder="请选择开始日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="居住结束日期">
                <el-date-picker
                  v-model="queryForm.endTime"
                  type="date"
                  :editable="true"
                  placeholder="请选择结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="核实状态">
                <el-input v-model="queryForm.cardId" placeholder="请输入核实状态"></el-input>
              </el-form-item>
              <el-form-item label="核实人">
                <el-input v-model="queryForm.phone" placeholder="请输入核实人"></el-input>
              </el-form-item>
              <el-form-item label="核实时间">
                <el-date-picker
                  v-model="queryForm.endTime"
                  type="date"
                  :editable="true"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="info-item-box">
            <div class="info-item-title">放款银行</div>
            <el-form ref="queryForm" :model="queryForm" label-width="120px" class="info-item-form">
              <el-form-item label="银行卡号">
                <el-input v-model="queryForm.name" placeholder="请输入银行卡号"></el-input>
              </el-form-item>
              <el-form-item label="银行">
                <el-select v-model="queryForm.city" clearable placeholder="请选择银行">
                  <el-option label="11" value="11"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发卡省份">
                <el-select v-model="queryForm.city" clearable placeholder="请选择发卡省份">
                  <el-option label="11" value="11"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发卡城市">
                <el-select v-model="queryForm.city" clearable placeholder="请选择发卡城市">
                  <el-option label="11" value="11"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分行名称">
                <el-input v-model="queryForm.phone" placeholder="请输入分行名称"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="info-item-box">
            <div class="info-item-title">配偶信息</div>
            <el-form ref="queryForm" :model="queryForm" label-width="120px" class="info-item-form">
              <el-form-item label="姓名">
                <el-input v-model="queryForm.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="身份证">
                <el-input v-model="queryForm.cardId" placeholder="请输入身份证"></el-input>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="queryForm.phone" placeholder="请输入手机号"></el-input>
              </el-form-item>
              <el-form-item label="工作单位">
                <el-input v-model="queryForm.phone" placeholder="请输入工作单位"></el-input>
              </el-form-item>
              <el-form-item label="工作地址">
                <el-input v-model="queryForm.phone" placeholder="请输入工作地址"></el-input>
              </el-form-item>
              <el-form-item label="职位">
                <el-input v-model="queryForm.phone" placeholder="请输入职位"></el-input>
              </el-form-item>
              <el-form-item label="月收入">
                <el-input v-model="queryForm.phone" placeholder="请输入月收入"></el-input>
              </el-form-item>
              <el-form-item label="进入单位年月">
                <el-date-picker
                  v-model="queryForm.endTime"
                  type="date"
                  :editable="true"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="单位电话">
                <el-input v-model="queryForm.phone" placeholder="请输入单位电话"></el-input>
              </el-form-item>
              <el-form-item label="核实状态">
                <el-select v-model="queryForm.city" clearable placeholder="请选择核实状态">
                  <el-option label="11" value="11"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="核实人">
                <el-input v-model="queryForm.phone" placeholder="请输入核实人"></el-input>
              </el-form-item>
              <el-form-item label="核实时间">
                <el-date-picker
                  v-model="queryForm.endTime"
                  type="date"
                  :editable="true"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="info-item-box">
            <div class="info-item-title">工作信息</div>
            <el-form ref="queryForm" :model="queryForm" label-width="120px" class="info-item-form">
              <el-form-item label="单位全称">
                <el-input v-model="queryForm.name" placeholder="请输入单位全称"></el-input>
              </el-form-item>
              <el-form-item label="单位性质">
                <el-input v-model="queryForm.name" placeholder="请输入单位性质"></el-input>
              </el-form-item>
              <el-form-item label="工作地址">
                <el-input v-model="queryForm.name" placeholder="请输入工作地址"></el-input>
              </el-form-item>
              <el-form-item label="所属部门">
                <el-input v-model="queryForm.name" placeholder="请输入所属部门"></el-input>
              </el-form-item>
              <el-form-item label="担任职位">
                <el-input v-model="queryForm.name" placeholder="请输入担任职位"></el-input>
              </el-form-item>
              <el-form-item label="税后工资">
                <el-input v-model="queryForm.name" placeholder="请输入税后工资"></el-input>
              </el-form-item>
              <el-form-item label="每月发薪日">
                <el-select v-model="queryForm.city" clearable placeholder="请选择每月发薪日">
                  <el-option label="11" value="11"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工资发放方式">
                <el-select v-model="queryForm.city" clearable placeholder="请选择工资发放方式">
                  <el-option label="11" value="11"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="单位电话">
                <el-input v-model="queryForm.name" placeholder="请输入单位电话"></el-input>
              </el-form-item>
              <el-form-item label="联系人">
                <el-input v-model="queryForm.name" placeholder="请输入联系人"></el-input>
              </el-form-item>
              <el-form-item label="核实状态">
                <el-select v-model="queryForm.city" clearable placeholder="请选择核实状态">
                  <el-option label="11" value="11"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="核实人">
                <el-input v-model="queryForm.name" placeholder="请输入核实人"></el-input>
              </el-form-item>
              <el-form-item label="核实时间">
                <el-date-picker
                  v-model="queryForm.endTime"
                  type="date"
                  :editable="true"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="info-item-box">
            <div class="info-item-title">工作信息</div>
            <el-form ref="queryForm" :model="queryForm" label-width="120px" class="info-item-form">
              <el-form-item label="企业类型">
                <el-input v-model="queryForm.name" placeholder="请输入企业类型"></el-input>
              </el-form-item>
              <el-form-item label="注册时间">
                <el-date-picker
                  v-model="queryForm.endTime"
                  type="date"
                  :editable="true"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="是否私营企业">
                <el-select v-model="queryForm.city" clearable placeholder="请选择是否私营企业">
                  <el-option label="11" value="11"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="员工人数">
                <el-select v-model="queryForm.city" clearable placeholder="请选择员工人数">
                  <el-option label="11" value="11"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="持股比例">
                <el-input v-model="queryForm.name" placeholder="请输入持股比例"></el-input>
              </el-form-item>
              <el-form-item label="每月对公流水">
                <el-input v-model="queryForm.name" placeholder="请输入每月对公流水"></el-input>
              </el-form-item>
              <el-form-item label="核实状态">
                <el-input v-model="queryForm.name" placeholder="请输入核实状态"></el-input>
              </el-form-item>
              <el-form-item label="核实人">
                <el-input v-model="queryForm.name" placeholder="请输入核实人"></el-input>
              </el-form-item>
              <el-form-item label="核实时间">
                <el-date-picker
                  v-model="queryForm.endTime"
                  type="date"
                  :editable="true"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="info-item-box">
            <div class="info-item-title">房产信息</div>
            <el-form ref="queryForm" :model="queryForm" label-width="120px" class="info-item-form">
              <el-form-item label="房产城市">
                <el-input v-model="queryForm.name" placeholder="请输入房产城市"></el-input>
              </el-form-item>
              <el-form-item label="详细地址">
                <el-input v-model="queryForm.name" placeholder="请输入详细地址"></el-input>
              </el-form-item>
              <el-form-item label="建筑面积">
                <el-input v-model="queryForm.name" placeholder="请输入建筑面积"></el-input>
              </el-form-item>
              <el-form-item label="购买单价">
                <el-input v-model="queryForm.name" placeholder="请输入购买单价"></el-input>
              </el-form-item>
              <el-form-item label="不动产权号">
                <el-input v-model="queryForm.name" placeholder="请输入不动产权号"></el-input>
              </el-form-item>
              <el-form-item label="估值">
                <el-input v-model="queryForm.name" placeholder="请输入估值"></el-input>
              </el-form-item>
              <el-form-item label="按揭状态">
                <el-input v-model="queryForm.name" placeholder="请输入按揭状态"></el-input>
              </el-form-item>
              <el-form-item label="贷款金额">
                <el-input v-model="queryForm.name" placeholder="请输入贷款金额"></el-input>
              </el-form-item>
              <el-form-item label="贷款起止日期">
                <el-date-picker
                  v-model="queryForm.endTime"
                  type="date"
                  :editable="true"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="核实状态">
                <el-input v-model="queryForm.name" placeholder="请输入核实状态"></el-input>
              </el-form-item>
              <el-form-item label="核实人">
                <el-input v-model="queryForm.name" placeholder="请输入核实人"></el-input>
              </el-form-item>
              <el-form-item label="核实时间">
                <el-date-picker
                  v-model="queryForm.endTime"
                  type="date"
                  :editable="true"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="info-item-box">
            <div class="info-item-title">车产信息</div>
            <el-form ref="queryForm" :model="queryForm" label-width="120px" class="info-item-form">
              <el-form-item label="车辆品牌">
                <el-input v-model="queryForm.name" placeholder="请输入车辆品牌"></el-input>
              </el-form-item>
              <el-form-item label="车辆型号">
                <el-input v-model="queryForm.name" placeholder="请输入车辆型号"></el-input>
              </el-form-item>
              <el-form-item label="牌照">
                <el-input v-model="queryForm.name" placeholder="请输入牌照"></el-input>
              </el-form-item>
              <el-form-item label="按揭状态">
                <el-select v-model="queryForm.city" clearable placeholder="请选择按揭状态">
                  <el-option label="11" value="11"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="估值">
                <el-input v-model="queryForm.name" placeholder="请输入估值"></el-input>
              </el-form-item>
              <el-form-item label="贷款金额">
                <el-input v-model="queryForm.name" placeholder="请输入贷款金额"></el-input>
              </el-form-item>
              <el-form-item label="贷款起止日期">
                <el-date-picker
                  v-model="queryForm.endTime"
                  type="date"
                  :editable="true"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="核实状态">
                <el-input v-model="queryForm.name" placeholder="请输入核实状态"></el-input>
              </el-form-item>
              <el-form-item label="核实人">
                <el-input v-model="queryForm.name" placeholder="请输入核实人"></el-input>
              </el-form-item>
              <el-form-item label="核实时间">
                <el-date-picker
                  v-model="queryForm.endTime"
                  type="date"
                  :editable="true"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="info-item-box">
            <div class="info-item-title">联系人信息（不低于三个）</div>
            <el-form ref="queryForm" :model="queryForm" label-width="120px" class="info-item-form">
              <el-form-item label="姓名">
                <el-input v-model="queryForm.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="手机号码">
                <el-input v-model="queryForm.name" placeholder="请输入手机号码"></el-input>
              </el-form-item>
              <el-form-item label="关系">
                <el-input v-model="queryForm.name" placeholder="请输入关系"></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="queryForm.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="手机号码">
                <el-input v-model="queryForm.name" placeholder="请输入手机号码"></el-input>
              </el-form-item>
              <el-form-item label="关系">
                <el-input v-model="queryForm.name" placeholder="请输入关系"></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="queryForm.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="手机号码">
                <el-input v-model="queryForm.name" placeholder="请输入手机号码"></el-input>
              </el-form-item>
              <el-form-item label="关系">
                <el-input v-model="queryForm.name" placeholder="请输入关系"></el-input>
              </el-form-item>
              <el-form-item label="核实状态">
                <el-input v-model="queryForm.name" placeholder="请输入核实状态"></el-input>
              </el-form-item>
              <el-form-item label="核实人">
                <el-input v-model="queryForm.name" placeholder="请输入核实人"></el-input>
              </el-form-item>
              <el-form-item label="核实时间">
                <el-date-picker
                  v-model="queryForm.endTime"
                  type="date"
                  :editable="true"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <el-button class="info-btn" @click="nextHandle">下一步</el-button>
        </el-tab-pane>
        <el-tab-pane label="上传资料" name="second" class="upload-info-box">
          <template v-if="uploadList">
            <div class="upload-info clearfix">
              <div class="upload-info-item active fl">征信资料</div>
              <div class="upload-info-item active fl">身份证</div>
              <div class="upload-info-item active fl">收入证明</div>
              <div class="upload-info-item active fl">工作证明</div>
              <div class="upload-info-item active upload-apply fr">申请表</div>
              <div class="upload-info-item active fl">居住证明</div>
              <div class="upload-info-item active fl">房产资料</div>
              <div class="upload-info-item active fl">保单资料</div>
              <div class="upload-info-item active fl">公司资料</div>
              <div class="upload-info-item active upload-social fl">社保公积金资料</div>
              <div class="upload-info-item active fl">车辆资料</div>
              <div class="upload-info-item active fl">其他资料</div>
              <div class="upload-info-item active fl">补充资料</div>
            </div>
            <el-button class="info-btn" @click="nextHandle">下一步</el-button>
          </template>
          <template v-else>
            <div class="info-upload">
              <div class="info-upload-title">申请表</div>
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog v-model="dialogVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl">
              </el-dialog>
              <div class="info-upload-title">手机通话详单</div>
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog v-model="dialogVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl">
              </el-dialog>
              <el-button class="info-btn" @click="nextHandle">下一步</el-button>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="银行录像" name="third" class="upload-info-box">
          <div class="info-upload">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-button class="info-btn" @click="nextHandle">上传到服务器</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="个人征信信息" name="fourth" class="info-credit-box">
          <div class="info-credit-asset">
            <div class="credit-title">征信资产汇总</div>
            <div class="credit-asset-box clearfix">
              <div class="credit-item fl">
                <div class="item-title">贷款汇总</div>
                <div class="item-box">
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">贷款机构数</div>
                    <div class="subitem-right fl">152</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">笔数</div>
                    <div class="subitem-right fl">34</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">合同总数</div>
                    <div class="subitem-right fl">2</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">合同余额</div>
                    <div class="subitem-right fl">1561,211 元</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">最近6个月平均应还款</div>
                    <div class="subitem-right two-line fl">5000 元</div>
                  </div>
                </div>
              </div>
              <div class="credit-item fl">
                <div class="item-title">信用卡汇总</div>
                <div class="item-box">
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">发卡机构数</div>
                    <div class="subitem-right fl">中国工商</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">账户数</div>
                    <div class="subitem-right fl">34</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">授信总额</div>
                    <div class="subitem-right fl">150,000 元</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">单家行最高授信额</div>
                    <div class="subitem-right fl">80,000 元</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">单价行最低授信额</div>
                    <div class="subitem-right fl">50,000 元</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">已用额度</div>
                    <div class="subitem-right fl">50,000 元</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">最近6个月平均使用额度</div>
                    <div class="subitem-right two-line fl">3,000 元</div>
                  </div>
                </div>
              </div>
              <div class="credit-item fl">
                <div class="item-title">担保情况</div>
                <div class="item-box">
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">担保笔数</div>
                    <div class="subitem-right fl">3</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">担保余额</div>
                    <div class="subitem-right fl">180,000 元</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">担保本金余额</div>
                    <div class="subitem-right fl">150,000 元</div>
                  </div>
                </div>
              </div>
              <div class="credit-item fl">
                <div class="item-title">其他资产情况</div>
                <div class="item-box">
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">呆账信息汇总-笔数</div>
                    <div class="subitem-right fl">3</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">呆账信息汇总-余额笔数</div>
                    <div class="subitem-right two-line fl">34</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">资产处置信息汇总-笔数</div>
                    <div class="subitem-right two-line fl">2</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">资产处置信息汇总-余额</div>
                    <div class="subitem-right two-line fl">180,000 元</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">保证人代偿信息汇总-笔数</div>
                    <div class="subitem-right two-line fl">3</div>
                  </div>
                  <div class="subitem clearfix">
                    <div class="subitem-left fl">保证人代偿信息汇总-余额</div>
                    <div class="subitem-right two-line fl">150,000 元</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="info-credit-record clearfix">
            <div class="credit-item fl">
              <div class="item-title">征信贷款记录</div>
              <div class="item-box">
                <div class="subitem clearfix">
                  <div class="subitem-left fl">贷款机构银行</div>
                  <div class="subitem-right fl">中国工商银行</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">贷款类型</div>
                  <div class="subitem-right fl">车贷</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">当前状态</div>
                  <div class="subitem-right fl">正常</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">金额</div>
                  <div class="subitem-right fl">1561,211 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">起期</div>
                  <div class="subitem-right fl">2017年01月12日</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">止期</div>
                  <div class="subitem-right fl">2019年12月12日</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">剩余期数</div>
                  <div class="subitem-right fl">24期</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">本月还款金额</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">本月还款日期</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">上次还款金额</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">上次还款日期</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
              </div>
            </div>
            <div class="credit-item fl">
              <div class="item-title">信用卡记录</div>
              <div class="item-box">
                <div class="subitem clearfix">
                  <div class="subitem-left fl">贷款机构银行</div>
                  <div class="subitem-right fl">中国工商银行</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">贷款类型</div>
                  <div class="subitem-right fl">车贷</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">当前状态</div>
                  <div class="subitem-right fl">正常</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">金额</div>
                  <div class="subitem-right fl">1561,211 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">起期</div>
                  <div class="subitem-right fl">2017年01月12日</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">止期</div>
                  <div class="subitem-right fl">2019年12月12日</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">剩余期数</div>
                  <div class="subitem-right fl">24期</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">本月还款金额</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">本月还款日期</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">上次还款金额</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">上次还款日期</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
              </div>
            </div>
            <div class="credit-item fl">
              <div class="item-title">社保情况</div>
              <div class="item-box">
                <div class="subitem clearfix">
                  <div class="subitem-left fl">贷款机构银行</div>
                  <div class="subitem-right fl">中国工商银行</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">贷款类型</div>
                  <div class="subitem-right fl">车贷</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">当前状态</div>
                  <div class="subitem-right fl">正常</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">金额</div>
                  <div class="subitem-right fl">1561,211 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">起期</div>
                  <div class="subitem-right fl">2017年01月12日</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">止期</div>
                  <div class="subitem-right fl">2019年12月12日</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">剩余期数</div>
                  <div class="subitem-right fl">24期</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">本月还款金额</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">本月还款日期</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">上次还款金额</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">上次还款日期</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
              </div>
            </div>
            <div class="credit-item fl">
              <div class="item-title">公积金情况</div>
              <div class="item-box">
                <div class="subitem clearfix">
                  <div class="subitem-left fl">贷款机构银行</div>
                  <div class="subitem-right fl">中国工商银行</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">贷款类型</div>
                  <div class="subitem-right fl">车贷</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">当前状态</div>
                  <div class="subitem-right fl">正常</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">金额</div>
                  <div class="subitem-right fl">1561,211 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">起期</div>
                  <div class="subitem-right fl">2017年01月12日</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">止期</div>
                  <div class="subitem-right fl">2019年12月12日</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">剩余期数</div>
                  <div class="subitem-right fl">24期</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">本月还款金额</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">本月还款日期</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">上次还款金额</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">上次还款日期</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
              </div>
            </div>
            <div class="credit-item fl">
              <div class="item-title">征信查询记录</div>
              <div class="item-box">
                <div class="subitem clearfix">
                  <div class="subitem-left fl">贷款机构银行</div>
                  <div class="subitem-right fl">中国工商银行</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">贷款类型</div>
                  <div class="subitem-right fl">车贷</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">当前状态</div>
                  <div class="subitem-right fl">正常</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">金额</div>
                  <div class="subitem-right fl">1561,211 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">起期</div>
                  <div class="subitem-right fl">2017年01月12日</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">止期</div>
                  <div class="subitem-right fl">2019年12月12日</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">剩余期数</div>
                  <div class="subitem-right fl">24期</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">本月还款金额</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">本月还款日期</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">上次还款金额</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">上次还款日期</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
              </div>
            </div>
            <div class="credit-item fl">
              <div class="item-title">不良情况查寻结果</div>
              <div class="item-box">
                <div class="subitem clearfix">
                  <div class="subitem-left fl">贷款机构银行</div>
                  <div class="subitem-right fl">中国工商银行</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">贷款类型</div>
                  <div class="subitem-right fl">车贷</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">当前状态</div>
                  <div class="subitem-right fl">正常</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">金额</div>
                  <div class="subitem-right fl">1561,211 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">起期</div>
                  <div class="subitem-right fl">2017年01月12日</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">止期</div>
                  <div class="subitem-right fl">2019年12月12日</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">剩余期数</div>
                  <div class="subitem-right fl">24期</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">本月还款金额</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">本月还款日期</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">上次还款金额</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">上次还款日期</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
              </div>
            </div>
            <div class="credit-item fl">
              <div class="item-title">其他金融贷款情况</div>
              <div class="item-box">
                <div class="subitem clearfix">
                  <div class="subitem-left fl">贷款机构银行</div>
                  <div class="subitem-right fl">中国工商银行</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">贷款类型</div>
                  <div class="subitem-right fl">车贷</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">当前状态</div>
                  <div class="subitem-right fl">正常</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">金额</div>
                  <div class="subitem-right fl">1561,211 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">起期</div>
                  <div class="subitem-right fl">2017年01月12日</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">止期</div>
                  <div class="subitem-right fl">2019年12月12日</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">剩余期数</div>
                  <div class="subitem-right fl">24期</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">本月还款金额</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">本月还款日期</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">上次还款金额</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
                <div class="subitem clearfix">
                  <div class="subitem-left fl">上次还款日期</div>
                  <div class="subitem-right fl">5,000 元</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add-data',
  data () {
    return {
      activePane: 'first',
      queryForm: {
        name: '',
        cardId: '',
        phone: '',
        city: '',
        startTime: '',
        endTime: ''
      },
      isLoading: false,
      uploadList: true,
      dialogImageUrl: '',
      dialogVisible: false,
      imageUrl: ''
    }
  },
  methods: {
    nextHandle () {
      this.uploadList = false
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {}
  }
}
</script>

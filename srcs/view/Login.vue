<template>
  <div class="login-box" v-if="isShow">
    <div class="login-form-box inner-box" @keyup.enter="submitHandle">
      <div class="login-title">立即登录</div>
      <div class="login-switch clearfix">
        <div class="login-switch-item fl" :class="loginType === 'passType' && 'active'" @click="switchTab('passType')">密码登录</div>
        <div class="login-switch-item fl" :class="loginType === 'codeType' && 'active'" @click="switchTab('codeType')">手机登录</div>
      </div>
      <el-form :model="passForm" ref="passForm" v-if="loginType === 'passType'">
        <el-form-item prop="userName" :rules="[{required: true, message: '用户名不能为空'}]" class="login-user">
          <el-input v-model="passForm.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" :rules="[{required: true, message: '密码不能为空'}]" class="login-pass">
          <el-input type="password" v-model="passForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="codeForm" ref="codeForm" v-else>
        <el-form-item prop="telephone" :rules="[{required: true, message: '手机号码不能为空'}]" class="login-phone">
          <el-input v-model="codeForm.telephone" placeholder="请输入您的手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="randomNo" :rules="[{required: true, message: '验证码不能为空'}]" class="login-code">
          <el-input v-model="codeForm.randomNo" placeholder="请输入手机验证码"></el-input>
          <a class="login-code-btn" @click="getCode">{{count === 60 ? '获取验证码' : count+'s'}}</a>
        </el-form-item>
      </el-form>
      <el-button :loading="isLoading" @click="submitHandle">登 录</el-button>
      <div class="login-extra clearfix" v-if="loginType === 'passType'">
        <div class="fl">
          <el-checkbox v-model="checkPass">记住密码</el-checkbox>
        </div>
        <div class="fr">
          <a href="#" class="forget-pass">{{$t('message')}}忘记密码</a>
        </div>
      </div>
    </div>
    <div class="login-logo inner-box"></div>
    <div class="login-bg">
      <div class="login-pic-bg inner-box"></div>
    </div>
  </div>
</template>

<script>
let flag = false
export default {
  name: 'login',
  data () {
    // 获取缓存中存储的密码，没有则为空
    let password = this.$localStorage('password') || ''
    return {
      loginType: 'passType',
      passForm: {
        userName: '',
        password: password
      },
      codeForm: {
        telephone: '',
        randomNo: ''
      },
      checkPass: false,
      count: 60,
      isLoading: false,
      isShow: false
    }
  },
  beforeCreate () {
    // 全局加载动画
    let loadObj = this.$loading({ fullscreen: true })
    setTimeout(() => {
      loadObj.close()
      this.isShow = true
    }, 2000)
    // 切换语言
    this.$i18n.locale = 'en'
    // 获取国际语言信息
    console.log(this.$t('message'))
    // 清除缓存
    this.$rmSessionStorage()
    this.$rmLocalStorage('userName')
  },
  methods: {
    // 切换登录方式
    switchTab (type) {
      this.loginType = type
      if (type === 'passType') {
        this.$refs['codeForm'].resetFields()
      } else {
        this.$refs['passForm'].resetFields()
      }
    },
    // 获取手机验证码
    getCode () {
      if (flag) return
      // 验证手机号码
      if (this.codeForm.telephone.length !== 11 || isNaN(this.codeForm.telephone)) {
        this.$msg('手机号必须为11位数')
        return
      }
      let _this = this
      this.$ajax({
        url: '/smsAction/nologin/kjlogin',
        data: {'telephone': this.codeForm.telephone},
        success: data => {
          this.$message(data.message)
          flag = true
          // 倒计时
          let timer = window.setInterval(function () {
            _this.count--
            if (_this.count === 0) {
              window.clearInterval(timer)
              flag = false
              _this.count = 60
            }
          }, 1000)
        },
        error: err => {
          this.$msg(err.message)
        }
      })
    },
    // 登录
    submitHandle () {
      if (this.loginType === 'passType') {
        // 密码登录
        this.$refs['passForm'].validate((valid) => {
          if (valid) {
            this.$ajax({
              url: '/cust/login',
              data: this.passForm,
              loading: true,
              success: data => {
                // 存储用户名
                this.$localStorage('userName', data.rows[0]['userName'])
                // 存储密码
                if (this.checkPass) {
                  this.$localStorage('password', this.passForm['password'])
                }
                this.$router.replace('/home')
              }
            })
          }
        })
      } else {
        // 手机验证码登录
        this.$refs['codeForm'].validate((valid) => {
          if (valid) {
            this.$ajax({
              url: '/cust/kjLogin',
              data: this.codeForm,
              loading: true,
              success: data => {
                // 存储用户名
                this.$localStorage('userName', data.rows[0]['userName'])
                this.$router.replace('/home')
              }
            })
          }
        })
      }
    }
  }
}
</script>

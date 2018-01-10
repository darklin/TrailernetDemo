<template>
  <div class="login-box" :style="bgImg">
    <div class="login-form-box" @keyup.enter="submitHandle">
      <div class="login-title">{{$t('login.title')}}</div>
      <div class="logo-form">
        <el-form :model="loginForm" ref="loginForm">
          <el-form-item prop="userName" :rules="[{required: true, message: $t('login.username') + $t('common.beRequired')}]" class="login-user">
            <el-input v-model="loginForm.userName" :placeholder="$t('login.username')">
              <template slot="prepend"></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="passWord" :rules="[{required: true, message: $t('login.password') + $t('common.beRequired')}]" class="login-pass">
            <el-input type="password" v-model="loginForm.passWord" :placeholder="$t('login.password')">
              <template slot="prepend"></template>
            </el-input>
          </el-form-item>
        </el-form>
        <div class="login-extra clearfix">
          <el-checkbox class="fl" v-model="checkPass">{{$t('login.rememberPass')}}</el-checkbox>
          <div class="fr">
            <el-button :class="{'active':langType==='zh'}" @click="switchLang('zh')">中文</el-button><span class="divide-line"></span><el-button :class="{'active':langType==='en'}" @click="switchLang('en')">EN</el-button>
          </div>
        </div>
        <el-button :loading="isLoading" @click="submitHandle" class="submit-btn">{{$t('login.submitText')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  name: 'login',
  data () {
    // 获取缓存中存储的密码，没有则为空
    let password = this.$localStorage('password') || ''
    let username = this.$localStorage('userName') || ''
    // 获取本地化语言类型
    let langType = this.$i18n.locale
    // 获取本地时间和UTC时间的差值
    let offset = this.$timezoneOffset(new Date())
    return {
      langType: langType,
      loginForm: {
        langType: langType,
        userName: username,
        passWord: password,
        rememberMe: 1,
        CodeKey: 'test',
        offset: offset
      },
      checkPass: true,
      isLoading: false,
      bgImg: {
        background: `url(${require('@/assets/images/login_bg.jpg')}) no-repeat center center`,
        backgroundSize: 'cover'
      }
    }
  },
  beforeCreate () {
    // 清除缓存
    this.$rmSessionStorage()
    this.$rmLocalStorage('alarmNum')
    // 登录界面
    this.$get({
      url: '/user/login',
      success: () => {}
    })
  },
  methods: {
    // 切换语言类型
    switchLang (type) {
      if (this.langType !== type) {
        this.langType = type
        this.$i18n.locale = type
        this.$localStorage('lang', type)
      }
    },
    // 登录
    submitHandle () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          let passWord = this.loginForm['passWord']
          this.loginForm['rememberMe'] = Number(this.checkPass)
          this.loginForm['passWord'] = md5(passWord)
          this.loginForm['langType'] = this.langType
          this.$post({
            url: '/user/login',
            data: this.loginForm,
            loading: true,
            success: data => {
              // 存储密码
              if (this.checkPass) {
                this.$localStorage('password', passWord)
              } else {
                this.$rmLocalStorage('password')
              }
              // 存储用户名
              this.$localStorage('userName', this.loginForm['userName'])
              this.$localStorage('offset', this.loginForm['offset'])
              // this.$sessionStorage('token', data.CodeKey)
              this.$router.replace('/')
            }
          })
        }
      })
    }
  }
}
</script>

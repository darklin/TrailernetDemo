<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('sys.roleManagement')}}</div>
    <div class="content-ctrl">
      <el-button class="table-normal-btn" @click="backHandle">{{$t('common.goback')}}</el-button>
    </div>
    <div class="content-form-box">
      <div class="content-form">
        <div class="content-form-title">{{$t('sys.setRights')}}</div>
        <div class="info-form-box clearfix">
          <div class="auth-menu fl">
            <div class="auth-menu-item" :class="{active: active === 'system'}" @click="switchAuth('system')"><span>系统管理</span><i class="el-icon-d-arrow-right"></i></div>
            <div class="auth-menu-item" :class="{active: active === 'user'}" @click="switchAuth('user')"><span>用户管理</span><i class="el-icon-d-arrow-right"></i></div>
            <div class="auth-menu-item" :class="{active: active === 'report'}" @click="switchAuth('report')"><span>报表统计</span><i class="el-icon-d-arrow-right"></i></div>
            <div class="auth-menu-item" :class="{active: active === 'alarm'}" @click="switchAuth('alarm')"><span>报警提醒</span><i class="el-icon-d-arrow-right"></i></div>
            <div class="auth-menu-item" :class="{active: active === 'archives'}" @click="switchAuth('archives')"><span>档案管理</span><i class="el-icon-d-arrow-right"></i></div>
            <div class="auth-menu-item" :class="{active: active === 'config'}" @click="switchAuth('config')"><span>数据配置</span><i class="el-icon-d-arrow-right"></i></div>
          </div>
          <div class="auth-panel fr" v-if="active === 'system'">
            <div class="auth-panel-group">
              <div class="auth-panel-title">角色管理</div>
              <div class="auth-panel-check">
                <el-checkbox v-model="checked">角色查看</el-checkbox>
                <el-checkbox v-model="checked">角色编辑</el-checkbox>
              </div>
              <div class="auth-panel-title divide-line">权限管理</div>
              <div class="auth-panel-check">
                <el-checkbox v-model="checked">权限查看</el-checkbox>
                <el-checkbox v-model="checked">权限编辑</el-checkbox>
              </div>
              <div class="auth-panel-title divide-line">基础数据管理</div>
              <div class="auth-panel-check">
                <el-checkbox v-model="checked">公司信息管理</el-checkbox>
                <el-checkbox v-model="checked">组织机构管理</el-checkbox>
                <el-checkbox v-model="checked">公司信息查看</el-checkbox>
                <el-checkbox v-model="checked">组织机构查看</el-checkbox>
              </div>
            </div>
            <div class="auth-panel-btn">
              <el-button class="info-confirm-btn"  @click="cancelHandle">取消</el-button>
              <el-button :loading="isLoading" class="info-confirm-btn"  @click="confirmHandle">设置</el-button>
            </div>
          </div>
          <div class="auth-panel fr" v-if="active === 'user'">
            <div class="auth-panel-group">
              <div class="auth-panel-title">角色管理11</div>
              <div class="auth-panel-check">
                <el-checkbox v-model="checked">角色查看11</el-checkbox>
                <el-checkbox v-model="checked">角色编辑11</el-checkbox>
                <el-checkbox v-model="checked">角色修改11</el-checkbox>
                <el-checkbox v-model="checked">角色删除11</el-checkbox>
              </div>
              <div class="auth-panel-title divide-line">权限管理</div>
              <div class="auth-panel-check">
                <el-checkbox v-model="checked">权限查看</el-checkbox>
                <el-checkbox v-model="checked">权限编辑</el-checkbox>
              </div>
              <div class="auth-panel-title divide-line">基础数据管理</div>
              <div class="auth-panel-check">
                <el-checkbox v-model="checked">公司信息管理</el-checkbox>
                <el-checkbox v-model="checked">组织机构管理</el-checkbox>
                <el-checkbox v-model="checked">公司信息查看</el-checkbox>
                <el-checkbox v-model="checked">组织机构查看</el-checkbox>
              </div>
            </div>
            <div class="auth-panel-btn">
              <el-button class="info-confirm-btn"  @click="cancelHandle">取消</el-button>
              <el-button :loading="isLoading" class="info-confirm-btn"  @click="confirmHandle">设置</el-button>
            </div>
          </div>
          <div class="auth-panel fr" v-if="active === 'report'">
            <div class="auth-panel-group">
              <div class="auth-panel-title">角色管理11</div>
              <div class="auth-panel-check">
                <el-checkbox v-model="checked">角色查看11</el-checkbox>
                <el-checkbox v-model="checked">角色编辑11</el-checkbox>
                <el-checkbox v-model="checked">角色修改11</el-checkbox>
                <el-checkbox v-model="checked">角色删除11</el-checkbox>
              </div>
            </div>
            <div class="auth-panel-btn">
              <el-button class="info-confirm-btn"  @click="cancelHandle">取消</el-button>
              <el-button :loading="isLoading" class="info-confirm-btn"  @click="confirmHandle">设置</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'set-auth',
  data () {
    let groupID = this.$localStorage('setAuth') || ''
    return {
      groupID: groupID,
      active: 'system',
      checked: true,
      isLoading: false
    }
  },
  created () {},
  methods: {
    // 返回处理
    backHandle () {
      this.$router.back()
    },
    // 切换权限
    switchAuth (type) {
      this.active = type
    },
    // 取消
    cancelHandle () {},
    // 确定
    confirmHandle () {}
  }
}
</script>

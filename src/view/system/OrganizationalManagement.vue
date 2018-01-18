<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('sys.orgManagement')}}</div>
    <div class="search-box clearfix">
      <el-form :model="searchForm" class="search-form">
        <el-form-item :label="$t('common.organization')" class="fl">
          <el-input v-model="searchForm.orgName"></el-input>
        </el-form-item>
      </el-form>
      <el-button :loading="isLoading" class="search-btn fl" icon="search"  @click="searchHandle">{{$t('common.search')}}</el-button>
    </div>
    <div class="table-box">
      <el-table
        :data="countData"
        style="width: 100%">
        <el-table-column
          type="index"
          align="center"
          :label="$t('index.indexField')"
          width="80">
        </el-table-column>
        <el-table-column
          align="left"
          :label="$t('common.organization')">
          <template scope="scope"><span :style="{paddingLeft: `${1 * (scope.row.Level - 1)}em`}">{{scope.row.OrgName}}</span></template>
        </el-table-column>
        <el-table-column
          prop="OrgID"
          align="center"
          :label="$t('common.orgID')">
        </el-table-column>
        <el-table-column
          prop="Address"
          align="center"
          :label="$t('boxUp.position')">
        </el-table-column>
        <el-table-column
          prop="Memo"
          align="center"
          :label="$t('car.remark')">
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('common.operate')"
          width="200">
          <template scope="scope">
            <el-button type="text" size="small" @click="addOrgHandle(scope.row.OrgID)">{{$t('common.add')}}</el-button>
            <el-button type="text" size="small" @click="editHandle(scope.row.OrgID)">{{$t('common.edit')}}</el-button>
            <el-button type="text" size="small" class="table-delete-btn" @click="deleteHandle(scope.row.OrgID)" v-if="scope.row.Level > 1">{{$t('common.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'remind-detail',
  data () {
    return {
      searchForm: {
        orgName: ''
      },
      isLoading: false,
      countData: []
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 获取机构管理信息
    searchHandle () {
      this.$get({
        url: '/organization',
        data: this.searchForm,
        loading: true,
        success: data => {
          this.countData = data.Rows || []
        }
      })
    },
    pageHandle (page) {
      this.searchHandle()
    },
    // 添加子机构
    addOrgHandle (orgID) {
      this.$localStorage('addOrg', orgID)
      this.$router.push('addOrg')
    },
    // 编辑处理
    editHandle (orgID) {
      this.$localStorage('editOrg', orgID)
      this.$router.push('editOrg')
    },
    // 删除处理
    deleteHandle (orgID) {
      this.$alert(this.$t('common.sureDelete') + '?', this.$t('common.gentlehint'), {
        showCancelButton: true,
        customClass: 'delete-warn-box',
        callback: action => {
          if (action === 'confirm') {
            this.$post({
              url: '/organization',
              data: {
                _method: 'DELETE',
                orgID: orgID
              },
              success: data => {
                this.searchHandle()
              }
            })
          }
        }
      })
    }
  }
}
</script>

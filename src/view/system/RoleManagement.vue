<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('sys.roleManagement')}}</div>
    <div class="table-box">
      <el-button class="table-add-btn" @click="addHandle">{{$t('common.add')}}</el-button>
      <el-table
        :data="countData"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          align="center"
          :label="$t('index.indexField')"
          width="80">
        </el-table-column>
        <el-table-column
          prop="GroupName"
          align="center"
          :label="$t('sys.groupName')">
        </el-table-column>
        <el-table-column
          prop="GroupID"
          align="center"
          :label="$t('common.roleCode')">
        </el-table-column>
        <el-table-column
          prop="Memo"
          align="center"
          :label="$t('car.remark')">
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('common.operate')"
          width="250">
          <template scope="scope">
            <el-button size="small" type="text" @click="roleHandle(scope.row.GroupID)">{{$t('sys.setRights')}}</el-button>
            <el-button size="small" type="text" @click="editHandle(scope.row.GroupID)">{{$t('common.edit')}}</el-button>
            <el-button size="small" type="text" class="table-delete-btn" @click="deleteHandle(scope.row.GroupID)">{{$t('common.delete')}}</el-button>
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
      countData: [],
      currentPage: 1,
      totalRecord: 1
    }
  },
  created () {
    this.searchHandle()
  },
  methods: {
    // 获取角色信息列表
    searchHandle () {
      this.$get({
        url: '/usergroup',
        success: data => {
          this.countData = data['Rows'] || []
          this.totalRecord = data.Total || 0
        }
      })
    },
    // 分页处理
    pageHandle () {},
    // 添加处理
    addHandle () {
      this.$router.push('addRole')
    },
    // 设置权限处理
    roleHandle (GroupID) {
      this.$localStorage('setAuth', GroupID)
      this.$router.push('setAuth')
    },
    // 编辑处理
    editHandle (GroupID) {
      this.$localStorage('editRole', GroupID)
      this.$router.push('editRole')
    },
    // 删除处理
    deleteHandle (GroupID) {
      this.$alert(this.$t('common.sureDelete') + '?', this.$t('common.gentlehint'), {
        showCancelButton: true,
        customClass: 'delete-warn-box',
        callback: action => {
          if (action === 'confirm') {
            this.$post({
              url: '/usergroup',
              data: {
                _method: 'DELETE',
                groupID: GroupID
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

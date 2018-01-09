<template>
  <div class="content-box">
    <div class="content-subtitle">{{$t('sys.roleManagement')}}</div>
    <div class="content-ctrl">
      <el-button class="table-normal-btn" @click="backHandle">{{$t('common.goback')}}</el-button>
    </div>
    <div class="content-form-box">
      <div class="content-form">
        <div class="content-form-title">{{$t('sys.setRights')}}</div>
        <el-form class="info-form-box single-form-box">
          <el-tree
            class="auth-tree"
            :data="authData"
            ref="authTree"
            show-checkbox
            node-key="id"
            :default-checked-keys="checkedKey"
            :default-expanded-keys="Object.keys(expandKey)"
            @node-expand="expandHandle"
            @node-collapse="collapseHandle"
            :props="defaultProps">
          </el-tree>
          <el-form-item label="">
            <el-button :loading="isLoading" class="info-confirm-btn"  @click="confirmHandle">{{$t('common.confirm')}}</el-button>
          </el-form-item>
        </el-form>
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
      isLoading: false,
      authData: [],
      checkedKey: [],
      expandKey: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created () {
    this.getAuth()
  },
  methods: {
    // 获取角色信息
    getAuth () {
      this.$get({
        url: 'rights/set',
        data: {groupID: this.groupID},
        success: data => {
          let zNodes = JSON.parse(data.zNodes || '')
          // 转化为平行结构对象
          let [nodes, checkedKey, expandKey, auth, rights] = [{}, [], {}, {}, []]
          zNodes.forEach(item => {
            if (item.checked) checkedKey.push(item.id)
            if (item.open) expandKey[item.id] = true
            nodes[item.id] = item
          })
          // 转化为树形结构对象
          zNodes.forEach(item => {
            let [pId, id] = [Number(item.pId), Number(item.id)]
            if (pId === 0) {
              auth[id] = item
              auth[id]['children'] = {}
            } else {
              if (auth[pId]) {
                auth[pId]['children'][id] = item
                auth[pId]['children'][id]['children'] = {}
              } else {
                let rId = Number(nodes[pId]['pId'])
                if (auth[rId]) {
                  auth[rId]['children'][pId]['children'][id] = item
                  auth[rId]['children'][pId]['children'][id]['children'] = {}
                } else {
                  let sId = Number(nodes[rId]['pId'])
                  if (auth[sId]) {
                    auth[sId]['children'][rId]['children'][pId]['children'][id] = item
                  }
                }
              }
            }
          })
          // 转化为树形结构数组
          for (let rKey in auth) {
            let rItem = auth[rKey]
            let rChild = rItem['children']
            rItem['children'] = []
            for (let cKey in rChild) {
              let cItem = rChild[cKey]
              let sChild = cItem['children']
              cItem['children'] = []
              for (let sKey in sChild) {
                let sItem = sChild[sKey]
                let tChild = sItem['children']
                sItem['children'] = []
                for (let tKey in tChild) {
                  sItem['children'].push(tChild[tKey])
                }
                if (!sItem['children'].length) delete sItem['children']
                cItem['children'].push(sItem)
              }
              if (!cItem['children'].length) delete cItem['children']
              rItem['children'].push(cItem)
            }
            if (!rItem['children'].length) delete rItem['children']
            rights.push(rItem)
          }
          this.checkedKey = checkedKey
          // 默认都关闭
          this.expandKey = []
          // this.expandKey = expandKey
          this.authData = rights
        }
      })
    },
    // 返回处理
    backHandle () {
      this.$router.back()
    },
    // 节点展开处理
    expandHandle (data, node) {
      this.expandKey[data['id']] = true
    },
    // 节点关闭处理
    collapseHandle (data, node) {
      delete this.expandKey[data['id']]
    },
    // 提交表单处理
    confirmHandle () {
      // 获取选择的权限id
      // 展开节点的id
      let ids = ''
      this.$refs['authTree'].getCheckedKeys().forEach(item => {
        ids = ids + item + ','
      })
      this.$post({
        url: 'rights/set',
        data: {
          groupID: this.groupID,
          rights: ids
        },
        loading: true,
        success: data => {
          this.$router.push('roleManagement')
        }
      })
    }
  }
}
</script>

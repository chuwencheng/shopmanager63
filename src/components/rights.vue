<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="权限管理" level2="权限列表"></cus-bread>
        <!-- 按钮 -->
        <el-button class="btn" type="primary">添加角色</el-button>
        <!-- 表格 -->
        <!-- 给表格设置固定宽度，可使其出现滚动条且表头自动固定 -->
        <el-table height='400px' :data="list" style="width: 100%">
            <!-- 表格序号 type="index"-->
            <el-table-column type="index" label="#" width="160">
            </el-table-column>
            <el-table-column prop="authName" label="角色名称" width="200">
            </el-table-column>
            <el-table-column prop="path" label="路径" width="200">
            </el-table-column>
            <!-- 当表格内容不再是prop的值时 在里面添加template标签，并设置属性slot-scope="scope" -->
            <el-table-column prop="level" label="层级" width="200">
                <template slot-scope="scope">
                    <span v-if="scope.row.level==='0'">一级</span>
                    <span v-if="scope.row.level==='1'">二级</span>
                    <span v-if="scope.row.level==='2'">三级</span>
                </template>
            </el-table-column>

            <!-- <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                    <el-button @click="setRights(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
                </template>
            </el-table-column> -->
        </el-table>
    </el-card>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
    //   const AUTH_TOKEN = localStorage.getItem('token')
    //   this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(`rights/list`)
      // console.log(res)
      const {meta: {status}, data} = res.data
      if (status === 200) {
        this.list = data
      }
    },
    setRights () {

    }
  }
}
</script>

<style>
.box {
  height: 100%;
}
.btn {
  margin-top: 20px;
}
</style>

<template>
    <!-- el-card小容器 可以理解为自带样式的div -->
    <el-card class="box">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索框 -->
        <el-row class="searchBox">
            <el-col>
                <el-input class="searchInput" placeholder="请输入内容" v-model="query">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button type="primary">添加用户</el-button>
            </el-col>
        </el-row>

        <!-- 表格
        el-table-column 控制列
        lable 控制表头
        prop的值控制的是该列中每一行单元格的内容
        -->
        <el-table :data="list" style="width: 100%">
            <el-table-column prop="id" label="#" width="80">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="100">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="140">
            </el-table-column>
            <el-table-column prop="mobile" label="电话" width="140">
            </el-table-column>
            <el-table-column label="创建日期" width="200">
                <template slot-scope="scope">
                    {{scope.row.create_time|fmtdate}}
                </template>
            </el-table-column>
            <el-table-column label="用户状态" width="120">
                <!-- 前提：单元格内容是一个组件，不是prop的值 -->
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                    <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
    </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 10,
      list: []
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      const AUTH_TOKEN = localStorage.getItem('token')
      //   console.log(AUTH_TOKEN)
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      )
      //   console.log(res)
      const { data, meta: { status, msg } } = res.data
      if (status === 200) {
        this.list = data.users
        console.log(this.list)
      }
    }
  }
}
</script>

<style>
.searchBox {
  margin-top: 20px;
}
.searchInput {
  width: 400px;
}
</style>
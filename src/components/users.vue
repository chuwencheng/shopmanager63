<template>
  <!-- el-card小容器 可以理解为自带样式的div -->
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1="用户管理" level2="用户列表"></cus-bread>
    <!-- 搜索框 -->
    <el-row class="searchBox">
      <el-col>
        <el-input @clear="getAllUsers()" clearable class="searchInput" placeholder="请输入内容" v-model="query">
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="showDiaAddUser()" type="primary">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格
        el-table-column 控制列
        lable 控制表头
        prop的值控制的是该列中每一行单元格的内容
        -->
    <el-table v-loading="loading" :data="list" style="width: 100%">
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
          <el-switch @change="changeState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="showDiaEditUser(scope.row)" type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button @click="showMsgBox(scope.row)" type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button @click="showDiaSetRole(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 对话框 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input disabled v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="formdata" label-width="80px">
        <el-form-item label="用户名">
          {{formdata.username}}
        </el-form-item>
        <el-form-item label="角色">
          {{selectVal}}
          <el-select v-model="selectVal" placeholder="请选择角色名称">
            <el-option label="请选择" :value="-1"></el-option>
            <!-- 其他5个选项 动态生成 -->
            <el-option :label="item.roleName" :value="item.id" v-for="(item) in roles" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 2,
      pagesize: 2,
      total: 1,
      list: [],
      // 对话框
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      // 表单
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 下拉框使用的数据
      selectVal: -1,
      roles: [],
      currUserId: -1,

      loading: true
    };
  },
  created() {
    this.getTableData();
  },

  methods: {
    // 分配角色-修改角色
    async setRole() {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.selectVal
      });
      //   console.log(res)
      const { meta: { msg, status } } = res.data;
      if (status === 200) {
        // 关闭对话框
        this.dialogFormVisibleRole = false;
        // 提示信息
        this.$message.success(msg);
      }
    },
    // 分配角色-显示对话框
    async showDiaSetRole(user) {
      this.currUserId = user.id;
      this.formdata = user;
      this.dialogFormVisibleRole = true;
      // 获取所有角色名称
      const res = await this.$http.get(`roles`);
      // console.log(res)
      const { data, meta: { status } } = res.data;
      if (status === 200) {
        this.roles = data;
        // console.log(this.roles)
      }
      // 获取当前用户的角色id
      const res2 = await this.$http.get(`users/${user.id}`);
      // console.log(res2)
      this.selectVal = res2.data.data.rid;
    },
    // 修改用户状态
    async changeState(user) {
      //   console.log(user)
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      //   console.log(res)
      const { meta: { msg, status } } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      }
    },
    // 编辑-显示对话框
    showDiaEditUser(user) {
      this.dialogFormVisibleEdit = true;
      this.formdata = user;
    },
    // 编辑-发起请求
    async editUser() {
      const res = await this.$http.put(
        `users/${this.formdata.id}`,
        this.formdata
      );
      //   console.log(res)
      const { meta: { status } } = res.data;
      if (status === 200) {
        // 关闭对话框
        this.dialogFormVisibleEdit = false;
        // 更新表格
        this.getTableData();
      }
    },
    // 点击删除图标，弹出确认框
    showMsgBox(user) {
      console.log(user);
      this.$confirm("是否删除用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送删除请求
          const res = await this.$http.delete(`users/${user.id}`);
          //   console.log(res)
          const { meta: { msg, status } } = res.data;
          if (status === 200) {
            // 提示框
            this.$message.success(msg);
            // 删除之后，默认显示第一页
            this.pagenum = 1;
            // 重新刷新列表
            this.getTableData();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 添加用户-发送请求
    async addUser() {
      // 获取表单数据
      const res = await this.$http.post(`users`, this.formdata);
      // console.log(res)
      this.getTableData();
      // 关闭对话框
      this.dialogFormVisibleAdd = false;
    },
    // 添加用户-展示对话框
    showDiaAddUser() {
      this.formdata = {};
      this.dialogFormVisibleAdd = true;
    },
    // 搜索框点击叉号 - 清空时获取所有用户
    getAllUsers() {
      // 此时query值为空字符串
      this.getTableData();
    },
    // 搜索用户
    searchUser() {
      this.pagenum = 1;
      // 按最新的query发送请求
      this.getTableData();
    },
    // 分页相关的方法
    // 当每页条数改变时，发送请求
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    // 根据新页码发送请求
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getTableData();
    },
    // 获取列表数据
    async getTableData() {
      // const AUTH_TOKEN = localStorage.getItem('token')
      // //   console.log(AUTH_TOKEN)
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );

      const data = res.data;
      const { meta: { msg, status } } = data;
      if (status === 200) {
        this.loading = false;
        const { data: { users, total } } = data;
        this.list = users;
        // 获取总共多少条数据
        // this.total = total;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.searchBox {
  margin-top: 20px;
}
.searchInput {
  width: 400px;
}
</style>

<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
        <!-- 按钮 -->
        <el-button class="btn" type="primary">添加角色</el-button>
        <!-- 表格 -->
        <el-table @expand-change="fn" :data="roles" style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row class="level1" v-for="(item1,i) in scope.row.children" :key="item1.id">
                        <el-col :span="4">
                            <el-tag @close="deleRights(scope.row,item1)" closable type="danger">{{item1.authName}}</el-tag>
                            <i class="el-icon-arrow-right"></i>
                        </el-col>
                        <el-col :span="20">
                            <el-row class="level2" v-for="(item2,i) in item1.children" :key="item2.id">
                                <el-col :span="4">
                                    <el-tag @close="deleRights(scope.row,item2)" closable type="info">{{item2.authName}}</el-tag>
                                    <i class="el-icon-arrow-right"></i>
                                </el-col>
                                <el-col :span="20">
                                    <el-tag @close="deleRights(scope.row,item3)" closable class="level3" v-for="(item3,i) in item2.children" :key="item3.id" type="warning">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row v-if="scope.row.children.length===0">
                        <el-col>
                            <span>未分配权限</span>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="160">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="200">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" width="200">
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                    <el-button @click="showDiaSetRights(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 对话框 -->
        <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
            <!-- node-key 每个节点唯一标识，值来源于treedata中的key名 -->
            <el-tree ref="treeDom" :data="treedata" show-checkbox node-key="id" default-expand-all :default-checked-keys="arrCheck" :props="defaultProps">
            </el-tree>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRights()">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      dialogFormVisible: false,
      // 树形结构绑定的数据
      treedata: [],
      //   默认展开的数据【被展开的节点id】
      //   arrExpand: [],
      //   默认选中的数据【被选中的节点id】
      arrCheck: [],
      //   lable和children的值来源于树形结构绑定数据treedata中的key名
      defaultProps: {
        label: "authName",
        children: "children"
      },
      // 当前角色id
      currRoleId: -1
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    // 优化-表格默认只展开一行,展开或关闭都会触发
    fn(row, expandedRows) {
      // expandedRows--所有展开行的数据
      // console.log(row, expandedRows)
      if (expandedRows.length > 1) {
        // 数组shift方法是把数组中的第一个元素移除，并返回第一个数的值
        expandedRows.shift();
      }
    },
    // 点击×，删除权限
    async deleRights(role, rights) {
      // console.log(role,rights)
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      const { meta: { msg, status }, data } = res.data;
      // console.log(data)// data是剩余权限
      if (status === 200) {
        // 提示信息
        this.$message.success(msg);
        // 更新
        // this.getRoles()
        // 优化 - 只更新当前角色权限
        role.children = data;
      }
    },
    // 点击√，显示权限对话框
    async showDiaSetRights(role) {
      console.log(role);
      this.currRoleId = role.id;
      this.dialogFormVisible = true;
      // 获取所有权限
      const res = await this.$http.get(`rights/tree`);
      // console.log(res)
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.treedata = data;
      }

      // 获取当前角色所有id
      // 获取treedata中的所有节点id
      const temp = [];
      role.children.forEach(item1 => {
        //   temp.push(item1.id)
        item1.children.forEach(item2 => {
          //   temp.push(item2.id)
          item2.children.forEach(item3 => {
            temp.push(item3.id);
          });
        });
      });
      //   console.log(temp)
      this.arrCheck = temp;
    },
    // 分配权限
    async setRights() {
      // // // 获取树形结构中的全选id
      const arr1 = this.$refs.treeDom.getCheckedKeys();
      // console.log(arr1)
      // 获取树形结构中的半选id
      const arr2 = this.$refs.treeDom.getHalfCheckedKeys();
      // console.log(arr2)
      // ES6 展开操作运算符
      const arr = [...arr1, ...arr2];
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(",")
      });
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.dialogFormVisible = false;
        this.getRoles();
      }
    },

    // 获取表格数据
    async getRoles() {
      const res = await this.$http.get(`roles`);
      //   console.log(res)
      this.roles = res.data.data;
      //   console.log(this.roles);
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.btn {
  margin-top: 20px;
}
.level1,
.level2 {
  margin-bottom: 10px;
}
</style>
// 展开行拆分方式
// el-row>(el-col>el-tag + el-col>el-row>(el-col>el-tag+el-col>el-tag))

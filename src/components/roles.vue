<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
        <!-- 按钮 -->
        <el-button class="btn" type="primary">添加角色</el-button>
        <!-- 表格 -->
        <el-table :data="roles" style="width: 100%">
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
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: []
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    // 点击×，删除权限
    async deleRights(role,rights) {
        // console.log(role,rights)
        const res = await this.$http.delete(`roles/${role.id}/rights/${rights.id}`)
        const {meta:{msg,status},data} = res.data
        // console.log(data)// data是剩余权限
        if (status === 200) {
            // 提示信息
            this.$message.success(msg)
            // 更新
            // this.getRoles()
            // 优化 - 只更新当前角色权限
            role.children = data
        }
    },
    // 点击√，显示权限对话框
    showDiaSetRights() {

    },
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

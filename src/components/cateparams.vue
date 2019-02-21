<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1="商品管理" level2="分类参数"></cus-bread>
    <!-- alert提示框 -->
    <el-alert class="alert" title="注意:只允许为第三级分类设置参数" type="warning" show-icon>
    </el-alert>
    <!-- 级联功能 -->
    <el-form class="form" label-position="left" label-width="120px" :model="form">
      <el-form-item label="请选择商品分类">
        <!-- 级联功能 -->
        <!-- {{selectedOptions}} -->
        <el-cascader clearable expand-trigger="hover" :options="options" v-model="selectedOptions" @change="handleChange" :props="defaultProp">
        </el-cascader>
      </el-form-item>
    </el-form>
    <!-- tabs切换 -->
    <el-tabs type="border-card" v-model="active" @tab-click="changeTab()">
      <el-tab-pane name="1" label="动态参数">
        <el-button>设置动态参数</el-button>
        <!-- 表格 -->
        <el-table height="450px" stripe :data="arrDy" style="width: 100%">
          <el-table-column type="expand" width="100">
            <template slot-scope="scope">
              <el-tag :key="i" v-for="(attr,i) in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(scope.row,attr)">
                {{attr}}
              </el-tag>

              <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
              </el-input>

              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" width="100"></el-table-column>

          <el-table-column prop="attr_name" label="属性名称" width="240"></el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="2" label="静态参数">
        <el-button>设置静态参数</el-button>
        <!-- 表格 -->
        <el-table height="300px" stripe :data="arrStatic" style="width: 100%">
          <el-table-column type="index" label="#" width="100"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="240"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="240"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      // 级联数据
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // tab 切换数据
      active: "1",
      arrDy: [],
      arrStatic: [],
      // 动态编辑tag数据
      // dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 动态编辑tag标签
    // 删除attr_vals中的值
    async handleClose(item, attr) {
      item.attr_vals.splice(item.attr_vals.indexOf(attr), 1);
      // console.log(item.attr_vals);
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`,
        {
          attr_name: item.attr_name,
          attr_sel: "many",
          attr_vals: item.attr_vals.join(",")
        }
      );
      // console.log(res);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(item) {
      let inputValue = this.inputValue;
      if (inputValue) {
        item.attr_vals.push(inputValue);
        const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`,
          {
            attr_name: item.attr_name,
            attr_sel: "many",
            attr_vals: item.attr_vals.join(",")
          }
        );
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // tab切换时触发
    changeTab() {
      this.getDyOrStatic();
    },
    // 级联变化时触发
    handleChange() {
      this.getDyOrStatic();
    },

    // 获取动态或静态数据
    async getDyOrStatic() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning("请先选择三级分类！");
        // 优化-当点击叉号的时候，清空表格
        if (this.active === "1") {
          this.arrDy = [];
        }
        if (this.active === "2") {
          this.arrStatic = [];
        }
        return;
      }
      if (this.active === "1") {
        // 获取动态数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        //   console.log(res);
        const { meta: { status, msg }, data } = res.data;
        if (status === 200) {
          this.arrDy = data;
          // console.log("动态参数----");
          // 处理this.arrDy中的每个元素的attr_vals
          //trim()可以处理空格问题
          this.arrDy.forEach(item => {
            // 如果item.attr_vals数组长度为0，遍历空数组
            // 如果item.attr_vals数组长度不为0，执行以下代码
            item.attr_vals =
              item.attr_vals.length === 0
                ? []
                : item.attr_vals.trim().split(",");
            //   console.log(item.attr_vals)
          });
          console.log(this.arrDy);
        }
      }
      // 获取静态数据
      if (this.active === "2") {
        // 获取静态数据;
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        const { meta: { status, msg }, data } = res.data;
        if (status === 200) {
          this.arrStatic = data;
          // console.log("静态参数----");
          console.log(this.arrStatic);
        }
      }
    },
    // 获取三级分类数据
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      //   console.log(res)
      // 注意：做级联选择器，从后台获取的数据一定是树状形式的数据
      const { meta: { status, msg }, data } = res.data;
      if (status === 200) {
        this.options = data;
        // console.log(this.options);
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-top: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

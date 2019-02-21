<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="商品管理" level2="商品列表"></cus-bread>
        <!-- 消息提示框 -->
        <el-alert class="alert" title="添加商品信息" type="info" center show-icon>
        </el-alert>
        <!-- 步骤条 -->
        <!-- 基本信息
        商品参数
        商品属性
        商品图片
        商品内容 -->
        <el-steps :active="active*1" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
        </el-steps>

        <!-- 表单 -->
        <el-form class="form" label-position="top" label-width="80px" :model="form">
            <!-- 左侧Tab切换 -->
            <el-tabs @tab-click="changeTab()" class="tab" v-model="active" tab-position="left">
                <el-tab-pane label="基本信息" name="1">
                    <el-form-item label="商品名称">
                        <el-input v-model="form.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="form.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="form.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="form.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <!-- 级联功能 -->
                        <!-- {{selectedOptions}} -->
                        <el-cascader clearable expand-trigger="hover" :options="options" v-model="selectedOptions" @change="handleChange" :props="defaultProp">
                        </el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="2">
                    <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDy" :key="item1.attr_id">
                        <!-- {{checkList}} -->
                        <el-checkbox-group v-model="item1.attr_vals">
                            <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="3">
                    <el-form-item :label="item.attr_name" v-for="(item,i) in arrStatic" :key="item.attr_id">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="4">
                    <el-form-item label="添加图片">
                        <!-- headers 设置头部 -->
                        <!-- 
                            1.图片上传必须全路径
                            2.必须授权（之前设置好的都是axios的API设置headers）
                         -->
                        <el-upload action="http://localhost:8888/api/private/v1/upload" :headers="headers" :on-success="handleSuccess" :on-remove="handleRemove" list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="5">
                    <el-form-item>
                        <el-button @click="addGoods()">添加商品</el-button>
                        <!-- vue项目富文本 -->
                        <quill-editor v-model="form.goods_introduce" class="quill"></quill-editor>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>

        </el-form>
    </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  // goods_name	商品名称	不能为空
  // goods_price	价格	不能为空
  // goods_weight	重量	不能为空
  // goods_number	数量	不能为空
  // goods_cat	以为','分割的分类列表	不能为空

  // goods_introduce	介绍	可以为空
  // pics	上传的图片临时路径（对象）	可以为空
  // attrs  商品的参数（数组）
  data() {
    return {
      active: "1",
      // 添加商品请求时的请求体
      form: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_introduce: "",

        goods_cat: "",
        pics: [],
        attrs: []
      },
      // 级联数据
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 商品参数动态数据
      arrDy: [],
      // 商品参数静态数据
      arrStatic: [],
      // 复选框组
      //   checkList:[]
      // 图片上传设置头部
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    // 级联数据打开页面时就显示
    this.getGoodsCate();
  },
  methods: {
    // 点击任何一个tab选项都能触发
    async changeTab() {
      // 判断如果选择的是第二个选项-商品参数
      // 如果商品分类是三级
      if (this.active === "2" || "3") {
        if (this.selectedOptions.length !== 3) {
          // 提示
          this.$message.error("请先选择三级分类！");
          if (this.active === "2") {
            this.arrDy = [];
          } else {
            this.arrStatic = [];
          }
          return;
        }
        if (this.active === "2") {
          // 获取动态数据;
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
            //   console.log(this.arrDy);
          }
        }
        if (this.active === "3") {
          // 获取静态数据;
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          const { meta: { status, msg }, data } = res.data;
          if (status === 200) {
            this.arrStatic = data;
            // console.log("静态参数----");
            //   console.log(this.arrStatic);
          }
        }
      }
    },
    // 获取三级联动分类数据
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      //   console.log(res)
      // 注意：做级联选择器，从后台获取的数据一定是树状形式的数据
      const { meta: { status, msg }, data } = res.data;
      if (status === 200) {
        this.options = data;
        // console.log(this.options);
      }
    },
    handleChange() {},
    // 图片假上传成功调用
    handleSuccess(res, file, fileList) {
      //   console.log("success----");
      //   console.log(res);
      //   res.data.data.tmp_path
      this.form.pics.push({
        pic: res.data.tmp_path
      });
      //   console.log(this.form.pics)
    },
    // 图片移除成功调用
    handleRemove(file, fileList) {
      // 处理请求体中的pics: []
      // 方法一 ：map方法
      // const Index = this.form.pics.map((item)=>{
      //     return item.pic === file.response.data.tmp_path
      // })
      // 方法二：findIndex 快速找下标ES6
      const Index = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(Index, 1);
      // console.log(this.form.pics)

      //   console.log("remove----");
      //   console.log(file.response.data.tmp_path);
    },
    // 最后-添加商品
    async addGoods() {
      // 处理请求体中的goods_cat
      this.form.goods_cat = this.selectedOptions.join(",");
      // 处理请求体中的attrs 商品的参数数组 可以为空 [{attr_id:?,attr_value:?}]

      // 方法一：1.处理动态数据
      // 可以遍历+return结果并添加到数组的方法 =》forEach
      // const obj1 = {attr_id:"",attr_value:""}
      // const arr1 = []
      // this.arrDy.forEach(item => {
      //     obj1.attr_id = item.attr_id
      //     obj1.attr_value = item.attr_vals
      //     arr1.push(obj1)
      // })
      // 2.处理静态数据
      // const obj2 = {attr_id:"",attr_value:""}
      // const arr2 = []
      // this.arrStatic.forEach(item => {
      //     obj2.attr_id = item.attr_id
      //     obj2.attr_value = item.attr_vals
      //     arr2.push(obj2)
      // })
      // 方法二：处理动态数据
      const arr1 = this.arrDy.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      // 处理静态数据
      const arr2 = this.arrStatic.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      // console.log(arr1)
      // console.log(arr2)
      this.form.attrs = [...arr1, ...arr2];
      console.log(this.form);

      const res = await this.$http.post(`goods`, this.form);
      // console.log(res)
      const { meta: { msg, status }, data } = res.data;
      if (status === 201) {
        // 刷新列表
        this.$router.push({
          name: "goods"
        });
      } else {
        this.$message.error(msg);
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
  margin-top: 10px;
  margin-bottom: 15px;
}
.tab {
  margin-top: 10px;
}
.form {
  height: 400px;
  overflow: auto;
}
.ql-container,
.ql-snow {
  min-height: 200px;
}
</style>

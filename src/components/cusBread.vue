<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  name: 'cusBread',
  // data 中的数据来源于自己
  // level1,level2 的值来源于外部
  data () {
    return {

    }
  },
  props: ['level1', 'level2']

}
</script>

<style>
</style>

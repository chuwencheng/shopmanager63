
<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1="数据统计" level2="数据报表"></cus-bread>
    <!-- 提供容器 -->
    <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</template>

<script>
// 引入echart
import Mychart from "echarts";

export default {
  data() {
    return {};
  },
  mounted() {
    this.initEcharts();
  },
  methods: {
    async initEcharts() {
      // 基于准备好的dom对象，初始化echarts实例
      var myChart = Mychart.init(document.getElementById("main"));

      // 请求数据
      const res = await this.$http.get(`reports/type/1`);
      // console.log(res);
      const option2 = res.data.data;

      // 指定图表的配置项和数据
      const option1 = {
        title: {
          text: "堆叠区域图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        }
      };
      const option = { ...option1, ...option2 };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
</style>

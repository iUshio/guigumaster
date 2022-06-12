<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0">
      <div class="clearfix" slot="header">
        <!-- 头部左侧内容 -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"> </el-tab-pane>
          <el-tab-pane label="访问量" name="visit"> </el-tab-pane>
        </el-tabs>
        <!-- 头部右侧内容 -->
        <div class="right">
          <span>今日</span>
          <span>本周</span>
          <span>本月</span>
          <span>本年</span>
          <!-- 日历 -->
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            size="mini"
            class="date"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6">
            <div class="titleRight">
              <h3>门店{{ title }}排名</h3>
              <ul>
                <li>
                  <span class="rindex">1</span>
                  <span>肯德基</span>
                  <span class="rvalue">123456</span>
                </li>
                <li>
                  <span class="rindex">2</span>
                  <span>肯德基</span>
                  <span class="rvalue">123456</span>
                </li>
                <li>
                  <span class="rindex">3</span>
                  <span>肯德基</span>
                  <span class="rvalue">123456</span>
                </li>
                <li>
                  <span>4</span>
                  <span>肯德基</span>
                  <span class="rvalue">123456</span>
                </li>
                <li>
                  <span>5</span>
                  <span>肯德基</span>
                  <span class="rvalue">123456</span>
                </li>
                <li>
                  <span>6</span>
                  <span>肯德基</span>
                  <span class="rvalue">123456</span>
                </li>
                <li>
                  <span>7</span>
                  <span>肯德基</span>
                  <span class="rvalue">123456</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      //收集日历数据
      date: [],
    };
  },
  mounted() {
    //   初始化echarts实例
    this.myCharts = echarts.init(this.$refs.charts);
    // 配置数据
    this.myCharts.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: ["一月", "二月", "三月", "四月", "五月"],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [3, 22, 13, 17, 49],
          color: "yellowgreen",
        },
      ],
    });
  },
  computed: {
    // 计算title
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
  },
  watch: {
    title() {
      console.log("修改配置数据");
      //重新修改图标的配置数据
      //图标配置数据可以再次修改，如果有新的数值，新的数值，没有新的数值，还是用以前的
      this.myCharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["一月", "二月", "三月", "四月", "五月"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: [3, 22, 13, 17, 49],
            color: "yellowgreen",
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.date {
  width: 200px;
  margin: 0 20px;
}
.right span {
  margin: 0 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  display: flex;
  justify-content: space-between;
  height: 8%;
  margin: 10px 0px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
.titleRight {
}
</style>
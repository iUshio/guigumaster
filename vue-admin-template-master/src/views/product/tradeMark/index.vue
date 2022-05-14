<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0"
      >添加</el-button
    >
    <!-- 表格组件 -->
    <!-- 
        :data：表格组件将来需要展示的数据----数组类型
        border：表格边框
        column属性：
          label显示的标题
          width：对应列的宽度
          align：标题的对齐方式
          type="index"：展示序号
          prop：对应列内容的字段名
       -->
    <el-table style="width: 100%" :data="list" border>
      <el-table-column
        prop="prop"
        label="序号"
        width="80px"
        align="center"
        type="index"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌Logo" width="width">
        <template slot-scope="{ row, $index }">
          <!-- row代表每一条数据 -->
          <!-- 后端被改，图片无法显示为正常 -->
          <img :src="row.logoUrl" alt="" style="width:100px;height:100px;">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" size="mini" >修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器
      :current-page：当前页码
      :total：总计页数
      :page-size：一页展示多少数据
      :page-sizes：手动设置每一页显示的条数
      :pager-count：连续展示的页码数（实际展示数量为count-2，左右各有两个...）
      layout：各组件的位置
      @size-change="handleSizeChange"：改变当前页面展示数据条数
      @current-change="handleCurrentChange"：当前页面发生改变时的回调函数
    -->
    <el-pagination
      style="margin-top: 20px; textAlign: center;"
      :current-page=page
      :total=total
      :page-size=limit
      :page-sizes="[3, 5, 10]"
      :pager-count="5"
      layout=" prev, pager, next, jumper, -> ,sizes , total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      // 分页器第几页
      page: 1,
      // 当前页数展示数据条数
      limit: 3,
      // 总共的数据
      total: 0,
      // 列表展示的数据
      list: [],
    };
  },
  mounted() {
    // 获取列表数据
    this.getPageList();
  },
  methods: {
    // 获取列表数据
    async getPageList(pager = 1) {
      this.page = pager
      // 解构参数
      const { page, limit } = this;
      // 发送请求
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code === 200) {
        // 要展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 修改分页器展示数据条数
    handleSizeChange(limit){
      // 整理参数
      this.limit = limit
      this.getPageList()
    }
  },
};
</script>

<style>
</style>
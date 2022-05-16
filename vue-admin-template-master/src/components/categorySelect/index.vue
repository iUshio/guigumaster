<template>
  <div>
    <!-- 
          :inline：代表行内表单，表示一行内可以放置多个表单元素
          :model：表示将表单的数据提交更新到哪个响应式数据
       -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cForm.category1Id">
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id">
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id">
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "categorySelect",
  data() {
    return {
      // 一级分类数据
      list1: [],
      // 二级分类数据
      list2: [],
      // 三级分类数据
      list3: [],
      // 收集相应的一级二级三级分类id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    //   获取一级分类数据
    this.getCategory1List();
  },
  methods: {
    // 获取一级分类数据的方法
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code === 200) {
        this.list1 = result.data;
      }
    },
    // 获取二级分类数据的方法
    async getCategory2List() {
      const { category1Id } = this.cForm;
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if (result.code === 200) {
        this.list2 = result.data;
      }
    },
    // 获取三级分类数据的方法
    async getCategory3List() {
      const { category2Id } = this.cForm;
      let result = await this.$API.attr.reqCategory3List(category2Id);
      if (result.code === 200) {
        this.list3 = result.data;
      }
    },
  },
  watch: {
    // 监听category1Id变化，当其发生改变时，更新category2的数据
    "cForm.category1Id"() {
      // 清除二级分类与三级分类数据
      if (this.cForm.category2Id) {
        this.cForm.category2Id = "";
        this.list2 = [];
      }
      if (this.cForm.category3Id) {
        this.cForm.category3Id = "";
        this.list3 = [];
      }
      // 重新获取二级分类数据
      if (this.cForm.category1Id) {
        this.getCategory2List();
      }
    },
    // 监听category2Id变化，当其发生改变时，更新category3的数据
    "cForm.category2Id"() {
      // 清除三级分类数据
      if (this.cForm.category3Id) {
        this.cForm.category3Id = "";
        this.list3 = [];
      }
      if (this.cForm.category2Id) {
        this.getCategory3List();
      }
    },
    // 监听category3Id变化，当其发生改变时向父组件传送id，以便发送请求获取平台属性列表
    "cForm.category3Id"() {
      this.$emit("getCategoryId", {
        category1Id: this.cForm.category1Id,
        category2Id: this.cForm.category2Id,
        category3Id: this.cForm.category3Id,
      });
    },
  },
};
</script>

<style>
</style>
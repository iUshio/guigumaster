<template>
  <div>
    <!-- 三级联动 -->
    <el-card style="margin: 20px 0">
      <categorySelect @getCategoryId="getCategoryId"></categorySelect>
    </el-card>
    <!-- 数据表格 -->
    <el-card>
      <!-- 表格 -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="attrList.length === 0"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格，展示平台属性 -->
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 5px 20px"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <!-- 修改按钮 -->
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 修改|新增 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>

        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              ></el-input>
              <span v-else @click="row.flag = true" style="display: block">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" :disabled="!attrInfo.attrName">
          保存
        </el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "attr",
  data() {
    return {
      // 菜单三级id
      categoryId: "",
      // 平台属性
      attrList: [],
      // 是否展示表格
      isShowTable: true,
      // 收集新增|修改属性使用
      attrInfo: {
        // 属性名
        attrName: "",
        // 属性值
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 0,
      },
    };
  },
  methods: {
    // 自定义事件回调，获取三级联动组件选择的id
    getCategoryId({ category1Id, category2Id, category3Id }) {
      // 如果category3Id不为空，则可以向服务器发送请求获取平台属性列表数据
      if (category3Id) {
        this.categoryId = category3Id;
        // 清除原有的平台属性列表数据
        this.attrList = [];
        // 发送请求
        this.getAttrList({ category1Id, category2Id, category3Id });
      } else {
        // 清空已有的平台属性列表数据
        this.attrList = [];
      }
    },
    // 获取平台属性列表数据
    async getAttrList({ category1Id, category2Id, category3Id }) {
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值回调
    addAttrValue() {
      // 向属性值数组添加元素
      // attrId：添加属性的id
      // valueName：属性值的名称
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true,
      });
    },
    // 添加属性按钮回调
    addAttr() {
      // 切换table
      this.isShowTable = false;
      // 清除收集新增|修改属性
      this.attrInfo = {
        // 属性名
        attrName: "",
        // 属性值
        attrValueList: [],
        categoryId: this.categoryId,
        categoryLevel: 0,
      };
    },
    // 修改属性按钮回调
    updateAttr(row) {
      // 切换table
      this.isShowTable = false;
      // 深拷贝（数据结构复杂，需要使用深拷贝解决）
      this.attrInfo = cloneDeep(row);
    },
    // 输入框失焦事件
    toLook(row) {
      // 校验输入框输入，输入为空时不可保存
      if (row.valueName.trim() == "") {
        // 可以删除该项
        this.$message("请输入合理值！");
        return;
      }
      // 新增属性值不可重复
      if (
        this.attrInfo.attrValueList.some((item) => {
          // 去除row
          if (row !== item) {
            return row.valueName == item.valueName;
          }
        })
      ) {
        this.$message("请不要输入重复值！");
        return;
      }

      row.flag = false;
    },
  },
};
</script>

<style>
</style>
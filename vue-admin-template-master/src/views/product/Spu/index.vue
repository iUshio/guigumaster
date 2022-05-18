<template>
  <div>
    <!-- 三级联动 -->
    <el-card style="margin: 20px 0">
      <categorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></categorySelect>
    </el-card>

    <!-- spu列表展示修改与更新 -->
    <el-card>
      <!-- spu列表展示 -->
      <div v-if="scene == 0">
        <!-- 添加spu属性 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >
          添加SPU
          </el-button>
        <!-- spu数据列表 -->
        <el-table style="width: 100%; margin: 10px 0" border :data="records">
          <el-table-column type="index" label="序号" width="80" align>
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="新增"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改"
                @click="changeSku"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <!-- 添加SPU|修改SPU -->
      <SpuForm v-else-if="scene == 1"></SpuForm>
      <!-- 添加SKU -->
      <SkuForm v-else></SkuForm>
    </el-card>
  </div>
</template>

<script>
// 引入子组件
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";

export default {
  name: "spu",
  data() {
    return {
      // 控制三级联动可操作性
      isShowTable: true,
      // 菜单一级id
      category1Id: "",
      // 菜单二级id
      category2Id: "",
      // 菜单三级id
      category3Id: "",
      // spu列表属性当前页码
      page: 1,
      // 每一页展示多少数据
      limit: 3,
      // spu数据列表
      records: [],
      // 分页器一共要展示数据的条数
      total: 0,
      // 切换场景，0代表展示spu列表数据,1代表添加|修改SPU，2代表添加SKU
      scene: 0,
    };
  },
  methods: {
    // 三级联动自定义事件，回传选中的三级ID
    getCategoryId({ category1Id, category2Id, category3Id }) {
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      if (category3Id) {
        this.getSpuList();
      } else {
        // 清除当前页展示的数据（没有3ID）
        this.records = [];
      }
    },
    // 获取spu列表数据的方法
    async getSpuList() {
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code === 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // 点击分页器页数按钮回调
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    // 切换分页器展示数据条数
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加Spu按钮回调
    addSpu(){
      this.scene = 1
    },
    // 修改Spu按钮
    changeSku(){
      this.scene = 1
    }
  },
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style>
</style>
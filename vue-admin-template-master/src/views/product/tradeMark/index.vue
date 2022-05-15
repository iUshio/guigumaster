<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
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
          <!-- index表示排序序号 -->
          <!-- 后端被改，图片无法显示为正常 -->
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
          >
            删除
          </el-button>
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
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      :pager-count="5"
      layout=" prev, pager, next, jumper, -> ,sizes , total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <!-- 
      新增|删除对话框
        title：对话框名字
        :visible.sync：控制对话框显示与隐藏
    -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 
        展示表单元素
          label：表单单项名称
          :label-width：表单单项宽度
          :model：把表单的数据收集到哪个对象的身上，将来elementUI表单验证也需要这个数据
          :rules:表单验证
          prop:验证的数据名称
      -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <!-- 
            上传图片
              :on-success="handleAvatarSuccess"：可以检测到图片上传成功，当图片上传成功，会执行一次
              :before-upload="beforeAvatarUpload"：在图片上传之前执行一次
              action：设置图片上传的地址
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 确认|退出按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
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
      // 当前页列表展示的数据
      list: [],
      // 对话框显示与隐藏的属性
      dialogFormVisible: false,
      // 收集品牌信息
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 对话框表单验证
      rules: {
        // 品牌名称验证规则
        // required表示是否必须，message表示提示信息，trigger表示用户触发行为（blur：失焦，change：文本发生变化时）
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        // 品牌logo验证规则
        logoUrl: [
          { required: true, message: "请上传品牌的图片", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    // 获取列表数据
    this.getPageList();
  },
  methods: {
    // 获取列表数据
    async getPageList(pager = 1) {
      this.page = pager;
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
    handleSizeChange(limit) {
      // 整理参数
      this.limit = limit;
      this.getPageList();
    },
    // 点击添加品牌按钮
    showDialog() {
      // 清除表单数据
      this.tmForm = { tmName: "", logoUrl: "" };
      this.dialogFormVisible = true;
    },
    // 修改品牌按钮
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      // row表示当前选中的品牌信息
      // 将已有的品牌信息赋值给tmForm进行展示
      // 浅拷贝row的数据给tmForm，防止修改了tmForm数据的同时修改了row的数据
      this.tmForm = { ...row };
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res：上传图片后返回的图源下载地址信息
      // file：上传图片后图片的信息
      // 收集品牌图片的数据，方便将来带给服务器
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传验证
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 对话框表单上传，添加品牌或者修改品牌
    addOrUpdateTradeMark() {
      // 当全部的验证字段通过，再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          // 如果校验成功再去执行逻辑
          // 隐藏对话框
          this.dialogFormVisible = false;
          // 发送请求
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code === 200) {
            // 弹出信息：添加品牌成功|修改品牌成功
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            // 重新获取品牌列表
            // 添加品牌停留在第一页，修改品牌留在当前页

            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          // 校验失败
          console.log("faile");
          return false;
        }
      });
    },
    // 删除品牌操作
    deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 用户点击确定按钮时触发
          // 向服务器发送删除请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 再次获取品牌列表数据
            // 当前页还有数据则不进行跳转，当前页没有数据则回到上一页
            this.getPageList(this.list.length > 1? this.page:this.page - 1);
          }
        })
        // 用户点击取消按钮时触发
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
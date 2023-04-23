
<template>
  <div class="app-container">
    <el-form
      ref="clock"
      :model="query_clock"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="名称" prop="clockName">
        <el-input
          v-model="query_clock.clo_name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="findClocks"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="findClocks"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="preAddClock"
          v-hasPermi="['attendance:clock:add']"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="findClocks"
      ></right-toolbar>
    </el-row>
    <el-table
      :data="clocks"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" align="center" prop="clo_name" />
      <el-table-column label="排序" align="center" prop="clo_sort" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="preUpdateClock(scope.row)"
            v-hasPermi="['attendance:clock:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="deleteClockById(scope.row.clo_id)"
            v-hasPermi="['attendance:clock:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total_rows > 0"
      :total="total_rows"
      :page.sync="current_page"
      :limit.sync="page_rows"
      @pagination="findClocks"
    />
    <el-dialog :visible.sync="addClockVisible" title="新增时段" width="500px" append-to-body>
      <el-form ref="addClockForm" :model="current_clock" label-width="80px">
        <el-form-item
          :rules="[
            { required: true, message: '时段名称不能为空', trigger: 'blur' },
          ]"
          prop="clo_name"
          label="时段名称"
        >
          <el-input v-model="current_clock.clo_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="时段序号">
          <el-input-number
            v-model="current_clock.clo_sort"
            :min="0"
            :max="10"
            label="值越大，时段越靠后"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addClockVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClock('addClockForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog :visible.sync="updateClockVisible" title="修改时段">
      <el-form ref="updateClockForm" :inline="true" :model="current_clock">
        <el-form-item
          :rules="[
            { required: true, message: '时段名称不能为空', trigger: 'blur' },
          ]"
          prop="clo_name"
          label="时段名称"
        >
          <el-input v-model="current_clock.clo_name" auto-complete="on" />
        </el-form-item>
        <el-form-item label="时段序号">
          <el-input-number
            v-model="current_clock.clo_sort"
            :min="0"
            :max="10"
            label="值越大，时段越靠后"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateClockVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateClock('updateClockForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveClock, getClocks, deleteClock } from "@/api/attendance/clock";
export default {
  data() {
    return {
      query_clock: {
        clo_name: null,
        page: null,
        size: null,
      },
      current_clock: {
        clo_id: null,
        clo_name: null,
        clo_sort: null,
      },
      addClockVisible: false,
      updateClockVisible: false,
      current_page: 1,
      page_rows: 7,
      total_rows: 0,
      showSearch: true,
      loading: true,
      clocks: [],
    };
  },
  created() {
    this.findClocks();
  },
  methods: {
    tableHeadClassName() {
      return "table-head";
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "success-row";
      }
      return "warning-row";
    },
    findClocks() {
      this.query_clock.page = this.current_page - 1;
      this.query_clock.size = this.page_rows;
      getClocks(this.query_clock).then((response) => {
        if (response.result_code === 5000) {
          if (response.content.content.length <= 0 && this.current_page > 1) {
            this.current_page -= 1;
            this.findClocks();
          } else {
            this.clocks = response.content.content;
            this.total_rows = response.content.totalElements;
          }
        } else {
          this.$message.error(response.result_desc);
        }
      });
    },
    clearCurrentClock() {
      this.current_clock.clo_id = null;
      this.current_clock.clo_name = null;
      this.current_clock.clo_sort = null;
    },
    preAddClock() {
      this.clearCurrentClock();
      this.addClockVisible = true;
    },
    addClock(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveClock(this.current_clock).then((response) => {
            if (response.result_code === 5000) {
              this.findClocks();
              this.$message.success("添加成功");
            } else {
              this.$message.error(response.result_desc);
            }
            this.addClockVisible = false;
          });
        }
      });
    },
    preUpdateClock(row) {
      this.current_clock.clo_id = row.clo_id;
      this.current_clock.clo_name = row.clo_name;
      this.current_clock.clo_sort = row.clo_sort;
      this.updateClockVisible = true;
    },
    updateClock(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveClock(this.current_clock).then((response) => {
            if (response.result_code === 5000) {
              this.findClocks();
              this.$message.success("修改成功");
            } else {
              this.$message.error(response.result_desc);
            }
            this.updateClockVisible = false;
          });
        }
      });
    },
    deleteClockById(clockId) {
      this.$confirm("此操作将永久删除该时段, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteClock({ clo_id: clockId }).then((response) => {
          if (response.result_code === 5000) {
            this.findClocks();
            this.$message.success("时段删除成功");
          } else {
            this.$message.error(response.result_desc);
          }
        });
      });
    },
    handleSizeChange(val) {
      this.page_rows = val;
    },
    handleCurrentChange(val) {
      this.current_page = val;
      this.findClocks();
    },
    resetQuery() {
      this.resetForm("clock");
      this.handleQuery();
    },
  },
};
</script>



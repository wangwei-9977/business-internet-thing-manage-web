<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入姓名"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="queryParams.phone"
              placeholder="请输入手机号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="证件号" prop="idCode">
            <el-input
              v-model="queryParams.idCode"
              placeholder="请输入证件号 "
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!--      <el-form-item label="访客单位" prop="visitDept">-->
          <!--        <el-input-->
          <!--          v-model="queryParams.visitDept"-->
          <!--          placeholder="请输入访客单位"-->
          <!--          clearable-->
          <!--          @keyup.enter.native="handleQuery"-->
          <!--        />-->
          <!--      </el-form-item>-->
          <el-form-item label="车牌号" prop="plateNo">
            <el-input
              v-model="queryParams.plateNo"
              placeholder="请输入车牌号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="工号" prop="jobNo">
            <el-input
              v-model="queryParams.jobNo"
              placeholder="请输入工号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="权限开始时间" prop="startTime">
            <el-date-picker clearable
                            v-model="queryParams.startTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择权限开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="权限结束时间" prop="endTime">
            <el-date-picker clearable
                            v-model="queryParams.endTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择权限结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:bitUser:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:bitUser:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:bitUser:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:bitUser:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="bitUserList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="id" align="center" prop="id" />
          <el-table-column label="姓名" align="center" prop="name" />
          <el-table-column label="手机号" align="center" prop="phone" />
          <!--      <el-table-column label="证件类型：1-身份证；2-护照；" align="center" prop="idType" />-->
          <!--      <el-table-column label="证件号 用密钥加密，取出来再解密" align="center" prop="idCode" />-->
          <el-table-column label="性别" align="center" prop="sex" />
          <!--      <el-table-column label="是否实名 " align="center" prop="isAuth" />-->
          <!--      <el-table-column label="用户昵称" align="center" prop="nickName" />-->
          <el-table-column label="认证图片地址" align="center" prop="authPicUrl" />
          <!--      <el-table-column label="1-一级 姓名身份证 2-二级 照片" align="center" prop="authLevel" />-->
          <!--      <el-table-column label="实名认证时间" align="center" prop="authTime" width="180">-->
          <!--        <template slot-scope="scope">-->
          <!--          <span>{{ parseTime(scope.row.authTime, '{y}-{m}-{d}') }}</span>-->
          <!--        </template>-->
          <!--      </el-table-column>-->
          <!--      <el-table-column label="个人加密因子" align="center" prop="encryKey" />-->
          <el-table-column label="微信openID" align="center" prop="openId" />
          <el-table-column label="帐号状态" align="center" prop="status" />
          <!--      <el-table-column label="下发人脸标识 1未下发 2下发" align="center" prop="isSend" />-->
          <!--      <el-table-column label="用户类型 1&#45;&#45;员工 2&#45;&#45;访客 3&#45;&#45;外协" align="center" prop="userType" />-->
          <!--      <el-table-column label="访客单位" align="center" prop="visitDept" />-->
          <!--      <el-table-column label="民族" align="center" prop="nation" />-->
          <!--      <el-table-column label="地址" align="center" prop="addr" />-->
          <!--      <el-table-column label="身份证图片地址" align="center" prop="idCodePicUrl" />-->
          <el-table-column label="车牌号" align="center" prop="plateNo" />
          <el-table-column label="工号" align="center" prop="jobNo" />
          <!--      <el-table-column label="离职时间" align="center" prop="leaveTime" width="180">-->
          <!--        <template slot-scope="scope">-->
          <!--          <span>{{ parseTime(scope.row.leaveTime, '{y}-{m}-{d}') }}</span>-->
          <!--        </template>-->
          <!--      </el-table-column>-->
          <!--      <el-table-column label="权限开始时间" align="center" prop="startTime" width="180">-->
          <!--        <template slot-scope="scope">-->
          <!--          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>-->
          <!--        </template>-->
          <!--      </el-table-column>-->
          <!--      <el-table-column label="权限结束时间" align="center" prop="endTime" width="180">-->
          <!--        <template slot-scope="scope">-->
          <!--          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>-->
          <!--        </template>-->
          <!--      </el-table-column>-->
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:bitUser:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:bitUser:remove']"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>


    <!-- 添加或修改员工对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="证件号" prop="idCode">
          <el-input v-model="form.idCode" placeholder="请输入证件号" />
        </el-form-item>
<!--        <el-form-item label="是否实名 " prop="isAuth">-->
<!--          <el-input v-model="form.isAuth" placeholder="请输入是否实名 F:未实名 T：实名;N:审核中" />-->
<!--        </el-form-item>-->
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="认证图片地址" prop="authPicUrl">
          <el-input v-model="form.authPicUrl" placeholder="请输入认证图片地址" />
        </el-form-item>
<!--        <el-form-item label="部门id" prop="deptId">-->
<!--          <el-input v-model="form.deptId" placeholder="请输入部门id" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="删除标志" prop="delFlag">-->
<!--          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="下发人脸标识 1未下发 2下发" prop="isSend">-->
<!--          <el-input v-model="form.isSend" placeholder="请输入下发人脸标识 1未下发 2下发" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="访客单位" prop="visitDept">-->
<!--          <el-input v-model="form.visitDept" placeholder="请输入访客单位" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="民族" prop="nation">-->
<!--          <el-input v-model="form.nation" placeholder="请输入民族" />-->
<!--        </el-form-item>-->
        <el-form-item label="地址" prop="addr">
          <el-input v-model="form.addr" placeholder="请输入地址" />
        </el-form-item>
<!--        <el-form-item label="身份证图片地址" prop="idCodePicUrl">-->
<!--          <el-input v-model="form.idCodePicUrl" placeholder="请输入身份证图片地址" />-->
<!--        </el-form-item>-->
        <el-form-item label="车牌号" prop="plateNo">
          <el-input v-model="form.plateNo" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="工号" prop="jobNo">
          <el-input v-model="form.jobNo" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="权限开始时间" prop="startTime">
          <el-date-picker clearable
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择权限开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="权限结束时间" prop="endTime">
          <el-date-picker clearable
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择权限结束时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBitUser, getBitUser, delBitUser, addBitUser, updateBitUser } from "@/api/system/bitUser";
import { deptTreeSelect } from '@/api/system/user'
import Treeselect from '@riophae/vue-treeselect'
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "BitUser",
  dicts: ['sys_normal_disable', 'sys_user_sex'],
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 部门名称
      deptName: undefined,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 部门树选项
      deptOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 员工表格数据
      bitUserList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        phone: null,
        idType: null,
        idCode: null,
        sex: null,
        isAuth: null,
        nickName: null,
        authPicUrl: null,
        authLevel: null,
        authTime: null,
        encryKey: null,
        openId: null,
        expireTime: null,
        cache: null,
        deptId: null,
        status: null,
        isSend: null,
        userType: null,
        visitDept: null,
        nation: null,
        addr: null,
        idCodePicUrl: null,
        plateNo: null,
        jobNo: null,
        personId: null,
        certAddr: null,
        faceId: null,
        isFlag: null,
        orgIndexCode: null,
        iscSend: null,
        blackEndTime: null,
        leaveTime: null,
        startTime: null,
        endTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        idType: [
          { required: true, message: "证件类型：1-身份证；2-护照；不能为空", trigger: "change" }
        ],
        sex: [
          { required: true, message: "性别：0-男；1-女；不能为空", trigger: "change" }
        ],
        isAuth: [
          { required: true, message: "是否实名 F:未实名 T：实名;N:审核中不能为空", trigger: "blur" }
        ],
        encryKey: [
          { required: true, message: "个人加密因子不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDeptTree();
  },
  methods: {
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },
    /** 查询员工列表 */
    getList() {
      this.loading = true;
      listBitUser(this.queryParams).then(response => {
        this.bitUserList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        phone: null,
        idType: null,
        idCode: null,
        sex: null,
        isAuth: null,
        nickName: null,
        authPicUrl: null,
        authLevel: null,
        authTime: null,
        encryKey: null,
        openId: null,
        createTime: null,
        updateTime: null,
        expireTime: null,
        cache: null,
        deptId: null,
        status: null,
        delFlag: null,
        isSend: null,
        userType: null,
        visitDept: null,
        nation: null,
        addr: null,
        idCodePicUrl: null,
        plateNo: null,
        jobNo: null,
        personId: null,
        certAddr: null,
        faceId: null,
        isFlag: null,
        orgIndexCode: null,
        iscSend: null,
        blackEndTime: null,
        leaveTime: null,
        startTime: null,
        endTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加员工";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBitUser(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改员工";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBitUser(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBitUser(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除员工编号为"' + ids + '"的数据项？').then(function() {
        return delBitUser(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/bitUser/export', {
        ...this.queryParams
      }, `bitUser_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

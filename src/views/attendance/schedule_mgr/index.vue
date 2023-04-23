<template>
  <div class="app-container">
    <div class="depart-list">
      <div>
        <el-tree :data="genFullDeparts" :props="departProps" :highlight-current="true" accordion
                 @node-click="handleNodeClick"/>
      </div>
    </div>
    <div class="depart-detail">
      <div class="query-box">
        <el-form :inline="true" :model="userQuery" size="mini">
          <el-form-item label="工号" class="query-item">
            <el-input v-model="userQuery.card_num" placeholder="工号"/>
          </el-form-item>
          <el-form-item label="姓名" class="query-item">
            <el-input v-model="userQuery.user_name" placeholder="姓名"/>
          </el-form-item>
          <el-form-item label="岗位" class="query-item">
            <el-select v-model="userQuery.post_id" filterable clearable placeholder="请选择" >
              <el-option v-for="post in hasPostsOfDepart" :key="post.post_id" :label="post.post_name"
                         :value="post.post_id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是否在职" class="query-item">
            <el-select v-model="userQuery.work_state" clearable placeholder="请选择">
              <el-option label="在职" value="1"/>
              <el-option label="离职" value="0"/>
              <el-option label="休长假" value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="周期排班" class="query-item">
            <el-select v-model="userQuery.schedule_id" filterable clearable placeholder="请选择">
              <el-option v-for="schedule in scheduleList" :key="schedule.schedule_id" :label="schedule.schedule_name"
                         :value="schedule.schedule_id"/>
            </el-select>
          </el-form-item>
          <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="getUsersByDepartId(current_depart.depart_id)"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="getUsersByDepartId(current_depart.depart_id)" class="btn-query">

            </el-button>
          </el-form-item> -->
        </el-form>
      </div>

      <div class="content-box">
        <!-- <div class="op-batch">
          <el-button type="primary" @click="weekInit" class="btn-plain"> 批量修改周期排班</el-button>
          <el-button type="primary" @click="monthInit" class="btn-plain">批量修改每日排班</el-button>
        </div> -->
        <el-table ref="multipleUsersTable" :data="query_users" :header-cell-class-name="tableHeadClassName" :cell-class-name="tableRowClassName" v-loading="loadingData"
                  @selection-change="handleSelectionChange" >
          <!--<el-table-column type="selection" width="55"/>-->
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="card_num" label="工号" width="90" align="center"/>
          <el-table-column prop="user_name" label="姓名" align="center"/>
          <el-table-column prop="work_state" label="是否在职" width="80">
            <template slot-scope="scope">
              <el-tag size="mini" :type="scope.row.work_state === 1 ? 'primary' : 'warning'" disable-transitions>
                {{ isWorking(scope.row.work_state) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="schedule_name" label="周期排班" min-width="120" align="center"/>
          <el-table-column prop="user-update" label="操作" header-align="center" width="230">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="monthPersonInit(scope.row, 'look')">查看</el-button>
              <el-button type="text" size="small" @click="weekPersonInit(scope.row)">修改周期排班</el-button>
              <el-button type="text" size="small" @click="monthPersonInit(scope.row, 'edit')">修改每日排班</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
      v-show="total_rows > 0"
      :total="total_rows"
      :page.sync="current_page"
      :limit.sync="page_rows"
      @pagination="getUsersByDepartId(current_depart.depart_id)"
    />
        <!-- <div class="page-box">
          <div class="total-item">共{{ total_rows }}条</div>
          <el-pagination :total="total_rows" :page-size="page_rows" :current-page="current_page" background
                         layout="prev, pager, next" @current-change="handleCurrentChange"
                         @size-change="handleSizeChange"/>
          <div class="jump-item">
            跳至
            <el-input type="text" v-model="current_page" @change="handleCurrentChange" style="width:24px;height:24px"></el-input>
            页
          </div>
        </div> -->

      </div>

      <!--批量修改周期排班-->
      <el-dialog :visible.sync="weekVisible" title="批量修改周期排班">
        <el-form size="mini" :model="dialogUserQuery" :inline="true">
          <el-form-item label="部门">
            <el-cascader :value="selectDeparts" :options="genFullDeparts" :props="departCascaderProps" :clearable="true"
                         placeholder="试试搜索：部门" filterable clearable change-on-select @change="weekDepartChange"
                         style="width: 140px;"/>
          </el-form-item>
          <el-form-item label="岗位">
            <el-select v-model="dialogUserQuery.post_id" filterable clearable placeholder="请选择" style="width: 140px">
              <el-option v-for="post in hasPostsOfDepart" :key="post.post_id" :label="post.post_name"
                         :value="post.post_id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="dialogUserQuery.role_id" filterable clearable placeholder="请选择" style="width: 140px">
              <el-option v-for="role in allRoles" :key="role.role_id" :label="role.role_name" :value="role.role_id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="dialogUserQuery.user_sex" clearable placeholder="请选择" style="width: 140px">
              <el-option label="男" value="男"/>
              <el-option label="女" value="女"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是否注册">
            <el-select v-model="dialogUserQuery.reg_state" clearable placeholder="请选择" style="width: 113px">
              <el-option label="已注册" value="1"/>
              <el-option label="未注册" value="0"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是否在职">
            <el-select v-model="dialogUserQuery.work_state" clearable placeholder="请选择" style="width: 113px">
              <el-option label="在职" value="1"/>
              <el-option label="离职" value="0"/>
              <el-option label="休长假" value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="工号">
            <el-input v-model="dialogUserQuery.card_num" placeholder="工号" size="mini" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="dialogUserQuery.user_name" placeholder="姓名" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="周期排班">
            <el-select v-model="dialogUserQuery.schedule_id" filterable clearable placeholder="请选择"
                       style="width: 113px">
              <el-option v-for="schedule in scheduleList" :key="schedule.schedule_id" :label="schedule.schedule_name"
                         :value="schedule.schedule_id"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="dialogUserSearch(dialogUserQuery.depart_id)">查询</el-button>
          </el-form-item>
        </el-form>

        <el-form size="mini" :model="dialogWeekForm" :inline="true">

          <el-form-item label="人员选择" :rules="{ required: true, message: '人员选择不能为空', trigger: 'blur'} "
                        prop="selectedPersons">
            <el-transfer v-model="dialogWeekForm.user_ids" :data="userList" :props="userProps"
                         :titles="['未选择人员','已选择人员']"
                         v-loading="dialogUserLoading" style="margin-left: 70px;"/>
          </el-form-item>
          <el-form-item label="周期排班" :rules="{ required: true, message: '周期排班不能为空', trigger: 'change'} "
                        prop="schedule_id">
            <el-select v-model="dialogWeekForm.schedule_id" filterable placeholder="请选择" style="width: 130px">
              <el-option v-for="schedule in scheduleList" :key="schedule.schedule_id" :label="schedule.schedule_name"
                         :value="schedule.schedule_id"/>
            </el-select>
          </el-form-item>
        </el-form>

        <div slot="footer">
          <el-button size="mini" @click="weekVisible=false">取 消</el-button>
          <el-button size="mini" type="primary" @click="weekSubmit">确 定</el-button>
        </div>

      </el-dialog>

      <!--修改个人周期排班-->
      <el-dialog :visible.sync="weekPersonVisible" width="300px" title="修改个人周期排班">
        <el-form size="mini" :model="dialogWeekForm" label-width="80px">
          <el-form-item label="姓名">
            {{weekPersonName}}
            <!--<el-input v-model="weekPersonName" placeholder="姓名"  disabled style="width: 130px"/>-->
          </el-form-item>
          <el-form-item label="周期排班" :rules="{ required: true, message: '周期排班不能为空', trigger: 'blur'} "
                        prop="schedule_id">
            <el-select v-model="dialogWeekForm.schedule_id" filterable placeholder="请选择" style="width: 130px">
              <el-option v-for="schedule in scheduleList" :key="schedule.schedule_id" :label="schedule.schedule_name"
                         :value="schedule.schedule_id"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="weekPersonVisible=false">取 消</el-button>
          <el-button size="mini" type="primary" @click="weekSubmit">确 定</el-button>
        </div>
      </el-dialog>


      <!--批量修改每日排班-->
      <el-dialog :visible.sync="monthVisible" title="批量修改每日排班">
        <el-form size="mini" :model="dialogUserQuery" :inline="true">
          <el-form-item label="部门">
            <el-cascader :value="selectDeparts" :options="genFullDeparts" :props="departCascaderProps" :clearable="true"
                         placeholder="试试搜索：部门" filterable clearable change-on-select @change="weekDepartChange"
                         style="width: 140px;"/>
          </el-form-item>
          <el-form-item label="岗位">
            <el-select v-model="dialogUserQuery.post_id" filterable clearable placeholder="请选择" style="width: 140px">
              <el-option v-for="post in hasPostsOfDepart" :key="post.post_id" :label="post.post_name"
                         :value="post.post_id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="dialogUserQuery.role_id" filterable clearable placeholder="请选择" style="width: 140px">
              <el-option v-for="role in allRoles" :key="role.role_id" :label="role.role_name" :value="role.role_id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="dialogUserQuery.user_sex" clearable placeholder="请选择" style="width: 140px">
              <el-option label="男" value="男"/>
              <el-option label="女" value="女"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是否注册">
            <el-select v-model="dialogUserQuery.reg_state" clearable placeholder="请选择" style="width: 113px">
              <el-option label="已注册" value="1"/>
              <el-option label="未注册" value="0"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是否在职">
            <el-select v-model="dialogUserQuery.work_state" clearable placeholder="请选择" style="width: 113px">
              <el-option label="在职" value="1"/>
              <el-option label="离职" value="0"/>
              <el-option label="休长假" value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="工号">
            <el-input v-model="dialogUserQuery.card_num" placeholder="工号" size="mini" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="dialogUserQuery.user_name" placeholder="姓名" style="width: 140px"/>
          </el-form-item>
          <el-form-item label="周期排班">
            <el-select v-model="dialogUserQuery.schedule_id" filterable clearable placeholder="请选择"
                       style="width: 113px">
              <el-option v-for="schedule in scheduleList" :key="schedule.schedule_id" :label="schedule.schedule_name"
                         :value="schedule.schedule_id"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="dialogUserSearch(dialogUserQuery.depart_id)">查询</el-button>
          </el-form-item>
        </el-form>

        <el-form size="mini" :model="dialogMonthForm" :inline="true">

          <el-form-item label="人员选择" :rules="{ required: true, message: '人员选择不能为空', trigger: 'blur'} "
                        prop="selectedPersons">
            <el-transfer v-model="dialogMonthForm.selectedPersons" :data="userList" :props="userProps"
                         :titles="['未选择人员','已选择人员']"
                         v-loading="dialogUserLoading" style="margin-left: 70px;"/>
          </el-form-item>
          <el-form-item label="每日排班" :rules="{ required: true} ">
            <el-button v-if="dialogMonthForm.dutys.length===0" size="mini" @click="monthDutyInit">请设置</el-button>
            <el-button v-else size="mini" @click="monthDutyInit">已修改{{dialogMonthForm.dutys.length}}天</el-button>
          </el-form-item>
        </el-form>

        <div slot="footer">
          <el-button size="mini" @click="monthVisible=false">取 消</el-button>
          <el-button size="mini" type="primary" @click="monthSubmit">确 定</el-button>
        </div>

      </el-dialog>

      <!--修改每日排班明细-->
      <el-dialog :visible.sync="monthDutyVisible" title="修改每日排班">
        <el-form size="mini" :model="dialogMonthForm" label-width="80px">
          <el-form-item label="排班月份" :rules="{ required: true, message: '请选择排班月份', trigger: 'blur'} ">
            <el-date-picker v-model="dialogMonthForm.start_date" type="month" placeholder="选择排班月份" format="yyyy年MM月"
                            value-format="yyyy-MM-dd" :picker-options="pickerOptions" @change="dateChange"
                            style="width: 180px;"/>
          </el-form-item>
          <el-form-item label="每日排班" :rules="{ required: true} ">
            <span>快捷设置班次: </span>
            <el-select v-model="classSelected" clearable placeholder="请选择" style="width: 130px;" @change="shiftChange">
              <el-option v-for="item in classList" :key="item.class_id" :label="item.class_name"
                         :value="item.class_id"/>
            </el-select>

            <el-table :data="dutySetting" size="mini" tooltip-effect="dark" :height="dutySetting.length>6 ? 318 : null"
                      style="width: 100%;">
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="date" label="日期" width="130"/>
              <el-table-column prop="" label="排班选择">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.value" clearable placeholder="请选择" style="width: 130px;">
                    <el-option v-for="item in classList" :key="item.class_id" :label="item.class_name"
                               :value="item.class_id"/>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>


        </el-form>

        <div slot="footer">
          <el-button size="mini" @click="monthDutyVisible=false">取 消</el-button>
          <el-button size="mini" type="primary" @click="monthDutySubmit">确 定</el-button>
        </div>
      </el-dialog>

      <!--修改/查看个人每日排班明细-->
      <el-dialog :visible.sync="monthPersonVisible" :title=" (monthPersonType === 'edit' ? '编辑' : '查看') + '个人每日排班'">
        <el-form size="mini" :model="dialogMonthForm" label-width="80px">
          <el-form-item label="姓名"> {{monthPersonName}}</el-form-item>
          <el-form-item v-if="monthPersonType!=='edit'" label="周期排班">
            <el-select v-model="monthPersonSchedule" style="width: 180px">
              <el-option v-for="schedule in scheduleList" disabled :key="schedule.schedule_id"
                         :label="schedule.schedule_name" :value="schedule.schedule_id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="排班月份" :rules="{ required: true, message: '请选择排班月份', trigger: 'blur'} ">
            <el-date-picker v-model="dialogMonthForm.start_date" type="month" placeholder="选择排班月份" format="yyyy年MM月"
                            value-format="yyyy-MM-dd" :picker-options="pickerOptions" @change="dateChange"
                            style="width: 180px;"/>
          </el-form-item>
          <el-form-item label="每日排班" :rules="{ required: monthPersonType==='edit'} ">
            <div v-if="monthPersonType==='edit'"><span>快捷设置班次: </span>
              <el-select v-model="classSelected" placeholder="请选择" style="width: 130px;" @change="shiftChange">
                <el-option v-for="item in classList" :key="item.class_id" :label="item.class_name"
                           :value="item.class_id"/>
              </el-select>
            </div>
            <el-table :data="dutySetting" size="mini" tooltip-effect="dark" v-loading="monthPersonLoading"
                      :height=" dutySetting.length > 6 ? 316 : null" style="width: 100%;">
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="date" label="日期" width="130"/>
              <el-table-column v-if="monthPersonType!=='edit'" key="table-name" prop="name" label="每日班次"/>
              <el-table-column v-else prop="value" key="table-value" label="每日排班">
                <template slot-scope="scope">
                  <el-select :disabled="monthPersonType!=='edit'" v-model="scope.row.value" placeholder="未分配"
                             style="width: 130px;">
                    <el-option v-for="item in classList" :key="item.class_name" :label="item.class_name"
                               :value="item.class_id"/>
                  </el-select>
                  <!--<div v-else>-->
                  <!--{{scope.row.value}}-->
                  <!--</div>-->
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>


        </el-form>

        <div slot="footer">
          <el-button size="mini" @click="monthPersonVisible=false">{{monthPersonType === 'edit' ? '取 消' : '确 定'}}
          </el-button>
          <el-button v-if="monthPersonType==='edit'" size="mini" type="primary" @click="monthDutySubmit">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import {getDeparts} from '@/api/attendance/depart';
  import {getPostsByDepartId, getPostsByUserId} from '@/api/attendance/post';
  import {getRoles} from '@/api/attendance/role';
  import {getClasses} from '@/api/attendance/classes';

  import {findUsers, getUsers} from '@/api/attendance/user';
  import {getList, getPersonSchedule, updatePersonSchedule, updatePersonShifts} from '@/api/attendance/schedule';
  import {timestampToTime} from '@/utils/index';


  export default {
    data() {
      return {
        userQuery: {
          card_num: null,
          user_name: null,
          schedule_id: null,
          user_sex: null,
          depart_id: null,
          post_id: null,
          role_id: null,
          reg_state: null,
          work_state: null,
          page: null,
          size: null
        },
        loadingData: false,
        departs: [],
        departProps: {
          label: 'depart_name',
          children: 'children'
        },
        current_depart: {
          depart_id: null,
          parent_id: null,
          depart_name: null,
          tag: null,
          level: 0,
          is_private: 0,
          sort: 0,
          flag: 0
        },

        hasPostsOfDepart: [],
        allRoles: [],
        scheduleList: [],

        multipleUsersSelection: [],
        current_page: 1,
        page_rows: 10,
        total_rows: 0,
        query_users: [],

        weekVisible: false,
        dialogUserQuery: {
          card_num: null,
          user_name: null,
          schedule_id: null,
          user_sex: null,
          depart_id: null,
          post_id: null,
          role_id: null,
          reg_state: null,
          work_state: null,
          page: null,
          size: null
        },
        departCascaderProps: {
          value: 'depart_id',
          label: 'depart_name',
          children: 'children'
        },
        selectDeparts: [],
        userList: [],
        userProps: {
          key: 'user_id',
          label: 'user_name'
        },
        dialogUserLoading: true,
        dialogWeekForm: {
          user_ids: [],
          schedule_id: null
        },
        weekPersonVisible: false,
        weekPersonName: null,


        monthVisible: false,
        dialogMonthForm: {
          selectedPersons: [],
          start_date: null,
          dutys: []
        },
        monthDutyVisible: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },
        classList: [],
        dutySetting: [],
        classSelected: null,

        monthPersonType: 'edit', //edit编辑,look查看
        monthPersonVisible: false,
        monthPersonLoading: false,
        monthPersonName: null,
        monthPersonSchedule: null


      };
    },
    computed: {
      genFullDeparts() {
        var fullDepartList = [];
        if (this.departs == null || this.departs.length <= 0) {
          return fullDepartList;
        }
        this.departs.forEach(departDto => {
          if (departDto.parent_id == null) {
            var depart = {};
            depart.depart_id = departDto.depart_id;
            depart.depart_name = departDto.depart_name;
            depart.children = this.genChildrenDeparts(departDto.depart_id);
            fullDepartList.push(depart);
          }
        });
        return fullDepartList;
      }
    },
    created() {
      this.getAllDepart();
      this.getAllRole();
      this.getUsersByDepartId(null);
      this.getAllSchedule();
      this.getAllClass();
    },
    methods: {
      tableHeadClassName() {
        return 'table-head';
      },
      tableRowClassName({row, rowIndex}) {
          if (rowIndex % 2 == 0) {
            return 'success-row';
          }
          return 'warning-row';
      },
      getAllDepart() {
        this.departs = [];
        getDeparts({}).then(response => {
          if (response.result_code === 5000) {
            // let departs_temp = response.content.departs;
            // departs_temp.forEach((depart) => {
            //   if(!depart.depart_id.indexOf('OUT')){
            //     this.departs.push(depart);
            //   }
            // })
            this.departs = response.content.departs;
          } else {
            this.$message.error(response.result_desc);
          }
        });
      },
      getAllPostsByDepart(departId) {
        this.hasPostsOfDepart = [];
        getPostsByDepartId({depart_id: departId}).then(response => {
          if (response.result_code === 5000) {
            this.hasPostsOfDepart = response.content.posts;
          } else {
            this.$message.error(response.result_desc);
          }
        });
      },
      genChildrenDeparts(departId) {
        var fullDepartList = [];
        if (this.departs == null || this.departs.length <= 0) {
          return fullDepartList;
        }
        this.departs.forEach(departDto => {
          if (departId === departDto.parent_id) {
            var depart = {};
            depart.depart_id = departDto.depart_id;
            depart.depart_name = departDto.depart_name;
            depart.children = this.genChildrenDeparts(departDto.depart_id);
            fullDepartList.push(depart);
          }
        });
        return fullDepartList;
      },

      getAllRole() {
        this.allRoles = [];
        getRoles({}).then(response => {
          if (response.result_code === 5000) {
            this.allRoles = response.content.content;
          } else {
            this.$message.error(response.result_desc);
          }
        });
      },
      resetQuery() {
      this.resetForm("userQuery");
      this.handleQuery();
    },
      getAllSchedule() {
        this.scheduleList = [];
        getList({schedule_name: null, page: -1, size: 10}).then(res => {
          if (res.result_code === 5000) {
            this.scheduleList = res.content.content;
          } else {
            this.$message.error(res.result_desc);
          }
        });
      },
      getAllClass() {
        this.classList = [];
        // this.classList.push({class_id: '-1', class_name: '休息', attend_time: '', total_hours: 0, is_elastic: 0});
        getClasses({att_cla_name: null, page: 0, size: 1000}).then(res => {
          if (res.result_code === 5000) {
            if (res.content.content && res.content.content.length > 0) res.content.content.forEach(v => {
              this.classList.push({
                class_id: v.att_cla_id,
                class_name: v.att_cla_name,
                attend_time: v.claCloDtosList,
                total_hours: v.att_cla_totalHours,
                is_elastic: v.att_cla_isElastic
              });
            });
          } else {
            this.$message.error(res.result_desc);
          }
        });
      },

      handleNodeClick(data) {
        this.current_depart = data;
        this.getAllPostsByDepart(this.current_depart.depart_id);
        this.getUsersByDepartId(this.current_depart.depart_id);
      },
      //搜索查询
      getUsersByDepartId(departId) {
        this.userQuery.page = this.current_page - 1;
        this.userQuery.size = this.page_rows;
        this.userQuery.depart_id = departId;
        this.query_users = [];
        this.loadingData = true;
        findUsers(this.userQuery).then(response => {
          if (response.result_code === 5000) {
            const data = response.content.users;
            // console.log("user shcedule:")
            // console.log(data)
            // console.log("=================")
            // let allUsers = data.content;
            // let total = 0;
            // allUsers.forEach((user) => {
            //   if(!user.user_id.indexOf('OUT')){
            //     this.query_users.push(user);
            //     total = total+1
            //   }
            // })
            this.query_users = data.content;
            this.total_rows = data.totalElements;
            // this.page_rows = data.totalPages;
          } else {
            this.$message.error(response.result_desc);
          }
          this.loadingData = false;
        }).catch(() => this.loadingData = false);
      },
      handleCurrentChange(val) {
        var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
        if (!re.test(val)) {
          this.$message.error('请输入数字');
          return
        }
        if (val <= 0) {
          this.$message.error('页面不能小于1');
          return
        }
         var total_page = parseInt(this.total_rows/this.page_rows);
        if (this.total_rows % this.page_rows != 0) {
          total_page += 1;
        }
        if (val > total_page) {
          this.$message.error('页面不能大于' + total_page);
          return
        }
        this.current_page = val;
        this.getUsersByDepartId(this.current_depart.depart_id);
      },
      handleSizeChange(val) {
        this.page_rows = val;
        this.getUsersByDepartId(this.current_depart.depart_id);
      },
      isWorking(workState) {
        if (workState === 0 || workState === '0') {
          return '离职';
        }
        if (workState === 1 || workState === '1') {
          return '在职';
        }
        if (workState === 2 || workState === '2') {
          return '长休假';
        }
        return workState;
      },
      handleSelectionChange(val) {
        this.multipleUsersSelection = val;
      },


      weekInit() {
        this.weekVisible = true;
        this.dialogWeekForm = {
          user_ids: [],
          schedule_id: null
        };
        this.dialogUserSearch(null);
      },
      weekDepartChange(value) {
        if (value == null) {
          return;
        }
        this.dialogUserQuery.depart_id = value[value.length - 1];
        this.getAllPostsByDepart(value[value.length - 1]);
      },
      dialogUserSearch(departId) {
        this.dialogUserQuery.page = -1;
        this.dialogUserQuery.size = 1000;
        this.dialogUserQuery.depart_id = departId;
        this.userList = [];
        this.dialogUserLoading = true;
        getUsers(this.userQuery).then(response => {
          if (response.result_code === 5000) {
            this.userList = response.content.users;
          } else {
            this.$message.error(response.result_desc);
          }
          this.dialogUserLoading = false;
        }).catch(() => this.dialogUserLoading = false);
      },
      weekSubmit() {
        if (!this.dialogWeekForm.user_ids || this.dialogWeekForm.user_ids.length === 0) {
          this.$message.error('人员选择不能为空');
          return;
        }
        if (!this.dialogWeekForm.schedule_id) {
          this.$message.error('请选择排班周期');
          return;
        }

        updatePersonSchedule(this.dialogWeekForm).then((res) => {
          if (res.result_code === 5000) {
            this.$message({message: '修改周期排班成功', type: 'success'});
            this.getUsersByDepartId(this.current_depart.depart_id);
            this.weekVisible = false;
            this.weekPersonVisible = false;
          } else {
            this.$message.error(res.result_desc);
          }
        });
        console.log(this.dialogWeekForm);
      },
      weekPersonInit(row) {
        this.weekPersonVisible = true;
        this.weekPersonName = row.user_name;
        this.dialogWeekForm = {
          user_ids: [row.user_id],
          schedule_id: row.schedule_id
        };
      },


      monthInit() {
        this.monthVisible = true;
        const now = new Date();
        this.dialogMonthForm = {
          selectedPersons: [],
          start_date: now.getFullYear() + '-' + (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1) + '-01',
          dutys: []
        };
        // this.dateChange();
        this.dialogUserSearch(null);
      },
      monthSubmit() {
        if (!this.dialogMonthForm.selectedPersons || this.dialogMonthForm.selectedPersons.length === 0) {
          this.$message.error('人员选择不能为空');
          return;
        }
        if (!this.dialogMonthForm.dutys || this.dialogMonthForm.dutys.length === 0) {
          this.$message.error('请修改每日排班');
          return;
        }

        let reqData = {
          user_ids: this.dialogMonthForm.selectedPersons,
          classes: this.dialogMonthForm.dutys.map((v) => {
            return {id: v.user_cla_id || null, att_cla_id: v.value, date: new Date(v.date)};
          })
        };

        updatePersonShifts(reqData).then((res) => {
          if (res.result_code === 5000) {
            this.$message({message: '批量修改每日排班成功', type: 'success'});
            this.getUsersByDepartId(this.current_depart.depart_id);
            this.monthVisible = false;
          } else {
            this.$message.error(res.result_desc);
          }
        });

      },
      monthDutyInit() {
        this.monthPersonType = 'edit';
        this.monthDutyVisible = true;
        this.classSelected = null;

        this.dateChange();
        if (this.dialogMonthForm.dutys.length > 0) {

          const strs = this.dialogMonthForm.dutys.map(r => r.date);
          this.dutySetting.forEach(v => {
            if (strs.indexOf(v.date) > -1) v.value = this.dialogMonthForm.dutys[strs.indexOf(v.date)].value;// ? this.dialogMonthForm.dutys[strs.indexOf(v.date)].value : '-1';
          });
        }
      },
      dateChange() {
        let end = new Date(this.dialogMonthForm.start_date);
        end.setMonth(end.getMonth() + 1);
        end.setDate(end.getDate() - 1);
        const monthLen = end.getDate();
        const day = end.getMonth() > new Date().getMonth() ? 1 : new Date().getDate();
        this.dutySetting = [];
        for (let i = (this.monthPersonType === 'edit' ? day : 1); i <= monthLen; i++) {
          this.dutySetting.push({
            date: this.dialogMonthForm.start_date.substring(0, 8) + (i < 10 ? '0' : '') + i,
            // disabled: (i + 1) >= day?1:0,
            value: null,
            name: ''
          });
        }
        if (this.monthPersonType !== 'edit' || this.monthPersonVisible) this.monthDutyGet();
      },
      monthDutySubmit() {
        if (!this.dialogMonthForm.start_date) {
          this.$message.error('请选择排班月份');
          return;
        }
        if (this.dutySetting.length === 0 || this.dutySetting.filter(r => r.value !== null && r.value !== '').length === 0) {
          this.$message.error('至少设置一天的排班');
          return;
        }
        this.dialogMonthForm.dutys = this.dutySetting.filter(r => r.value !== null && r.value !== '').map(v => {
          // if (v.value === '-1') v.value = '';
          return v;
        });


        if (this.monthPersonVisible) { //个人每日班次修改提交
          let reqData = {
            user_ids: this.dialogMonthForm.selectedPersons,
            classes: this.dialogMonthForm.dutys.map((v) => {
              return {id: v.user_cla_id || null, att_cla_id: v.value, date: new Date(v.date)};
            })
          };

          updatePersonShifts(reqData).then((res) => {
            if (res.result_code === 5000) {
              this.$message({message: '修改每日排班成功', type: 'success'});
              this.getUsersByDepartId(this.current_depart.depart_id);
              this.monthPersonVisible = false;
            } else {
              this.$message.error(res.result_desc);
            }
          });
        } else {
          this.monthDutyVisible = false;
        }

      },

      shiftChange(val) {
        this.dutySetting.forEach(v => {
          v.value = val;
        });
      },

      //个人的每日排班获取
      monthDutyGet() {
        this.monthPersonLoading = true;
        getPersonSchedule({
          user_id: this.dialogMonthForm.selectedPersons[0],
          date: new Date(this.dialogMonthForm.start_date)
        }).then((res) => {
          if (res.result_code === 5000) {
            let personClass = res.content;
            // const dateStr = this.dialogMonthForm.start_date.substring(0, 8);
            personClass.forEach((v) => {
              v.date = timestampToTime(v.date).substring(0, 10); //dateStr + (i < 9 ? '0' : '') + (i + 1);
            });
            const strs = personClass.map(v => v.date);
            this.dutySetting.forEach(v => {
              if (strs.indexOf(v.date) > -1) {
                v.value = personClass[strs.indexOf(v.date)].att_cla_id;//|| '-1';
                v.name = personClass[strs.indexOf(v.date)].att_cla_name;// || '休息 ';
              }
            });
          } else {
            this.$message.error(res.result_desc);
          }
          this.monthPersonLoading = false;
        }).catch(() => {
          this.monthPersonLoading = false;
        });
      },
      monthPersonInit(row, type) {
        this.monthPersonType = type;
        this.classSelected = null;
        const now = new Date();
        this.monthPersonVisible = true;
        this.monthPersonName = row.user_name;
        this.dialogMonthForm = {
          selectedPersons: [row.user_id],
          start_date: now.getFullYear() + '-' + (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1) + '-01',
          dutys: []
        };
        this.dateChange();

        if (this.dialogMonthForm.dutys.length > 0) {
          const strs = this.dialogMonthForm.dutys.map(r => r.date);
          this.dutySetting.forEach(v => {
            if (strs.indexOf(v.date) > -1) v.value = this.dialogMonthForm.dutys[strs.indexOf(v.date)].value;// ? this.dialogMonthForm.dutys[strs.indexOf(v.date)].value : '-1';
          });
        }

        if (this.monthPersonType !== 'edit') {
          this.monthPersonSchedule = row.schedule_id;
        }
      }


    }
  };
</script>
<style scoped>
.page-box .total-item {
  position: absolute;
  right: 210px;
  top: 10px;
}
.page-box {
  position: relative;
  margin-top: 20px;
  text-align: right;
  margin-right: 80px;
  background-color: #fff;
}
.app-container {
    position: relative;
    width: 100%;
    min-height: calc(100vh - 88px);
    /*background-color: #f0f4ff;*/
    padding: 14px 14px 14px 14px;
    overflow: hidden;
    font: 14px/14px \5FAE\8F6F\96C5\9ED1;
    color: #606266;
    display: flex;
}
.app-container .depart-list{
    width: 21%;
    /* min-height: calc(100vh - 88px); */
    float: left;
    background-color: #ffffff;
    margin-right: 14px;
    padding: 14px 14px 14px 14px;
  }
  .app-container .depart-detail{
    width: 77%;
    min-height: calc(100vh - 88px);
    float: left;
    /* background-color: #ffffff; */
    /* padding: 14px 14px 14px 14px; */
    flex: 1;
  }
</style>


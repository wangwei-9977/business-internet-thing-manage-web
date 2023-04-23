
<template>
  <div class="app-container">
    <el-form
      size="mini"
      ref="schedule"
      :model="query_schedule"
      :inline="true"
      label-width="68px"
    >
      <el-form-item class="query-item" label="排班名称" prop="schedule_name">
        <el-input
          v-model="query_schedule.schedule_name"
          class="input-with-select"
          placeholder="请输入排班名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="search"
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
          @click="addSchedule"
          v-hasPermi="['attendance:schedule:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          @click="editSchedule"
          v-hasPermi="['attendance:schedule:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="scheduleDelete"
          v-hasPermi="['attendance:schedule:remove']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="search"
      ></right-toolbar>
    </el-row>
    <el-table
      :data="schedules"
      :header-cell-class-name="tableHeadClassName"
      :cell-class-name="tableRowClassName"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        type="index"
        label="序号"
        align="center"
      ></el-table-column>
      <el-table-column prop="schedule_name" label="排班名称" align="center" />
      <el-table-column prop="loop_time" label="周期天数" align="center" />
      <el-table-column prop="start_date" label="开始时间" align="center">
        <template slot-scope="scope">
          {{ transformDate(scope.row.start_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="start_date" label="混合模板" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.is_blend === 1 ? 'primary' : 'warning'"
            disable-transitions
          >
            {{ scope.row.is_blend ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="option"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editSchedule(scope.row)"
            v-hasPermi="['attendance:schedule:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="scheduleDelete(scope.row)"
            v-hasPermi="['attendance:schedule:remove']"
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
      @pagination="search"
    />

    <!-- 添加或修改周期排班对话框 -->
    <el-dialog :visible.sync="saveScheduleVisible" title="设置周期排班">
      <el-form :model="form" label-width="120px" size="mini">
        <el-form-item prop="schedule_name" label="排班名称:">
          <el-input
            v-model="form.schedule_name"
            placeholder="请输入排班名称"
            size="small"
            style="width: 180px"
          ></el-input>
        </el-form-item>

        <el-form-item prop="user_ids" label="参与考勤人员:">
          <el-button plain @click="dutyPersonInit" size="small">
             {{
              this.form.user_ids.length > 0 ? this.form.user_ids.length + "人" : "请选择"
            }}  
          </el-button>
        </el-form-item>

        <el-form-item label="开始日期:" prop="start_date">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="form.start_date"
            type="datetime"
            size="small"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            align="right"
            style="width: 180px"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="编辑模式:">
          <div>
            <el-radio v-model="editType" label="1" @change="editTypeChange"
              >固定班制(每天考勤一样)</el-radio
            >
          </div>
          <div style="margin-top: 20px">
            <el-radio v-model="editType" label="2" @change="editTypeChange"
              >排班制(自定义设置考勤时间)</el-radio
            >
          </div>
          <div style="margin-top: 20px">
            <el-radio v-model="editType" label="3" @change="editTypeChange"
              >混合排班(按现有排班进行二次排班)</el-radio
            >
          </div>
        </el-form-item>
        <el-form-item v-if="editType === '1'" label="工作日设置:">
          <span>快捷设置班次: 休息</span>
          <el-button type="text" size="mini" @click="dutyWeekInit"
            >更改班次</el-button
          >
          <el-table
            ref="workTable"
            :data="work_classes"
            tooltip-effect="dark"
            @selection-change="dutyWeekCheckChange"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              prop="class_name"
              label="工作日"
              width="120"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="attend_time"
              label="工作时间段"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="option"
              label="操作"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="dutyWeekInit(scope.row)"
                  >更改班次</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="dutyWeekclear(scope.row)"
                  >删除班次</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-if="editType === '2'" label="考勤班次">
          <el-button
            v-if="dutyCycleShifts.length <= 0"
            plain
            size="mini"
            @click="dutyCycleShiftInit"
            >选择班次
          </el-button>
          <el-button
            v-if="dutyCycleShifts.length > 0"
            plain
            size="mini"
            @click="dutyCycleShiftInit"
            style="max-width: 100%; text-align: left"
          >
            <span v-for="(tag, index) in dutyCycleShifts" :key="index">
              <el-tag
                size="mini"
                :type="tagType[index % 4]"
                :disable-transitions="false"
                closable
                style="margin-right: 5px; margin-bottom: 5px"
                @close="closeTag(tag)"
              >
                {{ tag.class_name }}
              </el-tag>
              <br v-if="(index + 1) % 4 === 0"
            /></span>
          </el-button>
        </el-form-item>

        <el-form-item
          v-if="
            editType === '2' && dutyCycleShifts && dutyCycleShifts.length > 0
          "
          label="排班周期:"
        >
          <el-button
            v-if="!dutyCycles || dutyCycles.length <= 0"
            plain
            size="mini"
            @click="dutyCycleInit"
            >请设置排班周期
          </el-button>
          <div v-else>
            <el-table
              size="mini"
              :data="dutyCycles"
              tooltip-effect="dark"
              style="width: 100%"
            >
              <el-table-column
                label="周期班次"
                prop="valueStr"
              ></el-table-column>
              <el-table-column
                label="周期天数"
                prop="loop_time"
              ></el-table-column>
              <!--<el-table-column label="开始日期" prop="start_date"/>-->
              <el-table-column prop="option" label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="dutyCycleInit(scope.row)"
                    >设置</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>

        <el-form-item v-if="editType === '3'" label="月份设置:">
          <span>快捷设置排班: 休息</span>
          <el-button type="text" size="mini" @click="monthScheduleInit"
            >更改排班</el-button
          >
          <el-table
            :data="month_schedules"
            size="mini"
            tooltip-effect="dark"
            @selection-change="handleSecheduleChange"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              prop="schedule_month"
              label="月份"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="schedule_name"
              label="排班类型"
            ></el-table-column>
            <el-table-column prop="option" label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="monthScheduleInit(scope.row)"
                  >更改排班</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="holidayStatus" @change="holidayChange"
            >法定节假日自动排休</el-checkbox
          >
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="medium" @click="saveSchedule"
            >保存设置</el-button
          >
          <el-button type="primary" size="medium" @click="goback"
            >返回</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--考勤人员设置-->
    <el-dialog
      :visible.sync="dutyPersonVisible"
      title="参与考勤人员"
      width="50%"
    >
      <el-form
        :model="dutyPersonQuery"
        :inline="true"
        size="small"
        label-width="70px"
      >
        <el-form-item label="部门">
          <el-cascader :value="selectDeparts" :options="genFullDeparts" :props="departCascaderProps"
                       style="width: 180px;"
                       placeholder="试试搜索：部门" filterable change-on-select @change="departSelecedChange"/>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            v-model="dutyPersonQuery.userName"
            clearable
            auto-complete="off"
            style="width: 180px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dutyPersonGet">查询</el-button>
        </el-form-item>
      </el-form>
      <el-transfer
        v-model="selectedPersons"
        :data="query_users"
        :props="userProps"
        :titles="['未分配人员', '已分配人员']"
        v-loading="dutyPersonLoading"
        filterable
      ></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dutyPersonVisible = false"
          >取 消</el-button
        >
        <el-button size="mini" type="primary" @click="dutyPersonSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--工作日班次选择-->
    <el-dialog :visible.sync="dutyWeekVisible" title="选择班次">
      <el-form :model="dutyWeekQuery" :inline="true" label-width="120px">
        <el-form-item style="float: right">
          <el-input
            v-model="dutyWeekQuery.name"
            size="mini"
            placeholder="请输入班次名称"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="dutyWeekSearch"
            ></i>
          </el-input>
        </el-form-item>
      </el-form>

      <el-table
        :data="dutyWeekShifts"
        tooltip-effect="dark"
        size="mini"
        height="298"
        style="width: 100%"
      >
        <el-table-column label="" width="55">
          <template scope="scope">
            <el-radio
              :label="scope.row.class_id"
              v-model="dutyWeekType"
              @change.native="dutyWeekChange(scope.$index, scope.row)"
              >&nbsp
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="class_name"
          label="班次名称"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="total_hours"
          label="总工时"
          width="120"
        ></el-table-column>
        <el-table-column prop="is_elastic" label="是否弹性">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.is_elastic === 1 ? 'primary' : 'warning'"
              disable-transitions
            >
              {{ isElastic(scope.row.is_elastic) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dutyWeekVisible = false"
          >取 消</el-button
        >
        <el-button size="mini" type="primary" @click="dutyWeekSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--排班制 班次选择-->
    <el-dialog :visible.sync="dutyCycleShiftVisible" title="选择班次">
      <el-form :model="dutyCycleShiftQuery" :inline="true" label-width="120px">
        <el-form-item style="float: right">
          <el-input
            v-model="dutyCycleShiftQuery.att_cla_name"
            size="medium"
            placeholder="请输入班次名称"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="dutyCycleShiftSearch"
            ></i>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table
        size="mini"
        ref="multipleClassesTable"
        :data="dutyCycleShiftLists"
        tooltip-effect="dark"
        height="298"
        style="width: 100%"
        @selection-change="handleSelClassChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          prop="class_name"
          label="班次名称"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="total_hours"
          label="总工时"
          width="120"
        ></el-table-column>
        <el-table-column prop="is_elastic" label="是否弹性">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.is_elastic === 1 ? 'primary' : 'warning'"
              disable-transitions
            >
              {{ isElastic(scope.row.is_elastic) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dutyCycleShiftVisible = false"
          >取 消</el-button
        >
        <el-button size="mini" type="primary" @click="dutyCycleShiftSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--设置排班周期-->
    <el-dialog :visible.sync="dutyCycleVisible" title="设置排班周期">
      <el-form :model="dutyCycleSetting" size="mini" label-width="120px">
        <el-form-item
          label="每个周期天数:"
          :rules="{
            required: true,
            message: '请输入周期天数',
            trigger: 'change',
          }"
          prop="loop_time"
        >
          <el-input-number
            :min="2"
            :max="31"
            v-model="dutyCycleSetting.loop_time"
            controls-position="right"
            @change="handleChange"
          ></el-input-number>
          <span
            >以{{
              dutyCycleSetting.loop_time
            }}天为周期进行循环，最大周期天数为31天</span
          >
        </el-form-item>
        <el-form-item
          v-for="item in dutyCycleSetting.loop_time"
          :key="item"
          :label="'第' + item + '天:'"
        >
          <el-select
            v-model="dutyCycleSetting.values[item - 1]"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dutyCycleShifts"
              :key="item.class_id"
              :label="item.class_name"
              :value="item.class_id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dutyCycleVisible = false"
          >取 消</el-button
        >
        <el-button size="mini" type="primary" @click="dutyCycleSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--月份设置 排班选择-->
    <el-dialog :visible.sync="monthScheduleVisible" title="选择排班">
      <el-form :model="monthScheduleQuery" :inline="true" label-width="120px">
        <el-form-item style="float: right">
          <el-input
            v-model="monthScheduleQuery.name"
            size="mini"
            placeholder="请输入排班名称"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="monthScheduleSearch"
            ></i>
          </el-input>
        </el-form-item>
      </el-form>

      <el-table
        :data="monthScheduleLists"
        tooltip-effect="dark"
        size="mini"
        height="298"
        style="width: 100%"
      >
        <el-table-column label="" width="55">
          <template scope="scope">
            <el-radio
              :label="scope.row.schedule_id"
              v-model="monthScheduleType"
              @change.native="monthScheduleChange(scope.$index, scope.row)"
              >
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="schedule_name"
          label="排班名称"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="loop_time"
          label="周期天数"
          width="120"
        ></el-table-column>
        <el-table-column prop="start_date" label="开始时间">
          <template slot-scope="scope">
            {{ transformDate(scope.row.start_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="start_date" label="混合模板" width="90">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.is_blend === 1 ? 'primary' : 'warning'"
              disable-transitions
            >
              {{ scope.row.is_blend ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="monthScheduleVisible = false"
          >取 消</el-button
        >
        <el-button size="mini" type="primary" @click="monthScheduleSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  getSchedule,
  deleteSchedule,
  saveSchedule,
} from "@/api/attendance/schedule";
import { timestampToTime } from "@/utils/index";
import { getDeparts } from "@/api/attendance/depart";
import { getUsers } from "@/api/attendance/user";
import { getPostsByDepartId } from "@/api/attendance/post";
import { getClasses } from "@/api/attendance/classes";
import{formatDate,} from "@/utils/index";

export default {
  data() {
    return {
      query_schedule: {
        schedule_name: null,
        page: null,
        size: null,
      },
      schedules: [],
      current_page: 1,
      page_rows: 5,
      total_rows: 0,
      showSearch: true,
      saveScheduleVisible: false,
      form: {
        schedule_id: null,
        schedule_name: "",
        start_date: "",
        loop_time: 0,
        is_holiday: 0,
        is_blend: 0,
        classess: [], //班次集合{class_id,class_no班次序号}
        children_blends: [], //混合模版集合 {child_id排班ID,month月份}
        user_ids: [], //用户ID集合
      },
      holidayStatus: false,
      editType: "1",
      weekDay: 0,

      getInfo: false, //是否已请求列表

      scheduleQuery: {
        schedule_name: null,
        page: 0,
        size: 1000,
      },
      scheduleList: [],
      month_schedules: [
        {
          id: 0,
          schedule_month: "一月",
          schedule_name: "休息",
          schedule_id: "1001",
        },
        {
          id: 1,
          schedule_month: "二月",
          schedule_name: "休息",
          schedule_id: "1002",
        },
        {
          id: 2,
          schedule_month: "三月",
          schedule_name: "休息",
          schedule_id: "1003",
        },
        {
          id: 3,
          schedule_month: "四月",
          schedule_name: "休息",
          schedule_id: "1004",
        },
        {
          id: 4,
          schedule_month: "五月",
          schedule_name: "休息",
          schedule_id: "1005",
        },
        {
          id: 5,
          schedule_month: "六月",
          schedule_name: "休息",
          schedule_id: "1006",
        },
        {
          id: 6,
          schedule_month: "七月",
          schedule_name: "休息",
          schedule_id: "1007",
        },
        {
          id: 7,
          schedule_month: "八月",
          schedule_name: "休息",
          schedule_id: "1008",
        },
        {
          id: 8,
          schedule_month: "九月",
          schedule_name: "休息",
          schedule_id: "1009",
        },
        {
          id: 9,
          schedule_month: "十月",
          schedule_name: "休息",
          schedule_id: "1010",
        },
        {
          id: 10,
          schedule_month: "十一月",
          schedule_name: "休息",
          schedule_id: "1011",
        },
        {
          id: 11,
          schedule_month: "十二月",
          schedule_name: "休息",
          schedule_id: "1012",
        },
      ],
      monthScheduleChecked: [],
      monthScheduleVisible: false,
      monthScheduleQuery: { name: "" },
      monthScheduleLists: [], //筛选后的排班类型集合
      monthScheduleType: "",
      monthScheduleValue: "",

      dutyPersonVisible: false,
      dutyPersonLoading: false,
      dutyPersonQuery: {
        card_num: null,
        user_name: null,
        depart_id: null,
        post_id: null,
        role_id: null,
        hire_date: null,
      },

      departCascaderProps: {
        value: "depart_id",
        label: "depart_name",
        children: "children",
      },
      hasPostsOfDepart: [],
      selectedPersons: [],
      query_users: [],
      userProps: {
        key: "user_id",
        label: "user_name",
      },

      dutyWeekVisible: false,
      dutyWeekQuery: { name: "" },
      dutyWeekShifts: [], //筛选后的排班类型集合
      dutyWeekType: "",
      dutyWeekTypeValue: "",
      work_classes: [
        { id: 0, class_name: "周一", attend_time: "休息", class_id: "1001" },
        { id: 1, class_name: "周二", attend_time: "休息", class_id: "1022" },
        { id: 2, class_name: "周三", attend_time: "休息", class_id: "1033" },
        { id: 3, class_name: "周四", attend_time: "休息", class_id: "1044" },
        { id: 4, class_name: "周五", attend_time: "休息", class_id: "1055" },
        { id: 5, class_name: "周六", attend_time: "休息", class_id: "1066" },
        { id: 6, class_name: "周日", attend_time: "休息", class_id: "1077" },
      ],
      work_classes_classIds: ["1001","1022","1033","1044","1055","1066","1077",""],
      dutyWeekChecked: [],
      shiftSelected: null,

      dutyCycleShiftVisible: false,
      dutyCycleShiftQuery: {
        att_cla_name: null,
        page: 0,
        size: 1000,
      },
      dutyCycleShiftLists: [], // 排班集合
      dutyCycleShiftChecked: [], // 选择中的排班集合
      tagType: ["", "success", "info", "warning", "danger"],
      dutyCycleVisible: false,
      dutyCycleShifts: [], // 排班可选
      dutyCycleIds: [], //排班id集合
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      dutyCycleSetting: {
        //排班周期
        // start_date: '',
        loop_time: 2,
        values: [], // 具体值
      },
      dutyCycles: [], //周期列表
      departs: [],
      selectDeparts: [],
      classes: [],
    };
  },
  computed: {
    genFullDeparts() {
      var fullDepartList = [];
      if (this.departs == null || this.departs.length <= 0) {
        return fullDepartList;
      }
      this.departs.forEach((departDto) => {
        if (departDto.parent_id == null) {
          var depart = {};
          depart.depart_id = departDto.depart_id;
          depart.depart_name = departDto.depart_name;
          depart.children = this.genChildrenDeparts(departDto.depart_id);
          fullDepartList.push(depart);
        }
      });
      return fullDepartList;
    },
  },
  created() {
    this.getScheduleList();
    this.getAllDepart();
    this.shiftInit();
    this.scheduleListGet();
    this.scheduleGet();
    this.search();
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
    getScheduleList() {
      this.query_schedule.page = this.current_page - 1;
      this.query_schedule.size = this.page_rows;
      getList(this.query_schedule).then((response) => {
        if (response.result_code === 5000) {
          if (response.content.content.length === 0 && this.current_page > 1) {
            this.current_page -= 1;
            this.getScheduleList();
          } else {
            this.schedules = response.content.content;
            this.total_rows = response.content.totalElements;
          }
        } else {
          this.$message.error(response.result_desc);
        }
      });
    },
    preAddSchedule() {},
    clearForm() {
      this.form.schedule_id = null;
      this.form.schedule_name = "";
      this.form.start_date = "";
      this.form.loop_time = 0;
      this.form.is_holiday = 0;
      this.form.is_blend = 0;
      this.form.classess = [];
      this.form.children_blends = [];
      this.form.userIds = [];
    },
    addSchedule() {
      this.clearForm();
      this.saveScheduleVisible = true;
    },
    editSchedule(row) {
      //this.$router.push({ path: "/scheduleModify/" + schedule_id });
      this.clearForm();
      this.saveScheduleVisible = true;
      this.title = "修改周期排班";
      const id = row.schedule_id || this.ids;
      getSchedule({schedule_id: row.schedule_id }).then((response) => {
        this.saveScheduleVisible = true;
        this.title = "修改周期排班";
        this.form.schedule_id = response.content.schedule_id;
        this.form.schedule_name = response.content.schedule_name;
        this.form.start_date = response.content.start_date;
        this.form.loop_time = response.content.loop_time;
        this.form.is_holiday = response.content.is_holiday;
        this.form.is_blend = response.content.is_blend;
        this.form.classess = response.content.classess;
        this.form.children_blends = response.content.children_blends;
        this.form.user_ids = response.content.user_ids;
        this.holidayStatus = this.form.is_holiday === 1;
        if (this.form.start_date) {
          this.form.start_date = formatDate(this.form.start_date);
          this.weekDay = new Date(this.form.start_date).getDay();
        }
        this.scheduleInit();
        
      });
      // this.$nextTick(() => {
      //   this.form.schedule_id = row.schedule_id;
      //   this.form.schedule_name = row.schedule_name;
      //   this.form.start_date = row.start_date;
      //   this.form.loop_time = row.loop_time;
      //   this.form.is_holiday = row.is_holiday;
      //   this.form.is_blend = row.is_blend;
      //   this.form.classess = row.classess;
      //   this.form.children_blends = row.children_blends;
      //   this.form.userIds = row.user_ids;
      //   this.holidayStatus = this.form.is_holiday === 1;
      //   if (this.form.start_date) {
      //     this.form.start_date = formatDate(this.form.start_date);
      //     this.weekDay = new Date(this.form.start_date).getDay();
      //   }
      //   getSchedule(
      //     {schedule_id: row.schedule_id }).then((data) => 
      //      {
      //       this.form = data.schedule;
      //       this.holidayStatus = this.form.is_holiday === 1;
      //       if (this.form.start_date) {
      //         this.form.start_date = formatDate(this.form.start_date);
      //         this.weekDay = new Date(this.form.start_date).getDay();
      //       }
      //       this.scheduleInit();
      //     }
      //   );
      //   this.scheduleInit();
      // });
    },
    
    
    scheduleDelete(row) {
      this.$confirm("是否确认删除当前排班周期?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteSchedule({ schedule_id: row.schedule_id })
            .then((res) => {
              if (res.result_code === 5000) {
                this.$message({ type: "success", message: "删除成功!" });
                this.getScheduleList();
              } else {
                this.$message.error(res.result_desc);
              }
            })
            .catch(() => {
              //this.$message.error("删失败！请重试！");
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    dutyWeekclear(row) {
      row.attend_time = "休息";
      row.dutyWeekType = "";
      row.dutyWeekTypeValue = ""; //'休息';
      
      if(row.id === 0){
        row.class_id = '1001';
      }else if (row.id === 1){
        row.class_id = '1022';
      }else if (row.id === 2){
        row.class_id = '1033';
      }else if (row.id === 3){
        row.class_id = '1044';
      }else if (row.id === 4){
        row.class_id = '1055';
      }else if (row.id === 5){
        row.class_id = '1066';
      }else if (row.id === 6){
        row.class_id = '1077';
      }
      this.dutyFormInit();
    },
    preUpdateSchedule() {},
    updateSchedule() {},
    search() {
      this.current_page = 1;
      this.getScheduleList();
    },
    handleSizeChange(val) {
      this.page_rows = val;
    },
    handleCurrentChange(val) {
      this.current_page = val;
      this.getScheduleList();
    },
    transformDate(date) {
      return timestampToTime(date);
    },
    resetQuery() {
      this.resetForm("schedule");
      this.handleQuery();
    },
    //班次信息获取
    shiftInit() {
      this.classes = [];
      // this.classes.push({class_id: '', class_name: '休息', attend_time: '', total_hours: 0, is_elastic: 0});
      getClasses(this.dutyCycleShiftQuery).then((res) => {
        if (res.result_code === 5000) {
          if (res.content.content && res.content.content.length > 0)
            res.content.content.forEach((v) => {
              this.classes.push({
                class_id: v.att_cla_id,
                class_name: v.att_cla_name,
                attend_time: v.claCloDtosList,
                total_hours: v.att_cla_totalHours,
                is_elastic: v.att_cla_isElastic,
              });
            });
        } else {
          this.$message.error(res.result_desc);
        }
      });
    },
    //排班列表
    scheduleListGet() {
      this.scheduleList = [];
      getList(this.scheduleQuery).then((res) => {
        if (res.result_code === 5000) {
          this.scheduleList = res.content.content;
        } else {
          this.$message.error(res.result_desc);
        }
      });
    },
    //获取排班信息
    scheduleGet() {
      if (
        (this.scheduleList.length === 0 || this.classes.length === 0) &&
        !this.getInfo
      ) {
        setTimeout(() => {
          this.scheduleGet();
        }, 100);
      } else {
        this.getInfo = true;
        if (this.$route.params.schedule_id) {
          getSchedule({ schedule_id: this.$route.params.schedule_id })
            .then((res) => {
              if (res.result_code === 5000) {
                this.form = res.content;
                this.holidayStatus = this.form.is_holiday === 1;
                if (this.form.start_date) {
                  this.form.start_date = timestampToTime(this.form.start_date);
                  this.weekDay = new Date(this.form.start_date).getDay();
                }
              } else {
                this.$message.error(res.result_desc);
              }
              this.scheduleInit();
            })
            .catch(() => this.scheduleInit());
        }
      }
    },
    //排班信息 不同类型初始化
    scheduleInit() {
      if (this.form.is_blend) {
        //混合排班
        this.editType = "3";
      } else {
        //非混合排班
        this.editType = this.form.loop_time === 7 ? "1" : "2";
      }
      this.editTypeChange();
    },
    //工作日展示顺序处理
    changeDate() {
      const oldDay = this.weekDay;
      this.weekDay = new Date(this.form.start_date).getDay(); //周天值为0
      this.weekDay = this.weekDay === 0 ? 7 : this.weekDay; //周天转为7
      const num = this.weekDay - oldDay; //周几递增量
      if (this.editType !== "1") return; //固定班制模式排序
      this.form.classess.forEach((v) => {
        v.class_no =
          v.class_no <= num
            ? v.class_no - num + 7
            : v.class_no - num > 7
            ? v.class_no - num - 7
            : v.class_no - num;
      });
      this.form.classess.sort((a, b) => (a.class_no > b.class_no ? 1 : -1));

      const weeks = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
      let day = this.weekDay - 1;
      this.work_classes = [];
      for (let temp = 0; temp < 7; temp++) {
        let obj = this.form.classess.find((r) => r.class_no === temp + 1);
        this.work_classes.push({
          id: this.work_classes.length,
          class_name: weeks[day],
          attend_time: obj
            ? this.classes.find((r) => r.class_id === obj.class_id).class_name
            : "休息", //'休息',
          class_id: obj ? obj.class_id : "",
        });
        day = day === 6 ? 0 : day + 1;
      }
    },

    /**
     *  考勤人员 弹窗
     */
    dutyPersonInit() {
      this.dutyPersonVisible = true;
      this.selectedPersons = this.form.user_ids;
      this.dutyPersonGet();
    },
    dutyPersonGet() {
      this.dutyPersonLoading = true;
      getUsers(this.dutyPersonQuery)
        .then((res) => {
          if (res.result_code === 5000) {
            this.query_users =[];
            // var res_user = res.content.users;
            this.query_users = res.content.users;
          // res_user.forEach((usertemp) => {
          //   if(!usertemp.user_id.indexOf('OUT')){
          //     this.query_users.push(usertemp)
          //   }
          // });
          } else {
            this.$message.error(res.result_desc);
          }
          this.dutyPersonLoading = false;
        })
        .catch(() => (this.dutyPersonLoading = false));
    },
    dutyPersonSubmit() {
      this.form.user_ids = this.selectedPersons;
      console.log(this.form.user_ids.length)
      this.dutyPersonVisible = false;
    },
    // 删除班次
    dutyWeekDelete(row, index) {
          this.dutyWeekType = '';
          this.dutyWeekTypeValue = ''; // '休息';
          this.work_classes[index].attend_time = '休息';
          this.work_classes[index].class_id = '';
          this.dutyFormInit();
        },

    dutyWeekInit(row) {
      this.dutyWeekShifts = this.classes;
      this.dutyWeekType = "";
      this.dutyWeekTypeValue = ""; //'休息';
      if (row && row.class_name) {
        this.dutyWeekType = row.class_id;
        let shifts = this.dutyWeekShifts.find(
          (v) => v.class_id === row.class_id
        );
        this.dutyWeekTypeValue = shifts ? shifts.class_name : "";
        this.dutyWeekChecked = [];
        this.dutyWeekChecked.push(row);
      } else {
      }
      this.dutyWeekVisible = true;
    },
    dutyWeekSearch() {
      this.monthScheduleLists = this.classes.filter(
        (v) => v.class_name.indexOf(this.dutyWeekQuery.name) > -1
      );
    },
    dutyWeekCheckChange(val) {
      this.dutyWeekChecked = val;
    },
    dutyWeekChange(index, row) {
      this.dutyWeekType = row.class_id;
      this.dutyWeekTypeValue = row.class_name;
    },
    dutyWeekSubmit() {
      if (!this.dutyWeekType && !this.dutyWeekTypeValue) return;
      if (
        this.dutyWeekChecked &&
        this.dutyWeekChecked.length > 0 &&
        this.dutyWeekChecked[0].class_name
      ) {
        const checkIds = this.dutyWeekChecked.map((v) => v.id);
        this.work_classes.forEach((v) => {
          if (checkIds.indexOf(v.id) > -1) {
            v.class_id = this.dutyWeekType;
            v.attend_time = this.dutyWeekTypeValue;
          }
        });
      } else {
        this.work_classes.forEach((v) => {
          v.class_id = this.dutyWeekType;
          v.attend_time = this.dutyWeekTypeValue;
        });
        
        this.dutyWeekChecked=this.work_classes;
       
      }
 console.log('this.dutyWeekChecked',this.dutyWeekChecked);
      this.dutyFormInit();
      this.dutyWeekVisible = false;
    },
    holidayChange() {
      this.form.is_holiday = this.holidayStatus ? 1 : 0;
    },

    dutyCycleShiftInit() {
      this.dutyCycleShiftLists = this.classes;
      this.dutyCycleShiftVisible = true;
      this.$nextTick(() => {
        let before = this.dutyCycleShifts;
        this.$refs["multipleClassesTable"].clearSelection();
        if (before && before.length > 0) {
          before.forEach((v) =>
            this.$refs["multipleClassesTable"].toggleRowSelection(v)
          );
        }
      });
    },
    dutyCycleShiftSearch() {
      this.dutyCycleShiftLists = this.classes.filter(
        (v) => v.class_name.indexOf(this.dutyCycleShiftQuery.name) > -1
      );
    },
    handleSelClassChange(val) {
      this.dutyCycleShiftChecked = val;
    },
    dutyCycleShiftSubmit() {
      this.dutyCycleShifts = this.dutyCycleShiftChecked;
      this.dutyCycles = [];
      this.dutyCycleShiftVisible = false;
    },
    closeTag(tag) {
      this.dutyCycleShiftChecked.splice(
        this.dutyCycleShiftChecked.indexOf(tag),
        1
      );
      this.dutyCycleShifts = this.dutyCycleShiftChecked;
      this.dutyCycles = [];
    },

    dutyCycleInit(row) {
      if (row && row.values) {
        this.dutyCycleSetting = {
          // start_date: row.start_date,
          loop_time: row.loop_time,
          values: row.values,
        };
      } else {
        this.dutyCycleSetting = { loop_time: 2, values: [] };
      }
      if (
        this.dutyCycleSetting.values.length === 0 &&
        this.dutyCycleShifts.length > 0
      ) {
        for (let i = 0; i < this.dutyCycleSetting.loop_time; i++) {
          this.dutyCycleSetting.values.push(this.dutyCycleShifts[0].class_id);
        }
      }
      this.dutyCycleVisible = true;
    },
    handleChange(value) {
      for (
        let i = this.dutyCycleSetting.values.length;
        i < this.dutyCycleSetting.loop_time;
        i++
      ) {
        this.dutyCycleSetting.values.push(this.dutyCycleShifts[0].class_id);
      }
    },
    dutyCycleSubmit(index) {
      const strs = this.dutyCycleShifts.map((v) => v.class_id);
      let cycle = {
        // start_date: this.dutyCycleSetting.start_date,
        loop_time: this.dutyCycleSetting.loop_time,
        values: this.dutyCycleSetting.values,
        valueStr: this.dutyCycleSetting.values
          .map((v) => this.dutyCycleShifts[strs.indexOf(v)].class_name)
          .join("-"),
      };
      if (!index) {
        this.dutyCycles.push(cycle);
      } else {
        this.dutyCycles.splice(index, 1, cycle);
      }
      this.dutyFormInit();
      this.dutyCycleVisible = false;
    },

    handleSecheduleChange(val) {
      this.monthScheduleChecked = val;
    },
    monthScheduleInit(row) {
      this.monthScheduleLists = this.scheduleList;
      this.monthScheduleType = "";
      this.monthScheduleValue = ""; //'休息';
      if (row && row.schedule_name) {
        this.monthScheduleType = row.schedule_id;
        let shifts = this.monthScheduleLists.find(
          (v) => v.schedule_id === row.schedule_id
        );
        this.monthScheduleValue = shifts ? shifts.schedule_name : "";
        this.monthScheduleChecked = [];
        this.monthScheduleChecked.push(row);
      } else {
      }
      this.monthScheduleVisible = true;
    },
    monthScheduleSearch() {
      this.monthScheduleLists = this.scheduleList.filter(
        (v) => v.schedule_name.indexOf(this.monthScheduleQuery.name) > -1
      );
    },
    goback() {
      this.saveScheduleVisible = false;
    },
    monthScheduleChange(index, row) {
      this.monthScheduleType = row.schedule_id;
      this.monthScheduleValue = row.schedule_name;
    },
    monthScheduleSubmit() {
      if (!this.monthScheduleType) return;
      if (
        this.monthScheduleChecked &&
        this.monthScheduleChecked.length > 0 &&
        this.monthScheduleChecked[0].schedule_name
      ) {
        const checkIds = this.monthScheduleChecked.map((v) => v.id);
        this.month_schedules.forEach((v) => {
          if (checkIds.indexOf(v.id) > -1) {
            v.schedule_id = this.monthScheduleType;
            v.schedule_name = this.monthScheduleValue;
          }
        });
      } else {
        this.month_schedules.forEach((v) => {
          v.schedule_id = this.monthScheduleType;
          v.schedule_name = this.monthScheduleValue;
        });
      }

      this.dutyFormInit();
      this.monthScheduleVisible = false;
    },

    //编辑模式切换
    editTypeChange() {
      if (this.editType === "1") {
        this.form.is_blend = 0;
        this.changeDate();
      } else if (this.editType === "2") {
        this.form.is_blend = 0;
        // this.dutyCycleSetting.start_date = this.form.start_date;
        this.dutyCycleSetting.loop_time = this.form.loop_time;
        this.dutyCycleSetting.values = [];
        let temp = 0;
        let strs = [];
        this.dutyCycleShifts = [];
        this.form.classess.sort((a, b) => (a.class_no > b.class_no ? 1 : -1));
        this.form.classess.forEach((v, index) => {
          if (index + 1 != v.class_no) {
            //休息的补齐
            for (; temp + 1 < v.class_no; ) {
              this.dutyCycleSetting.values.push("");
              temp++;
            }
            strs.push("");
          }
          this.dutyCycleSetting.values.push(v.class_id);
          strs.push(v.class_id);
          temp++;
        });

        for (; temp < this.form.loop_time; temp++) {
          this.dutyCycleSetting.values.push("");
          strs.push("");
        }

        if (!this.dutyCycleShifts || this.dutyCycleShifts.length === 0)
          this.dutyCycleShifts = this.classes.filter(
            (r) => strs.indexOf(r.class_id) > -1
          );
        this.dutyCycles = [];
        this.dutyCycles.push({
          start_date: this.form.start_date,
          loop_time: this.form.loop_time,
          values: this.dutyCycleSetting.values,
          valueStr: this.dutyCycleSetting.values
            .map(
              (v) =>
                this.dutyCycleShifts.find((r) => r.class_id === v).class_name
            )
            .join("-"),
        });
      } else if (this.editType === "3") {
        this.form.is_blend = 1;
        this.month_schedules = [];
        const months = [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月",
        ];
        let temp = 0;
        this.form.children_blends.sort((a, b) => (a.month > b.month ? 1 : -1));
        this.form.children_blends.forEach((v, index) => {
          if (index + 1 != v.month) {
            //休息的补齐
            for (; temp + 1 < v.month; ) {
              this.month_schedules.push({
                id: temp,
                schedule_month: months[temp],
                schedule_name: "", //'休息',
                schedule_id: "",
              });
              temp++;
            }
          }

          let shift = this.scheduleList.find(
            (r) => r.schedule_id === v.schedule_id
          );
          this.month_schedules.push({
            id: temp,
            schedule_month: months[temp],
            schedule_name: shift.schedule_name,
            schedule_id: v.schedule_id,
          });
          temp++;
        });
        for (; temp < 12; temp++) {
          this.month_schedules.push({
            id: temp,
            schedule_month: months[temp],
            schedule_name: "",
            schedule_id: "",
          }); //休息
        }
      }
    },
    //班次安排初始化
    dutyFormInit() {
      if (this.editType === "1") {
        this.form.loop_time = 7;
        this.form.start_date = timestampToTime(
          this.getFirstDayOfWeek(new Date()).getTime()
        );
        this.form.classess = this.work_classes
          .map((v, index) => {
              return { class_id: v.class_id, class_no: index + 1 };
          })
          .filter(v => {
            if(v.class_id !==""){
            let tempItem = this.work_classes_classIds.find(ids => v.class_id === ids) 
            return tempItem ? false : true;
            }
            
          } );
        this.form.is_blend = 0;
        this.form.children_blends = [];
      } else if (this.editType === "2") {
        this.form.loop_time = this.dutyCycleSetting.loop_time;
        this.form.classess = this.dutyCycleSetting.values
          .map((v, index) => {
            return { class_id: v, class_no: index + 1 };
          })
          .filter((v) => v.class_id);
        this.form.is_blend = 0;
        this.form.children_blends = [];
      } else if (this.editType === "3") {
        this.form.loop_time = 0;
        this.form.start_date = new Date().getFullYear() + "-01-01";
        this.form.classess = [];
        this.form.is_blend = 1;
        this.form.children_blends = this.month_schedules
          .map((v, index) => {
            return { child_id: v.schedule_id, month: index + 1 };
          })
          .filter((v) => v.child_id);
      }
    },
    getFirstDayOfWeek(date) {
      let day = date.getDay() || 7;
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1 - day
      );
    },

    genChildrenDeparts(departId) {
      var fullDepartList = [];
      if (this.departs == null || this.departs.length <= 0) {
        return fullDepartList;
      }
      this.departs.forEach((departDto) => {
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
    getAllDepart() {
      getDeparts({}).then((response) => {
        if (response.result_code === 5000) {
           console.log('this.departs_before',this.departs);
          const data = response.content;
          // this.departs = [];
          // var departs_temp =data.departs;
          // departs_temp.forEach((departtemp) => {
          //   if(!departtemp.depart_id.indexOf('OUT')){
          //     console.log('departtemp',departtemp);
          //     this.departs.push(departtemp)
          //   }
          // });
          // console.log('this.departs',this.departs);
          this.departs = data.departs;
        } else {
          this.$message.error(response.result_desc);
        }
      });
    },
    getAllPostsByDepart(departId) {
      getPostsByDepartId({ depart_id: departId }).then((response) => {
        if (response.result_code === 5000) {
          this.hasPostsOfDepart = response.content.posts;
        } else {
          this.$message.error(response.result_desc);
        }
      });
    },
    departSelecedChange(value) {
      if (value == null) {
        return;
      }
      this.dutyPersonQuery.depart_id = value[value.length - 1];
      this.getAllPostsByDepart(value[value.length - 1]);
    },

    addNeedClockDate() {},
    addUnNeedClockDate() {},

    isElastic(state) {
      return state === 1 || state === "1" ? "是" : "否";
    },
    saveSchedule() {
      if (!this.form.schedule_name) {
        this.$message.error("排班名称不能为空");
        return;
      }
      if (!this.form.start_date) {
        this.$message.error("请选择开始时间");
        return;
      }
      if (!this.form.user_ids || this.form.user_ids.length === 0) {
        this.$message.error("请选择考勤人员");
        return;
      }
      if (this.editType === "2") {
        if (
          this.dutyCycles.length === 0 &&
          this.dutyCycleShiftLists.length === 0
        ) {
          this.$message.error("请选择考勤班次");
          return;
        }
        if (this.dutyCycles.length === 0) {
          this.$message.error("请设置排班周期");
          return;
        }
      }
      console.log(this.form);
      saveSchedule(this.form)
        .then((res) => {
          if (res.result_code === 5000) {
            this.$message({ message: "排班保存成功", type: "success" });
            setTimeout(() => {
             this.saveScheduleVisible = false;
             this.getScheduleList();
            }, 500);
          } else {
            this.$message.error(res.result_desc);
          }
        })
        .catch((err) => {
          this.$message.error("保存失败！请重试！");
        });
    },
    transformDate(date) {
      return timestampToTime(date);
    }
  }
};
</script>

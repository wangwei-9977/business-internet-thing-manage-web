<template>
  <div class="app-container">
        <el-form ref="classes" :model="query_classes" :inline="true" label-width="68px">
          <el-form-item label="班次名称" prop="att_cla_name">
            <el-input v-model="query_classes.att_cla_name" class="input-with-select" placeholder="请输入班次名称"></el-input>
          </el-form-item>
<el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="getClasses"
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
          @click="preAddClasses"
          v-hasPermi="['attendance:classes:add']"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getClasses"
      ></right-toolbar>
    </el-row>

        <el-table :data="classes" :header-cell-class-name="tableHeadClassName" :cell-class-name="tableRowClassName">
           <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="att_cla_name" label="班次名称" align="center"/>
          <el-table-column label="考勤时间">
            <template v-if="scope.row.claCloDtosList && scope.row.claCloDtosList.length > 0" slot-scope="scope" >
              <div v-for="clo in scope.row.claCloDtosList" :key="clo.clo_id">
                {{ formatAttendTime(clo) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :formatter="formatTotalHour" label="总工时" align="center"/>
          <el-table-column
            prop="att_cla_isElastic"
            label="是否弹性"
            width="100">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.att_cla_isElastic === 1 ? 'primary' : 'warning'"
                disable-transitions>{{ isElastic(scope.row.att_cla_isElastic) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="option" label="操作" align="center"
        class-name="small-padding fixed-width">
            <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="preUpdateClasses(scope.row)"
            v-hasPermi="['attendance:classes:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="deleteClassesById(scope.row.att_cla_id)"
            v-hasPermi="['attendance:classes:remove']"
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
      @pagination="getClasses"
    />

    <el-dialog :visible.sync="uploadClassesVisible" :title="classes_title">
      <el-form :model="class_clock" size="mini">
        <el-form-item label="班次名称">
          <el-input v-model="class_clock.att_cla_name" auto-complete="on" style="width: 120px"/>
        </el-form-item>
        <el-form-item label="是否弹性">
          <!--<el-checkbox v-model="class_clock.att_cla_isElastic" @change="culTotalHour">是否弹性</el-checkbox>-->
          <el-select v-model="class_clock.att_cla_isElastic" filterable style="width: 80px">
            <el-option :value="1" label="是"/>
            <el-option :value="0" label="否"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="class_clock.att_cla_isElastic == 0">
          <label>设置时间段</label>
        </el-form-item>
        <el-form-item>
          <el-table v-if="class_clock.att_cla_isElastic == 0" ref="clockTable" :data="class_clock.claCloDtosList" tooltip-effect="dark" size="mini" style="width: 100%">
            <el-table-column prop="clo_name" label="时间段" />
            <el-table-column :formatter="genOnWorkTime" label="上班时间段" />
            <el-table-column :formatter="genOffWorkTime" label="下班时间段" />
            <el-table-column :formatter="allowLateTime" label="允许迟到时间" />
            <el-table-column :formatter="allowEarlyTime" label="允许早退时间" />
            <el-table-column prop="delete" label="操作" width="150px">
              <template slot-scope="scope">
                <el-button size="mini" @click="preUpdateClock(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="总工时">
          <el-input v-model="class_clock.att_cla_totalHours" :disabled="class_clock.att_cla_isElastic == 0" auto-complete="on" style="width: 80px"/>
          <span>小时</span>
          <!--<el-time-picker-->
            <!--v-model="class_clock.att_cla_totalHours"-->
            <!--:picker-options="{-->
              <!--selectableRange: '00:00:00 - 23:59:59'-->
            <!--}"-->
            <!--:disabled="!class_clock.att_cla_isElastic"/>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadClassesVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateClasses">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="updateClockVisible" width="800px" title="添加时间段">
      <el-form :model="clock" size="mini" label-width="50px">
        <el-form-item label="时段">
          <el-select v-model="clock.clo_name" filterable disabled placeholder="请选择时段" style="width: 120px" @change="clockChange">
            <el-option v-for="clock in all_clocks" :key="clock.clo_id" :label="clock.clo_name" :value="clock"/>
          </el-select>
        </el-form-item>
        <el-form-item label="上班">
          <div class="agent-value">
            <el-time-picker
              v-model="clock.onWorkClockDate"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
              size="mini"
              placeholder="开始时间"
              format="HH:mm:ss"
              style="width: 120px"/>
            <div class="agent-label">~</div>
            <el-time-picker
              v-model="clock.onWorkDate"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
              size="mini"
              placeholder="结束时间"
              format="HH:mm:ss"
              style="width: 120px"/>
          </div>
          <div class="agent-label">
            允许迟到
            <el-input-number :min="0" :max="60" v-model="clock.allowLateTime" controls-position="right" class="_input_num"/>
            分钟
          </div>
          <div class="agent-label">
            <el-select v-model="clock.onWorkClockState" filterable class="_input_sort">
              <el-option :value="1" label="必须"/>
              <el-option :value="0" label="不用"/>
            </el-select>
            打卡
          </div>
        </el-form-item>
        <el-form-item label="下班">
          <div class="agent-value">
            <el-time-picker
              v-model="clock.offWorkDate"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
              placeholder="开始时间"
              format="HH:mm:ss"
              style="width: 120px"/>
            <span class="agent-label">~</span>
            <el-time-picker
              v-model="clock.offWorkClockDate"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
              placeholder="结束时间"
              format="HH:mm:ss"
              style="width: 120px"/>
          </div>
          <div class="agent-label">
            允许早退
            <el-input-number :min="0" :max="60" v-model="clock.allowEarlyTime" controls-position="right" class="_input_num"/>
            分钟
          </div>
          <div class="agent-label">
            <el-select v-model="clock.offWorkClockState" filterable class="_input_sort">
              <el-option :value="1" label="必须"/>
              <el-option :value="0" label="不用"/>
            </el-select>
            打卡
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateClock">取 消</el-button>
        <el-button type="primary" @click="updateClock">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addClasses, getClasses, deleteClasses } from '@/api/attendance/classes'
import { getClocks } from '@/api/attendance/clock'
export default {
  data() {
    return {
      query_classes: {
        att_cla_name: null,
        page: null,
        size: null
      },
      clock: {
        clo_id: null,
        clo_name: null,
        onWorkClockDate: null,
        onWorkDate: null,
        onWorkClockState: null,
        offWorkDate: null,
        offWorkClockDate: null,
        offWorkClockState: 0,
        allowLateTime: 0,
        allowEarlyTime: 0
      },
      // 显示搜索条件
      showSearch: true,
      classes_title: '新增',
      all_clocks: [],
      classes: [],
      current_page: 1,
      page_rows: 5,
      total_rows: 0,
      multipleSelection: [],
      uploadClassesVisible: false,
      updateClockVisible: false,
      class_clock: {
        att_cla_id: null,
        att_cla_name: null,
        att_cla_isElastic: null,
        att_cla_totalHours: null,
        claCloDtosList: []
      }
    }
  },
  computed: {
  },
  created() {
    this.getAllClocks()
    this.getClasses()
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
    getAllClocks() {
      var query_clock = {}
      query_clock.page = -1
      getClocks(query_clock).then(response => {
        if (response.result_code === 5000) {
          this.all_clocks = response.content.content
          console.log(this.all_clocks)
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    getClasses() {
      this.query_classes.page = this.current_page - 1
      this.query_classes.size = this.page_rows
      getClasses(this.query_classes).then(response => {
        console.log(response)
        if (response.result_code === 5000) {
          if (response.content.content.length === 0 && this.current_page > 1) {
            this.current_page -= 1
            this.getClasses()
          } else {
            this.classes = response.content.content
            this.total_rows = response.content.totalElements
          }
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    resetQuery() {
      this.resetForm("query_classes");
      this.handleQuery();
    },
    deleteClassesById(claId) {
      this.$confirm('此操作将永久删除该时段, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteClasses({ att_cla_id: claId }).then(response => {
          if (response.result_code === 5000) {
            this.getClasses()
            this.$message.success('班次删除成功')
          } else {
            this.$message.error(response.result_desc)
          }
        })
      })
    },
    formatAttendTime(cloDto) {
      var clo = ''
      var prefix = cloDto.clo_name + ':'
      var start_time = ''
      var end_time = ''
      if (cloDto.onWorkClockState === 1) {
        if (cloDto.onWorkClockDate || cloDto.onWorkDate) {
          start_time = this.formatTime2(new Date(cloDto.onWorkClockDate)) + '~' + this.formatTime2(new Date(cloDto.onWorkDate)) + '  '
          clo = prefix + start_time
        }
      }
      if (cloDto.offWorkClockState === 1) {
        if (cloDto.offWorkDate && cloDto.offWorkClockDate) {
          end_time = this.formatTime2(new Date(cloDto.offWorkDate)) + '~' + this.formatTime2(new Date(cloDto.offWorkClockDate))
          clo = prefix + start_time + end_time
        }
      }
      return clo
    },
    formatTotalHour(row) {
      return row.att_cla_totalHours + '小时'
    },
    isElastic(state) {
      return (state === 1 || state === '1') ? '是' : '否'
    },
    preAddClasses() {
      this.classes_title = '新增班次'
      this.class_clock.att_cla_name = null
      this.class_clock.claCloDtosList = []
      this.class_clock.att_cla_totalHours = 0
      this.class_clock.att_cla_isElastic = 0
      this.class_clock.att_cla_id = null
      this.all_clocks.forEach(clock => {
        var cloDto = {}
        cloDto.clo_id = clock.clo_id
        cloDto.clo_name = clock.clo_name
        cloDto.onWorkClockDate = null
        cloDto.onWorkDate = null
        cloDto.onWorkClockState = null
        cloDto.offWorkDate = null
        cloDto.offWorkClockDate = null
        cloDto.offWorkClockState = 0
        cloDto.allowLateTime = 0
        cloDto.allowEarlyTime = 0
        this.class_clock.claCloDtosList.push(cloDto)
      })
      this.culTotalHour()
      this.uploadClassesVisible = true
    },
    addClasses() {
      this.uploadClassesVisible = false
    },
    includeClock(arr, id) {
      if (!arr || arr.length <= 0) {
        return -1
      }
      var match = -1
      arr.forEach((clock, index) => {
        if (clock.clo_id === id) {
          match = index
        }
      })
      return match
    },
    preUpdateClasses(row) {
      this.classes_title = '编辑班次'
      console.log(row)
      this.class_clock.att_cla_id = row.att_cla_id
      this.class_clock.att_cla_name = row.att_cla_name
      this.class_clock.att_cla_isElastic = row.att_cla_isElastic
      this.class_clock.att_cla_totalHours = row.att_cla_totalHours
      this.class_clock.claCloDtosList = []
      this.all_clocks.forEach(clock => {
        var cloIndex = this.includeClock(row.claCloDtosList, clock.clo_id)
        var cloDto = {}
        if (cloIndex > -1) {
          cloDto.clo_id = row.claCloDtosList[cloIndex].clo_id
          cloDto.clo_name = row.claCloDtosList[cloIndex].clo_name
          cloDto.onWorkClockDate = row.claCloDtosList[cloIndex].onWorkClockDate===null?null:new Date(row.claCloDtosList[cloIndex].onWorkClockDate)
          cloDto.onWorkDate = row.claCloDtosList[cloIndex].onWorkDate ===null?null:new Date(row.claCloDtosList[cloIndex].onWorkDate)
          cloDto.onWorkClockState = row.claCloDtosList[cloIndex].onWorkClockState
          cloDto.offWorkDate = row.claCloDtosList[cloIndex].offWorkDate===null?null:new Date(row.claCloDtosList[cloIndex].offWorkDate)
          cloDto.offWorkClockDate = row.claCloDtosList[cloIndex].offWorkClockDate===null?null:new Date(row.claCloDtosList[cloIndex].offWorkClockDate)
          cloDto.offWorkClockState = row.claCloDtosList[cloIndex].offWorkClockState
          cloDto.allowLateTime = row.claCloDtosList[cloIndex].allowLateTime
          cloDto.allowEarlyTime = row.claCloDtosList[cloIndex].allowEarlyTime
        } else {
          cloDto.clo_id = clock.clo_id
          cloDto.clo_name = clock.clo_name
          cloDto.onWorkClockDate = null
          cloDto.onWorkDate = null
          cloDto.onWorkClockState = null
          cloDto.offWorkDate = null
          cloDto.offWorkClockDate = null
          cloDto.offWorkClockState = 0
          cloDto.allowLateTime = 0
          cloDto.allowEarlyTime = 0
        }
        this.class_clock.claCloDtosList.push(cloDto)
      })
      this.culTotalHour()
      console.log('total hour:' + this.class_clock.att_cla_totalHours)
      this.uploadClassesVisible = true
    },
    clearClock() {
      this.clock.clo_id = null
      this.clock.clo_name = null
      this.clock.onWorkClockDate = null
      this.clock.onWorkDate = null
      this.clock.onWorkClockState = null
      this.clock.offWorkDate = null
      this.clock.offWorkClockDate = null
      this.clock.offWorkClockState = null
      this.clock.allowLateTime = null
      this.clock.allowEarlyTime = null
    },
    cancelUpdateClock() {
      this.clearClock()
      this.updateClockVisible = false
    },
    updateClock() {
      this.class_clock.claCloDtosList.forEach(clo => {
        if (clo.clo_id === this.clock.clo_id && (this.clock.onWorkClockState === 1 || this.clock.offWorkClockState === 1)) {
          console.log('时段:' + clo.clo_name)
          clo.onWorkClockDate = this.clock.onWorkClockDate
          clo.onWorkDate = this.clock.onWorkDate
          clo.onWorkClockState = this.clock.onWorkClockState
          clo.offWorkDate = this.clock.offWorkDate
          clo.offWorkClockDate = this.clock.offWorkClockDate
          clo.offWorkClockState = this.clock.offWorkClockState
          clo.allowLateTime = this.clock.allowLateTime
          clo.allowEarlyTime = this.clock.allowEarlyTime
        }
      })
      this.culTotalHour()
      console.log('total hour:' + this.class_clock.att_cla_totalHours)
      // this.clearClock()
      this.updateClockVisible = false
    },
    onOrOffWorkClockState(state) {
      return state === 1 ? '必须' : '不用'
    },
    updateClasses() {
      console.log(this.class_clock)
      if (this.class_clock.att_cla_isElastic === 1) {
        this.class_clock.claCloDtosList = []
      }
      addClasses(this.class_clock).then(response => {
        if (response.result_code === 5000) {
          if ('新增班次' === this.classes_title) {
            this.$message.success('新增班次成功')
          } else if ('编辑班次' === this.classes_title) {
            this.$message.success('班次修改成功')
          }
          this.getClasses()
        } else {
          this.$message.error(response.result_desc)
        }
      })
      this.uploadClassesVisible = false
    },
    formatTime(time) {
      if (time == null || time === undefined || time === '') {
        return
      }
      return time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
    },
    formatTime2(time) {
      if (time == null || time === undefined || time === '') {
        return
      }
      var h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
      var m = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
      return h + ':' + m
    },
    formatHour(time) {
      if (time == null || time === undefined || time === '') {
        return
      }
      return time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
    },
    genOnWorkTime(row) {
      if (row.onWorkClockState !== 1) {
        return ''
      }
      return this.formatTime2(row.onWorkClockDate) + '~' + this.formatTime2(row.onWorkDate)
    },
    genOffWorkTime(row) {
      if (row.offWorkClockState !== 1) {
        return ''
      }
      return this.formatTime2(row.offWorkDate) + '~' + this.formatTime2(row.offWorkClockDate)
    },
    allowLateTime(row) {
      return row.allowLateTime + '分钟'
    },
    allowEarlyTime(row) {
      return row.allowEarlyTime + '分钟'
    },
    preUpdateClock(row) {
      console.log('row',row);
      console.log('row.offWorkDate',row.offWorkDate);
      console.log('row.offWorkClockDate',row.offWorkClockDate);
      console.log('row.offWorkClockState',row.offWorkClockState);
      this.clock.clo_id = row.clo_id
      this.clock.clo_name = row.clo_name
      this.clock.onWorkClockDate = row.onWorkClockDate
      this.clock.onWorkDate = row.onWorkDate
      this.clock.onWorkClockState = row.onWorkClockState
      this.clock.offWorkDate = row.offWorkDate
      this.clock.offWorkClockDate = row.offWorkClockDate
      this.clock.offWorkClockState = row.offWorkClockState
      this.clock.allowLateTime = row.allowLateTime
      this.clock.allowEarlyTime = row.allowEarlyTime
      this.updateClockVisible = true
    },
    deleteClock(index) {
      console.log(index)
      this.class_clock.clocks.splice(index, 1)
    },
    culTotalHour() {
      if (this.class_clock.att_cla_isElastic === 0 && this.class_clock.claCloDtosList) {
        var total_time = 0
        console.log('开始计算正常班次的总工时')
        this.class_clock.claCloDtosList.forEach(clock => {
          console.log('时段:' + clock.name)
          if (clock.offWorkDate && clock.onWorkDate) {
            console.log(clock.offWorkDate)
            console.log(clock.onWorkDate)
            total_time += clock.offWorkDate.getTime() - clock.onWorkDate.getTime()
            console.log('total_time:' + total_time)
          }
        })
        this.class_clock.att_cla_totalHours = total_time / (1000 * 60 * 60.00)
        return this.class_clock.att_cla_totalHours
      }
      return this.class_clock.att_cla_totalHours
    },
    clockChange(val) {
      this.clock.clo_id = val.clo_id
      this.clock.clo_name = val.clo_name
    },
    handleSizeChange(val) {
      this.page_rows = val
    },
    handleCurrentChange(val) {
      this.current_page = val
      this.getClasses()
    }
  }
}
</script>

<style>
.agent-label,
.agent-value {
  display: inline;
  width: 50px;
  text-align: center;
}
</style>

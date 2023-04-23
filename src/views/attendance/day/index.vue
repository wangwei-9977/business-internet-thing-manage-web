<template>
  <div class="app-container">
    <div class="depart-list">
      <div>
        <el-tree
          :data="genFullDeparts"
          :props="departProps"
          :highlight-current="true"
          accordion
          @node-click="handleNodeClick"/>
      </div>
    </div>
    <div class="depart-detail">
      <div class="query-box">
        <el-form :inline="true" :model="userQuery" size="mini">
          <el-form-item label="姓名">
            <el-input v-model="userQuery.us_name" placeholder="姓名" />
          </el-form-item>
          <el-form-item label="考勤时间">
            <el-date-picker
              v-model="userQuery.attend_date"
              type="date"
              placeholder="选择日期"
              style="width: 150px"/>
          </el-form-item>
          <el-form-item>
             <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="getDailyDatas(current_depart.depart_id)"
          >搜索</el-button
        >
          </el-form-item>
          <el-form-item>
             <el-button
          type="primary"
          icon="el-icon-export"
          size="mini"
          @click="export_excel()"
          >导出</el-button
        >
          </el-form-item>
        </el-form>
      </div>
      <div class="content-box">
        <el-table :data="query_users" :header-cell-class-name="tableHeadClassName" :cell-class-name="tableRowClassName" v-loading="loadingData">
          <el-table-column label="日期"  align="center">
            <template slot-scope="scope">
              {{ formatDate(scope.row.date) }}
            </template>
          </el-table-column>
          <el-table-column prop="week" label="星期" align="center">
            <template slot-scope="scope">
              {{ formatWeek(scope.row.date) }}
            </template>
          </el-table-column>
          <el-table-column prop="user_name" label="姓名"align="center"/>
          <el-table-column prop="depart_name" label="部门" align="center"/>
          <el-table-column prop="post_name" label="岗位" align="center"/>
          <el-table-column v-for="clock in onAndOffClocks" :label="clock.clo_name" :key="clock.clo_name" width="120px" align="center">
            <template slot-scope="scope">
              <div v-if="inExistClock(scope.row,clock)">
                <el-tag :type="attendType(scope.row,clock)" disable-transitions>{{ calClockAttendState(scope.row,clock) }}</el-tag>
              </div>
              <div v-else>/</div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
      v-show="total_rows > 0"
      :total="total_rows"
      :page.sync="current_page"
      :limit.sync="page_rows"
      @pagination="getDailyDatas(current_depart.depart_id)"
    />
      </div>
    </div>
  </div>
</template>

<script>
import { getDeparts } from '@/api/attendance/depart'
import { getPostsByDepartId } from '@/api/attendance/post'
import { getClocks } from '@/api/attendance/clock'
import { getAllAttendState, queryDailyData,exportDutyDayExcel } from '@/api/attendance/attend'
const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
export default {
  data() {
    return {
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
      userQuery: {
        user_card_num: null,
        terminal_name: null,
        us_name: null,
        dep_id: null,
        post_id: null,
        clo_id: null,
        clo_name: null,
        attent_states: null,
        attend_date: null,
        page: null,
        size: null,
        depart_id: null
      },
      loadingData: false,
      selectDeparts: [],
      departs: [],
      departProps: {
        label: 'depart_name',
        children: 'children'
      },
      current_page: 1,
      page_rows: 10,
      total_rows: 0,
      query_users: [],
      hasPostsOfDepart: [],
      defaultDate: [new Date(2019, 3, 12, 1, 1), new Date(2019, 3, 12, 12, 12)],
      all_clocks: [],
      onAndOffClocks: [],
      all_attend_state: []
    }
  },
  computed: {
    genFullDeparts() {
      var fullDepartList = []
      if (this.departs == null || this.departs.length <= 0) {
        return fullDepartList
      }
      this.departs.forEach(departDto => {
        if (departDto.parent_id == null) {
          var depart = {}
          depart.depart_id = departDto.depart_id
          depart.depart_name = departDto.depart_name
          depart.children = this.genChildrenDeparts(departDto.depart_id)
          fullDepartList.push(depart)
        }
      })
      return fullDepartList
    }
  },
  created() {
    this.getAllDepart()
    this.getAllClocks()
    this.getAllAttendState()
    this.getDailyDatas(this.current_depart.depart_id)
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
    genChildrenDeparts(departId) {
      var fullDepartList = []
      if (this.departs == null || this.departs.length <= 0) {
        return fullDepartList
      }
      this.departs.forEach(departDto => {
        if (departId === departDto.parent_id) {
          var depart = {}
          depart.depart_id = departDto.depart_id
          depart.depart_name = departDto.depart_name
          depart.children = this.genChildrenDeparts(departDto.depart_id)
          fullDepartList.push(depart)
        }
      })
      return fullDepartList
    },
    export_excel() {
      this.userQuery.dep_id = this.userQuery.depart_id
      this.loadingData = true;
      exportDutyDayExcel(this.userQuery).then(response => {
          const link = document.createElement('a');
          let blob = new Blob([response], {type: "application/vnd.ms-excel"});
          link.href = URL.createObjectURL(blob);
          console.log(link.href);
          link.style.display ="none";
          link.download ="考勤日报.xlsx";
          link.click();
          URL.revokeObjectURL(link.href); // 释放URL 对象
          document.body.removeChild(link);
      }).catch(error => {
        this.$message.error(error);
      })
    },
    getAllDepart() {
      getDeparts({}).then(response => {
        if (response.result_code === 5000) {
           const data = response.content
          this.departs = data.departs
          // var departs_tepm = data.departs
          // departs_tepm.forEach((depart) => {
          //   if(!depart.depart_id.indexOf('OUT')){
          //     this.departs.push(depart);
          //   }
          // })
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    getAllClocks() {
      this.onAndOffClocks = []
      var query_clock = {}
      query_clock.page = -1
      getClocks(query_clock).then(response => {
        if (response.result_code === 5000) {
          this.all_clocks = response.content.content
          this.all_clocks.forEach(clo => {
            var onClo = {}
            onClo.clo_id = clo.clo_id
            onClo.clo_name = clo.clo_name + '上班'
            onClo.state = 'on'
            this.onAndOffClocks.push(onClo)
            var offClo = {}
            offClo.clo_id = clo.clo_id
            offClo.clo_name = clo.clo_name + '下班'
            offClo.state = 'off'
            this.onAndOffClocks.push(offClo)
          })
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    getAllAttendState() {
      getAllAttendState().then(response => {
        if (response.result_code === 5000) {
          this.all_attend_state = response.content
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    clearUserQuery() {
      this.userQuery.user_card_num = null
      this.userQuery.terminal_name = null
      this.userQuery.us_name = null
      this.userQuery.depart_id = null
      this.userQuery.post_id = null
      this.userQuery.clo_id = null
      this.userQuery.clo_name = null
      this.userQuery.attent_states = null
      this.userQuery.start_time = null
      this.userQuery.end_time = null
      this.userQuery.page = null
      this.userQuery.size = null
    },
    handleNodeClick(data) {
      this.current_depart = data
      //this.current_page = 1
      this.getAllPostsByDepart(this.current_depart.depart_id)
      this.getDailyDatas(this.current_depart.depart_id)
    },
    getDailyDatas(departId) {
      this.userQuery.dep_id = departId
      this.userQuery.page = this.current_page - 1
      this.userQuery.size = this.page_rows
      this.loadingData = true;
      this.query_users = [];
      queryDailyData(this.userQuery).then(response => {
        if (response.result_code === 5000) {
          // var query_user_temp = response.content.content;
          // var total = 0;
          // query_user_temp.forEach((userTempmp) => {
          //   if(!userTempmp.user_id.indexOf('OUT')){
          //     this.query_users.push(userTempmp);
          //     total = total+1;
          //   }
          // })
          // this.total_rows = total;
          this.query_users = response.content.content;
           this.total_rows = response.content.totalElements;
        } else {
          this.$message.error(response.result_desc)
        }
        this.loadingData = false
      }).catch(() => this.loadingData = false)
    },
    getAllPostsByDepart(departId) {
      getPostsByDepartId({ depart_id: departId }).then(response => {
        if (response.result_code === 5000) {
          this.hasPostsOfDepart = response.content.posts
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    formatDate(val) {
      var date = new Date(val)
      var month = date.getMonth() + 1
      month = (month < 10 ? '0' + month : month)
      var day = date.getDate()
      day = (day < 10 ? '0' + day : day)
      return date.getFullYear() + '-' + month + '-' + day
    },
    formatWeek(val) {
      var date = new Date(val)
      return weekday[date.getDay()]
    },
    formatTime(val) {
      var date = new Date(val)
      var h = date.getHours()
      h = (h < 10 ? '0' + h : h)
      var min = date.getMinutes()
      min = (min < 10 ? '0' + min : min)
      var sec = date.getSeconds()
      sec = (sec < 10 ? '0' + sec : sec)
      return h + ':' + min + ':' + sec
    },
    inExistClock(row, clock) {
      var isExists = false
      row.clockList.forEach(clo => {
        if (clo.clock_id === clock.clo_id) {
          if ((clock.state === 'on' && clo.onWorkAttendState !== null && clo.onWorkAttendState !== '无') || (clock.state === 'off' && clo.offWorkAttendState !== null && clo.offWorkAttendState !== '无')) {
            isExists = true
            return isExists
          }
        }
      })
      return isExists
    },
    attendType(row, clock) {
      var color = 'danger'
      row.clockList.forEach(clo => {
        if (clo.clock_id === clock.clo_id) {
          if (clock.state === 'on') {
            if (clo.onWorkAttendState !== '缺勤') {
              if (clo.onWorkAttendState === '迟到') {
                color = 'warning'
              } else if (clo.onWorkAttendState === '早退') {
                color = 'primary'
              } else {
                color = 'success'
              }
            }
          } else {
            if (clo.offWorkAttendState !== '缺勤') {
              if (clo.offWorkAttendState === '迟到') {
                color = 'warning'
              } else if (clo.offWorkAttendState === '早退') {
                color = 'primary'
              } else {
                color = 'success'
              }
            }
          }
        }
      })
      return color
    },
    calClockAttendState(row, clock) {
      var attendState = '缺勤'
      row.clockList.forEach(clo => {
        if (clo.clock_id === clock.clo_id) {
          if (clock.state === 'on') {
            if (clo.onWorkAttendState == null) {
              attendState = '/'
            } else if (clo.onWorkAttendState !== '缺勤') {
              attendState = this.formatTime(clo.onWorkDate)
            }
          } else {
            if (clo.offWorkAttendState == null) {
              attendState = '/'
            } else if (clo.offWorkAttendState !== '缺勤') {
              attendState = this.formatTime(clo.offWorkDate)
            }
          }
        }
      })
      return attendState
    },
    handleSizeChange(val) {
      this.page_rows = val
    },
    handleCurrentChange(val) {
      this.current_page = val
      this.getDailyDatas(this.current_depart.depart_id)
    },
    handleChange(value) {
    },
    departSelecedChange(value) {
      if (value == null) {
        return
      }
      this.userQuery.depart_id = value[value.length - 1]
      this.getAllPostsByDepart(value[value.length - 1])
    },
    clockChange(val) {
      this.userQuery.clo_id = val.clo_id
      this.userQuery.clo_name = val.clo_name
    }
  }
}
</script>

<style scoped>
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

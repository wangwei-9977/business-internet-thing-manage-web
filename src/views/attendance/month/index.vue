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
        <el-form :inline="true" :model="monthDuty">
          <el-form-item label="姓名">
            <el-input v-model="monthDuty.us_name" placeholder="姓名" />
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="monthDuty.attend_date"
              type="month"
              placeholder="选择月份"
              style="width: 150px"/>
          </el-form-item>
          <el-form-item>
            <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="getMonthDutyInfo(current_depart.depart_id)"
          >搜索</el-button
        >
          </el-form-item>
        </el-form>
      </div>
      <div class="content-box">
        <el-table :data="query_dutys" >
          <el-table-column prop="date" label="日期" width="88px">
            <template slot-scope="scope">
              {{ formatDate(scope.row.date) }}
            </template>
          </el-table-column>
          <el-table-column prop="us_dep" label="部门"/>
          <el-table-column prop="us_name" label="姓名"/>
          <el-table-column prop="lateDay" label="迟到次数"/>
          <el-table-column prop="earlyDay" label="早退次数"/>
          <el-table-column prop="absenceDay" label="缺勤次数"/>

          <el-table-column prop="totalDay" label="应出勤(天)"/>
          <el-table-column prop="actualDay" label="实出勤(天)"/>
          <el-table-column prop="actualDayPersent" label="出勤率%">
          <template slot-scope="scope">
          {{ fun(scope.row.actualDay / scope.row.totalDay) * 100 }}%
        </template>
        </el-table-column>
        </el-table>
        <pagination
      v-show="total_rows > 0"
      :total="total_rows"
      :page.sync="current_page"
      :limit.sync="page_rows"
      @pagination="getMonthDutyInfo(current_depart.depart_id)"
    />
      </div>
    </div>
  </div>
</template>

<script>
import { getDeparts } from '@/api/attendance/depart'
import { getPostsByDepartId } from '@/api/attendance/post'
import { queryMonthData } from '@/api/attendance/attend'
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
      monthDuty: {
        us_name: null,
        attend_date: null,
        dep_id: null,
        depart_id: null,
        post_id: null,
        page: null,
        size: null
      },
      selectDeparts: [],
      departs: [],
      departProps: {
        label: 'depart_name',
        children: 'children'
      },
      current_page: 1,
      page_rows: 5,
      total_rows: 0,
      query_dutys: [],
      hasPostsOfDepart: [],
      defaultDate: [new Date(2019, 3, 12, 1, 1), new Date(2019, 3, 12, 12, 12)]
    }
  },
  filters: {
    numFilter(value) {
// 截取当前数据到小数点后三位
let transformVal = Number(value).toFixed(3)
let realVal = transformVal.substring(0, transformVal.length - 1)
return Number(realVal)
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
    this.getMonthDutyInfo(null)
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
    fun(val){
　　　　return Number(val).toFixed(2);
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
          //this.departs = data.departs
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    handleNodeClick(data) {
      this.current_depart = data
      this.getAllPostsByDepart(this.current_depart.depart_id)
      this.getMonthDutyInfo(this.current_depart.depart_id)
    },
    getMonthDutyInfo(depart_Id) {
      console.log('this.monthDuty.dep_id',this.monthDuty.depart_id);
      this.query_dutys = [];
      this.monthDuty.dep_id = depart_Id
      this.monthDuty.page = this.current_page - 1
      this.monthDuty.size = this.page_rows
      queryMonthData(this.monthDuty).then(response => {
        console.log(response)
        if (response.result_code === 5000) {
          this.query_dutys = response.content.content
          this.total_rows = response.content.totalElements
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    formatDate(val) {
      if (val) {
        var date = new Date(val)
        var month = date.getMonth() + 1
        month = (month < 10 ? '0' + month : month)
        return date.getFullYear() + '-' + month
      }
      return '/'
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
    handleSizeChange(val) {
      this.page_rows = val
    },
    handleCurrentChange(val) {
      this.current_page = val
      this.getMonthDutyInfo(this.current_depart.depart_id)
    },
    handleChange(value) {
    },
    departSelecedChange(value) {
      if (value == null) {
        return
      }
      this.userQuery.depart_id = value[value.length - 1]
      this.getAllPostsByDepart(value[value.length - 1])
    }
  }
}
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


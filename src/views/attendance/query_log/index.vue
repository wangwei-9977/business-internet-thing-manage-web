<template>
  <div class="app-container">
    <div class="depart-detail">
      <div class="query-box">
        <el-form :inline="true" :model="userQuery">
          <el-form-item label="姓名">
            <el-input v-model="userQuery.us_name" placeholder="姓名" class="query-item" style="width: 200px" />
          </el-form-item>
          <el-form-item label="岗位">
            <el-select v-model="userQuery.post_id" filterable clearable placeholder="请选择" class="query-item" style="width: 200px">
              <el-option v-for="post in hasPostsOfDepart" :key="post.post_id" :label="post.post_name" :value="post.post_id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="userQuery.start_time"
              type="date"
              placeholder="选择日期"
              style="width: 200px"/>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="userQuery.end_time"
              type="date"
              placeholder="选择日期"
              style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getMonthDutyByDepart(current_depart.depart_id)" class="btn-query">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content-box">
        <el-table :data="query_users" :header-cell-class-name="tableHeadClassName" :cell-class-name="tableRowClassName">
          <el-table-column label="现场图">
            <template slot-scope="scope">
              <img :src="splitCompareImg(scope.row.compare_img)" style="width: 50px;height: 50px">
            </template>
          </el-table-column>
          <el-table-column label="原图">
            <template slot-scope="scope">
              <img :src="splitCompareImg(scope.row.source_img)" style="width: 50px;height: 50px">
            </template>
          </el-table-column>
          <el-table-column prop="score" label="比对分数"/>
          <el-table-column prop="us_name" label="姓名" />
          <el-table-column prop="tm_name" label="设备名称"/>
          <el-table-column prop="us_dept" label="部门" />
          <el-table-column prop="us_post" label="岗位"/>
          <el-table-column prop="duty_time" label="日期" width="88px">
            <template slot-scope="scope">
              {{ scope.row.duty_time.substring(0, 10) }}
            </template>
          </el-table-column>
          <el-table-column prop="duty_time" label="时间">
            <template slot-scope="scope">
              {{ scope.row.duty_time.substring(11, 19) }}
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <div class="total-item">共{{ total_rows }}条</div>
          <el-pagination :total="total_rows" :page-size="page_rows" :current-page="current_page" background
                         layout="prev, pager, next" @current-change="handleCurrentChange"
                         @size-change="handleSizeChange"/>
          <div class="jump-item">
            跳至
            <el-input type="text" v-model="current_page" @change="handleCurrentChange" style="width:24px;height:24px"></el-input>
            页
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDeparts } from '@/api/attendance/depart'
import { getPostsByDepartId } from '@/api/attendance/post'
import { queryDutyData } from '@/api/attendance/attend'
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
        us_name: null,
        dep_id: null,
        post_id: null,
        start_time: null,
        end_time: null,
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
      query_users: [],
      hasPostsOfDepart: [],
      defaultDate: [new Date(2019, 3, 12, 1, 1), new Date(2019, 3, 12, 12, 12)]
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
    this.getMonthDutyByDepart(null)
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
          this.departs = []
          this.departs = data.departs
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    handleNodeClick(data) {
      this.current_depart = data
      this.getAllPostsByDepart(this.current_depart.depart_id)
      this.getMonthDutyByDepart(this.current_depart.depart_id)
    },
    getMonthDutyByDepart(departId) {
      this.userQuery.dep_id = departId
      this.userQuery.page = this.current_page - 1
      this.userQuery.size = this.page_rows
      queryDutyData(this.userQuery).then(response => {
        console.log(response)
        if (response.result_code === 5000) {
          this.query_users = response.content.content
          this.total_rows = response.content.totalElements
        } else {
          this.$message.error(response.result_desc)
        }
      })
    },
    splitCompareImg(img) {
      if (img) {
        var imgsplit = img.split(';')
        if (imgsplit.length < 2) {
          img = 'data:image/png;base64,' + img
        }
      }
      return img
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
      this.getMonthDutyByDepart(this.current_depart.depart_id)
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
.app-container .depart-detail .query-box {
  height: 83px;
}
.app-container .depart-detail .content-box {
  min-height: calc(100vh - 185px);
}
.el-form-item__content {
    line-height: 34px;
  }
  .query-item {
    height: 34px;
    line-height: 34px;
  }
  /deep/.el-input{
    width: 100px;
    border: 1px 400 #d4d7dc;
    border-radius: 4px;
    width: 100%;
  }
  /deep/.el-input .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
  .content-box .op-batch {
    text-align: right;
    margin-bottom: 14px;
  }
  /deep/.content-box .op-batch .btn-plain {
    height: 34px;
    border-radius: 4px;
    color: #0082fe;
    font-size: 12px;
    text-align: center;
    background-color: #ffffff;
    border: 1px solid #0082fe;
    padding: 0px 12px;
  }
  /deep/.el-table .table-head {
  height: 50px;
  line-height: 50px;
  color: #677780;
  font-size: 14px;
  font-family: \5FAE\8F6F\96C5\9ED1;
  /*background-color: #e3edf8;*/
  padding: 0px;
  text-align: center;
}
/deep/.el-table .warning-row {
  height: 50px;
  line-height: 50px;
  color: #505255;
  font-size: 14px;
  background: #f2f7fb;
  text-align: center;
  overflow: hidden;
  padding: 0px;
}

/deep/.el-table .success-row {
  height: 50px;
  line-height: 50px;
  color: #505255;
  font-size: 14px;
  background: #ffffff;
  text-align: center;
  overflow: hidden;
  padding: 0px;
}
/deep/.el-pagination {
    display: inline-block;
    position: relative;
    /*top: -7px;*/
}
.page-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
}
/deep/ .page-box .el-input__inner {
  width: 24px;
  height: 24px;
  padding: 0px;
  border-radius: 4px;
  text-align: center;
}
</style>


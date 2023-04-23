<template>
  <div class="car-site-monitor">
    <el-row :gutter="10">
      <el-col :span="16">
        <div class="grid">
          <ul class="ul">
            <li v-for="(item, index) in imgList" :key="index">
              <div class="container" @click="imgClick(item)">
                <el-image
                  :src="item.url"
                  fit="cover"
                  lazy
                  style="width: 100%; height: 100%"
                />
              </div>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="table">
          <normal-table-render />
        </div>
        <el-radio-group v-model="value" size="small">
          <el-radio-button v-for="item in options" :label="item.value" :key="item.value">{{ item.label }}</el-radio-button>
        </el-radio-group>
        <div class="list">
          <ul>
            <li v-for="(item, index) in list" :key="index">
              <div>{{ item.label }}</div>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <List :visible="visible" :data="obj" @close="visible = false" @confirm="okHandle" />
  </div>
</template>

<script>
import { getTableDataList } from '@/api/carSiteMonitor';
import pageMixin from '@/common/mixin/pageMixin';
import List from '@/common/components/carSiteMonitor/list'

export default {
  name: "CarSiteMonitor",
  mixins: [pageMixin],
  components: { List },
  data() {
    return {
      showToolbar: false,
      checkbox: true,
      value: 0,
      visible: false,
      obj: {},
      list: [
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        },
        {
          label: '2022-01-01 15：15：21---门岗1--闽A12322进场'
        }
      ],
      imgList: [
        {
          url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        }
      ],
      options: [
        {
          label: '实时进场',
          value: 0
        },
        {
          label: '实时出场',
          value: 1
        }
      ],
      tableProps: {
        border: true
      },
      tableColumns: [
        {
          key: 'processName',
          title: '设备名称'
        },
        {
          key: 'number',
          title: '状态'
        }
      ]
    }
  },
  methods: {
    async request (query) {
      // return getTableDataList(query)
      return {
        list: [
          {
            title: '我问问',
            processName: '我问问',
            currTaskName: '13255048788',
            number: '闽AXX905',
            result: '辅导费',
            createTime: '辅导费',
            applyTime: '生产管理部',
            status: '13255044444'
          }
        ]
      }
    },
    imgClick (item) {
      this.obj = item
      this.visible = true
    },
    okHandle () {
      this.visible =false
    }
  }
}
</script>

<style lang="scss" scoped>
.grid {
  .ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    border: 2px solid #ECF0F6;
    list-style: none;
    margin: 0;
    max-height: calc(100vh - 100px);
    overflow: auto;
    li {
      width: 25%;
      height: 200px;
      padding: 5px;
      .container {
        cursor: pointer;
        height: 100%;
        position: relative;
        &:hover {
          &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            border: 5px solid #1cb1e0;
            background: rgba(0, 0, 0, 0.3);
          }
        }
      }
    }
  }
}
.list {
  margin-top: 10px;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 800px;
    overflow: auto;
    border: 1px solid #ECF0F6;
    li {
      height: 28px;
      font-size: 12px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      cursor: pointer;
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
      & + li {
        margin-top: 5px;
      }
    }
  }
}
.car-site-monitor {
  margin: 10px;
}
.table {
  margin-bottom: 10px;
  .app-container {
    padding: 0;
  }
}
::v-deep .el-radio-group {
  width: 100%;
  .el-radio-button {
    width: 50%;
    .el-radio-button__inner {
      width: 100%;
    }
  }
}
</style>

<template>
  <div class="modal-template">
    <div class="modal-header">
      <el-menu :default-active="activeIndex" 
      mode="horizontal"
      @select="menuSwitch"
      style="padding: 0 15px; flex: 1;">
        <el-menu-item index="1">学生</el-menu-item>
        <el-menu-item index="2">班级</el-menu-item>
      </el-menu>
      <i class="modal-close el-icon-close" @click="close"></i>
    </div>
    <div class="modal-content">
      <template v-if="activeIndex == 1">
        <div class="container-left">
          <div class="search-div">
            <el-input placeholder="搜索学生姓名或学号" class="student-search" v-model="searchValue">
              <i
                class="el-icon-search el-input__icon"
                slot="suffix"
                style="padding: 0 10px">
              </i>
            </el-input>
          </div>
          <div class="left-bottom">
            <el-checkbox-group v-model="selectedStudentIds">
              <template v-for="student in studentFilter()">
                <div class="list-item" :key="student.uaid">
                  <el-checkbox style="width: 100%; height: 100%; box-sizing: border-box; display: flex; align-items: center; padding: 0 25px;" @change="handleSelect($event, student.uaid)" :label="student.uaid">
                    <div class="list-item-title">
                      {{student.stu_name}}
                    </div>
                    <div class="list-item-detail">
                      {{student.smp_id}}
                    </div>
                  </el-checkbox>
                </div>
              </template>
            </el-checkbox-group>
          </div>
        </div>
        <div class="container-right">
          <div class="modal-title">已选择学生 ({{selectedCount}})</div>
          <div class="scroll-container" style="flex: 1;">
            <div v-for="student in selectedStudents" :key="student.smp_id" class="right-box-item">{{student.stu_name}}</div>
          </div>
        </div>
      </template>
      <!-- 班级页面 -->
      <template v-if="activeIndex == 2">
        <div class="class-container">
          <div class="search-div">
            <el-input placeholder="输入班级名称" class="student-search" v-model="searchValue">
              <i
                class="el-icon-search el-input__icon"
                slot="suffix"
                style="padding: 0 10px">
              </i>
            </el-input>
          </div>
            <el-table
              ref="singleTable"
              :data="classList.filter(data => !searchValue || data.class_name.toLowerCase().includes(searchValue.toLowerCase()))"
              highlight-current-row
              @current-change="handleCurrentChange"
              height="calc(100%  - 71px)"
              style="width: 100%;"
              show-overflow-tooltip>
              <el-table-column
                width="50">
                <template slot-scope="scope" >
                  <el-radio v-model="selectedClass.class_id" :label="scope.row.class_id" style="margin-left: 15px;">
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column
                property="class_name"
                label="班级名称"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <span style="font-weight: 600">{{ scope.row.class_name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                property="subject"
                label="科目"
                width="150">
              </el-table-column>
              <el-table-column
                property="items"
                label="学生"
                show-overflow-tooltip>
                <template slot-scope="scope" >
                  <span style="margin-right: 25px;">
                    {{scope.row.items.map(x=>{return x.stu_name;}).join(", ")}}
                  </span>
                </template>
              </el-table-column>
            </el-table>
        </div>
      </template>
    </div>
    <div class="modal-footer">
      <div style="padding-left: 25px;">
        <span class="date-text">截止日期</span>
        <el-date-picker
          v-model="deadline"
          type="date"
          placeholder="未设置"
          size="small"
          clear-icon="el-icon-close"
          style="width: 140px;">
        </el-date-picker>
      </div>
      <div style="padding-right: 20px;">
        <el-button @click.prevent="close">取 消</el-button>
        <el-button type="primary" @click.prevent="save" >确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import common from '@/utils/common.js';

// 格式化YYYY-mm-dd
function getYmd(date) {
    if (common.isEmpty(date)) {
      return "";
    }
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0];
}

export default {
  name: 'ModalShare',

  components: {
  },

  props: {
    remark: {
      default: "",
    },
  },

  data() {
    return {
      activeIndex: "1",
      searchValue: "",
      showMenu: false,
      studentList: new Map(),
      selectedStudents: [],
      selectedStudentIds: [],
      deadline: "",
      classList: [],
      selectedClass: 0,
    }
  },

  computed: {
    selectedCount() {
      return this.selectedStudents.length;
    },
  },

  methods: {
    studentFilter() {
      var ret = [];
      if (this.searchValue.length == 0) {
        return this.studentList.values();
      } else {
        Array.from(this.studentList.values()).forEach((student) => {
          if (student.stu_name.includes(this.searchValue) || student.smp_id.includes(this.searchValue)) {
            ret.push(student);
          }
        });
      }
      return ret;
    },

    menuSwitch(index) {
      this.activeIndex = index;
      if (index == 2) {
        this.selectedStudents = [];
        this.selectedStudentIds = [];
      } else {
        this.selectedClass = 0;
      }
    },

    handleSelect(value, id) {
      if (value) {
        this.selectedStudents.push(this.studentList.get(id));
      } else {
        for(var i = 0; i < this.selectedStudents.length; i++) {
          if (id == this.selectedStudents[i].uaid) {
            this.selectedStudents.splice(i, 1);
          }
        }
      }
    },

    handleCurrentChange(newRow) {
      this.selectedClass = newRow;
    },

    close() {
      this.$emit("close");
    },

    save() {
      this.$api.user.share({
        title: this.remark, 
        class_id: this.selectedClass ? this.selectedClass.class_id : 0, 
        exp_time: getYmd(this.deadline),
        class_name: this.selectedClass ? this.selectedClass.class_name : "", 
        data: this.selectedClass ? this.selectedClass.items.map(x => x.uaid) : this.selectedStudentIds
      }).then(res => {
        console.log(res);
      });
      this.$emit("close");
    }
  },

  mounted() {
    var ret = new Map();
    var classList = this.$store.state.students;
    if (!common.isEmpty(classList)) {
      this.classList = classList;
      classList.forEach(c => {
        if (c.items) {
          c.items.forEach(student => {
            ret.set(student.uaid, student);
          })
        }
      });
    }
    this.studentList = ret;
  }
}
</script>

<style scoped>
.modal-template {
  width: 70%; 
  height: 70%; 
  background-color: #fff;
  text-align: left;
  display: flex;
  flex-direction: column;
}
.modal-header {
  display: flex; 
  align-items: center; 
  border-bottom: 1px solid #e6e6e6;
}
.modal-content {
  display: flex;
  width: 100%;
  height: calc(100% - 114px);
}

.modal-footer {
  height: 64px;
  border-top: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.container-left {
  width: 65%;
  display: flex;
  flex-direction: column;
  border-right: 2px solid #ededed;
}

.container-right {
  padding: 20px;
  flex: 1;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
}

.search-div {
  padding: 15px;
  border-bottom: 1px solid #dedede;
}

.modal-title {
  font-size: 16px;
  font-weight: 400;
  color: #4a4a4a;
  margin-bottom: 20px;
}

.student-search > .el-input__inner:focus {
  border-color: #dcdfe6;
}

.left-bottom {
  height: 100%;
  flex: 1;
  overflow: auto;
}

.scroll-container {
  overflow: auto;
}

.el-menu >>> .el-menu-item {
  font-size: 16px !important;
  height: 48px !important;
  line-height: 48px !important;
  padding: 0 30px;
}

.list-item {
  width: 100%;
  display: flex;
  align-items: center;
  height: 60px;
  font-size: 14px;
  font-weight: 400;
}

.list-item:hover {
  background: #f7f7f7;
}

.el-checkbox >>> .el-checkbox__label {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.list-item-title {
  white-space: nowrap;
  font-size: 14px;
  line-height: 30px;
  font-weight: 600;
  color: #333;
}

.list-item-detail {
  white-space: nowrap;
  font-size: 14px;
  line-height: 30px;
  font-weight: 400;
  color: #333;
  padding-right: 15px;
}

.modal-close {
  padding: 15px;
  cursor: pointer;
}

.right-box-item {
  word-break: break-word;
  width: 100%;
  padding: 18px 15px;
  background-color: #fff;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  margin-bottom: 12px;
  box-sizing: border-box;
}

.date-text {
  display: inline-block;
  width: 64px;
  line-height: 30px;
  margin-right: 10px;
  font-size: 14px;
  color: #999;
}

.class-container {
  width: 100%;
}

label >>> .el-radio__label {
  display: none;
}

tbody >>> tr {
  padding: 0 25px;
}

.el-table >>> .el-table__header th{
  background-color: #f2f2f2;
}
@media (max-aspect-ratio: 1/1) {
  .modal-template {
    width: 80%; 
    height: 70%; 
  }
}
</style>

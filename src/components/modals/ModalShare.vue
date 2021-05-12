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
              <template v-for="(student, index) in studentList">
                <div class="list-item">
                  <el-checkbox style="width: 100%; height: 100%; box-sizing: border-box; display: flex; align-items: center; padding: 0 25px;" @change="handleSelect($event, student.id)">
                    <div class="list-item-title">
                      {{student.name}}
                    </div>
                    <div class="list-item-detail">
                      {{"000000"+student.id}}
                    </div>
                  </el-checkbox>
                </div>
              </template>
          </div>
        </div>
        <div class="container-right">
          <div class="modal-title">已选择学生 ({{selectedCount}})</div>
          <div class="scroll-container" style="flex: 1;">
            <div v-for="(student, index) in selectedStudents" :key="student.id" class="right-box-item">{{student.name}}</div>
          </div>
        </div>
      </template>
      <!-- 班级页面 -->
      <template v-if="activeIndex == 2">
        <div class="class-container">
          <div class="search-div">
            <el-input placeholder="输入班级名称或班号" class="student-search" v-model="searchValue">
              <i
                class="el-icon-search el-input__icon"
                slot="suffix"
                style="padding: 0 10px">
              </i>
            </el-input>
          </div>
            <el-table
              ref="singleTable"
              :data="classList"
              highlight-current-row
              @current-change="handleCurrentChange"
              style="width: 100%;"
              show-overflow-tooltip>
              <el-table-column
                width="50">
                <template slot-scope="scope" >
                  <el-radio v-model="selectedClass" :label="scope.row.id" style="margin-left: 15px;">
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column
                property="name"
                label="班级名称"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <span style="font-weight: 600">{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                property="type"
                label="科目"
                width="150">
              </el-table-column>
              <el-table-column
                property="students"
                label="学生"
                show-overflow-tooltip>
                <template slot-scope="scope" >
                  <span style="margin-right: 25px;">
                    {{scope.row.students.join(", ")}}
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
          style="width: 140px;">
        </el-date-picker>
      </div>
      <div style="padding-right: 20px;">
        <el-button >取 消</el-button>
        <el-button type="primary" >确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ModalShare',

  components: {
  },

  props: {

  },

  data() {
    return {
      activeIndex: "1",
      searchValue: "",
      showMenu: false,
      studentList: [],
      selectedStudents: [],
      deadline: "",
      classList: [
        {
          id: 1,
          name: "A班",
          type: "托福",
          students: ["学生1", "学生2", "学生3","学生4", "学生5", "学生6","学生1", "学生2", "学生3","学生4", "学生5", "学生6","学生1", "学生2", "学生3","学生4", "学生5", "学生6","学生1", "学生2", "学生3","学生4", "学生5", "学生6"]
        },
        {
          id: 2,
          name: "B班",
          type: "托福",
          students: ["学生1", "学生1", "学生1","学生1", "学生1", "学生1"]
        },
        {
          id: 3,
          name: "C班",
          type: "托福",
          students: ["学生1"]
        },
      ],
      selectedClass: 0,
    }
  },

  computed: {
    selectedCount() {
      return this.selectedStudents.length;
    }
  },

  methods: {
    help() {
      this.$emit("help");
    },

    menuSwitch(index) {
      this.activeIndex = index;
      if (index == 2) {
        this.selectedStudents = [];
      } else {
        this.selectedClass = 0;
      }
    },

    handleSelect(value, id) {
      if (value) {
        for(var i = 0; i < this.studentList.length; i++) {
          if (id == this.studentList[i].id) {
            this.selectedStudents.push(this.studentList[i]);
          }
        }
      } else {
        for(var i = 0; i < this.selectedStudents.length; i++) {
          if (id == this.selectedStudents[i].id) {
            this.selectedStudents.splice(i, 1);
          }
        }
      }
    },

    handleCurrentChange(newRow) {
      this.selectedClass = newRow.id;
    },

    close() {
      this.$emit("close");
    }
  },

  mounted() {
    var ret = [];
    for (var i = 0; i < 40; i++) {
      ret.push({
        name: "学生 "+i,
        id: i,
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

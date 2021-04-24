<template>
  <div class="modal-template">
    <el-menu :default-active="activeIndex" 
    mode="horizontal" 
    @select="handleSelect"
    background-color="#2e3138"
    text-color="#fff"
    active-text-color="#ffd04b"
    style="padding: 0 15px">
      <el-menu-item index="1">学生</el-menu-item>
      <el-menu-item index="2">班级</el-menu-item>
    </el-menu>
    <div class="modal-content">
      <div class="container-left">
        <div class="left-top">
          <el-input placeholder="搜索学生姓名或学号" class="student-search" v-model="searchValue">
            <i
              class="el-icon-search el-input__icon"
              slot="suffix"
              style="padding: 0 10px">
            </i>
          </el-input>
        </div>
        <div class="left-bottom">
            <template v-for="student in filteredStudents">
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
        <div class="modal-title">已选择学生</div>
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
      students: [],
    }
  },

  computed: {
    filteredStudents: function() {
      var ret = [];
      for (var i = 0; i < 40; i++) {
        ret.push({
          name: "学生 "+i,
          id: i,
        }); 
      }
      return ret;
    }
  },

  methods: {
    help() {
      this.$emit("help");
    },

    handleSelect(value, id) {
      console.log(value, id);
    },
  },
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
.modal-content {
  display: flex;
  width: 100%;
  height: calc(100% - 50px);
}
.container-left {
  width: 66%;
  display: flex;
  flex-direction: column;
  border-right: 2px solid #ededed;
}

.container-right {
  padding: 15px;
}

.left-top {
  padding: 15px;
  box-shadow: 0 2px 12px #dedede;
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

.list-item:nth-child(odd) {
  background: #f2f2f2;
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

@media (max-aspect-ratio: 1/1) {
  .modal-template {
    width: 80%; 
    height: 70%; 
  }
}
</style>

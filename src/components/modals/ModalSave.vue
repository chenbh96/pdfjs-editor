<template>
  <div class="modal-save-template">
    <div class="modal-header">
      保存文件
      <i class="el-icon-close" style="float: right; line-height: 22px; cursor: pointer;" @click="close"></i>
    </div>
    <div class="modal-content">
      <el-form label-position="right" size="small">
        <el-form-item label="文件名 (不包括后缀名)">
          <el-input v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="新文件名">
          <el-input  v-model="tag"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="modal-footer">
      <div style="height: 100%; display: flex; align-items: center; justify-content: space-between;">
        <div style="font-size: 12px;">
          <b style="color: #999">保存</b> <span style="color:#aaa">将同步更新当前这份教材</span>
          <br>
          <b style="color: #999">另存为</b> <span style="color:#aaa">将新建一份教材</span>
        </div>
        <div>
          <el-button  style="width: 80px;" @click="save">保存</el-button>
          <el-button type="primary"  style="width: 80px;" @click="saveNew">另存为</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { SAVE_MODE } from '@/utils/constants';

export default {
  name: 'ModalSave',

  components: {
  },

  props: {
    show: {
      type: Boolean,
    }
  },

  data() {
    return {
      name: this.$store.state.title,
      tag: "",
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

    close() {
      this.$emit("close");
    },

    save() {
      this.$emit("save",this.tag, SAVE_MODE.EDIT);
    },
    saveNew() {
      this.$emit("save",this.tag, SAVE_MODE.NEWFILE);
    }
  },
}
</script>

<style scoped>
.modal-save-template {
  width: 450px; 
  height: 350px; 
  border-radius: 6px;
  background-color: #fff;
  text-align: left;
  display: flex;
  flex-direction: column;
}

.modal-header {
  font-size: 15px;
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
}

.modal-content {
  flex: 1;
  height: 200px;
  padding: 15px;
}

.modal-footer {
  border-top: 1px solid #ddd;
  padding: 10px 15px;
}


</style>

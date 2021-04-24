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
        <el-form-item label="Tag">
          <el-input  v-model="tag"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="modal-footer">
      <el-row style="height: 100%; display: flex; align-items: center; justify-content: flex-end;">
        <el-button size="mini" style="width: 80px;" round>保存</el-button>
        <el-button type="primary" size="mini" style="width: 80px;" round>另存为</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>

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
      name: "",
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
    help() {
      this.$emit("help");
    },

    handleSelect(value, id) {
      console.log(value, id);
    },

    close() {
      this.$emit("close");
    }
  },
}
</script>

<style scoped>
.modal-save-template {
  width: 300px; 
  height: 300px; 
  border-radius: 6px;
  background-color: #fff;
  text-align: left;
  display: flex;
  flex-direction: column;
}

.modal-header {
  font-size: 15px;
  padding: 5px 10px;
  border-bottom: 1px solid #ddd;
}

.modal-content {
  flex: 1;
  height: 200px;
  padding: 15px;
}

.modal-footer {
  border-top: 1px solid #ddd;
  padding: 10px;
}


</style>

<template>
  <div class="modal-save-template">
    <div class="modal-header">
      教材布置备注
      <i class="el-icon-close" style="float: right; line-height: 22px; cursor: pointer;" @click="close"></i>
    </div>
    <div class="modal-content" style="display: flex; flex-direction: column; justify-content: center; ">
      <el-form label-position="right" size="small">
        <el-form-item label="请输入教材布置备注">
          <el-input v-model="remark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="modal-footer">
        <div style="float:right;">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
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
      remark: "",
    }
  },

  computed: {
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
    },

    save() {
      this.$emit("save");
    },
  }
}
</script>

<style scoped>
.modal-save-template {
  width: 350px; 
  height: 300px; 
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

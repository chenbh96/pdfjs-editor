<template>
  <div class="modal-save-template">
    <div class="modal-content" >
      {{msg}}
    </div>
  </div>
</template>

<script>

import { SAVE_MODE } from '@/utils/constants';

export default {
  name: 'ModalTip',

  components: {
  },

  props: {
    msg: {
      type: String,
      default: ""
    }
  },

  computed: {
  },

  methods: {
    close() {
      this.$emit("close");
    },
  }
}
</script>

<style scoped>
.modal-save-template {
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
  min-width: 200px;
  height: 100px;
  padding: 15px;
  display: flex; 
  justify-content: center; 
  align-items: center;
}

.modal-footer {
  border-top: 1px solid #ddd;
  padding: 10px 15px;
}


</style>

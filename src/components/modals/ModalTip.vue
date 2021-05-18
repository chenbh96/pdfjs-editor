<template>
  <div class="modal-save-template">
    <div class="modal-content" >
      {{msg}}
    </div>
  </div>
</template>

<script>

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
  padding: 15px 25px;
  display: flex; 
  justify-content: center; 
  align-items: center;
  font-size: 12px;
  color: #000;
}

.modal-footer {
  border-top: 1px solid #ddd;
  padding: 10px 15px;
}


</style>

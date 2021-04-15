<template>
  <a class="user-info">
    <CaretIcon style="margin-right: 15px;"></CaretIcon>
    <img id="undo" class="avatar" src="https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eolRXosbFgtTPsE65nKTCPzYsZ1amVkb1TsSIj9kaicoOgJzSTeCHjaX5t6AMnN31Zibmib6kY8M8PFw/132"></img>
  </a>
</template>

<script>
import CaretIcon from "../assets/caret.svg";

export default {
  name: 'PDFEdit',

  components: {
    CaretIcon
  },

  props: {
  },

  methods: {
    clickUndo() {
      this.$emit("undo");
    },

    clickRedo() {
      this.$emit("redo");
    },

    clickSave() {
      this.$emit("save");
    }
  },
}
</script>

<style>
.user-info {
  padding: 0 1em;
  height: 100%;
  cursor: pointer;
}

.user-info:hover, .user-info:focus {
  background-color: rgba(255,255,255, 0.1);
}
.avatar {
  display: block;
  border-radius: 50%;
  width: 1.75em;
  height: 1.75em;
  font-size: 1.5em;
  background-color: rgba(255,255,255,0.1);
}
</style>

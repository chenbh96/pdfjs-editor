<template>
  <div class="pdf-action">
    <a id="undo" @click.prevent.stop="clickUndo()" class="icon">
      <img src="@/assets/icons/undo.png"/>
    </a>
    <a id="redo" @click.prevent.stop="clickRedo()" class="icon">
      <img src="@/assets/icons/redo.png"/>
    </a>
    <a id="save" @click.prevent.stop="clickSave()" class="icon">
      <img src="@/assets/icons/save.png"/>
    </a>
  </div>
</template>

<script>
import UndoIcon from '../assets/icon-undo.svg';
import RedoIcon from '../assets/icon-redo.svg';
import SaveIcon from '../assets/icon-save.svg';

export default {
  name: 'PDFEdit',

  components: {
    UndoIcon,
    RedoIcon,
    SaveIcon
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
.pdf-action {
}
.pdf-action a {
  float: left;
}
.pdf-action a:active {
  background-color: #ffff00;
}
</style>

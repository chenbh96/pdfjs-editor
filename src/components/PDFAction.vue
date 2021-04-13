<template>
  <div class="pdf-action">
    <a id="undo" @click.prevent.stop="clickUndo()" class="icon"><UndoIcon /></a>
    <a id="redo" @click.prevent.stop="clickRedo()" class="icon"><RedoIcon /></a>
    <a id="save" @click.prevent.stop="clickSave()" class="icon"><SaveIcon /></a>
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
  cursor: pointer;
  display: block;
  border: 1px #333 solid;
  background: white;
  color: #333;
  font-weight: bold;
  line-height: 1.5em;
  width: 1.5em;
  height: 1.5em;
  font-size: 1.5em;
}
.pdf-action a:active {
  background-color: #ffff00;
}
#redo {
  margin-right: 1.5em;
}
</style>

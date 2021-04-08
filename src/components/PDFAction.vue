<template>
  <div class="pdf-action">
    <a id="undo" @click.prevent.stop="clickUndo($event)" class="icon"><UndoIcon /></a>
    <a id="redo" @click.prevent.stop="clickRedo($event)" class="icon"><RedoIcon /></a>
  </div>
</template>

<script>
import UndoIcon from '../assets/icon-undo.svg';
import RedoIcon from '../assets/icon-redo.svg';

export default {
  name: 'PDFEdit',

  components: {
    UndoIcon,
    RedoIcon
  },

  props: {
  },

  methods: {
    clickUndo(event) {

    },

    clickRedo(event) {

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
</style>

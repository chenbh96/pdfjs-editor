<template>
  <div class="pdf-edit">
    <a id="pen" @click.prevent.stop="togglePen($event)" class="icon"><PenIcon /></a>
    <div v-show="pen.show" class="screen" @click.prevent.stop="togglePen"></div>
    <div v-show="pen.show" class="pen-option">
      <input type="color"  class="pen-color-picker  color-picker" @input="changePenColor($event.target.value)">
      <input type="range" class="pen-line-range" @input="changePenSize($event.target.value)" min="1" max="72" value="1">
      <span class="pen-range-span"><label class="pen-range-value">{{pen.size}}</label>Px</span>
    </div>
    <a id="text"  class="icon"><TextIcon /></a>
  </div>
</template>

<script>
import PenIcon from '../assets/icon-pen.svg';
import TextIcon from '../assets/icon-text.svg';

export default {
  name: 'PDFEdit',

  components: {
    PenIcon,
    TextIcon
  },

  props: {
    selected: [String, null]
  },

  data: function() {
    return {
      pen: {
        show: false,
        color: "#000",
        size: 1,
      },
    }
  },

  methods: {
    togglePen(e) {
      var target = null;
      if (e.target.tagName.toLowerCase() == 'a') {
        target = e.target;
      } else if (e.target.parentNode.tagName.toLowerCase() == 'a') {
        target = e.target.parentNode;
      } else {
        this.pen.show = false;
      }
      this.toggleSelected(target);
    },

    changePenSize(value) {
      this.pen.size = parseInt(value);
      this.$emit("update-config", this.pen);
    },

    changePenColor(value) {
      this.pen.color = value;
      this.$emit("update-config", this.pen);
    },

    toggleSelected(target) {
      if (target == null) {
        return true;
      }
      const selected = document.querySelector( '.selected' );
      if (selected) {
        selected.classList.remove('selected');
        this.$emit("update-selected", null);
        return false;
      } else {
        target.classList.add("selected");
        this.$emit("update-selected", target.id);
        this.$emit("update-config", this[target.id]);
        this[target.id].show = true;
        return true;
      }
    },
  },
}
</script>

<style>
.pdf-edit {
  position: relative;
}
.pdf-edit a {
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
.screen {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,0.3);
}
.pen-option {
  position: absolute;
  z-index: 1;
  max-height: calc(100vh - 150px);
  overflow: auto;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: rgb(26 26 26 / 20%) 0px 0px 12px;
  top: 100%;
  min-width: 260px;
}
.color-picker {
  padding: 0;
  margin-right: 5px;
}
.pen-line-range {
  padding: 0;
}
.pen-range-span {
  min-width: 40px;
  display: inline-block;
}
.selected {
  background-color: yellow !important;
}
</style>

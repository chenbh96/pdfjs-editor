<template>
  <div v-if="isEdit" class="pdf-edit">
    <el-tooltip effect="dark" content="Pen" :open-delay=500 placement="bottom-start">
      <a id="pen" 
      @mouseup.prevent.stop="togglePen($event)" 
      @touchend.prevent.stop="togglePen($event)" 
      class="icon">
        <img v-if="selected == 'pen'" src="@/assets/icons-blue/pen.png"/>
        <img v-else src="@/assets/icons/pen.png"/>
      </a>
    </el-tooltip>
    <div v-show="pen.show" class="screen" @mouseup.prevent.stop="togglePen($event)"></div>
    <div v-show="pen.show" class="pen-option">
      <input type="color"  class="pen-color-picker  color-picker" @input="changePenColor($event.target.value)">
      <input type="range" class="pen-line-range" @input="changePenSize($event.target.value)" min="1" max="72" value="1">
      <span class="pen-range-span"><label class="pen-range-value">{{pen.size}}</label>Px</span>
    </div>
    <el-tooltip effect="dark" content="Highlighter" :open-delay=500 placement="bottom-start">
      <a id="highlighter" 
      @mouseup.prevent.stop="toggleHighlighter($event)"
      @touchend.prevent.stop="toggleHighlighter($event)" 
      class="icon"
      ><!-- <HighlighterIcon /> -->
        <img v-if="selected == 'highlighter'" src="@/assets/icons-blue/highlighter.png"/>
        <img v-else src="@/assets/icons/highlighter.png"/>
      </a>
    </el-tooltip>
    <el-tooltip effect="dark" content="Eraser" :open-delay=500 placement="bottom-start">
      <a id="eraser" 
      @mouseup.prevent.stop="toggleEraser($event)"
      @touchend.prevent.stop="toggleEraser($event)" 
      class="icon"
      ><!-- <HighlighterIcon /> -->
        <img v-if="selected == 'eraser'" src="@/assets/icons-blue/eraser.png"/>
        <img v-else src="@/assets/icons/eraser.png"/>
      </a>
    </el-tooltip>
    <el-tooltip effect="dark" content="Undo" :open-delay=500 placement="bottom-start">
      <a id="undo" @click.prevent.stop="clickUndo()" class="icon">
        <img src="@/assets/icons/undo.png"/>
      </a>
    </el-tooltip>
    <el-tooltip effect="dark" content="Redo" :open-delay=500 placement="bottom-start">
      <a id="redo" @click.prevent.stop="clickRedo()" class="icon">
        <img src="@/assets/icons/redo.png"/>
      </a>
    </el-tooltip>
  </div>
</template>

<script>
import common from "@/utils/common.js";
import PenIcon from '../assets/icon-pen.svg';
import HighlighterIcon from '../assets/icon-highlighter.svg';
import {TOOLS} from '@/utils/constants.js';

export default {
  name: 'PDFEdit',

  components: {
    PenIcon,
    HighlighterIcon
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
      highlighter: {
        show: false,
        color: "rgba(255,255,0, 1)",
        size: 10,
      },
      eraser: {
        show: false,
        size: 10,
      },
      user: JSON.parse(localStorage.getItem("fm_user"))
    }
  },
  computed: {
    isEdit() {
      if (this.user) {
        return this.user.edit > 0
      }
      return false
    },
  },
  methods: {
    togglePen(e, callback = false) {
      var target = null;
      if (e.target.tagName.toLowerCase() == 'a') {
        target = e.target;
      } else if (e.target.parentNode.tagName.toLowerCase() == 'a') {
        target = e.target.parentNode;
      } else {
        this.pen.show = false;
        return;
      }
      if (!callback && common.isDoubleClick(this.togglePen, e)) {
        this.cancelTool();
        return;
      } 

      if (callback) {
        this.toggleSelected(target);
      }
    },

    changePenSize(value) {
      this.pen.size = parseInt(value);
      this.$emit("update-config", this.pen);
    },

    changePenColor(value) {
      this.pen.color = value;
      this.$emit("update-config", this.pen);
    },

    toggleHighlighter(e, callback = false) {
      var target = null;
      if (e.target.tagName.toLowerCase() == 'a') {
        target = e.target;
      } else if (e.target.parentNode.tagName.toLowerCase() == 'a') {
        target = e.target.parentNode;
      } else {
        this.highlighter.show = false;
        return;
      }

      if (!callback && common.isDoubleClick(this.toggleHighlighter, e)) {
        this.cancelTool();
        return;
      } 

      if (callback) {
        this.toggleSelected(target);
      }
    },

    toggleEraser(e, callback = false) {
      var target = null;
      if (e.target.tagName.toLowerCase() == 'a') {
        target = e.target;
      } else if (e.target.parentNode.tagName.toLowerCase() == 'a') {
        target = e.target.parentNode;
      } else {
        this.highlighter.show = false;
        return;
      }

      if (!callback && common.isDoubleClick(this.toggleHighlighter, e)) {
        this.cancelTool();
        return;
      }
      if (callback) {
        this.toggleSelected(target);
      }
    },

    toggleSelected(target) {
      if (target == null) {
        return true;
      } else {
        this.cancelTool();
        target.classList.add("selected");
        this.$emit("update-selected", target.id);
        this.$emit("update-config", this[target.id]);
        this[target.id].show = true;
        return true;
      }
    },

    cancelTool() {
      const selected = document.querySelector( '.selected' );
      if (selected) {
        selected.classList.remove('selected');
        this.$emit("update-selected", null);
      }
    },
    clickUndo() {
      this.$emit("undo");
    },

    clickRedo() {
      this.$emit("redo");
    },
  },
}
</script>

<style >
.pdf-edit {
  position: relative;
}
.pdf-edit a {
  float: left;
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
</style>

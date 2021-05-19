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
    <div v-if="pen.show" class="screen" @mouseup.prevent.stop="togglePen($event)"></div>
    <div v-if="pen.show" class="pen-option option">
      <Sizes :selected="pen.size" :options="pen.sizeOptions" @select="changePenSize" style="margin-right: 30px;"/>
      <Colors :selected="pen.color" :options="pen.colorOptions" @select="changePenColor"/>
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
    <div v-if="eraser.show" class="screen" @mouseup.prevent.stop="toggleEraser($event)"></div>
    <div v-if="eraser.show" class="pen-option option">
      <Sizes :selected="eraser.size" :options="eraser.sizeOptions" @select="changeEraserSize"/>
    </div>

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
import Sizes from './tool_config/Sizes';
import Colors from './tool_config/Colors';

export default {
  name: 'PDFEdit',

  components: {
    PenIcon,
    HighlighterIcon,
    Sizes,
    Colors,
  },

  props: {
    selected: [String, null]
  },

  data: function() {
    return {
      pen: {
        show: false,
        sizeOptions: [4, 6, 10, 14, 18],
        size: 10,
        colorOptions: ["#E16165", "#66A8F4", "#69BC6F", "#EDC64F", "#000000"],
        color: "#E16165",
      },
      highlighter: {
        show: false,
        color: "rgba(255,255,0, 1)",
        size: 10,
      },
      eraser: {
        show: false,
        sizeOptions: [4, 6, 10, 14, 18],
        size: 10,
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.userInfo;
    },
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
        this.eraser.show = false;
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


    changePenSize(value) {
      this.$set(this.pen, "size", value);
      this.$emit("update-config", this.pen);
    },

    changePenColor(value) {
      this.$set(this.pen, "color", value);
      this.$emit("update-config", this.pen);
    },

    changeEraserSize(value) {
      this.$set(this.eraser, "size", value);
      this.$emit("update-config", this.eraser);
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
  z-index: 99;
  background-color: rgba(0,0,0,0.1);
}
.option {
  z-index: 100;
  display: flex;
}
.pen-option {
  position: absolute;
  max-height: calc(100vh - 150px);
  overflow: auto;
  padding: 8px;
  background-color: #333;
  border-radius: 4px;
  box-shadow: rgb(26 26 26 / 20%) 0px 0px 12px;
  left: 0;
  top: calc(100% + 1em);
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

<template>
  <div class="pdf-zoom">
    <el-tooltip class="item" effect="dark" content="Zoom-in" :open-delay=500 placement="top-start">
      <a @click.prevent.stop="zoomIn" class="icon" :disabled="isDisabled">
        <img src="@/assets/icons/zoomin.png"/>
      </a>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="Zoom-out"  :open-delay=500 placement="top-start">
      <a @click.prevent.stop="zoomOut" class="icon" :disabled="isDisabled">
        <img src="@/assets/icons/zoomout.png"/>
      </a>
    </el-tooltip>
    <el-tooltip class="item pc" effect="dark" content="Fit-width"  :open-delay=500 placement="top-start">
      <a @click.prevent.stop="fitWidth" class="icon" :disabled="isDisabled">
        <img src="@/assets/icons/cover.png"/>      
      </a>
    </el-tooltip>
    <el-tooltip class="item pc" effect="dark" content="Fit-auto"  :open-delay=500 placement="top-start">
      <a @click.prevent.stop="fitAuto" class="icon" :disabled="isDisabled">
        <img src="@/assets/icons/contain.png"/>
      </a>
    </el-tooltip>
  </div>
</template>

<script>
import ZoomInIcon from '../assets/icon-zoom-in.svg';
import ZoomOutIcon from '../assets/icon-zoom-out.svg';
import ExpandIcon from '../assets/icon-expand.svg';
import ShrinkIcon from '../assets/icon-shrink.svg';

export default {
  name: 'PDFZoom',

  components: {
    ZoomInIcon,
    ZoomOutIcon,
    ExpandIcon,
    ShrinkIcon,
  },

  props: {
    scale: {
      type: Number,
    },
    increment: {
      type: Number,
      default: 0.25,
    },
  },

  computed: {
    isDisabled() {
      return !this.scale;
    },
  },

  methods: {
    zoomIn() {
      this.updateScale(this.scale + this.increment);
    },

    zoomOut() {
      if (this.scale <= this.increment) return;
      this.updateScale(this.scale - this.increment);
    },

    updateScale(scale) {
      this.$emit('change', {scale});
    },

    fitWidth() {
      this.$emit('fit', 'width');
    },

    fitAuto() {
      this.$emit('fit', 'auto');
    },
  },
}
</script>

<style>
.pdf-zoom a {
  float: left;
}
</style>

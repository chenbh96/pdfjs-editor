<template>
  <div class="tool-bar">
    <div v-for="size in options" :key="size" class="item" @click.prevent.stop="click(size)">
      <div
      :class="getClass(size)"
      :style="getStyle(size)"></div>
    </div>
  </div>
</template>

<script>
import {PIXEL_RATIO} from "@/utils/constants.js";

export default {
  name: 'Sizes',

  components: {
  },

  props: {
    selected: {
      default: 10,
    },
    options: {
      default: [],
    }
  },

  methods: {
    click(value) {
      this.$emit("select", value);
    },
    getClass(value) {
      return (value == this.selected) ? {selected: true, circle: true} : {selected: false, circle: true};
    },
    getStyle(value) {
      return "width: "+value+"px; height: "+value+"px;";
    },
  }
}
</script>

<style scoped>
.tool-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.item {
  padding: 0 8px;
}

.circle {
  background-color: #888;
  border-radius: 50%;
}

.selected {
  background-color: #fff !important;
}
</style>

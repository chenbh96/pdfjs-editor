<template>
  <div class="tool-bar">
    <div v-for="color in options" :key="color" 
    :class="getClass(color)"
    :style="getStyle(color)"
    @click.prevent.stop="click(color)">
    </div>
  </div>
</template>

<script>

export default {
  name: 'Colors',

  components: {
  },

  props: {
    selected: {
      default: "#E16165",
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
      return (value == this.selected) ? "item selected" : "item" ;
    },
    getStyle(value) {
      return "background-color: "+value;
    }
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
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
}

.item:not(:last-child) {
  margin-right: 10px;
}

.selected {
  border: 2px solid #fff !important;
}
</style>

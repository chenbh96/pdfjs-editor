<template>
  <div class="tool-bar">
    <div v-for="shape in options" :key="shape" 
    :class="getClass(shape)"
    :style="getStyle(shape)"
    @click.prevent.stop="click(shape)">
    </div>
  </div>
</template>

<script>

export default {
  name: 'Shapes',

  components: {
  },

  props: {
    selected: {
      default: "rectangle",
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
      switch(value) {
        case "rectangle": {
          return "";
        }
        case "circle": {
          return "border-radius: 50%;";
        }
      }
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
  border: 2px solid #888;
}

.item:not(:last-child) {
  margin-right: 10px;
}

.selected {
  border: 2px solid #fff !important;
}

.item:focus {
  outline: 0 !important;
}
</style>

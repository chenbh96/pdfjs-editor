<template>
  <div class="pdf-paginator">
    <template v-if="pageCount">
      <input
        :value="value"
        @input="input"
        min="1"
        :max="pageCount"
        type="number"
        /> <span style="color: #404246;"> / {{ pageCount }}</span>
    </template>
    <input v-else type="number" />
  </div>
</template>

<script>
export default {
  name: 'PDFPaginator',

  props: {
    value: Number,
    pageCount: Number,
  },

  methods: {
    input(event) {
      this.$emit('input', parseInt(event.target.value, 10));
    },
  },

  watch: {
    pageCount() {
      this.$emit('input', 1);
    },
  }
}
</script>

<style>
.pdf-paginator {
  color: white;
  font-weight: bold;
  font-size: 13px;
}
.pdf-paginator input {
  width: 2em;
  padding: 3px 0.3em;
  border: 2px solid #a9a9a9;
  border-radius: 4px;
  color: #3882FE;
  font-weight: 600;
  text-align: center;
}
</style>

<template>
  <div style="position: relative;">
    <canvas :id="getId" 
      v-visible="drawPage"
      v-bind="canvasAttrs">  
    </canvas>
    <canvas :id="getId + '-edit'"
      class="drawing-canvas" 
      v-bind="canvasAttrs"
      @mousedown="mousedown($event)"
      @mouseup="mouseup($event)"
      @mousemove="mousemove($event)"
      @mouseout="mouseup($event)"
      @touchstart.stop="mousedown($event)"
      @touchend.stop="mouseup($event)"
      @touchmove.stop="mousemove($event)"
      ></canvas>
  </div>
</template>

<script>
import debug from 'debug';
const log = debug('app:components/PDFPage');

import {PIXEL_RATIO} from '../utils/constants';
import visible from '../directives/visible';

export default {
  name: 'PDFPage',

  props: {
    page: {
      type: Object, // instance of PDFPageProxy returned from pdf.getPage
      required: true,
    },
    scale: {
      type: Number,
      required: true,
    },
    optimalScale: {
      type: Number,
      required: true,
    },
    isPageFocused: {
      type: Boolean,
      default: false,
    },
    isElementFocused: {
      type: Boolean,
      default: false,
    },
    index: {
      required: true,
    },
    selectedTool: {
      default: false,
    },
    toolConfig: {
      default: false,
    }
  },

  directives: {
    visible,
  },

  data: function() {
    return {
      currentEdit: [],
      isMouseDown: false,
      x: 0,
      y: 0,
      initScale: 0,
    }
  },

  computed: {
    actualSizeViewport() {
      return this.viewport.clone({scale: this.scale});
    },

    canvasStyle() {
      const {width: actualSizeWidth, height: actualSizeHeight} = this.actualSizeViewport;
      const [pixelWidth, pixelHeight] = [actualSizeWidth, actualSizeHeight]
        .map(dim => Math.ceil(dim / PIXEL_RATIO));
      return `width: ${pixelWidth}px; height: ${pixelHeight}px;`;
    },

    canvasAttrs() {
      let {width, height} = this.viewport;
      [width, height] = [width, height].map(dim => Math.ceil(dim));
      const style = this.canvasStyle;

      return {
        width,
        height,
        style,
        class: 'pdf-page box-shadow',
      };
    },

    pageNumber() {
      return this.page.pageNumber;
    },

    getId() {
      return "canvas-"+this.index;
    }
  },

  methods: {
    focusPage() {
      if (this.isPageFocused) return;

      this.$emit('page-focus', this.pageNumber);
    },

    drawPage() {
      console.log(this.index);
      if (this.renderTask) return;

      const {viewport} = this;
      const canvas = document.getElementById(this.getId);
      const canvasContext = canvas.getContext('2d');
      const renderContext = {canvasContext, viewport};

      // PDFPageProxy#render
      // https://mozilla.github.io/pdf.js/api/draft/PDFPageProxy.html
      this.renderTask = this.page.render(renderContext);
      this.renderTask
        .then(() => {
          this.$emit('page-rendered', {
            page: this.page,
            text: `Rendered page ${this.pageNumber}`,
          });
         })
        .catch(response => {
          this.destroyRenderTask();
          this.$emit('page-errored', {
            response,
            page: this.page,
            text: `Failed to render page ${this.pageNumber}`,
          });
        });
    },

    updateVisibility() {
      this.$parent.$emit('update-visibility');
      console.log(this.scale, this.initScale); 
    },

    destroyPage(page) {
      // PDFPageProxy#_destroy
      // https://mozilla.github.io/pdf.js/api/draft/PDFPageProxy.html
      if (page) page._destroy();

      this.destroyRenderTask();
    },

    destroyRenderTask() {
      if (!this.renderTask) return;

      // RenderTask#cancel
      // https://mozilla.github.io/pdf.js/api/draft/RenderTask.html
      this.renderTask.cancel();
      delete this.renderTask;
    },

    mousedown(event) {
      this.isMouseDown = true;
      if (this.selectedTool && this.isMouseDown) {
        [this.x, this.y] = [event.offsetX, event.offsetY];
      }
    },

    mouseup(event) {
      this.isMouseDown = false;
    },

    mousemove(event) {
      if (this.selectedTool && this.isMouseDown) {
        event.preventDefault();


        const canvas = document.getElementById(this.getId+"-edit");
        const context = canvas.getContext('2d');
        var scale = this.canvasAttrs.width/this.actualSizeViewport.width*PIXEL_RATIO;
        this.currentWidth = this.toolConfig.size;
        const newX = event.offsetX;
        const newY = event.offsetY;
        context.strokeStyle = this.toolConfig.color;
        context.lineWidth = this.toolConfig.size;
        context.lineCap = 'round';
        context.beginPath();
        context.moveTo( this.x*scale, this.y*scale );
        context.lineTo( newX*scale, newY*scale );
        context.stroke();
        //[x, y] = [newX, newY];
        this.x = newX;
        this.y = newY;
      }
    },
  },

  watch: {
    scale: 'updateVisibility',

    page(_newPage, oldPage) {
      this.destroyPage(oldPage);
    },

    isElementFocused(isElementFocused) {
      if (isElementFocused) this.focusPage();
    },
  },

  created() {
    // PDFPageProxy#getViewport
    // https://mozilla.github.io/pdf.js/api/draft/PDFPageProxy.html
    this.viewport = this.page.getViewport(this.optimalScale);
    this.initScale = this.scale;
  },

  mounted() {
    log(`Page ${this.pageNumber} mounted`);
  },

  beforeDestroy() {
    this.destroyPage(this.page);
  },
};
</script>
<style>
.pdf-page {
  display: block;
  margin: 0 auto;
}

.drawing-canvas {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>

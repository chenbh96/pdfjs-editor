<template>
  <div style="position: relative;">
    <canvas :id="getId"
      class="box-shadow"
      v-visible="drawPage"
      v-bind="canvasAttrs">  
    </canvas>
    <canvas :id="getId + '-edit'"
      class="drawing-canvas"
      v-bind="canvasAttrs"
      ></canvas>
    <canvas :id="getId + '-layer'"
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

import {PIXEL_RATIO, TOOLS} from '../utils/constants';
import visible from '../directives/visible';

function position(event, canvas) {
  if (event.offsetX) {
    return {
      x: event.offsetX,
      y: event.offsetY
    };
  } else {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.touches[0].clientX - rect.left,
      y: event.touches[0].clientY - rect.top
    };
  }
}

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
        class: 'pdf-page',
      };
    },

    pageNumber() {
      return this.page.pageNumber;
    },

    getId() {
      return "canvas-"+this.index;
    },
  },

  methods: {
    focusPage() {
      if (this.isPageFocused) return;

      this.$emit('page-focus', this.pageNumber);
    },

    drawPage() {
      this.zoomScale = this.canvasAttrs.width/this.actualSizeViewport.width*PIXEL_RATIO;
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
      if (this.isMouseDown && this.selectedTool && this.toolConfig) {
        switch(this.selectedTool) {
          case TOOLS.pen:
            this.pen(event, "finish");
            break;
          case TOOLS.highlighter:
            this.highlighter(event, "finish");
            break;
          case TOOLS.eraser: 
            this.highlighter(event, "finish");
            break;
        }
        this.$emit("edit-push", {
          page: this.index,
          tool: this.selectedTool,
          scale: this.zoomScale,
          toolConfig: this.toolConfig,
          content: this.currentEdit
        });
      }
      this.currentEdit = [];
      this.isMouseDown = false;
    },

    mousemove(event) {
      event.preventDefault();

      switch(this.selectedTool) {
        case TOOLS.pen:
          this.pen(event, "draw");
          break;
        case TOOLS.highlighter:
          this.highlighter(event, "draw");
          break;
        case TOOLS.eraser:
          this.eraser(event, "draw");
          break;
      }
    },

    pen(event, mode="draw") {
      if (!this.selectedTool || !this.isMouseDown) {
        return;
      }
      const cLayer = document.getElementById(this.getId+"-layer");
      const cCtx = cLayer.getContext('2d');
      cCtx.clearRect(0, 0, cLayer.width, cLayer.height);

      var scale = this.canvasAttrs.width/this.actualSizeViewport.width*PIXEL_RATIO;
      var canvas = document.getElementById(this.getId+"-edit");
      if (mode == "draw") {
        canvas = cLayer;
        const newX = position(event, canvas).x;
        const newY = position(event, canvas).y;
        this.currentEdit.push({
          sx: this.x,
          sy: this.y,
          dx: newX,
          dy: newY
        });

        this.x = newX;
        this.y = newY;
      }
      var context = canvas.getContext('2d');
      context.strokeStyle = this.toolConfig.color;
      context.lineWidth = this.toolConfig.size;
      context.lineCap = 'round';

      context.beginPath();
      this.currentEdit.forEach(seg => {
        context.moveTo(seg.sx*scale, seg.sy*scale);
        context.lineTo(seg.dx*scale, seg.dy*scale);
      });
      context.stroke();
    },

    highlighter(event, mode="draw") {
      if (!this.selectedTool || !this.isMouseDown) {
        return;
      }
      // layer层清空
      const cLayer = document.getElementById(this.getId+"-layer");
      const cCtx = cLayer.getContext('2d');
      cCtx.clearRect(0, 0, cLayer.width, cLayer.height);

      var scale = this.canvasAttrs.width/this.actualSizeViewport.width*PIXEL_RATIO;
      var canvas = document.getElementById(this.getId+"-edit");
      if (mode == "draw") {
        canvas = cLayer;
        const newX = position(event, canvas).x;
        const newY = position(event, canvas).y;
        this.currentEdit.push({
          sx: this.x,
          sy: this.y,
          dx: newX,
          dy: newY
        });

        this.x = newX;
        this.y = newY;
      }
      var context = canvas.getContext('2d');
      context.strokeStyle = "rgba(0,110,255, 0.3)";
      context.lineWidth=30;
      context.lineCap = 'round';

      context.beginPath();
      this.currentEdit.forEach(seg => {
        context.moveTo(seg.sx*scale, seg.sy*scale);
        context.lineTo(seg.dx*scale, seg.dy*scale);
      });
      context.stroke();
    },

    eraser(event, mode="draw") {
      const cLayer = document.getElementById(this.getId+"-layer");
      const cCtx = cLayer.getContext('2d');
      cCtx.clearRect(0, 0, cLayer.width, cLayer.height);

      var canvas = document.getElementById(this.getId+"-edit");
      const newX = position(event, canvas).x;
      const newY = position(event, canvas).y;
      var scale = this.canvasAttrs.width/this.actualSizeViewport.width*PIXEL_RATIO;
      cCtx.beginPath();
      cCtx.lineWidth = 1;
      cCtx.strokeStyle = "#000";
      cCtx.arc(newX * scale, newY * scale, 15, 0, 2 * Math.PI);
      cCtx.stroke();

      if (!this.selectedTool || !this.isMouseDown) {
        return;
      }

      this.currentEdit.push({
        sx: this.x,
        sy: this.y,
        dx: newX,
        dy: newY
      });

      this.x = newX;
      this.y = newY;

      var context = canvas.getContext('2d');
      context.globalCompositeOperation = "destination-out";
      context.lineWidth = "30";
      context.lineCap = 'round';

      context.beginPath();
      this.currentEdit.forEach(seg => {
        context.moveTo(seg.sx*scale, seg.sy*scale);
        context.lineTo(seg.dx*scale, seg.dy*scale);
      });
      context.stroke();
      context.globalCompositeOperation = "source-over";
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

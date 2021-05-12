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
    },
    pageData: {
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

    // edit层canvas
    editCanvas() {
      return document.getElementById(this.getId+"-edit");
    },

    // layer层canvas
    layerCanvas() {
      return document.getElementById(this.getId+"-layer");
    },
  },

  methods: {
    focusPage() {
      if (this.isPageFocused) return;

      this.$emit('page-focus', this.pageNumber);
    },

    drawPage() {
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
            this.eraser(event, "finish");
            break;
        }
        if (this.currentEdit.length) {
          this.$emit("edit-push", {
            page: this.index,
            tool: this.selectedTool,
            baseCanvasWidth: this.canvasAttrs.width,
            baseViewWidth: this.actualSizeViewport.width,
            toolConfig: this.toolConfig,
            content: this.currentEdit
          });
        }
      }
      this.currentEdit = [];
      this.isMouseDown = false;
    },

    mousemove(event) {
      switch(this.selectedTool) {
        case TOOLS.pen:
          // 判断是否选中工具并且鼠标正在点击
          if (!this.selectedTool || !this.isMouseDown) {
            return;
          }
          event.preventDefault(); // 取消移动端拖拽滚动页面
          this.pen(event, "draw");
          break;
        case TOOLS.highlighter:
          if (!this.selectedTool || !this.isMouseDown) {
            return;
          }
          event.preventDefault(); 
          this.highlighter(event, "draw");
          break;
        case TOOLS.eraser:
          var layerCanvas = this.layerCanvas;
          const cCtx = layerCanvas.getContext('2d');
          cCtx.clearRect(0, 0, layerCanvas.width, layerCanvas.height);
          var scale = this.canvasAttrs.width/this.actualSizeViewport.width*PIXEL_RATIO;
          const newX = this.position(event, layerCanvas).x;
          const newY = this.position(event, layerCanvas).y;
          cCtx.beginPath();
          cCtx.lineWidth = 1;
          cCtx.strokeStyle = "#000";
          cCtx.arc(newX * scale, newY * scale, 15, 0, 2 * Math.PI);
          cCtx.stroke();
          if (!this.selectedTool || !this.isMouseDown) {
            return;
          }
          event.preventDefault();
          this.eraser(event, "draw");
          break;
      }
    },

    position(event, canvas) {
      if (Number.isInteger(event.offsetX)) {
        return {
          x: event.offsetX,
          y: event.offsetY
        };
      } else if (event.touches[0]) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: event.touches[0].clientX - rect.left,
          y: event.touches[0].clientY - rect.top
        };
      }
      return {
        x: this.x, 
        y: this.y
      };
    },

    pen(event, mode="draw") {
      var layerCanvas = this.layerCanvas;
      const cCtx = layerCanvas.getContext('2d');
      cCtx.clearRect(0, 0, layerCanvas.width, layerCanvas.height);

      var canvas = this.editCanvas;
      if (mode == "draw") {
        canvas = this.layerCanvas;
        const newX = this.position(event, canvas).x;
        const newY = this.position(event, canvas).y;
        this.currentEdit.push({
          sx: this.x,
          sy: this.y,
          dx: newX,
          dy: newY
        });

        this.x = newX;
        this.y = newY;
        this.renderEdit(canvas, this.selectedTool, this.toolConfig, this.actualSizeViewport.width, this.currentEdit);
      }
    },

    highlighter(event, mode="draw") {
      var layerCanvas = this.layerCanvas;
      const cCtx = layerCanvas.getContext('2d');
      cCtx.clearRect(0, 0, layerCanvas.width, layerCanvas.height);

      var canvas = document.getElementById(this.getId+"-edit");
      if (mode == "draw") {
        canvas = layerCanvas;
        const newX = this.position(event, canvas).x;
        const newY = this.position(event, canvas).y;
        this.currentEdit.push({
          sx: this.x,
          sy: this.y,
          dx: newX,
          dy: newY
        });

        this.x = newX;
        this.y = newY;
        this.renderEdit(canvas, this.selectedTool, this.toolConfig, this.actualSizeViewport.width, this.currentEdit);
      }
    },

    eraser(event, mode="draw") {
      const newX = this.position(event, this.editCanvas).x;
      const newY = this.position(event, this.editCanvas).y;
      this.currentEdit.push({
        sx: this.x,
        sy: this.y,
        dx: newX,
        dy: newY
      });

      this.x = newX;
      this.y = newY;

      this.renderEdit(this.editCanvas, this.selectedTool, this.toolConfig, this.actualSizeViewport.width, this.currentEdit);
    },

    /**
     * 渲染编辑内容
     * @author   Liuxy
     * @datetime 2021-05-06T11:00:24+0800
     * @param    canvas 被操作的canvas
     * @param    scale  缩放比例
     */
    renderEdit(canvas, tool, toolConfig, baseViewWidth, editContent) {
      var context = canvas.getContext('2d');
      // 缩放比例：canvas.width / canvas显示宽度 * PIXEL_RATIO
      // !!! 换机器同步可能出问题 !!!
      var scale = this.canvasAttrs.width / baseViewWidth * PIXEL_RATIO;
      switch(tool) {
        case TOOLS.pen: 
          context.strokeStyle = toolConfig.color;
          context.lineWidth = toolConfig.size;
          context.lineCap = 'round';
          context.beginPath();
          editContent.forEach(seg => {
            context.moveTo(seg.sx*scale, seg.sy*scale);
            context.lineTo(seg.dx*scale, seg.dy*scale);
          });
          context.stroke();
          break;
        case TOOLS.highlighter:
          context.strokeStyle = "rgba(0,110,255, 0.3)";
          context.lineWidth= 30;
          context.lineCap = 'round';

          context.beginPath();
          editContent.forEach(seg => {
            context.moveTo(seg.sx*scale, seg.sy*scale);
            context.lineTo(seg.dx*scale, seg.dy*scale);
          });
          context.stroke();
          break;
        case TOOLS.eraser:
          context.beginPath();
          context.strokeStyle = "#000";
          context.globalCompositeOperation = "destination-out";
          context.lineWidth = "30";
          context.lineCap = 'round';

          editContent.forEach(seg => {
            context.moveTo(seg.sx*scale, seg.sy*scale);
            context.lineTo(seg.dx*scale, seg.dy*scale);
          });
          context.stroke();
          context.globalCompositeOperation = "source-over";
          break;
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

    // 清除画笔层
    selectedTool() {
      const cLayer = document.getElementById(this.getId+"-layer");
      const cCtx = cLayer.getContext('2d');
      cCtx.clearRect(0, 0, cLayer.width, cLayer.height);
    },

    /**
     * 监听当前页编辑数据
     * @author   Liuxy
     * @datetime 2021-05-04T16:37:04+0800
     * @param    String                 newString
     * @param    String                 oldString
     */
    pageData(newString, oldString) {
      var newValue = "", oldValue = "";
      if (newString) {
        var newValue = JSON.parse(newString);
      }
      if (oldString) {
        var oldValue = JSON.parse(oldString);
      }
      if (newValue.length > oldValue.length) { // 新增
        var lastEdit = newValue[newValue.length-1];
        this.renderEdit(this.editCanvas, lastEdit.tool, lastEdit.toolConfig, lastEdit.baseViewWidth, lastEdit.content);
      } else { // 撤回或原地修改需要重新render canvas
        var canvas = this.editCanvas;
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        newValue.forEach((editItem) => {
          this.renderEdit(this.editCanvas, editItem.tool, editItem.toolConfig, editItem.baseViewWidth, editItem.content);
        });
      }
    }
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

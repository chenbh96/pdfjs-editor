<template>
  <div class="pdf-viewer">
    <header class="pdf-viewer__header box-shadow">
      <div class="pdf-preview-toggle">
        <a @click.prevent.stop="togglePreview" class="icon"><PreviewIcon /></a>
      </div>

      <PDFZoom
        :scale="scale"
        @change="updateScale"
        @fit="updateFit"
        style="margin-right: 5em;"
        />

      <PDFEdit
        :selected="selectedTool"
        @update-selected="updateSelectedTool"
        @update-config="updateToolConfig"
        style="margin-right: 2.5em;"
        />


      <PDFAction
        style="margin-right: 2.5em;"
        @undo="undo"
        @redo="redo"
        @save="save"
        />

      <PDFPaginator
        v-model="currentPage"
        :pageCount="pageCount"
        />

      <slot name="header"></slot>
    </header>

    <PDFData
      class="pdf-viewer__main"
      :url="url"
      @page-count="updatePageCount"
      @page-focus="updateCurrentPage"
      @document-rendered="onDocumentRendered"
      @document-errored="onDocumentErrored"
      >
      <template v-slot:preview="{pages}">
        <PDFPreview
          v-show="isPreviewEnabled"
          class="pdf-viewer__preview"
          v-bind="{pages, scale, currentPage, pageCount, isPreviewEnabled}"
          />
      </template>

      <template v-slot:document="{pages}">
        <PDFDocument
          class="pdf-viewer__document"
          :class="{ 'preview-enabled': isPreviewEnabled }"
          v-bind="{pages, scale, optimalScale, fit, currentPage, pageCount, isPreviewEnabled, selectedTool, toolConfig}"
          @scale-change="updateScale"
          @edit-push="edit"
          />
      </template>
    </PDFData>
  </div>
</template>

<script>
import PreviewIcon from '../assets/icon-preview.svg';

import PDFDocument from './PDFDocument';
import PDFData from './PDFData';
import PDFPaginator from './PDFPaginator';
import PDFPreview from './PDFPreview';
import PDFZoom from './PDFZoom';
import PDFEdit from './PDFEdit';
import PDFAction from './PDFAction';

import {A4_WIDTH, A4_HEIGHT} from '@/utils/constants';
import common from '@/utils/common';

function floor(value, precision) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.floor(value * multiplier) / multiplier;
}

export default {
  name: 'PDFViewer',

  components: {
    PDFDocument,
    PDFData,
    PDFPaginator,
    PDFPreview,
    PDFZoom,
    PreviewIcon,
    PDFEdit,
    PDFAction,
  },

  props: {
    url: String,
  },

  data() {
    return {
      scale: undefined,
      optimalScale: undefined,
      fit: undefined,
      currentPage: 1,
      pageCount: undefined,
      isPreviewEnabled: false,
      selectedTool: null,
      toolConfig: null,
      editData: [],
    };
  },

  methods: {
    onDocumentRendered() {
      this.$emit('document-errored', this.url);
    },

    onDocumentErrored(e) {
      this.$emit('document-errored', e);
    },

    updateScale({scale, isOptimal = false}) {
      const roundedScale = floor(scale, 2);
      if (isOptimal) this.optimalScale = roundedScale;
      this.scale = roundedScale;
    },

    updateFit(fit) {
      this.fit = fit;
    },

    updatePageCount(pageCount) {
      this.pageCount = pageCount;
    },

    updateCurrentPage(pageNumber) {
      this.currentPage = pageNumber;
    },

    togglePreview() {
      this.isPreviewEnabled = !this.isPreviewEnabled;
    },

    updateSelectedTool(value) {
      this.selectedTool = value;
    },

    updateToolConfig(value) {
      this.toolConfig = value;
    },

    edit(value) {
      this.editData.push(value);
    },

    undo() {
    },

    redo() {
      this.$api.pdf.editSignal(566, 1570).then(res=>{
        console.log(res);
      });
    },

    save() {
      var ret = [];

      var pages = new Set();
      for (var i in this.editData) {
        pages.add(this.editData[i].page);
      }

      var self = this;
      pages.forEach(index => {
        var canvas = document.getElementById("canvas-"+index+"-edit");
        var base64=canvas.toDataURL("image/png");
        var img = new Image;

        img.onload = resizeImage;
        img.src = base64;

        // 异步
        function resizeImage() {
          var newCanvas = document.createElement("canvas");
          var ctx = newCanvas.getContext("2d");
          if (canvas.width < canvas.height) {
            newCanvas.width = A4_WIDTH;
            newCanvas.height = A4_HEIGHT;
          } else {
            newCanvas.width = A4_HEIGHT;
            newCanvas.height = A4_WIDTH;
          }
          ctx.drawImage(img, 0, 0, newCanvas.width, newCanvas.height);
          var newBase64 = newCanvas.toDataURL();
          ret.push({
            page: index+1,
            base64: newBase64,
            action: "edit",
          });

          if (ret.length == pages.size) {
            var requestBody = {
              "fid": parseInt(self.$route.query.fid),
              "data": ret,
              // [
              //     {
              //         "page": 0,
              //         "base64": "",
              //         "action": "add"
              //     }
              // ],
              "userid": self.$route.query.userid,
              "title": "",
              "version": "",
              "uid": 0
            };
            console.log(requestBody);
            self.$api.pdf.save(requestBody).then(res => {
              console.log(res);
            });
          }
        }
      });

    },
  },

  watch: {
    url() {
      this.currentPage = undefined;
    },
  },

  mounted() {
    document.body.classList.add('overflow-hidden');
  },
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 1em;
  position: relative;
  z-index: 99;
}
.header-item {
  margin-right: 2.5em;
}

.pdf-viewer .pdf-viewer__document,
.pdf-viewer .pdf-viewer__preview {
  top: 70px;
}

.pdf-viewer__preview {
  display: block;
  width: 15%;
  right: 85%;
}

.pdf-viewer__document {
  top: 70px;
  width: 100%;
  left: 0;
}

.pdf-viewer__document.preview-enabled {
  width: 85%;
  left: 15%;
}

.pdf-preview-toggle {
  position: absolute;
  left: 2.5em;
}

@media print {
  header {
    display: none;
  }
}
</style>

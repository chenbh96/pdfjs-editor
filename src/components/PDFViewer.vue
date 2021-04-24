<template>
  <div class="pdf-viewer">
    <header class="pdf-viewer__header">
      <div class="menu-left-section">
        <el-tooltip class="item" effect="dark" content="Preview" :open-delay=1000 placement="bottom-start">
          <a @click.prevent.stop="togglePreview" class="icon">
            <img src="@/assets/icons/preview.png"/>
          </a>
        </el-tooltip>

        <PDFPaginator
        v-model="currentPage"
        :pageCount="pageCount"
        style="margin-left: 1em"
        />
      </div>

      <PDFZoom
        :scale="scale"
        @change="updateScale"
        @fit="updateFit"
        />

      <PDFEdit
        :selected="selectedTool"
        @update-selected="updateSelectedTool"
        @update-config="updateToolConfig"
        />


      <PDFAction
        @undo="undo"
        @redo="redo"
        @save="modalSave"
        />

      <UserInfo
        class="menu-right-section"
        @help="help"
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

    <div class="modal-shadow" v-if="showModal">
      <ModalShare class="modal" 
        v-if="modals.help"/>
      <ModalSave class="modal" 
        v-if="modals.save" 
        :show="modals.save" 
        @close="closeSave"
        @save="save"/>
    </div>
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
import UserInfo from './UserInfo';
import ModalShare from './modals/ModalShare';
import ModalSave from './modals/ModalSave';

import {A4_WIDTH, A4_HEIGHT} from '@/utils/constants';
// import common from '@/utils/common';

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
    UserInfo,
    ModalShare,
    ModalSave,
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
      selectedTool: null, // 已选择工具
      toolConfig: null, // 编辑工具配置
      editData: [], // 编辑步骤存放
      editLock: false, // 编辑锁，编辑时为true
      modals: { // 所有弹窗判断
        help: false,
        save: false,
      },
      lastActionTimer: null, // 最后操作倒计时
    };
  },

  computed: {
    showModal() {
      for (var key in this.modals) {
        if (this.modals[key]) {
          return true;
        }
      }
      return false;
    },
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

    //////////////////// 编辑功能 ////////////////////
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
              "action": "Edit",
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

    modalSave() {
      this.modals.save = true;
    },

    closeSave() {
      this.modals.save = false;
      console.log(this.modals);
    },

    //////////////////// 用户菜单 ////////////////////

    help() {
      this.modals.help = true;
    },

    doNothing() {
      return;
    }
  },

  watch: {
    url() {
      this.currentPage = undefined;
    },
    editData() {
      clearTimeout(this.lastActionTimer);
      var _this = this;
      this.lastActionTimer = setTimeout(function(){
        _this.modals.save = true;
      }, 10000);
    }
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
  background-color: #F0F2F4;
}
.header-item {
  margin-right: 2.5em;
}

.pdf-viewer .pdf-viewer__document,
.pdf-viewer .pdf-viewer__preview {
  top: 56px;
}

.pdf-viewer__preview {
  display: block;
  width: 15%;
  right: 85%;
}

.pdf-viewer__document {
  top: 56px;
  width: 100%;
  left: 0;
}

.pdf-viewer__document.preview-enabled {
  width: 85%;
  left: 15%;
}

.menu-left-section {
  position: absolute;
  left: 1em;
  display: flex; 
  align-items: center;
}

.menu-right-section {
  position: absolute;
  right: 0;
  display: flex; 
  align-items: center;
}

.modal-shadow {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
}

.modal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

@media print {
  header {
    display: none;
  }
}
</style>

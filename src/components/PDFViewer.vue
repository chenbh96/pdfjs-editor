<template>
  <div class="pdf-viewer">
    <header class="pdf-viewer__header box-shadow">
      <div class="menu-left-section">
        <el-tooltip class="item" effect="dark" content="Preview" :open-delay=500 placement="bottom-start">
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
        @undo="undo"
        @redo="redo"
        />

      <UserInfo
        class="menu-right-section"
        @save="modalSave"
        @share="modalRemark"
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
      @tip="tip"
      @close-tip="closeTip"
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
          v-bind="{pages, scale, optimalScale, fit, currentPage, pageCount, isPreviewEnabled, selectedTool, toolConfig, perPageData}"
          @scale-change="updateScale"
          @edit-push="edit"
          />
      </template>
    </PDFData>

    <div class="modal-shadow" v-if="showModal">
      <ModalShare class="modal-center box-shadow" 
        v-if="modals.share"
        :remark="remark"
        @close="closeShare"/>
      <ModalRemark class="modal-center box-shadow"
        v-if="modals.remark"
        @close="closeRemark"
        @save="saveRemark" />
      <ModalSave class="modal-center box-shadow" 
        v-if="modals.save" 
        @close="closeSave"
        @save="save"/>
      <ModalTip class="box-shadow"
        style="z-index: 99; position: absolute; top: 70px; right: 12px;" 
        v-if="modals.tip"
        :msg="tipMsg" 
        @close="closeTip"/>
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
import UserInfo from './UserInfo';
import ModalShare from './modals/ModalShare';
import ModalSave from './modals/ModalSave';
import ModalRemark from './modals/ModalRemark';
import ModalTip from './modals/ModalTip';

import common from '@/utils/common';
import {A4_WIDTH, A4_HEIGHT, TIP_MSG, SAVE_MODE} from '@/utils/constants';

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
    UserInfo,
    ModalShare,
    ModalSave,
    ModalRemark,
    ModalTip
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
        share: false,
        save: false,
        remark: false,
        tip: false,
      },
      lastActionTimer: null, // 最后操作倒计时
      perPageData: {},
      redoData: [],
      remark: "",
      tipMsg: "",
      tipTimer: null,
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
      this.toolConfig = JSON.parse(JSON.stringify(value));
    },

    edit(value) {
      this.editData.push(value);
      var tempData = JSON.parse(JSON.stringify(this.perPageData));
      if (this.perPageData[value.page]) {
        tempData[value.page].push(value);
      } else {
        tempData[value.page] = [value];
      }
      this.perPageData = tempData;
      this.redoData = [];
    },

    undo() {
      var lastEdit = this.editData.pop();
      if (lastEdit) {
        this.perPageData[lastEdit.page].pop();
        this.redoData.push(lastEdit);
      }
    },

    redo() {
      if (this.redoData.length) {
        var prevEdit = this.redoData.pop();
        this.perPageData[prevEdit.page].push(prevEdit);
        this.editData.push(prevEdit);
      }
    },

    save(title, action) {
      clearTimeout(this.lastActionTimer);
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
        var _this = this;

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
              "action": action,
              "userid": self.$route.query.userid,
              "title": title,
              "version": "",
              "uid": 0
            };
            console.log(requestBody);
            self.$api.pdf.save(requestBody).then(res => {
              console.log(res.data);
              var dat=res.data;
              if(dat.data&&dat.data.fid) {
                localStorage.fm_fid = dat.data.fid;
                localStorage.fm_dtype = 1;
                _this.$store.dispatch("setFid", dat.data.fid);
                _this.$store.dispatch("updateDtype");
                _this.$store.dispatch("updateFirstSave");
              }
              self.modals.save = false;
              self.tip(TIP_MSG.saveSuccess, 1);
            });
          }
        }
      });

    },

    ///////////////// 弹窗 /////////////////
    modalSave() {
      if (this.editData.length == 0) {
        this.tip(TIP_MSG.noEdit, 1);
        return;
      }
      this.modals.save = true;
    },

    closeSave() {
      this.modals.save = false;
    },

    closeShare() {
      this.modals.share = false;
    },

    modalRemark() {
      this.modals.remark = true;
    },

    closeRemark() {
      this.modals.remark = false;
    },

    saveRemark(value) {
      this.modals.remark = false;
      this.modals.share = true;
      this.remark = value;
    },

    tip(msg, delay = 0) {
      clearTimeout(this.tipTimer);
      this.tipMsg = msg;
      this.modals.tip = true;
      if (delay > 0) {
        this.tipTimer = setTimeout(() => {
          this.modals.tip = false;
        }, delay * 1000);
      }
    }, 

    closeTip() {
      clearTimeout(this.tipTimer);
      this.tipMsg = false;
      this.modals.tip = false;
    },
  },

  watch: {
    url() {
      this.currentPage = undefined;
    },
    
    // 定时保存
    editData() {
      clearTimeout(this.lastActionTimer);
      var _this = this;
      this.lastActionTimer = setTimeout(function(){
        if (!common.isEmpty(_this.editData)) {
          if (_this.$store.state.firstSave) {
            _this.save(_this.$store.state.title, SAVE_MODE.EDIT);
          } else {
            _this.modals.save = true;
          }
        }
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
  z-index: 999;
}

.modal-center {
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

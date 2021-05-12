<template>
  <div id="app">

    <PDFViewer
      v-bind="{url}"
      @document-errored="onDocumentErrored"
      >
      <PDFUploader
        v-if="enableUploader"
        :documentError="documentError"
        @updated="urlUpdated"
        slot="header"
        class="header-item"
        />
    </PDFViewer>
  </div>
</template>

<script>
import PDFUploader from './components/PDFUploader.vue'
import PDFViewer from './components/PDFViewer.vue'
import common from '@/utils/common.js'

export default {
  name: 'app',

  components: {
    PDFUploader,
    PDFViewer,
  },

  created() {
    var params = this.$route.query;
    var _this = this;
    if (params.fid && params.userid) {
      this.$api.pdf.get({
        fid: params.fid,
        userid: params.userid,
        dtype: params.dtype ? params.dtype : 0
      }).then(res=>{
        if (res.data.data) {
          _this.url = res.data.data.pdfUrl;
          console.log(res.data.data);
          if (res.data.data.title) {
            localStorage.fm_title = res.data.data.title;
          }
        }
      });
    } else if(params.code){
      localStorage.fm_code = params.code
      this.$api.pdf.get({
        code: params.code
      }).then(res=>{
        if (res.data.data) {
          _this.url = res.data.data.pdfUrl;
          console.log(res.data.data);
          if (res.data.data.title) {
            localStorage.fm_title = res.data.data.title;
          }
        }
      });
    } else {
      alert("请求参数错误，没有找到对应文件");
    }
    localStorage.removeItem('fm_fid');
  },

  data() {
    return {
      // url: "process.env.VUE_APP_PDF_URL",
      url: common.fileUrl(),
      documentError: undefined,
      enableUploader: process.env.VUE_APP_UPLOAD_ENABLED === 'true',
    };
  },

  methods: {
    urlUpdated(url) {
      this.documentError = undefined;
      this.url = url;
    },
    onDocumentErrored(e) {
      this.documentError = e.text;
    },
  },

}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: rgb(239, 239, 242);
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #62637a;
}
label.form {
  color: white;
  font-family: Monaco, 'Courier New', Courier, monospace;
  font-weight: bold;
  margin-bottom: 2em;
  display: block;
}
input {
  padding: 0.45em;
  font-size: 1em;
}
.error {
  border: 1px solid red;
  background: pink;
  color: red;
  padding: 0.5em 3em;
  display: inline;
}

a.icon {
  cursor: pointer;
  display: block;
  /*background: white;*/
  color: #333;
  font-weight: bold;
  width: 1em;
  height: 1em;
  font-size: 1.5em;
  margin: 0 10px;
}

a.icon img {
  width: 24px;
  height: 24px;
}

.box-shadow {
  box-shadow: 0px 2px 8px 0px rgba(116, 116, 116, 0.4);
}
.overflow-hidden {
  overflow: hidden;
}

@media print {
  body {
    background-color: transparent;
  }
  #app {
    margin: 0;
    padding: 0;
  }
}

.el-tooltip:focus {
  outline: 0 !important;
}
</style>

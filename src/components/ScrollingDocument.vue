<template>
  <div
    class="scrolling-document"
    v-scroll.immediate="updateScrollBounds"
    style="background-color: #efeff2;"
    @scroll="handleScroll"
    >
    <ScrollingPage
      v-for="(page, index) in pages"
      :key="page.pageNumber"
      v-bind="{page, clientHeight, scrollTop, focusedPage, enablePageJump}"
      v-slot="{isPageFocused, isElementFocused, perPageData}"
      @page-jump="onPageJump"
      >
      <div
        class="scrolling-page"
        >
        <slot v-bind="{page, isPageFocused, isElementFocused, index}"
        ></slot>
      </div>
    </ScrollingPage>

    <div v-visible="fetchPages" class="observer"></div>
  </div>
</template>

<script>
import scroll from '../directives/scroll';
import visible from '../directives/visible';

import ScrollingPage from './ScrollingPage';

export default {
  components: {
    ScrollingPage,
  },

  directives: {
    visible,
    scroll,
  },

  props: {
    pages: {
      required: true,
    },
    enablePageJump: {
      type: Boolean,
      default: false,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    isParentVisible: {
      default: true,
    },
    perPageData: {
      default: false,
    }
  },

  data() {
    return {
      focusedPage: undefined,
      scrollTop: 0,
      clientHeight: 0,
    };
  },

  computed: {
    pagesLength() {
      return this.pages.length;
    },
  },

  methods: {
    fetchPages(currentPage) {
      this.$emit('pages-fetch', currentPage);
    },

    onPageJump(scrollTop) {
      this.$emit('page-jump', scrollTop);
    },

    updateScrollBounds() {
      const {scrollTop, clientHeight} = this.$el;
      this.scrollTop = scrollTop;
      this.clientHeight = clientHeight;
    },
    handleScroll() {
      this.$emit("scroll");
    },
  },

  watch: {
    isParentVisible: 'updateScrollBounds',

    pagesLength(count, oldCount) {
      if (oldCount === 0) this.$emit('pages-reset');

      // Set focusedPage after new pages are mounted
      this.$nextTick(() => {
        this.focusedPage = this.currentPage;
      });
    },

    currentPage(currentPage) {
      if (currentPage > this.pages.length) {
        this.fetchPages(currentPage);
      } else {
        this.focusedPage = currentPage;
      }
    },
  },
}
</script>
<style scoped>
.scrolling-page:first-child {
  padding-top: 1em;
}
</style>

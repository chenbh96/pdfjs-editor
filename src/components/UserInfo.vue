<template>
  <a class="user-info" @click.stop.prevent="clickAvatar">
    <CaretIcon style="margin-right: 15px;"/>
    <img id="undo" class="avatar" src="https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eolRXosbFgtTPsE65nKTCPzYsZ1amVkb1TsSIj9kaicoOgJzSTeCHjaX5t6AMnN31Zibmib6kY8M8PFw/132"/>
    <div class="shadow" v-if="showMenu" @click.stop.prevent="clickShadow"></div>
    <div class="user-menu" v-if="showMenu">
      <div class="menu-option"><img src="@/assets/icons/my.png" />Your profile</div>
      <div class="divider"/>
      <div class="menu-option" @click.stop.prevent="save"><img src="@/assets/icons/save.png" />Save</div>
      <div class="menu-option" @click.stop.prevent="share"><img src="@/assets/icons/share.png" />Share</div>
      <div class="divider"/>
      <div class="menu-option"><QuitIcon style="margin-right: 10px;"/>Quit</div>
    </div>
  </a>
</template>

<script>
import CaretIcon from "../assets/caret.svg";
import ProfileIcon from "../assets/menu-profile.svg";
import SettingIcon from "../assets/menu-setting.svg";
import HelpIcon from "../assets/menu-help.svg";
import UploadIcon from "../assets/menu-upload.svg";
import ShareIcon from "../assets/menu-share.svg";
import QuitIcon from "../assets/menu-quit.svg";

export default {
  name: 'PDFEdit',

  components: {
    CaretIcon,
    ProfileIcon,
    SettingIcon,
    HelpIcon,
    UploadIcon,
    ShareIcon,
    QuitIcon,
  },

  props: {
  },

  data() {
    return {
      showMenu: false,
    }
  },

  methods: {
    clickAvatar() {
      this.showMenu = true;
    },

    clickShadow() {
      this.showMenu = false;
    },

    save() {
      this.$emit("save");
      this.showMenu = false;
    },

    share() {
      this.$emit("share");
      this.showMenu = false;
    },
  },
}
</script>

<style scoped>
.user-info {
  padding: 0 1em;
  height: 100%;
  cursor: pointer;
}

.user-info:hover, .user-info:focus {
  background-color: rgba(255,255,255, 0.1);
}

.avatar {
  display: block;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  background-color: rgba(255,255,255,0.1);
}

.shadow {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  cursor: default;
}

.user-menu {
  z-index: 1999;
  position: absolute;
  top: 100%;
  right: 0;
  width: 140px;
  background-color: white;
  box-shadow: 0 6px 12px rgb(0 0 0 / 18%);
  padding: 5px 0;
}

.user-menu > .menu-option {
  text-align: left;
  align-items: center;
  padding: 5px 15px;
  display: flex;
  font-weight: normal;
  line-height: 1.4;
  color: #333;
  white-space: nowrap;
  font-size: 14px;
}

.user-menu > .menu-option:hover {
  background-color: #f2f2f2 !important;
}

.user-menu > .divider {
  height: 1px;
  margin: 6px 0;
  overflow: hidden;
  background-color: #e2e2e2;
}

.menu-option img {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}
</style>

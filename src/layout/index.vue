<template>
  <!-- 通栏布局 -->
  <template v-if="layout == 'header'">
    <header class="adminui-header headerh">
      <div class="adminui-header-left ajtre spaceh">
        <div class="logo-bar">
          <img class="logo" src="img/logo.png" />
          <span>{{ $CONFIG.APP_NAME }}</span>
        </div>
        <ul v-if="!ismobile" class="nav">
          <li v-for="item in menu" :key="item" :class="pmenu.path == item.path ? 'active' : ''" @click="showMenu(item)">
            <!-- <el-icon>
              <component :is="item.meta.icon || 'el-icon-menu'" />
            </el-icon> -->
            <span>{{ item.meta.title }}</span>
          </li>
        </ul>
      </div>
      <div class="adminui-header-right ajtre spaceh">
        <userbar></userbar>
      </div>
    </header>
    <section class="aminui-wrapper">
      <div v-if="(!ismobile && nextMenu.length > 0) || !pmenu.component"
        :class="menuIsCollapse ? 'aminui-side isCollapse' : 'aminui-side'">
        <div v-if="!menuIsCollapse" class="adminui-side-top">
          <h2>{{ pmenu.meta.title }}</h2>
        </div>
        <div class="adminui-side-scroll">
          <el-scrollbar>
            <el-menu :default-active="active" router :collapse="menuIsCollapse"
              :unique-opened="$CONFIG.MENU_UNIQUE_OPENED">
              <NavMenu :navMenus="nextMenu"></NavMenu>
            </el-menu>
          </el-scrollbar>
        </div>
        <!-- <div class="adminui-side-bottom" @click="$store.commit('TOGGLE_menuIsCollapse')">
          <el-icon>
            <el-icon-expand v-if="menuIsCollapse" />
            <el-icon-fold v-else />
          </el-icon>
        </div> -->
      </div>
      <Side-m v-if="ismobile"></Side-m>
      <div class="aminui-body el-container">
        <Topbar v-if="!ismobile"></Topbar>
        <Tags v-if="!ismobile && layoutTags"></Tags>
        <div class="adminui-main" id="adminui-main">
          <router-view v-slot="{ Component }">
            <keep-alive :include="this.$store.state.keepAlive.keepLiveRoute">
              <component :is="Component" :key="$route.fullPath" v-if="$store.state.keepAlive.routeShow" />
            </keep-alive>
          </router-view>
          <iframe-view></iframe-view>
        </div>
      </div>
    </section>
    <!-- <div class="adminui-side-bottom topbott" @click="ab">
      <el-icon>
        <el-icon-expand v-if="menuIsCollapse" />
        <el-icon-fold v-else />
      </el-icon>
    </div> -->
  </template>

  <!-- 经典布局 -->
  <template v-else-if="layout == 'menu'">
    <header class="adminui-header headerh">
      <div class="adminui-header-left ajtre spaceh">
        <div class="logo-bar">
          <img class="logo" src="img/logo.png" />
          <span>{{ $CONFIG.APP_NAME }}</span>
        </div>
      </div>
      <div class="adminui-header-right ajtre spaceh">
        <userbar></userbar>
      </div>
    </header>

    <section class="aminui-wrapper">
      <div v-if="!ismobile" :class="menuIsCollapse ? 'aminui-side isCollapse' : 'aminui-side'">
        <div class="adminui-side-scroll">
          <el-scrollbar>
            <el-menu background-color="#21304C" :default-active="active" router :collapse="menuIsCollapse"
              :unique-opened="$CONFIG.MENU_UNIQUE_OPENED">
              <NavMenu :navMenus="menu"></NavMenu>
            </el-menu>
          </el-scrollbar>
        </div>
      </div>
      <!-- <div class="adminui-side-bottom" @click="$store.commit('TOGGLE_menuIsCollapse')">
        <el-icon class="el-icon--left">
          <el-icon-expand v-if="menuIsCollapse" />
          <el-icon-fold v-else />

        </el-icon>
      </div> -->
      <Side-m v-if="ismobile"></Side-m>
      <div style="width: 2px;"></div>
      <div class="aminui-body el-container">
        <div class="topbott" @click="ab">
          <el-icon class="" color="#409EFC">

            <img src="../icons/svg/fullscreen.svg" class="iconim" />

          </el-icon>
        </div>
        <Topbar v-if="!ismobile"></Topbar>
        <Tags v-if="!ismobile && layoutTags"></Tags>
        <div class="adminui-main" id="adminui-main">
          <router-view v-slot="{ Component }">
            <keep-alive :include="this.$store.state.keepAlive.keepLiveRoute">
              <component :is="Component" :key="$route.fullPath" v-if="$store.state.keepAlive.routeShow" />
            </keep-alive>
          </router-view>
          <iframe-view></iframe-view>
        </div>
      </div>
    </section>
    <!-- <div class="adminui-side-bottom topbott" @click="ab">
      <el-icon>
        <el-icon-expand v-if="menuIsCollapse" />
        <el-icon-fold v-else />
      </el-icon>
    </div> -->
  </template>

  <!-- 功能坞布局 -->
  <template v-else-if="layout == 'dock'">
    <header class="adminui-header headerh">
      <div class="adminui-header-left ajtre spaceh">
        <div class="logo-bar">
          <img class="logo" src="img/logo.png" />
          <span>{{ $CONFIG.APP_NAME }}</span>
        </div>
      </div>
      <div class="adminui-header-right ajtre spaceh">
        <div v-if="!ismobile" class="adminui-header-menu">
          <el-menu mode="horizontal" :default-active="active" router background-color="#222b45" text-color="#fff"
            active-text-color="var(--el-color-primary)">
            <NavMenu :navMenus="menu"></NavMenu>
          </el-menu>
        </div>
        <Side-m v-if="ismobile"></Side-m>
        <userbar></userbar>
      </div>
    </header>
    <div class="adminui-side-bottom topbott" @click="ab">
      <el-icon>
        <el-icon-expand v-if="menuIsCollapse" />
        <el-icon-fold v-else />
      </el-icon>
    </div>
    <section class="aminui-wrapper">
      <div class="aminui-body el-container">
        <Tags v-if="!ismobile && layoutTags"></Tags>
        <div class="adminui-main" id="adminui-main">
          <router-view v-slot="{ Component }">
            <keep-alive :include="this.$store.state.keepAlive.keepLiveRoute">
              <component :is="Component" :key="$route.fullPath" v-if="$store.state.keepAlive.routeShow" />
            </keep-alive>
          </router-view>
          <iframe-view></iframe-view>
        </div>
      </div>
    </section>
    <div class="adminui-side-bottom topbott" @click="ab">
      <el-icon>
        <el-icon-expand v-if="menuIsCollapse" />
        <el-icon-fold v-else />
      </el-icon>
    </div>
  </template>

  <!-- 默认布局 -->
  <template v-else>
    <section class="aminui-wrapper">
      <div v-if="!ismobile" class="aminui-side-split">
        <div class="aminui-side-split-top">
          <router-link :to="$CONFIG.DASHBOARD_URL">4444
            <img class="logo" :title="$CONFIG.APP_NAME" src="img/logo-r.png" />
          </router-link>
        </div>
        <div class="adminui-side-split-scroll">
          <el-scrollbar>
            <ul>
              <li v-for="item in menu" :key="item" :class="pmenu.path == item.path ? 'active' : ''"
                @click="showMenu(item)">
                <el-icon>
                  <component :is="item.meta.icon || el - icon - menu" />
                </el-icon>
                <p>{{ item.meta.title }}</p>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
      <div v-if="(!ismobile && nextMenu.length > 0) || !pmenu.component"
        :class="menuIsCollapse ? 'aminui-side isCollapse' : 'aminui-side'">
        <div v-if="!menuIsCollapse" class="adminui-side-top">
          <h2>{{ pmenu.meta.title }}</h2>
        </div>
        <div class="adminui-side-scroll">
          <el-scrollbar>
            <el-menu :default-active="active" router :collapse="menuIsCollapse"
              :unique-opened="$CONFIG.MENU_UNIQUE_OPENED">
              <NavMenu :navMenus="nextMenu"></NavMenu>
            </el-menu>
          </el-scrollbar>
        </div>
        <div class="adminui-side-bottom" @click="$store.commit('TOGGLE_menuIsCollapse')">
          <el-icon>
            <el-icon-expand v-if="menuIsCollapse" />
            <el-icon-fold v-else />
          </el-icon>
        </div>
      </div>
      <Side-m v-if="ismobile"></Side-m>
      <div class="aminui-body el-container">
        <Topbar>
          <userbar></userbar>
        </Topbar>
        <Tags v-if="!ismobile && layoutTags"></Tags>
        <div class="adminui-main" id="adminui-main">
          <router-view v-slot="{ Component }">
            <keep-alive :include="this.$store.state.keepAlive.keepLiveRoute">
              <component :is="Component" :key="$route.fullPath" v-if="$store.state.keepAlive.routeShow" />
            </keep-alive>
          </router-view>
          <iframe-view></iframe-view>
        </div>
      </div>
    </section>
    <div class="adminui-side-bottom topbott" @click="ab">
      <el-icon>
        <el-icon-expand v-if="menuIsCollapse" />
        <el-icon-fold v-else />
      </el-icon>
    </div>
  </template>

  <div class="main-maximize-exit" @click="exitMaximize">
    <el-icon>
      <el-icon-close />
    </el-icon>
  </div>

  <!--<div class="layout-setting" @click="openSetting">
    <el-icon>
      <el-icon-brush-filled />
    </el-icon>
  </div>-->

  <el-drawer title="布局实时演示" v-model="settingDialog" :size="400" append-to-body destroy-on-close>
    <setting></setting>
  </el-drawer>
</template>

<script>
import { CaretLeft, CaretRight, CaretTop, CaretBottom } from "@element-plus/icons-vue";
import SideM from "./components/sideM.vue";
import Topbar from "./components/topbar.vue";
import Tags from "./components/tags.vue";
import NavMenu from "./components/NavMenu.vue";
import userbar from "./components/userbar.vue";
import setting from "./components/setting.vue";
import iframeView from "./components/iframeView.vue";

export default {
  name: "index",
  components: {
    SideM,
    Topbar,
    Tags,
    NavMenu,
    userbar,
    setting,
    iframeView,
    CaretLeft,
    CaretRight,
    CaretTop,
    CaretBottom,
  },
  data() {
    return {
      settingDialog: false,
      menu: [],
      nextMenu: [],
      pmenu: {},
      active: "",
    };
  },
  computed: {
    ismobile() {
      return this.$store.state.global.ismobile;
    },
    layout() {
      return this.$store.state.global.layout;
    },
    layoutTags() {
      return false; //this.$store.state.global.layoutTags
    },
    menuIsCollapse() {
      return this.$store.state.global.menuIsCollapse;
    },
  },
  created() {
    this.onLayoutResize();
    window.addEventListener("resize", this.onLayoutResize);
    var menu = this.$router.sc_getMenu();
    this.menu = this.filterUrl(menu);
    this.showThis();

  },
  watch: {
    $route() {
      this.showThis();
    },
    layout: {
      handler(val) {
        document.body.setAttribute("data-layout", val);
      },
      immediate: true,
    },
  },
  methods: {

    ab() {
      const header = document.getElementsByClassName('adminui-header')[0];
      const iconim = document.getElementsByClassName('iconim')[0];

      if (header.offsetHeight == 0) {
        header.style.height = "56px";
        iconim.style.height = "20px";
        iconim.style.width = "20px";
      } else {
        header.style.height = "0";
        iconim.style.height = "15px";
        iconim.style.width = "15px";
      }
    },

    openSetting() {
      this.settingDialog = true;
    },
    onLayoutResize() {
      this.$store.commit("SET_ismobile", document.body.clientWidth < 992);
    },
    //路由监听高亮
    showThis() {
      this.pmenu = this.$route.meta.breadcrumb
        ? this.$route.meta.breadcrumb[0]
        : {};
      this.nextMenu = this.filterUrl(this.pmenu.children);
      this.$nextTick(() => {
        this.active = this.$route.meta.active || this.$route.fullPath;
      });
    },
    //点击显示
    showMenu(route) {
      this.pmenu = route;
      this.nextMenu = this.filterUrl(route.children);
      if ((!route.children || route.children.length == 0) && route.component) {
        this.$router.push({ path: route.path });
      }
    },
    //转换外部链接的路由
    filterUrl(map) {
      var newMap = [];
      map &&
        map.forEach((item) => {
          item.meta = item.meta ? item.meta : {};
          //处理隐藏
          if (item.meta.hidden || item.meta.type == "button") {
            return false;
          }
          //处理http
          if (item.meta.type == "iframe") {
            item.path = `/i/${item.name}`;
          }
          //递归循环
          if (item.children && item.children.length > 0) {
            item.children = this.filterUrl(item.children);
          }
          newMap.push(item);
        });
      return newMap;
    },
    //退出最大化
    exitMaximize() {
      document.getElementById("app").classList.remove("main-maximize");
    },
  },
};
</script>
<style>
.topbott {

  margin-left: auto;
  width: 0px;
  height: 3px;
  margin-right: 20px;
}

.el-menu-item.is-active {
  border-right: 1px solid #409eff;
}

.el-space {
  overflow: hidden;
  display: inline-flex;
  vertical-align: top;
}

.adminui-header {
  overflow: hidden;
  height: 56px;
  background: #1972C6;
  color: #fff;
  display: flex;
  justify-content: space-between;
}

.iconim {
  width: 20px;
  height: 20px;
  margin-top: 38px;

}
</style>
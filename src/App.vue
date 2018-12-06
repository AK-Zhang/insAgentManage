<template>
  <div id="app">
    <el-container>
      <!-- header 顶部 -->
      <el-header style="height:50px;padding:0px;">
        <Header></Header>
      </el-header>
      <el-container>
        <!-- aside 侧边栏 -->
        <el-aside width="200px" style="background-color:#112955;overflow: hidden;">
          <Aside class="aside_menu"></Aside>
        </el-aside>
        <el-container>
          <!-- main 主体显示部分 -->
          <el-main style="overflow:hidden;min-width:1000px;">
            <Breadcrumb :v-if="isB"></Breadcrumb>
            <div class="contaner_box">
              <router-view class="home-container" ref="routerViewer" v-on:loaded="routerViewLoaded" />
            </div>
          </el-main>
          <!-- footer 底部 -->
          <el-footer v-if="false" style="height:40px;background:#fff;text-align:center;font-size:16px;color:#000;line-height:40px;">&copy;版权所有&nbsp;高信达信息科技有限公司</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Header from "./components/header.vue";
import Aside from "./components/aside.vue";
import Breadcrumb from "./components/breadcrumb.vue";
export default {
  name: "App",
  data() {
    return {
      isShow: true,
      keyword: "",
      tempKeyword: "",
      isB: true,
    };
  },
  components: {
    Header, //顶部header组件
    Aside, //左边侧边栏菜单
    Breadcrumb //面包屑导航
  },
  methods: {
    //当路由嵌入视图加载完成后触发
    routerViewLoaded(route) {
      if (this.$refs.routerViewer.loaded) {
        if (route.params && JSON.stringify(route.params) != "{}") {
          //alert("5");
          route.params.loadingByGlobalQuery = false;
          this.$refs.routerViewer.loaded(route.params);
        }
      }
    }
  },
  watch: {
    // "$route": 'checkLogin',
    $route: function(newroute, oldroute) {
      let name = newroute.name.toLowerCase();
      if (name == "login") {
        this.isShow = false;
      } else if (name == "register") {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
  }
};
</script>

<style>
</style>

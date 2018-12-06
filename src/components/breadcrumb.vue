<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="po" v-show="isShow1">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-show="$store.state.breadnav1 ? true : false">{{$store.state.breadnav1}}</el-breadcrumb-item>
    <el-breadcrumb-item v-show="$store.state.breadnav2">{{$store.state.breadnav2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>


<script>
export default {
  // 面包屑导航
  name: "breadcrumb",
  data() {
    return {
      isShow1: true
    };
  },
  created(){
    if(window.location.hash.slice(1, 20) == "/home"){
      this.isShow1 = false;
    } else {
      this.isShow1 = true;
    }
  },
  watch: {
    $route: function(newroute, oldroute) {
      let name = newroute.name.toLowerCase();
      if (name == "home") {
        this.isShow1 = false;
      } else {
        this.isShow1 = true;
      }
    }
  },
  methods: {}
};
</script>

<style scoped>
.el-breadcrumb {
  padding: 20px;
}
.el-breadcrumb__inner {
  color: #606266;
}
.po {
  position: relative;
  box-shadow: 0 0 8px 3px rgba(97, 163, 255, 0.15);
}
</style>

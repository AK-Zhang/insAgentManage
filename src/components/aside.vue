<template>
  <div class="">
    <el-row class="tac">
      <el-menu :default-active="$store.state.loaction" router class="el-menu-vertical-demo" background-color="#112955" text-color="#fff" unique-opened active-text-color="#fff" @select="handleSelect" style="height:100%;overflow: hidden;border-right:0px;">
        <el-menu-item index="/home">
          <i class="el-icon-menu  iconfont icon-home1"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="模板设置">
          <template slot="title">
            <i class="el-icon-location  iconfont icon-fuzhi"></i>
            <span>模板设置</span>
          </template>
          <el-menu-item index="/templates/subcommissiontemplates">客户手续费模板</el-menu-item>
          <el-menu-item index="/templates/agentfeetemplates">代理手续费模板</el-menu-item>
        </el-submenu>
        <el-menu-item index="/subaccounts">
          <i class="el-icon-location iconfont icon-Account"></i>
          <span slot="title">我的客户</span>
        </el-menu-item>
        <el-menu-item index="/agents">
          <template slot="title">
            <i class="el-icon-location iconfont icon-user-agent"></i>
            <span>下级代理</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/agentAccounts" v-show="($store.state.userInfo.AccountCode == '' || $store.state.userInfo.AccountCode != $store.state.userInfo.UserCode) ? false : true" id="agentAccount">
          <template slot="title">
            <i class="el-icon-location iconfont icon-user"></i>
            <span>代理子管理账户</span>
          </template>
        </el-menu-item>
        <el-submenu index="数据查询">
          <template slot="title">
            <i class="el-icon-location iconfont icon-fangdajing"></i>
            <span>数据查询</span>
          </template>
          <el-menu-item index="/selects/accountreports">我的账户查询</el-menu-item>
          <el-menu-item index="/selects/clientreports">客户查询</el-menu-item>
          <el-menu-item index="/selects/todayreports">当日查询</el-menu-item>
          <el-menu-item index="/selects/noticeAgents">代理通知</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-row>
    <div class="asdielinetop"></div>
    <div class="asdielinebottom"></div>
  </div>
</template>

<script>
import "../assets/lib/jquery.min.js";
export default {
  //
  name: "asides",
  data() {
    return {
      type: "",
      aa: "",
      userInfo: {}
    };
  },
  created() {
    this.type = JSON.parse(sessionStorage.getItem("type"));
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (
      this.$route.path.indexOf("login") != -1 ||
      this.$route.path.indexOf("forgetPswd") != -1 ||
      this.$route.path.indexOf("iphonregister") != -1
    ) {
     
      this.$store.state.userInfo.AccountCode = "";
    } else {
        this.$store.state.userInfo.AccountCode = this.userInfo.AccountCode;
        this.$store.state.userInfo.UserCode = this.userInfo.UserCode;
    }
  },
  methods: {
    handleSelect(key, keyPath, text) {
      this.$store.state.breadnav2 = text.$el.innerText;
      if (keyPath[0].length > 5) {
        this.$store.state.breadnav1 = 0;
      } else if (keyPath[0] == "/home") {
        this.$store.state.breadnav1 = 0;
        this.$store.state.breadnav2 = 0;
      } else {
        this.$store.state.breadnav1 = keyPath[0];
      }
    }
  }
};
</script>

<style scoped>
.fa {
  padding-left: 5px;
  margin-right: 10px;
}
.tac {
  background-color: #112955;
  height: 100%;
}
</style>

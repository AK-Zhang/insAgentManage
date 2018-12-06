<template>
  <el-container>
    <el-header height="0px"></el-header>
    <el-main>
      <div id="loginz" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.6)">
        <div class="login_container flex">
          <div class="login_container_left">
            <div class="login_container_left_title">
              <h3 class="title_color">登录</h3>
            </div>
            <div class="login_form">
              <label for="">用户名：</label><br>
              <input type="text" class="input_box" v-model="name"><br>
              <label for="">密码：</label><br>
              <input type="password" class="input_box" v-model="pwd" @keyup.enter="enterlogin()"><br>
              <span class="circle1 flex">
                <el-checkbox v-model="checked">记住用户名</el-checkbox>

                <el-checkbox v-model="accountChecked">子管理账户登录</el-checkbox>
              </span>
              <a href="javascript:;" @click="login()" class="btn btn__submit" style="color:#fff !important;">登录
                <span class="circle">
                  <i class="fa fa-long-arrow-right"></i>
                </span>
              </a>
              <hr>
              <p class="modify_pwd">
                <!-- <a href="javascript:;" class="m">忘记密码 ？</a> -->
                <a href="javascript:;" class="m" @click="forgetPassword()">忘记密码 ？</a>
              </p>
            </div>
          </div>
          <div class="login_container_right">
            <div class="m_title">
              <h3 class="m_title_name" v-if="this.ml">智星</h3>
              <h3 class="m_title_name" v-if="this.xx">环球期货</h3>
              <p class="m_title_p" v-if="this.ml">Smart Star</p>
              <p class="m_title_p" v-if="this.xx">Global futures</p>
            </div>
            <div class="m_brief">
              <h4 class="m_b_title">投资有风险，入市需谨慎</h4>
              <p>There is a risk in investment and caution in entering the market</p>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      Agentcode: "",
      ml: "",
      xx: false,
      loading: "",
      checked: false,
      isShow: true,
      name: "",
      pwd: "",
      inscode: "",
      accountChecked: false
    };
  },
  created: function() {
    if (this.$Agentcode == "ml") {
      this.ml = true;
      this.xx = false;
    } else {
      this.xx = true;
      this.ml = false;
    }
    this.getusername();
    this.clearCache();
  },
  methods: {
    getusername() {
      var cat = localStorage.getItem("username");
      if (typeof cat == undefined) {
        return;
      } else {
        this.name = cat;
        this.checked = true;
      }
    },
    rememberusername() {
      if (this.checked == false) {
        localStorage.setItem("username", "");
        return;
      } else {
        var username = this.name;
        localStorage.setItem("username", username);
        var cat = localStorage.getItem("username");
      }
    },
    clearCache() {
      var uname = sessionStorage.getItem("uname");
      var token = "token" + uname;
      sessionStorage.removeItem("uname");
      sessionStorage.removeItem("inscode");
      sessionStorage.removeItem("pwd");
      sessionStorage.removeItem(token);
      sessionStorage.removeItem("pubkey");
      this.$store.state.inscode = "";
      this.$store.state.uname = "";
      this.$store.state.pwd = "";
      this.$store.state.islogin = false;
      this.$store.state.userInfo = {};
    },
    enterlogin() {
      if (this.pwd == "") {
        return;
      } else {
        this.login();
      }
    },
    login() {
      let timeStap = Math.round(new Date().getTime() * 0.001);
      this.inscode = window.location.hash.slice(8, 100);
      if (this.inscode == "") {
        this.$alert("请请在地址栏输入正确链接地址，按回车键进入系统！");
        return;
      }
      localStorage.setItem("url", window.location.href);
      if (this.name == null || this.name == "") {
        this.$alert("请输入正确的账号", {
          confirmButtonText: "确定",
          center: "true",
          callback: action => {
            this.name = "";
          }
        });
        return;
      }
      if (this.pwd == null || this.pwd == "") {
        this.$alert("请输入正确的密码", {
          confirmButtonText: "确定",
          center: "true",
          callback: action => {
            this.pwd = "";
          }
        });
        return;
      }
      sessionStorage.setItem("uname", this.name);
      this.$store.state.inscode = this.inscode;
      this.$store.state.uname = this.name;
      this.$store.state.pwd = this.pwd + "&" + timeStap;
      this.$store.state.type = this.accountChecked == true ? "1" : "0";
      sessionStorage.setItem("type", this.$store.state.type);
      this.loading = true;
      this.$loginapi.login(
        this.inscode,
        this.name,
        this.pwd + "&" + timeStap,
        e => {
          this.loading = false;
          this.$store.state.pwd = "";
          if (e.Ret == 0) {
            // let dd = "token" + this.name;
            // console.log(sessionStorage.getItem(dd));

            this.$router.push({ path: "/home" });

            // window.location.href = "/#/home";
            // window.event.returnValue = false;
            // if (window.event.preventDefault) window.event.preventDefault();
            // // console.log(window.location);
          }
          if (e.Ret == -1) {
            this.$alert(e.Msg, {
              confirmButtonText: "确定",
              center: "true",
              callback: action => {
                this.pwd = "";
              }
            });
            return;
          }
        }
      );
      this.rememberusername();
    },
    forgetPassword(){
        sessionStorage.setItem("pswdpageiscode", window.location.hash.slice(1, 20));
        sessionStorage.setItem("whoAccout", this.accountChecked);
        this.$router.push("/forgetPswd");

    }
  }
};
</script>

<style scoped>
</style>

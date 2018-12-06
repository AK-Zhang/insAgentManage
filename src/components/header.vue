<template>
  <header class="header">
    <nav class="navbar navbar-default no_margin">
      <div class="container-fluid">
        <div class="navbar-header">
          <span class="navbar-brand" v-if="this.ml">&nbsp;代理后台管理系统&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span class="navbar-brand" v-if="this.xx">
            <i class="iconfont icon-shijian"></i>
            {{date|datefmt("HH:mm")}}
          </span>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <!-- <ul class="nav navbar-nav">
            <li>
              <a href="#"></a>
            </li>
          </ul> -->
          <ul class="nav navbar-nav navbar-right">
            <li>
              <a href="javascript:;" style="color:#fff !important;">欢迎您，{{$store.state.userInfo.AccountName}}
              </a>

            </li>
            <li>
              <a href="javascript:;" style="padding:10px 25px 5px 0px;">
                <div class="profile_info"><img src="../assets/images/profile.jpg" alt="暂无图片" class="profile_info_tx"></div>
              </a>
            </li>
            <li class="dropdown">
              <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                <span class="fa fa-user"></span>个人中心
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu dropdown-menus">
                <li @click="setpswd()">
                  <a href="javascript:;" class="setpsw">
                    <span class="fa fa-pencil-square-o"></span>&nbsp;修改密码</a>
                </li>
              </ul>
            </li>
            <li @click="exit()">
              <a href="javascript:;" style="color:#fff !important;">
                <span class="fa fa-power-off"></span> 退出 </a>
            </li>
            <li>
              <a href="javascript:;"></a>
            </li>
          </ul>
        </div>

        <el-dialog title="修改密码" :visible.sync="dialogFormVisible" :append-to-body="true" width="30%" @close="resetForm('ruleForm2')" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
          <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="旧密码" prop="OldPwd">
              <el-input type="password" v-model.trim="ruleForm2.OldPwd  " auto-complete="off" size="small"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="NewPwd">
              <el-input type="password" v-model.trim="ruleForm2.NewPwd" auto-complete="off" placeholder="包含大小写字母及数字，长度不得小于8位！" size="small"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass" style="margin-bottom:0px;">
              <el-input type="password" v-model.trim="ruleForm2.checkPass" auto-complete="off" placeholder="请再次输入密码" size="small"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('ruleForm2')" size="small">提交</el-button>
            <el-button @click="resetForm('ruleForm2')" size="small">重置</el-button>
          </div>
        </el-dialog>
      </div>
    </nav>
  </header>

</template>

<script>
import "../assets/lib/jquery.min.js";
export default {
  name: "headers",
  data() {
    var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value == this.ruleForm2.OldPwd) {
        callback(new Error("新密码不能与旧密码相同！"));
      } else if (value.length < 8) {
        callback(new Error("新密码长度不能低于8位！"));
      } else if (!reg.test(value)) {
        callback(
          new Error("新密码必须包含大写字母,小写字母,数字,不能包含特殊符号！")
        );
      } else if (reg.test(value)) {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.NewPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      dialogFormVisible: false,
      date: "",
      Agentcode: "",
      ml: "",
      xx: false,
      type: "",
      userInfo: {},
      ruleForm2: {
        NewPwd: "",
        OldPwd: "",
        checkPass: ""
      },
      rules2: {
        NewPwd: [{ validator: validatePass, trigger: "blur", required: true }],
        checkPass: [
          { validator: validatePass2, trigger: "blur", required: true }
        ],
        OldPwd: [
          { trigger: "blur", required: true, message: "旧密码不能为空!" }
        ]
      }
    };
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (this.$Agentcode == "ml") {
      this.ml = true;
      this.xx = false;
    } else {
      this.xx = true;
      this.ml = false;
    }
    if(this.$route.path.indexOf("login") != -1 || this.$route.path.indexOf("forgetPswd") != -1 || this.$route.path.indexOf("iphonregister") != -1){
      this.$store.state.userInfo.AccountName = "暂无信息";
    }else{
       if(this.$store.state.userInfo.AccountName == undefined ||  this.$store.state.userInfo.AccountName == null || this.$store.state.userInfo.AccountName == "暂无信息"){
      this.$store.state.userInfo.AccountName = this.userInfo.AccountName;
      }
    }

  },
  mounted() {
    var _this = this; //声明一个变量指向vue实例this,保证作用域一致
    this.timer = setInterval(function() {
      _this.date = new Date(); //修改数据date
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); //在vue实例销毁钱，清除我们的定时器
    }
  },
  methods: {
    exit() {
      var uname = sessionStorage.getItem("uname");
      var token = "token" + uname;
      var inscode = sessionStorage.getItem("inscode");
      sessionStorage.removeItem("uname");
      sessionStorage.removeItem("inscode");
      sessionStorage.removeItem("pwd");
      sessionStorage.removeItem(token);
      sessionStorage.removeItem("userInfo");
      sessionStorage.removeItem("type");
      this.$store.state.inscode = "";
      this.$store.state.uname = "";
      this.$store.state.pwd = "";
      this.$store.state.islogin = false;
      this.$store.state.userInfo = {};
      this.$router.push("/login/" + inscode);
    },

    //修改密码
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.type == "0") {
            let url = "/common/ModifyAgentSelfPwd";
            let data = {
              NewPwd: this.ruleForm2.NewPwd,
              OldPwd: this.ruleForm2.OldPwd
            };
            this.loading = true;
            this.$loginapi.post(url, data, response => {
              this.loading = false;
              if (response.Ret == 0) {
                this.$alert("密码修改成功，请重新登录！", "", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.dialogFormVisible = false;
                    this.exit();
                  }
                });
              } else {
                this.$alert(response.Msg);
              }
            });
          } else {
            let url = "/AgentAccount/ModifyAgentAccountPassword";
            let data = {
              NewPassword: this.ruleForm2.NewPwd,
              OldPassword: this.ruleForm2.OldPwd
            };
            this.loading = true;
            this.$loginapi.post(url, data, response => {
              this.loading = false;
              if (response.Ret == 0) {
                this.$alert("密码修改成功，请重新登录！", "", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.dialogFormVisible = false;
                    this.exit();
                  }
                });
              } else {
                this.$alert(response.Msg);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    setpswd(){
      this.dialogFormVisible = true;  
      this.type = sessionStorage.getItem("type");
    }
  }
};
</script>

<style scoped>
</style>

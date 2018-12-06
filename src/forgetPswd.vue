<template>
  <div class="registerb">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" >
      <div class="Rtitle">
        <span class="titlel">代理管理后台</span><span class="titler"> | 忘记密码</span>
      </div>
      <div class="Rmin">
      <el-form-item prop="name">
        <div class="error3">
         <span class="colorr">*</span> <span>代理代码:</span>
        </div>
        <el-input v-model.trim="ruleForm.name" placeholder="请输入代理人代码" id="name"></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <div class="error3">
         <span class="colorr">*</span> 手机号:
        </div>
        <el-input v-model.trim="ruleForm.phone" placeholder="请输入手机号" id="phone"></el-input>
        <span class="error4 hint">请填写账户绑定的手机号码.</span>
      </el-form-item>
      <el-form-item prop="phoneCode">
        <div class="error3">
         <span class="colorr">*</span> 手机验证码:
        </div>
        <el-input v-model.trim="ruleForm.phoneCode" placeholder="请输入的验证码"  id="code"></el-input>
        <el-button type="primary" size="small" @click="sendCode('ruleForm')" :disabled="isDisabled">{{buttonName}}</el-button>
      </el-form-item>
        <div class="bbbtn">
          <el-button type="primary" @click="submitForm('ruleForm')" class="submit" :disabled="this.isDisableds">确认</el-button>
          <el-button @click="resetForm('ruleForm')" class="submit">重置</el-button>
        </div>
      </div>
    </el-form>
  </div>

</template>

<script>
import "./assets/lib/jquery.min.js";

export default {
  name: "forgetPswd",
  data() {
    var reg = /^1[35789]\d{9}$/;
    var validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
        this.codephone = true;
      }
    };
    return {
      whoAccout:"",
      isDisableds: false,
      codephone: false,
      checked: false,
      buttonName: "发送短信验证码",
      isDisabled: false,
      time: 60,
      ruleForm: {
        name: "",
        phone: "",
        phoneCode: "",
        InsCode: "",
      },
      rules: {
        name: [
          {
            required: true,
            min: 2,
            max: 10,
            message: "真实姓名至少包含两个汉字（注意是否含有空格）",
            trigger: "blur"
          }
        ],
        phone: [
          { required: true, trigger: "blur", validator: validPhone } //这里需要用到全局变量
        ],
        phoneCode: [
          {
            required: true,
            message: "请输入正确的验证码",
            trigger: "blur"
          }
        ],
      },
      path: ""
    };
  },
  created(){
    document.getElementsByTagName("title")[0].innerText = '忘记密码';
    var pswdpageiscode = sessionStorage.getItem("pswdpageiscode" );
    this.whoAccout = sessionStorage.getItem("whoAccout" );
    if(pswdpageiscode == null){
       pswdpageiscode = window.location.hash.slice(1, 20);
      this.ruleForm.InsCode = pswdpageiscode.split("/")[2];
    }else{
      this.ruleForm.InsCode = pswdpageiscode.split("/")[2];
    }

  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 确认按钮
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid  === true) {
          if(this.whoAccout == "false"){
            this.isDisableds = true;
            let url = "Login/AgentForgetPassword";
            let postData =
              "AgentCode=" +
              this.ruleForm.name +
              "&Phone=" +
              this.ruleForm.phone +
              "&Code=" +
              this.ruleForm.phoneCode +
              "&InsCode=" +
              this.ruleForm.InsCode ;
              console.log(this.$indexApi)
              this.$indexapi.post(url, postData, response => {
              this.isDisableds = false;
              if (response.Ret == 0) {
                vue.$message.success("密码重置成功！自动跳转登录页面！");
                      $("#name").val("");
                      $("#phone").val("");
                      $("#code").val("");
                      setTimeout(() => {
                        this.$router.push("/");
                      }, 1000);
              } else {
                this.$message.error(response.Msg);
                this.resetForm('ruleForm');
              }
            });
          }else{
            this.isDisableds = true;
            let url = "Login/AgentAccountForgetPassword";
            let postData =
              "AgentAccountCode=" +
              this.ruleForm.name +
              "&Phone=" +
              this.ruleForm.phone +
              "&Code=" +
              this.ruleForm.phoneCode +
              "&InsCode=" +
              this.ruleForm.InsCode ;
              this.$indexapi.post(url, postData, response => {
              this.isDisableds = false;
              if (response.Ret == 0) {
                vue.$message.success("密码重置成功！自动跳转登录页面！");
                      $("#name").val("");
                      $("#phone").val("");
                      $("#code").val("");
                      setTimeout(() => {
                        this.$router.push("/");
                      }, 1000);
              } else {
                this.$message.error(response.Msg);
                this.resetForm('ruleForm');
              }
            });
          }
        } else {
          vue.$message.error("信息输入有误！");
          return false;
        }
      });
    },
    //获取验证码
    sendCode(formName) {
      this.isDisabled = true;
      this.$refs[formName].validateField("phone",valid => {
          if (valid  === "") {
            let url = "login/SendVerifyCodeToPhone";
            let Phone = "phone=" + this.ruleForm.phone;
            this.$indexapi.post(url, Phone, response => {
              if (response.Ret == 0) {
                this.$message.success("验证码已发送，请注意查收!");
                this.sendMsg();
                this.codephone = false;
              } else {
                this.$message.error(response.Msg);
              }
            });
          } else {
            vue.$message.error("信息输入有误！");
              this.isDisabled = false;
            return false;
          }
      })
    },
        // 短信验证倒计时
    sendMsg() {
      let me = this;
      me.isDisabled = true;
      let interval = window.setInterval(function() {
        me.buttonName = "（" + me.time + "s）发送";
        --me.time;
        if (me.time < 0) {
          me.buttonName = "发送短信验证码";
          me.time = 60;
          me.isDisabled = false;
          window.clearInterval(interval);
        }
      }, 1000);
    },
  }
};
</script>


<style scoped>
.el-input {
  width: 50% !important;
}
</style>

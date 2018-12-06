<template>
  <div class="registerb"  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <h1>账户注册</h1>
      <el-form-item prop="name" style="margin:-10px 20px 10px -80px">
        <div class="error3">
          真实姓名:
          <span class="error4 red">*用户名关联出金，需与真实姓名一致.</span>
        </div>
        <el-input v-model.trim="ruleForm.name" placeholder="请输入姓名" id="name"></el-input>
      </el-form-item>
      <el-form-item prop="phone" style="margin:0 20px 10px -80px">
        <div class="error3">
          手机号:
          <span class="error4 red">*必填 </span>
        </div>
        <el-input v-model.trim="ruleForm.phone" placeholder="请输入手机号" id="phone"></el-input>
      </el-form-item>
      <el-form-item prop="phoneCode" style="margin:0 20px 0 -80px">
        <div class="error3">
          手机验证码:
          <span class="error4 red">*必填 </span>
        </div>
        <el-input v-model.trim="ruleForm.phoneCode" placeholder="请输入的验证码" style="width:60%;" id="code"></el-input>
        <el-button type="primary" size="small" @click="sendCode()" :disabled="isDisabled">{{buttonName}}</el-button>
      </el-form-item>
      <el-form-item  prop="pass" style="margin:10px 20px 0 -80px">
        <div class="error3">
          交易密码:
          <span class="error4 red">*必填 </span>
        </div>
        <el-input v-model.trim="ruleForm.pass"  placeholder="包含大小写字母及数字，长度不得小于8位！" type="password" id="pswd" ></el-input>
      </el-form-item>
      <el-form-item prop="checkPass" style="margin:0 20px 0 -80px">
        <div class="error3" style="margin-top:10px">
          确认交易密码:
          <span class="error4 red">*必填 </span>
        </div>
        <el-input v-model.trim="ruleForm.checkPass" placeholder="请再次输入交易密码" type="password" id="pswds"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" style="margin:15px 20px 0 20px;font-size:12px">我已阅读并同意</el-checkbox>
         <span class="cbule"  @click="dialogVisible = true">《交易系统使用风险揭示书》</span>
        <div class="bbtn">
          <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </div>
    </el-form>
    <!-- 进入验证弹窗 -->
      <el-dialog title="开户问卷调查" center :visible.sync="dialogFormVisible1"  width="90%" top="3vh" :show-close="false" custom-class="aaa" :modal-append-to-body="false" :close-on-click-modal="false">
        <P>尊敬的客户：</P>
        <P>您好！为了保障您的权益，请您在开户前认真阅读并填写以下问卷。感谢您配合。祝您交易愉快！</P>
       <template>
         <p>1,   您是否自主开户？</p>
        <el-radio v-model="radio1" label="1">是</el-radio>
        <el-radio v-model="radio1" label="2">否</el-radio>
      </template>
      <template>
         <p>2,   您是否清楚交易风险？</p>
        <el-radio v-model="radio2" label="1">是</el-radio>
        <el-radio v-model="radio2" label="2">否</el-radio>
      </template>
      <template>
         <p>3,   您是否知晓风控细则？</p>
        <el-radio v-model="radio3" label="1">是</el-radio>
        <el-radio v-model="radio3" label="2">否</el-radio>
      </template>
      <template>
         <p>4,   您是否知晓账户交易手续费？</p>
        <el-radio v-model="radio4" label="1">是</el-radio>
        <el-radio v-model="radio4" label="2">否</el-radio>
      </template>
      <template>
         <p>5,   您的开户公司或代理人是否向您承诺了收益？</p>
        <el-radio v-model="radio5" label="1">是</el-radio>
        <el-radio v-model="radio5" label="2">否</el-radio>
      </template>
      <template>
         <p>6,   您是否自主交易？</p>
        <el-radio v-model="radio6" label="1">是</el-radio>
        <el-radio v-model="radio6" label="2">否</el-radio>
      </template>
      <template>
         <p>7,   您是否自主保管交易账户密码？</p>
        <el-radio v-model="radio7" label="1">是</el-radio>
        <el-radio v-model="radio7" label="2">否</el-radio>
      </template>
       <div class="line1"></div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible()" size="small">提交</el-button>
      </div>
    </el-dialog>
    <!-- 验证不正确弹框 -->
    <el-dialog
      :visible.sync="dialogVisible2"
      width="80%"
      :modal-append-to-body="false"
      >
      <span>您的开户存在风险，为了保障您的权益，请了解风险后在注册。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 风险提示书 -->
    <el-dialog
      title="【风险揭示书】"
      :visible.sync="dialogVisible"
      width="80%"
      center=""
      :modal="true"
      :modal-append-to-body="false">
      <span>您使用软件之前，必须仔细阅读下面的内容，以便全面地了解使用软件的风险。</span>
      <p> 软件系统通过交易所的行情发布商，专线接入交易所获取行情数据，交易网关后台对接证券/期货的交易结算系统的开放接口。软件系统已经尽可能采取有效措施保护交易活动的安全，尽管如此，本着对用户负责的态度，在此提醒用户，使用本软件存在且不限于下列风险：</p>
      <p> (一) 在不限于以下故障情况出现时，可能会使您的委托指令无法发出，或产生错误指令：</p>
      <p>（1）系统与交易所、证券/期货公司的远程数据通讯线路发生故障，而交易所还在正常进行交易。</p>
      <p>（2）系统的计算机设备出现故障，而交易所还在正常进行交易。</p>
      <p>（3）用户交易终端与后台系统的通讯线路发生故障，而证券/期货公司和交易所还在正常交易。</p>
      <p>（4）突然停电而导致计算机系统中断。</p>
      <p>（5）用户设置好程序化以后，退出软件或关机。</p>
      <p>（6）用户在交易过程中因自身原因进行的误操作。</p>
      <p>（7）其他不可预测的系统风险或者技术风险。</p>
      <p>(二) 委托交易的数据传输可能因通讯繁忙或丢包等原因出现中断、停顿、延迟、数据错误、丢失或不完全，造成交易出现延迟、停顿、中断，从而会发生您不能及时、完整完成交易的风险。因此，您在使用该软件时，及时查证核实成交情况。</p>
      <p>(三) 由于出现网络故障或网络繁忙或交易网关负载过重，或因受到网络黑客、网络病毒的攻击和入侵等原因，软件可能会出现故障，您可能不能及时进入或通过该系统进行正常交易，或接到错误信息，或不能使用软件提供的全部或部分功能（包括但不限于各种自助和预设触发条件的下单功能等）。鉴于上述风险的存在，您在使用本软件的时候，应当使用其它信息系统或其它交易手段进行验证，并及时查证成交情况。</p>
      <p>(四) 软件发布的行情信息及其它证券/期货信息，因为网络延时等原因有可能出现错误或被误导，从而导致您做出错误判断，因此，您在使用该软件时，应对比其他软件，或采用其它手段，并及时查对行情数据。</p>
      <p>(五) 条件单和止损单，设定委托发出的条件，当条件满足时，交易系统将委托单自动报入交易所，当条件不满足时，委托单保留在云端服务器中。</p>
      <p>(六) 程序化模型所发出买卖讯号之建议，乃依据特定数学公式计算所得结果，仅供交易参考，据此入市，盈亏自负。</p>
      <p>(七) 软件的条件单、止损单等，对操作者有一定的交易经验与基础要求，请慎重考虑使用。</p>
      <p>(八) 由于交易所交易规则所限，软件中包括但不限于各种自助和预设触发条件的下单功能所发生的交易委托不一定能够成交。</p>
      <p>(九) 由于用户对开户资料、交易账户、交易密码等重要资料保护不当，造成被他人盗用，仿冒而产生的亏损由用户自己负责。</p>
      <p>由于您开立的证券/期货交易账户交由他人使用，出现未按您本人意图买卖证券/期货合约和提取资金的情况，所产生的后果由您本人承担。本揭示书未能尽述一切有关软件电子交易风险的重要事项，用户应该在细心研究、熟悉软件后，方可使用。证券/期货公司和软件提供方，都不会因为您使用或无法使用该软件而造成的损失承担责任。</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

        <el-dialog
        title="尊敬的用户"
        :visible.sync="hintshow"
        width="80%"
         :modal-append-to-body="false"
        >
        <span>恭喜，注册成功！</span>
         <p style="margin-top:20px"><a href="http://zx.mlinsoft.com/down/%E6%99%BA%E6%98%9F%E6%9C%9F%E8%B4%A70809.apk">点击下载安卓版APP</a></p>
          <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="successbtn()">确 定</el-button>
        </span>
      </el-dialog>
  </div>

</template>

<script>
import "./assets/lib/jquery.min.js";
import "./assets/lib/jquery.qrcode.min.js";

export default {
  name: "register",
  data() {
    var pswdreg =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      }else if (value.length < 8) {
        callback(new Error("新密码长度不能低于8位！"));
      }else if (!pswdreg.test(value)) {
        callback(new Error("新密码必须包含大写字母,小写字母,数字,不能包含特殊符号！"));
      }else if (pswdreg.test(value)) {
         if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
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
      radio1: "",
      radio2: "",
      radio3: "",
      radio4: "",
      radio5: "",
      radio6: "",
      radio7: "",
      insCode: "",
      agentId: "",
      codephone: false,
      dialogVisible: false,
      dialogFormVisible1: true,
      dialogVisible2: false,
      checked: false,
      hintshow: false,
      buttonName: "发送短信验证码",
      isDisabled: false,
      time: 60,
      ruleForm: {
        name: "",
        phone: "",
        phoneCode: "",
        pass: "",
        checkPass: "",
        delivery: false
      },
      rules: {
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
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
        ]
      },
      path: ""
    };
  },
  created() {
    document.getElementsByTagName("title")[0].innerText = "账户注册";
    this.getAgentPromoteQrcode();
  },
  methods: {
    //获取当前代理人推广链接
    getAgentPromoteQrcode() {
      this.agentId = window.location.hash.split("=")[2];
      let imgurlsplit = window.location.hash.split("=")[1];
      let str = imgurlsplit.split("&");
      this.insCode = str[0];
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 注册按钮
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.checked === false){
            this.$message.error("请确认阅读风险揭示书。");
            return;
          }
          let url = "openinsuser/AgentOpeningInsUser";
          let postData =
            "insCode=" +
            this.insCode +
            "&agentId=" +
            this.agentId +
            "&name=" +
            this.ruleForm.name +
            "&Phone=" +
            this.ruleForm.phone +
            "&Code=" +
            this.ruleForm.phoneCode +
            "&pwd=" +
            this.ruleForm.pass;
          this.$indexapi.post(url, postData, response => {
            if (response.Ret == 0) {
              $("#name").val("");
              $("#phone").val("");
              $("#code").val("");
              $("#pswd").val("");
              $("#pswds").val("");
            //  this.hintshow = true;
            this.resetForm('ruleForm');
            this.$message.success("恭喜，注册成功，自动跳转登录页面！");
            setTimeout(() => {
                      location.href = "http://paya.kaizzz.top/#/Login/ZZ";
                    }, 1000);
            } else {
              this.$message.error(response.Msg);
              this.resetForm('ruleForm');
            }
          });
        } else {
          vue.$message.error("信息输入有误！");
          return false;
        }
      });
    },

    dialogFormVisible() {
      if (
        this.radio1 == "1" &&
        this.radio2 == "1" &&
        this.radio3 == "1" &&
        this.radio4 == "1" &&
        this.radio5 == "2" &&
        this.radio6 == "1" &&
        this.radio7 == "1"
      ) {
        this.dialogFormVisible1 = false;
      } else {
        this.dialogVisible2 = true;
      }
    },
    //获取验证码
    sendCode() {
      if (this.codephone == true) {
        let url = "openinsuser/SendVerifyCodeToPhone";
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
        vue.$message.error("手机号输入有误！");
      }
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
    successbtn(){
      this.hintshow = false;
      this.resetForm('ruleForm');
    }
  }
};
</script>


<style scoped>
</style>

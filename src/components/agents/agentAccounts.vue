<template>
  <div class="po">
    <el-button-group style="position: absolute;top:10px;right:20px;z-index:21110;">
      <el-button size="small" type="primary" @click="addClick()">新增</el-button>
      <el-button size="small" type="primary" @click="batchDel()">删除
      </el-button>
    </el-button-group>
    <template>
      <el-table :data="accountList" style="width: 100%;" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" v-loading="loading" max-height="750">
        <el-table-column label="序号" type="index"  width="60">
        </el-table-column>
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column label="用户代码" width="200" prop="AccountCode">
        </el-table-column>
        <el-table-column label="用户名" width="200" prop="AccountName">
        </el-table-column>
        <el-table-column prop="Remark" label="备注" style="width:80%" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <el-button class="el-icon-caret-bottom el-icon--right opera_btn" type="primary" size="mini"></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="clearfix" @click.native="editClick(scope.row)">
                  编辑
                  <el-badge class="mark">
                  </el-badge>
                </el-dropdown-item>
                <el-dropdown-item class="clearfix" @click.native="delClick(scope.row)">
                  删除
                  <el-badge class="mark">
                  </el-badge>
                </el-dropdown-item>
                <el-dropdown-item class="clearfix" @click.native="resetClick(scope.row)">
                  重置密码
                  <el-badge class="mark">
                  </el-badge>
                </el-dropdown-item>
                <el-dropdown-item class="clearfix" @click.native="showPrivate(scope.row)">
                  设置隐私权限
                  <el-badge class="mark">
                  </el-badge>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗 -->
      <el-dialog title="新增代理子管理账户" :close-on-click-modal=false :visible.sync="dialogFormVisible" class="alert_title" @close="resetForm('accountInfo')" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-form :model="accountInfo" :rules="rules" ref="accountInfo" label-width="100px" class="demo-accountInfo addacount" size="small" :label-position="labelPosition">
          <el-form-item label="用户代码" prop="AccountCode">
            <el-input v-model.trim="AccountCode_after" id="aafter" ></el-input>
            <span style=" position: absolute; font-size: 14px;top:0px;left:10px;" id="plhd">{{accountInfo.AccountCode}}</span>
          </el-form-item>
          <el-form-item label="用户名" prop="AccountName">
            <el-input v-model.trim="accountInfo.AccountName" ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="Password">
            <el-input type="password" v-model.trim="accountInfo.Password"  placeholder="包含大小写字母及数字，长度不得小于8位！"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="makeSurePassword">
            <el-input type="password" v-model.trim="accountInfo.makeSurePassword"   placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="Phone">
            <el-input v-model.trim="accountInfo.Phone" ></el-input>
          </el-form-item>          
          <el-form-item label="备注">
            <el-input type="textarea" v-model="accountInfo.Remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('accountInfo')" size="small">取消</el-button>
          <el-button type="primary" @click="Save('accountInfo')" size="small">保存</el-button>
        </div>
      </el-dialog>

      <el-dialog title="编辑代理子管理账户" :close-on-click-modal=false :visible.sync="editDialogFormVisible" class="alert_title" @close="resetForm('accountInfo')" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-form :model="accountInfo" :rules="rules" ref="accountInfo" label-width="100px" class="demo-accountInfo addacount" size="small" :label-position="labelPosition">
          <el-form-item label="用户代码" prop="AccountCode">
            <el-input v-model.trim="accountInfo.AccountCode" disabled ></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="AccountName">
            <el-input v-model.trim="accountInfo.AccountName" ></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="Phone">
            <el-input v-model.trim="accountInfo.Phone" ></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="accountInfo.Remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('accountInfo')" size="small">取消</el-button>
          <el-button type="primary" @click="Save('accountInfo')" size="small">保存</el-button>
        </div>
      </el-dialog>

      <!-- 设置敏感信息权限 -->
      <el-dialog title="设置敏感信息权限" :close-on-click-modal=false :visible.sync="dialogPrivateSetVisible" class="alert_title" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <div>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAllAuth" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedAuth" @change="handleCheckedAuthChange">
            <el-checkbox v-for="item in AuthList" :label="item" :key="item.Code">{{item.Name}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div>
          <p class="bodykan10">&nbsp;&nbsp;&nbsp;&nbsp;注：选中则该账户具有查看，编辑选中信息权限。</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('')" size="small">取消</el-button>
          <el-button type="primary" @click="SaveAuthInfo()" size="small">保存</el-button>
        </div>
      </el-dialog>
      <div class="pagination_m text-center">
        <pagination :pagerPro="Pager" @ee="pageFn"></pagination>
      </div>
    </template>
  </div>
</template>

<script>
import pagination from "../paging.vue";

export default {
  // 代理子管理账户管理
  name: "agentfeetemplates",
  data() {
    var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      }else if (value.length < 8) {
        callback(new Error("新密码长度不能低于8位！"));
      } else if (!reg.test(value)) {
        callback(
          new Error("新密码必须包含大写字母,小写字母,数字,不能包含特殊符号！")
        );
      } else if (reg.test(value)) {
        if (this.accountInfo.makeSurePassword !== "") {
          this.$refs.accountInfo.validateField("makeSurePassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.accountInfo.Password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var regPhone = /^1[345678]\d{9}$/;
    var validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!regPhone.test(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      loading: "",
      Pager: {
        PageNo: 1,
        PageSize: 10,
        RecordCount: 0
      },
      accountList: [],
      accountInfo: {
        AgentCode: "",
        AccountCode: "",
        AccountName: "",
        Phone:"",
        Password: "",
        makeSurePassword:"",
        Remark: ""
      },
      userInfo: {},
      labelPosition: "top",
      dialogFormVisible: false,
      editDialogFormVisible: false,
      dialogPrivateSetVisible: false,
      rules: {
        AccountName: [
          {
            required: true,
            message: "必须填写用户名称",
            trigger: "blur"
          }
        ],
        AccountCode: [
          {
            required: true,
            message: "必须填写用户代码",
            trigger: "blur"
          }
        ],
        Phone: [
          { required: true, trigger: "blur", validator: validPhone } //这里需要用到全局变量
        ],
        Password:[{required: true, validator: validatePass, trigger: "blur" }],
        makeSurePassword:[{required: true, validator: validatePass2, trigger: "blur" }],
      },
      checkdAccountList: [],
      AuthList: [
        { Code: 1, Name: "手机号" },
        { Code: 2, Name: "身份证号" },
        { Code: 4, Name: "地址" },
        { Code: 5, Name: "银行卡号" }
      ],
      checkAllAuth: false,
      checkedAuth: [],
      isIndeterminate: true,
      AuthInfo: null,
      AddModifyModel: {
        UserName: "",
        UserAuth: "",
        UserCode: "",
        UserType: 3
      },
      MarkCode: "",
      SelectUser: null,
      ViewPrivacyData: {},
      withdrawData: {
        VerifyCode: "",
        ClientKey: "",
        VerifyCodeKey: ""
      },
      a: "",
      rulesCard: {},
      buttonName: "发送短信验证码",
      time: 60,
      isDisabled: false,
      currAgentInfo: {},
      usercode: "",
      codeindex: 0,
      AccountCode_after: ""
    };
  },
  components: {
    pagination
  },
  created() {
    this.$store.state.loaction = "/agentAccounts";
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.accountInfo.AccountCode = this.userInfo.AccountCode;
    this.accountInfo.AgentCode = this.userInfo.UserCode;
    this.getlist();
    this.getAgentInfo();
  },
  methods: {
    viewprivacy(row, obj) {
      this.ViewPrivacy = true;
      this.usercode = row.AccountCode;
      this.codeindex = obj.$index;
    },
    getAgentInfo() {
      let url = "/subagent/GetAgentInfo";
      this.$loginapi.post(url, this.accountInfo.AgentCode, response => {
        if (response.Msg == "无效token" || response.Msg == "缺少token") {
          this.$router.push("/");
        }
        if (response.Ret == 0) {
          this.currAgentInfo = response.Data;
        } else {
          if (response.Msg == "无效的token" || response.Msg == "缺少token") {
            this.$router.push("/");
            return;
          }
          this.$message.error(response.Msg);
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.editDialogFormVisible = false;
      this.dialogPrivateSetVisible = false;
      this.makeSurePassword = "";
      if (formName != "") {
        this.$refs[formName].resetFields();
      }
    },
    getlist() {
      this.loading = true;
      let url = "/agentaccount/QueryAgentAccountList";
      this.accountInfo.AgentCode = this.userInfo.UserCode;
      this.$loginapi.postWithPage(
        url,
        this.Pager.PageNo,
        this.Pager.PageSize,
        this.accountInfo.AgentCode,
        response => {
          if (response.Ret == 0) {
            this.loading = false;
            this.accountList = response.Data;
            if (this.Pager.PageNo == 1) {
              this.Pager = response.Pager;
            }
          } else {
            this.$message.error(response.Msg);
          }
        }
      );
    },

    handleCheckAllChange(val) {
      this.checkedAuth = val ? this.AuthList : [];
      this.isIndeterminate = false;
    },
    handleCheckedAuthChange(value) {
      let checkedCount = value.length;
      this.checkAllAuth = checkedCount === this.AuthList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.AuthList.length;
    },

    //获取用户认证权限
    GetUserPrivacyAuthInfo(code) {
      var url = "/userprivacyauth/QueryUserPrivacyAuth";
      var postData = {
        UserCode: code,
        UserType: 3
      };
      this.$loginapi.post(url, postData, response => {
        if (response.Ret == 0) {
          this.AuthInfo = response.Data;
          if (this.AuthInfo != null) {
            var list = this.AuthInfo.UserAuth.split(",");
            for (var i = 0; i < list.length; i++) {
              var id = list[i];
              for (var j = 0; j < this.AuthList.length; j++) {
                if (this.AuthList[j].Code == id) {
                  this.checkedAuth.push(this.AuthList[j]);
                  break;
                }
              }
            }
            if (this.checkedAuth.length == this.AuthList.length) {
              this.checkAllAuth = true;
              this.isIndeterminate = false;
            }
          }
        } else {
          this.$alert(response.Msg, {});
        }
      });
    },

    addClick() {
      String.prototype.len = function() {
        return this.replace(/[^\x00-\xff]/g, "xx").length;
      };
      this.accountInfo.AgentCode = this.userInfo.UserCode;
      this.accountInfo.AccountCode = this.userInfo.AccountCode;
      this.accountInfo = {
        AgentCode: this.accountInfo.AgentCode,
        AccountCode: this.accountInfo.AccountCode + "-",
        AccountName: "",
        Password: "",
        Remark: "",
        Phone:this.accountInfo.Phone,
      };
      this.dialogFormVisible = true;
      setTimeout(() => {
        // let padding = this.accountInfo.AccountCode.len() * 12 + "px";
        let padding = $("#plhd").width() + 10 + "px";
        $("#aafter").attr("style", "padding-left:" + padding);
      }, 200);
    },
    editClick(rowObj) {
      this.accountInfo = jQuery.extend({}, rowObj);
      this.editDialogFormVisible = true;
    },
    // 重置密码
    resetClick(rowObj){
        this.$confirm('此操作将重置密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = "agentaccount/ResetAgentAccountPassword";
          let  postData = {
            AccountCode: rowObj.AccountCode,
          }
          this.loading = true;
          this.$loginapi.post(url, postData, response => {
            this.loading = false;
            if (response.Ret == 0) {
              this.$message.success("密码重置成功！");
            } else {
              this.$message.error(response.Msg);
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置密码'
          });          
        });
    },
    //保存
    Save(formName) {
      let url = "/agentaccount/AddAgentAccount";
      // let postData = this.accountInfo;
      let  postData = {
            AgentCode: this.accountInfo.AgentCode,
            AccountCode: this.accountInfo.AccountCode,
            AccountName: this.accountInfo.AccountName,
            Password: this.accountInfo.Password,
            makeSurePassword:this.accountInfo.makeSurePassword,
            Remark: this.accountInfo.Remark,
            Phone:this.accountInfo.Phone,
      }
      this.$refs[formName].validate(valid => {
      if (valid) {
      if (this.dialogFormVisible == true) {
        var addData = jQuery.extend({}, this.accountInfo);
        addData.AccountCode =  this.accountInfo.AccountCode + this.AccountCode_after;
        addData = {
            AgentCode: addData.AgentCode.replace(/\s+/g,''),
            AccountCode: addData.AccountCode.replace(/\s+/g,''),
            AccountName: addData.AccountName.replace(/\s+/g,''),
            Password: addData.Password.replace(/\s+/g,''),
            makeSurePassword:addData.makeSurePassword.replace(/\s+/g,''),
            Remark: addData.Remark.replace(/\s+/g,''),
            Phone:addData.Phone,
        }
      
      } else {
        url = "/agentaccount/ModifyAgentAccount";
        var addData = jQuery.extend({}, this.accountInfo);
        addData = {
             AgentCode: addData.AgentCode.replace(/\s+/g,''),
            AccountCode: addData.AccountCode.replace(/\s+/g,''),
            AccountName: addData.AccountName.replace(/\s+/g,''),
            Password: addData.Password.replace(/\s+/g,''),
            Remark: addData.Remark.replace(/\s+/g,''),
            Phone:addData.Phone,
         }
      }
      this.loading = true;
      this.$loginapi.post(url, addData, response => {
        if (response.Ret == 0) {
          this.makeSurePassword = "";
          this.AccountCode_after = "";
          this.loading = false;
          this.$message.success("保存成功！");
          this.getlist();
          this.dialogFormVisible = false;
          this.editDialogFormVisible = false;
        } else {
          this.loading = false;
          this.$message.error(response.Msg);
        }
      });
        } else {
          this.$message.warning("请按照提示完善信息！");
          return false;
        }
      });
    },

    //显示隐私权限
    showPrivate(rowObj) {
      this.checkedAuth.splice(0, this.checkedAuth.length);
      this.GetUserPrivacyAuthInfo(rowObj.AccountCode);
      this.dialogPrivateSetVisible = true;
      this.SelectUser = rowObj;
    },

    SaveAuthInfo() {
      var url = "";
      var postData = {};
      this.AddModifyModel.UserName = this.SelectUser.AccountName;
      this.AddModifyModel.UserCode = this.SelectUser.AccountCode;
      var authInfo = "";
      this.checkedAuth.forEach(auth => {
        if (authInfo == "") {
          authInfo = auth.Code;
        } else {
          authInfo += "," + auth.Code;
        }
      });
      this.AddModifyModel.UserAuth = authInfo;
      if (this.AuthInfo == null) {
        //如果是新增
        url = "/userprivacyauth/AddUserPrivacyAuth";
        postData = this.AddModifyModel;
      } else {
        if (this.checkedAuth.length == 0) {
          //如果选中为空 则为删除
          url = "/userprivacyauth/DeleteUserPrivacyAuth";
          postData = [this.AuthInfo.ID];
        } else {
          //修改
          url = "/userprivacyauth/ModifyUserPrivacyAuth";
          postData = this.AddModifyModel;
        }
      }
      this.loadingsave = true;
      this.$loginapi.post(url, postData, response => {
        this.loadingsave = false;
        if (response.Ret == 0) {
          this.dialogPrivateSetVisible = false;
          this.getlist();
          this.$message.success("保存成功");
        } else {
          this.$alert(response.Msg, {});
        }
      });
    },

    //单个删除
    delClick(rowObj) {
      this.checkdAccountList.splice(0, this.checkdAccountList.length);
      this.checkdAccountList.push(rowObj.AccountCode);
      this.batchDel();
    },
    //批量删除
    batchDel() {
      if (this.checkdAccountList.length == 0) {
        this.$message.warning("请选择要删除的子管理账户！");
        return;
      }

      this.$confirm("此操作将永久删除该子管理账户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          let url = "/agentaccount/DeleteAgentAccount";
          var postData = {
            AgentCode: this.accountInfo.AgentCode,
            AccountCodes: this.checkdAccountList
          };
          this.$loginapi.post(url, postData, response => {
            if (response.Ret == 0) {
              this.loading = false;
              this.getlist();
              this.checkdAccountList.splice(0, this.checkdAccountList.length);
            } else {
              this.loading = false;
              this.$message.error(response.Msg);
            }
          });
        })
        .catch(() => {
          this.checkdAccountList.splice(0, this.checkdAccountList.length);
        });
    },
    pageFn(size, pageNo) {
      this.Pager.PageSize = size;
      this.Pager.PageNo = pageNo;
      this.getlist();
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    //全选
    handleSelectionChange(val) {
      let arrCode = [];
      val.forEach(function(item) {
        arrCode.push(item.AccountCode);
      });
      this.checkdAccountList = arrCode;
    }
  }
};
</script>

<style scoped>
.el-form-item {
    margin-bottom: 22px;
    width: 45%;
    float: left;
    margin-left: 20px;
}
</style>

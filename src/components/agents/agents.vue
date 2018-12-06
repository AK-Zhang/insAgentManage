<template>
  <el-container>
    <el-header height="80" class="header_agent">
      <el-button-group style="position: absolute;top:108px;right:40px;z-index:21110;">
        <el-button size="small" type="primary" @click="addClick()">新增</el-button>
        <el-button size="small" type="primary" @click="editClick()">编辑</el-button>
        <el-button size="small" type="primary" @click="delClick()">删除
        </el-button>
      </el-button-group>
    </el-header>
    <el-container>
      <el-aside width="200px" class="treeAside">
        <el-tree  :data="agentTree" :default-active="1" node-key="AgentCode" :props="defaultProps" @current-change="handleNodeClick" :default-expanded-keys="expandedKeys" :highlight-current="true" ref="tree2"></el-tree>
      </el-aside>
      <el-main>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="下级代理人" name="first">
            <el-table :data="agentList" style="width: 100%">
              <el-table-column type="index" label="序号">
              </el-table-column>
              <el-table-column prop="AgentCode" label="代理人代码">
              </el-table-column>
              <el-table-column prop="AgentName" label="代理人名称">
              </el-table-column>
              <el-table-column prop="AgentFeeTemplateName" label="代理人手续费模板">
              </el-table-column>
              <el-table-column prop="CreateDate" label="创建日期">
              </el-table-column>
            </el-table>
            <div class="pagination_m text-center">
              <pagination :pagerPro="Pager" @ee="pageFn"></pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="子账户" name="second">
            <el-table :data="acountList" style="width: 100%">
              <el-table-column type="index" label="序号">
              </el-table-column>
              <el-table-column prop="UserName" label="姓名">
              </el-table-column>
              <el-table-column prop="UserCode" label="子账户代码">
              </el-table-column>
              <el-table-column prop="AgentName" label="代理人名称" width="250" >
              </el-table-column>
              <el-table-column prop="MarginTemplateName" label="保证金模板">
              </el-table-column>
              <el-table-column prop="CreateDate" label="创建日期">
              </el-table-column>
              <el-table-column label="来源">
                <template slot-scope="scope">
                  <span>{{scope.row.Source | GetSource}}</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination_m text-center">
              <pagination :pagerPro="Pager" @ee="accountPageFn"></pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
        <!-- 新增弹窗 -->
        <el-dialog title="新增代理人" :visible.sync="dialogFormVisible" class="alert_title" @close="resetForm('addAgentInfo')" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.6)">
          <div class="line"></div>
          <el-form :model="addAgentInfo" :rules="rules" ref="addAgentInfo" label-width="100px" class="demo-currAgentInfo" size="small" :label-position="labelPosition">
            <el-form-item label="代理人名称" prop="name" style="width: 45%" class="el-form-box">
              <el-input v-model.trim="addAgentInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="代理手续费模板" prop="AgentFeeTemplateID" class="el-form-boxr" style="width: 45%">
              <el-select v-model="addAgentInfo.AgentFeeTemplateID" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in agentfeeTemplatesList" :key="item.TpCode" :label="item.Name" :value="item.TpCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="登录密码" prop="pswd" style="width: 45%" class="el-form-box">
              <el-input id="loginPassword" v-model.trim="addAgentInfo.pswd" type="password" placeholder="包含大小写字母及数字，长度不得小于8位！"></el-input>
            </el-form-item>
            <el-form-item label="确认登录密码" prop="pswds" style="width: 45%" class="el-form-boxr">
              <el-input v-model.trim="addAgentInfo.pswds" type="password" placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item label="出金汇率" prop="OutRate" style="width: 45%" class="el-form-box">
              <el-input v-model.trim="addAgentInfo.OutRate" type="number" :disabled="true" style="color:#000;"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="Phone" style="width: 45%" class="el-form-boxr">
              <el-input v-model.trim="addAgentInfo.Phone"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="desc" class="el-form-box" style="width: 100%">
              <el-input type="textarea" v-model="addAgentInfo.Remark" style="width: 100%" resize="none"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm('addAgentInfo')" size="small">取消</el-button>
            <el-button type="primary" @click="Save('addAgentInfo')" size="small">保存</el-button>
          </div>
        </el-dialog>
        <!-- 编辑弹窗 -->
        <el-dialog title="编辑代理人" :visible.sync="editDialogFormVisible" class="alert_title" @close="resetForm('currAgentInfo')">
          <div class="line"></div>
          <el-form :model="currAgentInfo" :rules="rules" ref="currAgentInfo" label-width="100px" class="demo-currAgentInfo" size="small" :label-position="labelPosition">
            <el-form-item label="代理人名称" prop="cpname" style="width: 45%" class="el-form-box">
              <el-input v-model="currAgentInfo.AgentName"></el-input>
            </el-form-item>
            <el-form-item label="代理手续费模板" prop="templ"  class="el-form-boxr" style="width: 45%">
              <el-select v-model="currAgentInfo.AgentFeeTemplateID" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in agentfeeTemplatesList" :key="item.TpCode" :label="item.Name" :value="item.TpCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="desc" class="el-form-box" style="width: 100%">
              <el-input type="textarea" v-model="currAgentInfo.Remark" style="width: 100%" resize="none"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editDialogFormVisible = false" size="small">取消</el-button>
            <el-button type="primary" @click="EditSave()" size="small">保存</el-button>
          </div>
        </el-dialog>
      </el-main>
      <el-aside width="250px">
        <el-card class="box-card agentCurrent">
          <div slot="header" class="clearfix">
            <span></span>
          </div>
          <div class="text item">
            {{'当前代理人代码：'}}
          </div>
          <hr>
          <div class="text item textCSS">
            {{currAgentInfo.AgentCode == null ? '暂无下级代理信息':currAgentInfo.AgentCode}}
          </div>
          <hr>
          <div class="text item">
            {{'代理人名称：'}}
          </div>
          <hr>
          <div class="text item textCSS">
            {{currAgentInfo.AgentName == null ? '暂无数据':currAgentInfo.AgentName}}
          </div>
          <hr>
          <div class="text item">
            {{'代理手续费模版ID：'}}
          </div>
          <hr>
          <div class="text item textCSS">
            {{currAgentInfo.AgentFeeTemplateID == null ? '暂无模板':currAgentInfo.AgentFeeTemplateID }}
          </div>
          <hr>
          <div class="text item">
            {{'创建时间：'}}
          </div>
          <hr>
          <div class="text item textCSS">
            {{currAgentInfo.CreateDate == null ? '暂无数据':currAgentInfo.CreateDate}}
          </div>
        </el-card>

      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import pagination from "../paging.vue";
import EnumConfig from "../../assets/js/EnumConfig.js";
export default {
  // 下级代理
  name: "agents",
  data() {
    var pswdreg =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      }else if (value.length < 8) {
        callback(new Error("密码长度不能低于8位！"));
      }else if (!pswdreg.test(value)) {
        callback(new Error("密码必须包含大写字母,小写字母,数字,不能包含特殊符号！"));
      }else if (pswdreg.test(value)) {
        if (this.addAgentInfo.pswds !== "") {
          this.$refs.addAgentInfo.validateField("pswds");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addAgentInfo.pswd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var reg = /^[0-9a-zA-Z]+$/;
    var validCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入代理人代码"));
      } else if (!reg.test(value)) {
        callback(new Error("你输入的字符不是数字或者字母"));
      } else {
        callback();
      }
    };
    var regphone = /^1[345678]\d{9}$/;
    var validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!regphone.test(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
        this.codephone = true;
      }
    };
    var regOutRate = /^\d+(\.\d+)?$/;
    var validOutRate = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入汇率"));
      } else if (!regOutRate.test(value)) {
        callback(new Error("请输入正确汇率"));
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
      accountPager: {
        PageNo: 1,
        PageSize: 10,
        RecordCount: 0
      },
      agentTree: [],
      defaultProps: {
        children: "Childs",
        label: "AgentCode",
        label: "AgentName"
      },
      toSelectCode:"",
      expandedKeys: [], //全局筛选后默认打开的节点
      agentList: [],
      acountList: [],
      activeName: "first",
      agentInfo: [],
      currAgentInfo: {},
      addAgentInfo: {
        name: "",
        pswd: "",
        pswds: "",
        OutRate:0.1369,
        Phone:"",
        Remark: "",
      },
      labelPosition: "top",
      editDialogFormVisible: false,
      dialogFormVisible: false,
      agentfeeTemplatesList: [],
      rules: {
        name: [
          { required: true, message: "必须填写代理人名称", trigger: "blur" },
          { min: 2, max: 16, message: "代理人名称不合法", trigger: "blur" }
        ],
        AgentFeeTemplateID:[{required: true,message: "必须填写代理手续费模板",trigger: "change",}],
        pswd: [{ required: true, validator: validatePass, trigger: "blur" }],
        pswds: [{ required: true, validator: validatePass2, trigger: "blur" }],
        OutRate: [{ required: true, validator:validOutRate,  trigger: "blur" }],
        Phone: [
        { required: true, trigger: "blur", validator: validPhone } //这里需要用到全局变量
        ]
      },
    };
  },
  components: {
    pagination
  },
  created() {
    this.$store.state.loaction = "/agents";
    this.getAgentTree();
  },
  mounted(){

  },
  filters: {
    GetSource(type) {
      return EnumConfig.GetSource(type);
    }
  },
  methods: {
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
      // this.addAgentInfo.AgentFeeTemplateID = "";
      // this.addAgentInfo.Remark = "";
      this.addAgentInfo.OutRate = 0.1369;
    },
    //当前登录代理的代理树
    getAgentTree() {
      this.loading = true;
      this.agentInfo = [];
      let url = "/subagent/QueryAgentTree";
      this.$loginapi.post(url, "", response => {
        if (response.Ret == 0) {
          this.loading = false;
          this.agentTree = response.Data.Agents;
          if (response.Data.Agents.length > 0) {
            this.getAgentInfo(response.Data.Agents[0].AgentCode);
            setTimeout(this.selectTreeNode, 200);
          }
        } else {
          this.loading = false;
          this.$message.error(response.Msg);
        }
      });
    },
    //获取代理信息
    getAgentInfo(agentCode) {
      this.loading = true;
      let url = "/subagent/GetAgentInfo";
      this.$loginapi.post(url, agentCode, response => {
        if (response.Ret == 0) {
          this.loading = false;
          this.agentInfo.push(response.Data);
          this.currAgentInfo = this.agentInfo[0];
          this.getAgentList();
          this.getAccountList();
          this.selectAgentModel = response.Data;
          this.toSelectCode = response.Data.AgentCode;
        } else {
          this.loading = false;
          this.$message.error(response.Msg);
        }
      });
    },
    //获取代理人的下级代理
    getAgentList() {
      let url = "/subagent/QueryAgentsByAgent";
      this.$loginapi.postWithPage(
        url,
        this.Pager.PageNo,
        this.Pager.PageSize,
        this.currAgentInfo.AgentCode,
        response => {
          if (response.Ret == 0) {
            this.agentList = response.Data;
          } else {
            this.$message.error(response.Msg);
          }
        }
      );
    },
    getAccountList() {
      let url = "/subagent/QueryUsersByAgent";
      this.$loginapi.postWithPage(
        url,
        this.accountPager.PageNo,
        this.accountPager.PageSize,
        this.currAgentInfo.AgentCode,
        response => {
          if (response.Ret == 0) {
            this.acountList = response.Data;
          } else {
            this.$message.error(response.Msg);
          }
        }
      );
    },
    //获取模板下拉列表
    getfeeTemplateList() {
      let url = "/template/QueryAgentFeeTemplates";
      this.$loginapi.postWithPage(url, 1, 9999, "", response => {
        if (response.Ret == 0) {
          this.agentfeeTemplatesList = response.Data;
        } else {
          this.$message.error(response.Msg);
        }
      });
    },
    //打开新增页面
    addClick() {
      this.getfeeTemplateList();
      this.dialogFormVisible = true;
    },
    //新增
    Save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          let url = "/subagent/AddAgent";
          this.$loginapi.post(
            url,
            {
              InsCode: "",
              InsName: "",
              ParentID: "",
              AgentName: this.addAgentInfo.name.replace(/\s+/g,''),
              AgentFeeTemplateID: this.addAgentInfo.AgentFeeTemplateID,
              OutRate: this.addAgentInfo.OutRate,
              Phone:this.addAgentInfo.Phone,
              Password: this.addAgentInfo.pswd,
              Remark: this.addAgentInfo.Remark,
              Property: 0,
              RealNameAuthID: 0,
              PassValidation: false
            },
            response => {
              this.loading = false;
              if (response.Ret == 0) {
                this.getAgentTree();
                this.dialogFormVisible = false;
                this.resetForm(formName);
                this.addAgentInfo = {};
              } else {
                this.$message.error(response.Msg);
              }
            }
          );
        } else {
          this.$message.error("信息输入不正确");
          return false;
        }
      });
    },
    //打开编辑页面
    editClick() {
      this.getfeeTemplateList();
      this.editDialogFormVisible = true;
    },
    //编辑保存
    EditSave() {
      let url = "/subagent/UpdateAgent";
       this.currAgentInfo.AgentName =   this.currAgentInfo.AgentName.replace(/\s+/g,'');
      this.$loginapi.post(url, this.currAgentInfo, response => {
        if (response.Ret == 0) {
          // this.getAgentTree();
          this.getAgentInfo(this.currAgentInfo.AgentCode);
          this.editDialogFormVisible = false;
          this.$message.success("保存成功!");
          let AgentName = this.currAgentInfo.AgentName;
          for (var i = 0; i < this.agentTree.length; i++) {
          var item = this.agentTree[i];
          if (item.AgentCode == this.currAgentInfo.AgentCode) {
            item.AgentName = this.currAgentInfo.AgentName;
            break;
          }
          this.UpdateNodeName(item, this.currAgentInfo.AgentCode,this.currAgentInfo.AgentName);
        }
        } else {
          this.$message.error(response.Msg);
        }
      });
    },
    UpdateNodeName(item, code, name) {
      for (var i = 0; i < item.Childs.length; i++) {
        if (item.Childs[i].AgentCode == code) {
          item.Childs[i].AgentName = name;
          break;
        }
        this.UpdateNodeName(item.Childs[i], code, name);
      }
    },
    delClick() {
      this.$confirm("此操作将永久删除该代理, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "/subagent/DelAgent";
          this.$loginapi.post(url, this.currAgentInfo.AgentCode, response => {
            if (response.Ret == 0) {
              this.getAgentTree();
            } else {
              this.$message.error(response.Msg);
            }
          });
        })
        .catch(() => {});
    },
    pageFn(size, PageNo) {
      this.Pager.PageSize = size;
      this.Pager.PageNo = PageNo;
      this.getAgentList();
    },
    accountPageFn(size, PageNo) {
      this.accountPager.PageSize = size;
      this.accountPager.PageNo = PageNo;
      this.getAccountList();
    },
    handleNodeClick(data) {
      this.agentInfo = [];
      this.getAgentInfo(data.AgentCode);
      this.getAgentList();
      this.getAccountList();
    },
    handleClick(tab, event) {
      //console.log(event);
    },
    selectTreeNode() {
      this.expandedKeys.splice(0, this.expandedKeys.length);
      this.agentTree.forEach(item => {
        if (item.AgentCode == this.toSelectCode) {
          this.$refs.tree2.setCurrentNode(item);
          this.expandedKeys.push(item);
          this.toSelectCode = "";
          return false;
        }
        this.selectNode(item, this.toSelectCode);
      });
    },

    selectNode(item, code) {
      item.Childs.forEach(child => {
        if (child.AgentCode == code) {
          this.$refs.tree2.setCurrentNode(child);
          this.toSelectCode = "";
          if (item.Level == 0) {
            this.expandedKeys.push(child);
          } else {
            this.expandedKeys.push(item);
          }
          return false;
        }
        this.selectNode(child, code);
      });
    },
  }
};
</script>

<style scoped>

 .el-loading-spinner {
    text-align: center !important;
}
.treeAside{
  background-image: linear-gradient(#fff, #fff);
}
</style>

<template>
  <el-row>
    <el-col :span="24">
      <div class="grid-content bg-purple-dark flex aginfo-titile">
        <div class="info_left col-md-9">
          <router-link to="/templates/agentfeetemplates">代理手续费模板</router-link>
          <span> ({{contactFee.Name}})</span>
        </div>
        <div class="info_right col-md-3 text-right">
          <el-button-group>
            <el-button type="primary" size="small" @click="editFeeAgentTemplate()">编辑</el-button>
            <el-button type="primary" size="small" @click="Del()">删除</el-button>
          </el-button-group>
        </div>
      </div>
    </el-col>
    <el-col :span="24">
      <div class="grid-content noPadding flex">
        <div class="col-md-9">
          <el-tabs v-model="activeName" >
            <el-tab-pane label="品种手续费" name="first">
              <el-table :data="contactFee.FeeDetails" max-height="700">
                <el-table-column type="index" label="序号">
                </el-table-column>
                <el-table-column prop="CommodityNo" label="品种代码">
                </el-table-column>
                <el-table-column prop="CommodityName" label="品种名称">
                </el-table-column>
                <el-table-column label="我的成本">
                  <template slot-scope="scope">
                    <span>{{ scope.row.MinFee }}（{{scope.row.CurrencyName}}）</span>
                  </template>
                </el-table-column>
                <el-table-column label="代理手续费">
                  <template slot-scope="scope">
                    <span>{{ scope.row.Fee }}（{{scope.row.CurrencyName}}）</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="使用模板的代理人" name="second">
              <el-row>
                <el-col :span="24" v-show="isNull">
                  <div class="grid-content bg-purple-light conbocx">
                    <div class="conbcx">
                      <div class="li-cont">
                        <p tabindex="0" style="text-align:center;">
                          暂无数据
                        </p>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" v-for="item in contactFee.InsAgents" :key="item.AgentCode">
                  <div class="grid-content bg-purple-light conbocx">
                    <div class="conbcx">
                      <div class="li-cont">
                        <p tabindex="0">
                          <span class="icon_agent1"></span>
                          <span class="jig1">{{item.AgentName}}</span>
                        </p>
                      </div>
                      <p class="pxg">
                        <span class="pxg_title">代理人代码：</span>
                        <span class="pxg_cot">{{item.AgentCode}}</span>
                      </p>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="col-md-3">
          <el-tabs v-model="activeName1">
            <el-tab-pane :label="tips" name="first">
              <el-col :span="24">
                <el-card shadow="always" style="border:none;">
                  {{contactFee.Remark}}
                </el-card>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-col>
    <!-- 弹窗 -->
    <!-- 编辑代理手续费模板 -->
    <el-dialog title="编辑代理手续费模板" :close-on-click-modal="false" :visible.sync="editFeeAgentTem" class="alert_title" width="60%">
      <el-form :model="contactFeeCopy" :rules="rules" ref="contactFeeCopy" label-width="100px" class="demo-ruleForm" size="small" :label-position="labelPosition">
        <el-form-item label="代理手续费模板名称" prop="Name">
          <el-input v-model="contactFeeCopy.Name"></el-input>
        </el-form-item>
        <el-form-item label="模板说明">
          <el-input type="textarea" v-model="contactFeeCopy.Remark"></el-input>
        </el-form-item>
      </el-form>
      <el-table :data="contactFeeCopy.FeeDetails">
        <el-table-column property="CommodityNo" label="品种代码" width="80px">
        </el-table-column>
        <el-table-column property="CommodityName" label="品种名称" width="180px"></el-table-column>
        <el-table-column label="我的成本" width="100px">
          <template slot-scope="scope">
            <span>{{scope.row.MinFee}}{{scope.row.CurrencyName}}/手</span>
          </template>
        </el-table-column>
        <el-table-column label="下级代理手续费">
          <template slot-scope="scope">
            <el-input v-model="scope.row.Fee" size="mini"></el-input>
            <span class="by">{{scope.row.CurrencyName}}/手</span>
          </template>
        </el-table-column>
        <el-table-column label="设置范围" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.MinFee }}~{{scope.row.MaxFee}}({{scope.row.CurrencyName}})</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFeeAgentTem = false" size="small">取消</el-button>
        <el-button type="primary" @click="addFeeAgentTemplate(contactFeeCopy.Name, contactFeeCopy.Remark,contactFeeCopy.TpCode)" size="small">保存</el-button>
      </div>
    </el-dialog>
  </el-row>

</template>

<script>
export default {
  // 代理手续费模板详情
  name: "agentfeetemplates",
  data() {
    return {
      contactFee: {},
      contactFeeCopy: {},
      activeName: "first",
      activeName1: "first",
      gridData: [],
      labelPosition: "top",
      addFeeAgentTem: false,
      editFeeAgentTem: false,
      ruleForm: {
        name: "",
        desc: "",
        TpCode: ""
      },
      rules: {
        Name: [{ required: true, message: "必须填写代理手续费模板名称", trigger: "blur" }  ]},
      tips: "",
      isNull: true
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    getlist() {
      let TpCode = sessionStorage.getItem("TpCode");
      let url = "/template/GetAgentFeeTemplateDetail";
      this.$loginapi.post(url, TpCode, response => {
        if (response.Ret == 0) {
          this.contactFee = response.Data;
          this.tips = this.contactFee.Name + "的信息";
          if (this.contactFee.InsAgents.length > 0) {
            this.isNull = false;
          }
        } else {
          this.$message.error(response.Msg);
        }
      });
    },
    editFeeAgentTemplate() {
      this.contactFeeCopy = jQuery.extend({}, this.contactFee);
      this.editFeeAgentTem = true;
    },
    addFeeAgentTemplate(Name, Remark, TpCode) {
        let url = "/template/AddOrUpdateFeeTemplate";
        let postData = {
          TpCode: TpCode,
          Name: Name,
          Remark: Remark,
          Details: this.contactFee.FeeDetails
        };
        this.$loginapi.post(url, postData, response => {
          if (response.Ret == 0) {
            this.editFeeAgentTem = false;
            this.getlist();
            this.$message.success(response.Msg);
          } else {
            this.$message.error(response.Msg);
          }
        });
    },
    Del() {
      this.$confirm("此操作将永久删除该模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "/template/DelFeeTemplate";
          let postData = [this.contactFee.TpCode];
          this.$loginapi.post(url, postData, response => {
            if (response.Ret == 0) {
              this.$router.push("/templates/agentfeetemplates");
            } else {
              this.$message.error(response.Msg);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>

</style>

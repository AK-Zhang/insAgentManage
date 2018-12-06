<template>
  <el-row>
    <el-col :span="24">
      <div class="grid-content bg-purple-dark flex aginfo-titile">
        <div class="info_left col-md-9">
          <router-link to="/templates/agentfeetemplates">客户手续费模板</router-link>
          <span>({{contactFee.Name}})</span>
        </div>
        <div class="info_right col-md-3 text-right">
        </div>
      </div>
    </el-col>
    <el-col :span="24">
      <div class="grid-content noPadding flex">
        <div class="col-md-9" style="position:relative">
          <el-tabs v-model="activeName">
            <el-tab-pane label="品种手续费" name="first">
              <el-table :data="contactFee.FeeDetails" style="width: 100%" v-loading="loading" max-height="700">
                <el-table-column type="index" label="序号"  width="100">
                </el-table-column>
                <el-table-column prop="CommodityNo" label="品种代码">
                </el-table-column>
                <el-table-column prop="CommodityName" label="品种名称">
                </el-table-column>
                <el-table-column label="我的成本">
                  <template slot-scope="scope">
                    <span>{{ scope.row.MyFee }}（{{scope.row.CurrencyName}}）</span>
                  </template>
                </el-table-column>
                <el-table-column label="客户手续费">
                  <template slot-scope="scope">
                    <span>{{ scope.row.CustomerFee }}（{{scope.row.CurrencyName}}）</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="使用模板的客户" name="second">
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
                <el-col :span="12" v-for="item in contactFee.InsUsers" :key="item.InsUserCode">
                  <div class="grid-content bg-purple-light conbocx">
                    <div class="conbcx">
                      <div class="li-cont">
                        <p tabindex="0">
                          <span class="icon_agent1"></span>
                          <span class="jig1">{{item.InsUserName}}</span>
                        </p>
                      </div>
                      <p class="pxg">
                        <span class="pxg_title">子账户代码：</span>
                        <span class="pxg_cot">{{item.InsUserCode}}</span>
                      </p>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
          <el-button-group style="position: absolute;top:5px;right:20px;z-index:21110;">
            <el-button type="primary" size="small" @click="dialogFormVisible = true" v-show="!$store.state.tpInfo.State">设为扫码开户模板</el-button>
          </el-button-group>
        </div>
        <div class="col-md-3">
          <el-tabs v-model="activeName1">
            <el-tab-pane :label="tips" name="first">
              <el-col :span="24">
                <el-card shadow="always" style="border:none;">
                  <h4>模板说明：</h4>{{contactFee.Remark}}
                </el-card>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-col>
    <!-- 弹窗 -->
    <el-dialog title="设置默认模板" :visible.sync="dialogFormVisible" :close-on-click-modal="false" class="alert_title">

      <div class="settemplt">已有扫码开户默认模板，是否确定要更换？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="setDefault(contactFee)" size="small">确认</el-button>
      </div>
    </el-dialog>
  </el-row>

</template>

<script>
export default {
  // 代理手续费模板详情
  name: "subcommisionfeetemplatesinfo",
  data() {
    return {
       loading: "",
      contactFee: {},
      activeName: "first",
      activeName1: "first",
      labelPosition: "top",
      dialogFormVisible: false,
      isNull: true,
      tips: ""
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    getlist() {
      this.loading = true;
      let TpCode = sessionStorage.getItem("TpCode");
      let url = "/template/GetUserFeeTemplateDetailWithAgent";
      this.$loginapi.post(url, TpCode, response => {
        if (response.Ret == 0) {
           this.loading = false;
          this.contactFee = response.Data;
          if (this.contactFee.InsUsers.length > 0) {
            this.isNull = false;
          }
          this.tips = this.contactFee.Name + "的信息";
        } else {
          this.$message.error(response.Msg);
        }
      });
    },
    setDefault(rowObj) {
      let url = "/template/SetUserDefaultFeeTps";
      this.$loginapi.post(url, rowObj.TpCode, response => {
        if (response.Ret == 0) {
          this.$message.success("设置成功！");
          this.$store.state.tpInfo.State = !this.$store.state.tpInfo.State;
          this.dialogFormVisible = false;
        } else {
          this.$message.error(response.Msg);
        }
      });
    }
  }
};
</script>

<style scoped>

</style>

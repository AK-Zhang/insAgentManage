<template>
  <el-row>
    <el-col :span="24">
      <div class="grid-content bg-purple-dark flex">
        <div class="info_left col-md-9" style="line-height: 50px;">
          <!-- <router-link to="/templates/agentfeetemplates">我的客户</router-link> -->
          <span>我的客户&nbsp;>&nbsp;</span>
          <span>{{customerInfo.AgentName}}</span>
        </div>
        <div class="info_right col-md-3 text-right">
        </div>
      </div>
    </el-col>
    <el-col :span="24">
      <div class="grid-content noPadding flex">
        <div class="col-md-9">
          <el-tabs v-model="activeName">
            <el-tab-pane label="保证金" name="first">
              <el-table :data="customerInfo.MoneyTransfer" style="width: 100%">
                <el-table-column type="index" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="品种代码">
                </el-table-column>
                <el-table-column prop="name" label="品种名称">
                </el-table-column>
                <el-table-column label="保证金">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name }}（美元）</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="可交易品种" name="second">
              <el-table :data="customerInfo.MoneyTransfer" style="width: 100%">
                <el-table-column type="index" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="品种代码">
                </el-table-column>
                <el-table-column prop="name" label="品种名称">
                </el-table-column>
                <el-table-column label="保证金">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name }}（美元）</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="资金" name="third">
              <el-row>
                <el-col :span="12">
                  <div class="grid-content bg-purple-light conbocx">
                    <div class="conbcx">
                      <div class="li-cont">
                        <p tabindex="0">
                          <span class="icon_agent1"></span>
                          <span class="jig1">李俊朋</span>
                        </p>
                      </div>
                      <p class="pxg">
                        <span class="pxg_title">代理人代码：</span>
                        <span class="pxg_cot">79420009358</span>
                      </p>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple-light conbocx">
                    <div class="conbcx">
                      <div class="li-cont">
                        <p tabindex="0">
                          <span class="icon_agent1"></span>
                          <span class="jig1">曹敏</span>
                        </p>
                      </div>
                      <p class="pxg">
                        <span class="pxg_title">代理人代码：</span>
                        <span class="pxg_cot">79420009389</span>
                      </p>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="定时砍仓" name="fourth">
              <el-table :data="customerInfo.MoneyTransfer" style="width: 100%">
                <el-table-column type="index" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="品种代码">
                </el-table-column>
                <el-table-column prop="name" label="品种名称">
                </el-table-column>
                <el-table-column label="保证金">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name }}（美元）</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="col-md-3">
          <el-tabs v-model="activeName1">
            <el-tab-pane label="客户详情信息" name="first">
              <ul class="tmpul">
                <li>
                  <div>客户代码：</div>
                  <span>{{customerInfo.UserCode}}</span>
                </li>
                <li>
                  <div>手续费模板：</div>
                  <span>{{customerInfo.FeeTemplateName}}</span>
                </li>
                <li>
                  <div>手机号：</div>
                  <span>{{customerInfo.Phone}}</span>
                </li>
                <li>
                  <div>来源：</div>
                  <span>{{customerInfo.Source | GetSource}}</span>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-col>

  </el-row>

</template>

<script>
import EnumConfig from "../../../assets/js/EnumConfig.js";
export default {
  // 客户详情
  name: "agentfeetemplates",
  data() {
    return {
      customerInfo: {},
      customerInfotips: "",
      activeName: "first",
      activeName1: "first",
      labelPosition: "top"
    };
  },
  created() {
    this.getlist();
  },
  filters: {
    GetSource(type) {
      return EnumConfig.GetSource(type);
    }
  },
  methods: {
    getlist() {
      let UserCode = sessionStorage.getItem("UserCode");
      let url = "/mycustomer/GetInsUserDetail";
      this.$loginapi.post(url, UserCode, response => {
        if (response.Ret == 0) {
          this.customerInfo = response.Data;
          console.log(this.customerInfo)
          this.customerInfotips = response.Data.UserName + "的信息";
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

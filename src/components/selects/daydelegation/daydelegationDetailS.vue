 <template>
  <el-row class="el-row_h">
    <el-col :span="24">
      <div class="grid-content bg-purple-dark layout_box flex s_bg">
        <SeachConPage ref="SeachConPage"></SeachConPage>
        <el-input placeholder="请输入合约代码" v-model="ContactNoValue" clearable size="small" class="s_padding filterSelect">
        </el-input>
        <el-select v-model="PositionEffectValue" size="small" placeholder="请选择" class="s_padding">
          <el-option v-for="item in PositionEffectList" :key="item.Code" :label="item.Name" :value="item.Code">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="small" @click="getList()">查询</el-button>
      </div>
      <div>
        <daytableCom :data="delegateList" v-loading="loading"></daytableCom>
      </div>
      <div class="pagination_m text-center">
        <pagination :pagerPro="Pager" @ee="pageFn"></pagination>
      </div>
      <!-- <div class="footer grid-content bg-purple layout_box">
        <span class="text-right">
          佣金合计:
          <span class="capital">{{totalCapital}}</span>
          <span class="Currency"> (美元)</span>
          &nbsp;&nbsp;&nbsp; 提现合计:
          <span class="capital">{{totalCurrency}}</span>
          <span class="Currency"> (美元)</span>
        </span>
      </div> -->
    </el-col>
  </el-row>
</template>
<script>
import daytableCom from "./daydelegationDetailT.vue";
import pagination from "../../paging.vue";
import SeachConPage from "../SeachConPage.vue";

export default {
  // 筛选器
  name: "daydelegationDetailS",
  components: {
    daytableCom,
    pagination,
    SeachConPage
  },
  data() {
    return {
      loading: "",
      Pager: {
        PageNo: 1,
        PageSize: 10,
        RecordCount: 0
      },
      delegateList: [],
      totalCapital: 0,
      totalCurrency: 0,
      ContactNoValue: "",
      PositionEffectValue: "",
      PositionEffectList: [
        { Code: 0, Name: "请选择" },
        { Code: 1, Name: "开仓" },
        { Code: 2, Name: "平仓" }
      ]
    };
  },
  mounted() {
    this.PositionEffectValue = this.PositionEffectList[0].Code;
    this.getList();
  },
  methods: {
    getList(isSearch = true) {
      if (isSearch) {
        this.Pager = {
          PageNo: 1,
          PageSize: 20,
          RecordCount: 0
        };
      }
      this.loading = true;
      let AgentValue = this.$refs.SeachConPage.AgentValue;
      let UserValue = this.$refs.SeachConPage.UserValue;
      let url = "";
      let postData = "";

      if (AgentValue == "") {
        url = "/report/QryAllUserCurrentOrder";
        postData = {
          UserCode: UserValue,
          ContactNO: this.ContactNoValue,
          PositionEffect: this.PositionEffectValue
        };
      } else if (AgentValue == "AllDirectly") {
        url = "/report/QryInsUserCurrentOrder";
        postData = {
          UserCode: UserValue,
          ContactNO: this.ContactNoValue,
          PositionEffect: this.PositionEffectValue
        };
      } else if (AgentValue == "AllAgent") {
        url = "/report/QryAgentUserCurrentOrder";
        postData = {
          AgentCode: "",
          UserCode: UserValue,
          ContactNO: this.ContactNoValue,
          PositionEffect: this.PositionEffectValue
        };
      } else {
        url = "/report/QryAgentUserCurrentOrder";
        postData = {
          AgentCode: AgentValue,
          UserCode: UserValue,
          ContactNO: this.ContactNoValue,
          PositionEffect: this.PositionEffectValue
        };
      }

      this.$loginapi.postWithPage(
        url,
        this.Pager.PageNo,
        this.Pager.PageSize,
        postData,
        response => {
          this.loading = false;
          if (response.Ret == 0) {
            this.delegateList = response.Data.Records;
            this.totalCapital = 0;
            this.totalCurrency = 0;
            if (this.Pager.PageNo == 1) {
              this.Pager = response.Pager;
            }
          } else {
            this.$message.error(response.Msg);
          }
        }
      );
    },
    pageFn(size, PageNo) {
      this.Pager.PageSize = size;
      this.Pager.PageNo = PageNo;
      this.getList(false);
    }
  }
};
</script>

<style scoped>
</style>

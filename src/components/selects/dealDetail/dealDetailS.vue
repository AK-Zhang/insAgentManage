 <template>
  <el-row class="el-row_h">
    <el-col :span="24">
      <div class="grid-content bg-purple-dark layout_box flex s_bg">
        <SeachConPage ref="SeachConPage"></SeachConPage>
        <dateRange ref="dateRange"></dateRange>
        <el-input placeholder="请输入合约代码" v-model="ContactNoValue" clearable size="small" class="s_padding filterSelect">
        </el-input>
        <el-select v-model="PositionEffectValue" size="small" placeholder="请选择" class="s_padding">
          <el-option v-for="item in PositionEffectList" :key="item.Code" :label="item.Name" :value="item.Code">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="small" @click="getList()">查询</el-button>
      </div>
      <div>
        <tableCom :data="dealList" v-loading="loading"></tableCom>
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
import tableCom from "./dealDetailT.vue";
import pagination from "../../paging.vue";
import dateRange from "../../dateRangeSub.vue";
import SeachConPage from "../SeachConPage.vue";

export default {
  // 筛选器
  name: "dealDetailS",
  components: {
    tableCom,
    pagination,
    dateRange,
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
      dealList: [],
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
        url = "/report/QryAllUserHistoryTrade";
        postData = {
          UserCode: UserValue,
          ContactNO: this.ContactNoValue,
          PositionEffect: this.PositionEffectValue,
          BeginDate: this.$refs.dateRange.DateRangeValue[0],
          EndDate: this.$refs.dateRange.DateRangeValue[1]
        };
      } else if (AgentValue == "AllDirectly") {
        url = "/report/QryInsUserHistoryTrade";
        postData = {
          UserCode: UserValue,
          ContactNO: this.ContactNoValue,
          PositionEffect: this.PositionEffectValue,
          BeginDate: this.$refs.dateRange.DateRangeValue[0],
          EndDate: this.$refs.dateRange.DateRangeValue[1]
        };
      } else if (AgentValue == "AllAgent") {
        url = "/report/QryAgentUserHistoryTrade";
        postData = {
          AgentCode: "",
          UserCode: UserValue,
          ContactNO: this.ContactNoValue,
          PositionEffect: this.PositionEffectValue,
          BeginDate: this.$refs.dateRange.DateRangeValue[0],
          EndDate: this.$refs.dateRange.DateRangeValue[1]
        };
      } else {
        url = "/report/QryAgentUserHistoryTrade";
        postData = {
          AgentCode: AgentValue,
          UserCode: UserValue,
          ContactNO: this.ContactNoValue,
          PositionEffect: this.PositionEffectValue,
          BeginDate: this.$refs.dateRange.DateRangeValue[0],
          EndDate: this.$refs.dateRange.DateRangeValue[1]
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
            this.dealList = response.Data.Records;
            this.totalCapital = 0;
            this.totalCurrency = 0;

            if (this.Pager.PageNo == 1) {
              this.Pager = response.Pager;
            }
          } else {
            this.$alert(response.Msg, {});
            // this.$message.error(response.Msg);
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

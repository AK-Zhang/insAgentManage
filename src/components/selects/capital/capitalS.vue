 <template>
  <el-row class="el-row_h">
    <el-col :span="24">
      <div class="grid-content bg-purple-dark layout_box flex s_bg">
        <SeachConPage ref="SeachConPage"></SeachConPage>
        <dateRange ref="dateRange"></dateRange>
        <el-button type="primary" icon="el-icon-search" size="small" @click="getList()">查询</el-button>
      </div>
      <div>
        <tableCom :data="capitalList" v-loading="loading"></tableCom>
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
import tableCom from "./capitalT.vue";
import pagination from "../../paging.vue";
import dateRange from "../../dateRangeSub.vue";
import SeachConPage from "../SeachConPage.vue";

export default {
  // 资金搜索
  name: "capitalS",
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
      capitalList: [],
      totalCapital: 0,
      totalCurrency: 0
    };
  },
  mounted() {
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
        url = "/report/QryAllUserHistoryAccount";
        postData = {
          UserCode: UserValue,
          BeginDate: this.$refs.dateRange.DateRangeValue[0],
          EndDate: this.$refs.dateRange.DateRangeValue[1]
        };
      } else if (AgentValue == "AllDirectly") {
        url = "/report/QryInsUserHistoryAccount";
        postData = {
          UserCode: UserValue,
          BeginDate: this.$refs.dateRange.DateRangeValue[0],
          EndDate: this.$refs.dateRange.DateRangeValue[1]
        };
      } else if (AgentValue == "AllAgent") {
        url = "/report/QryAgentUserHistoryAccount";
        postData = {
          AgentCode: "",
          UserCode: UserValue,
          BeginDate: this.$refs.dateRange.DateRangeValue[0],
          EndDate: this.$refs.dateRange.DateRangeValue[1]
        };
      } else {
        url = "/report/QryAgentUserHistoryAccount";
        postData = {
          AgentCode: AgentValue,
          UserCode: UserValue,
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
            this.capitalList = response.Data.Records;
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

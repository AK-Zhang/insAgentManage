 <template>
  <el-row class="el-row_h">
    <el-col :span="24">
      <div class="grid-content bg-purple-dark layout_box flex s_bg">
        <SeachConPage ref="SeachConPage"></SeachConPage>
        <el-select v-model="DirectionValue" placeholder="请选择" class="s_padding" size="small">
          <el-option v-for="item in DirectionList" :key="item.Code" :label="item.Name" :value="item.Code">
          </el-option>
        </el-select>
        <dateRange ref="dateRange"></dateRange>
        <el-select v-model="PositionEffectValue" size="small" placeholder="请选择" class="s_padding">
          <el-option v-for="item in PositionEffectList" :key="item.Code" :label="item.Name" :value="item.Code">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="small" @click="getList()">查询</el-button>
      </div>
      <div>
        <tableCom :data="withdrawDetailList" v-loading="loading"></tableCom>
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
import tableCom from "./withdrawalDetailT.vue";
import pagination from "../../paging.vue";
import dateRange from "../../dateRangeSub.vue";
import SeachConPage from "../SeachConPage.vue";

export default {
  // 出入金明细
  name: "withdrawalDetailS",

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
      DirectionList: [
        { Code: 0, Name: "全部" },
        { Code: 1, Name: "入金" },
        { Code: 2, Name: "出金" }
      ],
      withdrawDetailList: [],
      DirectionValue: "",
      totalCapital: 0,
      totalCurrency: 0,
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
    this.DirectionValue = this.DirectionList[0].Code;
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
        url = "/report/QueryAllUserHistoryMoneyTransfer";
        postData = {
          UserCode: UserValue,
          PositionEffect: this.PositionEffectValue,
          MoneyTransType: this.DirectionValue,
          BeginDate: this.$refs.dateRange.DateRangeValue[0],
          EndDate: this.$refs.dateRange.DateRangeValue[1]
        };
      } else if (AgentValue == "AllDirectly") {
        url = "/report/QueryNoAgentUserHistoryMoneyTransfer";
        postData = {
          UserCode: UserValue,
          PositionEffect: this.PositionEffectValue,
          MoneyTransType: this.DirectionValue,
          BeginDate: this.$refs.dateRange.DateRangeValue[0],
          EndDate: this.$refs.dateRange.DateRangeValue[1]
        };
      } else if (AgentValue == "AllAgent") {
        url = "/report/QueryAgentUserHistoryMoneyTransfer";
        postData = {
          AgentCode: "",
          UserCode: UserValue,
          PositionEffect: this.PositionEffectValue,
          MoneyTransType: this.DirectionValue,
          BeginDate: this.$refs.dateRange.DateRangeValue[0],
          EndDate: this.$refs.dateRange.DateRangeValue[1]
        };
      } else {
        url = "/report/QueryAgentUserHistoryMoneyTransfer";
        postData = {
          AgentCode: AgentValue,
          UserCode: UserValue,
          PositionEffect: this.PositionEffectValue,
          MoneyTransType: this.DirectionValue,
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
            this.withdrawDetailList = response.Data.ListDetail;
            $.each(this.withdrawDetailList, function(i, n) {
              // alert("索引"+i+"对应的值"+n);
              let YMD = n.OptDate.split("/");
              YMD = YMD[2] + "-" + YMD[0] + "-" + YMD[1];
              n.OptDate = YMD;
            });
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

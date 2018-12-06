 <template>
  <el-row class="el-row_h">
    <el-col :span="24">
      <div class="grid-content bg-purple-dark layout_box flex s_bg">
        <SeachConPage ref="SeachConPage"></SeachConPage>
        <dateRange ref="dateRange"></dateRange>
        <el-button type="primary" icon="el-icon-search" size="small" @click="getList()">查询</el-button>
      </div>
      <div>
        <tableCom :data="commissionRevenueList"></tableCom>
      </div>
      <div class="pagination_m text-center">
        <pagination :pagerPro="Pager" @ee="pageFn"></pagination>
      </div>
      <div class="footer grid-content bg-purple layout_box">
        <span class="text-right">
          佣金合计:
          <span class="capital">{{totalCapital}}</span>
          <span class="Currency"> (美元)</span>
          &nbsp;&nbsp;&nbsp; 提现合计:
          <span class="capital">{{totalCurrency}}</span>
          <span class="Currency"> (美元)</span>
        </span>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import tableCom from "./statementT.vue";
import pagination from "../../paging.vue";
import dateRange from "../../dateRangeSub.vue";
import SeachConPage from "../SeachConPage.vue";

export default {
  // 结算单搜索
  name: "statementS",
  components: {
    tableCom,
    pagination,
    dateRange,
    SeachConPage
  },
  data() {
    return {
      Pager: {
        PageNo: 1,
        PageSize: 10,
        RecordCount: 0
      },
      commissionRevenueList: [],
      totalCapital: 0,
      totalCurrency: 0
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      let url = "";
      let postData = {
        BeginDate: this.$refs.dateRange.DateRangeValue[0],
        EndDate: this.$refs.dateRange.DateRangeValue[1]
      };

      this.totalCapital = 99.99;
      this.totalCurrency = 66.66;
      this.commissionRevenueList = [
        {
          date: "2016-05-03 12:50:01",
          currentCommission: 15886,
          currWithdraw: 9999
        }
      ];
    },
    pageFn(size, PageNo) {
      this.Pager.PageSize = size;
      this.Pager.PageNo = PageNo;
      this.getList();
    }
  }
};
</script>

<style scoped>
.el-row_h {
  height: 100%;
}
.el-row {
  margin-bottom: 20px;
  height: 100%;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.layout_box {
  padding: 10px;
  border-radius: 0px;
}
.padding_right {
  padding-right: 10px;
}
.footer {
  position: fixed;
  width: 100%;
  bottom: 0px;
}
.Currency {
  font-size: 13px;
}
.capital {
  padding: 0 5px;
  font-size: 16px;
  color: black;
  font-weight: 700;
}
</style>


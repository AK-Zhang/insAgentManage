<template>
  <el-row class="el-row_h">
    <el-col :span="24">
      <div class="grid-content bg-purple-dark layout_box flex s_bg">
        <dateRange ref="dateRange"></dateRange>
        <el-button type="primary" icon="el-icon-search" size="small" @click="getList()">查询</el-button>
      </div>
      <div>
        <tableCom :data="commissionRevenueList" v-loading="loading"></tableCom>
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
import tableCom from "./commissionRevenueT.vue";
import pagination from "../../paging.vue";
import dateRange from "../../dateRangeSub.vue";

export default {
  // 筛选器
  name: "commissionRevenueS",
  components: {
    tableCom,
    pagination,
    dateRange
  },
  data() {
    return {
      loading: "",
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
    getList(isSearch = true) {
      if (isSearch) {
        this.Pager = {
          PageNo: 1,
          PageSize: 20,
          RecordCount: 0
        };
      }
      this.loading = true;
      let url = "/report/QryAgentDayCommissionHistory";
      let postData = {
        BeginDate: this.$refs.dateRange.DateRangeValue[0],
        EndDate: this.$refs.dateRange.DateRangeValue[1]
      };

      this.$loginapi.postWithPage(
        url,
        this.Pager.PageNo,
        this.Pager.PageSize,
        postData,
        response => {
          this.loading = false;
          if (response.Ret == 0) {
            this.commissionRevenueList = response.Data.Records;

            this.totalCapital = response.Data.Commission;
            this.totalCurrency = response.Data.TotalWithdraw;

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
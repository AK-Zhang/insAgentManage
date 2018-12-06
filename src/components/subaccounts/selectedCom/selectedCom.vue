<template>
  <el-row class="el-row_h">
    <el-col :span="24">
      <div class="grid-content bg-purple-dark layout_box flex s_bg">
        <div>
          <el-input v-model="accountValue" placeholder="请输入客户代码关键字" size="small" @keyup.enter.native="getList()"></el-input>
        </div>
        <!-- <el-select v-model="sourceValue" clearable size="small" placeholder="请选择" class="padding_right">
          <el-option v-for="item in sourceList" :key="item.Code" :label="item.Name" :value="item.Code">
          </el-option>
        </el-select> -->
        <dateRange ref="dateRange"></dateRange>
        <el-button type="primary" icon="el-icon-search" size="small" @click="getList()">查询</el-button>
      </div>
      <div>
        <tableCom :data="accountList" v-loading="loading"></tableCom>
      </div>
      <div class="pagination_m text-center">
        <pagination :pagerPro="Pager" @ee="pageFn"></pagination>
      </div>
      <div class="footer grid-content bg-purple layout_box">
        <span class="text-right">
          客户数量合计:{{totalAccount}}
        </span>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import tableCom from "../tableCom/tableCom.vue";
import pagination from "../../paging.vue";
import dateRange from "../../dateRangeSub.vue";

export default {
  // 我的客户
  name: "selectedCom",
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
      accountList: [],
      accountValue: "",
      // sourceList: [
      //   { Code: 0, Name: "全部" },
      //   { Code: 1, Name: "系统管理员" },
      //   { Code: 2, Name: "机构管理员" },
      //   { Code: 3, Name: "机构代理" },
      //   { Code: 4, Name: "投资用户" },
      //   { Code: 5, Name: "机构财务" }
      // ],
      sourceValue: "",
      totalAccount: 0
    };
  },
  mounted() {
    // this.sourceValue = this.sourceList[0].Code;
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
      let url = "/mycustomer/QueryMyCustomers";
      let postData = {
        UserCode: this.accountValue,
        // UserSource: this.sourceValue,
        BeginDate: this.$refs.dateRange.DateRangeValue[0],
        EndDate: this.$refs.dateRange.DateRangeValue[1]
      };

      this.$loginapi.postWithPage(
        url,
        this.Pager.PageNo,
        this.Pager.PageSize,
        postData,
        response => {
          if (response.Ret == 0) {
            this.loading = false;
            this.accountList = response.Data;
            if (this.Pager.PageNo == 1) {
              this.Pager = response.Pager;
              this.totalAccount = response.Pager.RecordCount;
            }
          } else {
            this.loading = false;
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


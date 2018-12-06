<template>
  <el-row class="el-row_h">
    <el-col :span="24">
      <div class="grid-content bg-purple-dark layout_box flex s_bg">
        <dateRange ref="dateRange"></dateRange>
        <el-select v-model="stateValue" clearable size="small" placeholder="请选择" class="padding_right">
          <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="small" @click="getList()">查询</el-button>
      </div>
      <div>
        <tableCom :data="withdrawalRecordList" v-loading="loading"></tableCom>
      </div>
      <div class="pagination_m text-center">
        <pagination :pagerPro="Pager" @ee="pageFn"></pagination>
      </div>
      <!-- <div class="footer grid-content bg-purple layout_box">
        <span class="text-right">
          提现金额合计:
          <span class="capital">{{withdrawValue}}</span>
          <span class="Currency"> (美元)</span>
        </span>
      </div> -->
    </el-col>
  </el-row>
</template>

<script>
import tableCom from "./withdrawalRecordT.vue";
import pagination from "../../paging.vue";
import dateRange from "../../dateRangeSub.vue";

export default {
  // 提现记录筛选器
  name: "withdrawalRecordT",
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
      withdrawalRecordList: [],
      withdrawValue: 0,
      stateList: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "已申请"
        },
        {
          value: 2,
          label: "已审核"
        },
        {
          value: 3,
          label: "申请被拒绝"
        },
        {
          value: 4,
          label: "提现失败"
        }
      ],
      stateValue: ""
    };
  },
  mounted() {
    this.stateValue = this.stateList[0].value;
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
      let url = "/report/QueryAgentHistoryMoneyTransfer";
      let postData = {
        WithDrawState: this.stateValue,
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
            // console.log(response);
            this.withdrawalRecordList = response.Data;
            $.each(this.withdrawalRecordList, function(i, n) {
              // alert("索引"+i+"对应的值"+n);
              let YMD = n.OptDate.split("/");
              YMD = YMD[2] + "-" + YMD[0] + "-" + YMD[1];
              n.OptDate = YMD;
            });

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

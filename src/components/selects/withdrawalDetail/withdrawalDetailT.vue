<template>
  <el-table :data="data" style="width: 100%;" :row-class-name="tableRowClassName" max-height="660">
    <el-table-column label="序号" type="index" width="100">
    </el-table-column>
    <el-table-column prop="UserCode" label="客户代码">
    </el-table-column>
    <el-table-column prop="UserName" label="客户名称">
      <template slot-scope="scope">
        <span>{{scope.row.UserName == null ? "--" : (scope.row.UserName == "" ? "--" : scope.row.UserName)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="TransferType" label="方向" >
      <template slot-scope="scope">
        <span>{{scope.row.TransferType | GetDirection}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="TransferMoney" label="发生金额">
    </el-table-column>
    <el-table-column prop="Id" label="出入金流水号">
    </el-table-column>
    <el-table-column prop="OptDate" label="操作日期">
    </el-table-column>
    <el-table-column prop="OptTime" label="操作时间">
    </el-table-column>
    <el-table-column prop="OrderState" label="支付状态">
    </el-table-column>
    <el-table-column prop="OprName" label="操作员">
    </el-table-column>
    <el-table-column prop="MoneyTransSource" label="来源">
    </el-table-column>
  </el-table>
</template>

<script>
import EnumConfig from "../../../assets/js/EnumConfig.js";
export default {
  // 出入金明细
  name: "withdrawalDetailT",
  data() {
    return {};
  },
  props: ["data"],
  filters: {
    GetDirection(type) {
      return EnumConfig.GetDirection(type);
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    handleClick(row) {
      //console.log(row);
    }
  }
};
</script>

<style scoped>
</style>

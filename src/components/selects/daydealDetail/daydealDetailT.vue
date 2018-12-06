<template>
  <el-table :data="data" style="width: 100%;" :row-class-name="tableRowClassName" max-height="660">
    <el-table-column label="序号" type="index" width="80">
    </el-table-column>
    <el-table-column prop="UserCode" label="客户代码" width="110">
    </el-table-column>
    <el-table-column prop="UserName" label="客户名称" width="150">
    </el-table-column>
    <el-table-column prop="AgentCode" label="代理人代码"  width="150">
    </el-table-column>
    <el-table-column prop="AgentName" label="代理人名称" width="200">
    </el-table-column>
    <el-table-column prop="ContractNo" label="合约代码" width="150">
    </el-table-column>
    <el-table-column prop="Direction" label="方向" width="100">
      <template slot-scope="scope">
        <span>{{scope.row.Direction | GetDirection}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="PositionEffect" label="开平" width="100">
      <template slot-scope="scope">
        <span>{{scope.row.PositionEffect | PositionEffect}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="Volume" label="成交手数" width="120">
    </el-table-column>
    <el-table-column prop="Commission" label="手续费" width="120">
    </el-table-column>
    <el-table-column prop="Price" label="成交价格" width="130">
    </el-table-column>
    <el-table-column prop="TradeDateTime" label="成交时间" width="170">
    </el-table-column>
    <el-table-column prop="CloseProfit" label="平仓盈亏" width="120"  >
    </el-table-column>
  </el-table>
</template>

<script>
import EnumConfig from "../../../assets/js/EnumConfig.js";
export default {
  // 成交明细表格
  name: "dealDetailT",
  data() {
    return {};
  },
  props: ["data"],
  filters: {
    GetPositionEffectType(type) {
      return EnumConfig.GetPositionEffectType(type);
    },
    GetDirection(type) {
      return EnumConfig.GetDirection(type);
    },
    PositionEffect(type) {
      return EnumConfig.PositionEffect(type);
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

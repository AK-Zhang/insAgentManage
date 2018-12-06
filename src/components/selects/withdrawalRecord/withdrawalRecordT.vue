<template>
  <el-table :data="data" style="width: 100%;" :row-class-name="tableRowClassName" max-height="660">
    <el-table-column label="序号" type="index" width="100">
    </el-table-column>
    <el-table-column prop="OptDate" label="操作日期">
    </el-table-column>
    <el-table-column prop="OptTime" label="操作时间">
    </el-table-column>
    <el-table-column prop="TransferMoney" label="提现金额（美元）">
    </el-table-column>
    <el-table-column prop="Id" label="提现流水号">
    </el-table-column>
    <el-table-column prop="OrderState" label="状态">
    </el-table-column>
    <el-table-column prop="Remark" label="备注" show-overflow-tooltip>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  // 提现记录表格
  name: "withdrawalRecordT",
  data() {
    return {};
  },
  props: ["data"],
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

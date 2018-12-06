<template>
  <el-table :data="data" style="width: 100%;" :row-class-name="tableRowClassName">
    <el-table-column label="序号" type="index" width="100">
    </el-table-column>
    <el-table-column prop="date" label="操作时间">
    </el-table-column>
    <el-table-column prop="withdraw" label="提现金额（美元）">
    </el-table-column>
    <el-table-column prop="withdrawNo" label="提现流水号">
    </el-table-column>
    <el-table-column prop="withdrawstate" label="状态">
    </el-table-column>
    <el-table-column prop="withdrawDesc" label="状态描述">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  // 结算单表格
  name: "statementT",
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


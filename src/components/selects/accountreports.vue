<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="佣金收入" name="first">
      <selectedFirst></selectedFirst>
    </el-tab-pane>
    <el-tab-pane label="提现记录" name="second">
      <withdrawalRecordSPage></withdrawalRecordSPage>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import selectedFirst from "./commissionRevenue/commissionRevenueS.vue";
import withdrawalRecordSPage from "./withdrawalRecord/withdrawalRecordS.vue";
export default {
  // 我的账户查询
  name: "accountreports",
  data() {
    return {
      activeName: "first"
    };
  },
  components: {
    selectedFirst,
    withdrawalRecordSPage
  },
  created() {
    this.$store.state.loaction = "/selects/accountreports";
  },
  methods: {
    handleClick(tab, event) {
      // console.log(event);
    }
  }
};
</script>

<style scoped>
</style>

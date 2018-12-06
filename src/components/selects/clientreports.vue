<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="所有客户" name="first">
      <allClient></allClient>
    </el-tab-pane>
    <el-tab-pane label="成交明细" name="second">
      <dealDetail></dealDetail>
    </el-tab-pane>
    <el-tab-pane label="出入金明细" name="fifth">
      <withdrawalDetail></withdrawalDetail>
    </el-tab-pane>
    <el-tab-pane label="委托" name="sixth">
      <delegation></delegation>
    </el-tab-pane>
    <el-tab-pane label="资金" name="eighth">
      <capital></capital>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import allClient from "./allCustomers/allCustomersS.vue";
import dealDetail from "./dealDetail/dealDetailS.vue";
import withdrawalDetail from "./withdrawalDetail/withdrawalDetailS.vue";
import delegation from "./delegation/delegationDetailS.vue";
import capital from "./capital/capitalS.vue";
export default {
  // 客户查询
  name: "clientreports",
  components: {
    allClient, //所有客户
    dealDetail, //成交明细
    withdrawalDetail, //出入金明细
    delegation, //委托
    capital //资金
  },
  data() {
    return {
      activeName: "first"
    };
  },
  created() {
    this.$store.state.loaction = "/selects/clientreports";
  },
  methods: {
    handleClick(tab, event) {
      //console.log(event);
    }
  }
};
</script>

<style scoped>
</style>

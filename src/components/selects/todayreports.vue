<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="成交明细" name="first">
      <daydealDetail></daydealDetail>
    </el-tab-pane>
    <el-tab-pane label="委托" name="second">
      <daydelegation></daydelegation>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import daydealDetail from "./daydealDetail/daydealDetailS.vue";
import daydelegation from "./daydelegation/daydelegationDetailS.vue";
export default {
  // 当日查询
  name: "todayreports",
  components: {
    daydealDetail, //成交明细
    daydelegation, //委托
  },
  data() {
    return {
      activeName: "first"
    };
  },
  created() {
    this.$store.state.loaction = "/selects/todayreports";
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

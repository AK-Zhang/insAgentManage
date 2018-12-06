<template>
  <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,,20, 30, 50,100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="pagerPro.RecordCount">
  </el-pagination>
</template>

 <script>
export default {
  props: ["pagerPro"],
  data() {
    return {
      currentPage: 1,
      pagesize: 10
    };
  },

  created() {
    // this.currentPage = 1;
    // this.PageSize = 10;
  },
  methods: {
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.currentPage = 1;
      this.$emit("ee", this.pagesize, this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$emit("ee", this.pagesize, this.currentPage);
      // console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style scoped>
</style>

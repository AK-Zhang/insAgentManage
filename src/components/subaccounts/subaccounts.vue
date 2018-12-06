<template>
  <selectbox></selectbox>
</template>

<script>
import selectbox from "./selectedCom/selectedCom.vue";
export default {
  // 我的客户
  name: "subaccounts",
  components: {
    selectbox
  },
  data() {
    return {};
  },
  created() {
    this.$store.state.loaction = "/subaccounts";
  },
  methods: {}
};
</script>

<style scoped>
</style>

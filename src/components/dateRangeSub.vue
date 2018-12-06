<template>
  <div>
    <el-date-picker v-model="DateRangeValue" size="small" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="DateRangePickerOptions" style="margin-right:20px;margin-left:10px" value-format="yyyy-MM-dd">
    </el-date-picker>
  </div>
</template>

<script>
import commonJs from "../assets/js/Common.js";

export default {
  data() {
    return {
      DateRangePickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      DateRangeValue: []
    };
  },
  mounted() {
    this.DateRangeValue = commonJs.getDayRanage();
  },
  methods: {}
};
</script>

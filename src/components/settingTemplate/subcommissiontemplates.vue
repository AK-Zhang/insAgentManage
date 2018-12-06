<template>
  <div>
    <template>
      <el-table :data="commissionTemplatesList" style="width: 100%;" :row-class-name="tableRowClassName" v-loading="loading" max-height="740">
        <el-table-column type="index" label="序号" width="100px">
        </el-table-column>
        <el-table-column prop="Name" label="模板名称" width="220px">
          <template slot-scope="scope">
            <a @click="godd(scope.row)">{{scope.row.Name}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="Remark" label="模板说明" style="width:80%">
          <template slot-scope="scope">
            <span>{{scope.row.Remark == null ? "--" : (scope.row.Remark == "" ? "--" : scope.row.Remark)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="State" label="默认模板（扫码注册）">
          <template slot-scope="scope">
            <i class="el-icon-success" :class="scope.row.State? 'checked':'checked_hover' "></i>
            <span :class="scope.row.State? 'checked':'checked_hover' " @click="setDefault(scope.row)">{{scope.row.State? '默认模板':'设为默认' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination_m text-center">
        <pagination :pagerPro="Pager" @ee="pageFn"></pagination>
      </div>
    </template>
  </div>
</template>

<script>
import pagination from "../paging.vue";

export default {
  // 客户手续费模板 Microsoft YaHei
  name: "subcommissiontemplates",
  data() {
    return {
      loading: "",
      Pager: {
        PageNo: 1,
        PageSize: 10,
        RecordCount: 0
      },
      commissionTemplatesList: []
    };
  },
  components: {
    pagination
  },
  created() {
    this.$store.state.loaction = "/templates/subcommissiontemplates";
    this.getlist();
  },
  methods: {
    getlist() {
      this.loading = true;
      let url = "/template/QueryUserFeeTps";
      this.$loginapi.postWithPage(
        url,
        this.Pager.PageNo,
        this.Pager.PageSize,
        "",
        response => {
          if (response.Ret == 0) {
            this.loading = false;
            this.commissionTemplatesList = response.Data;
            if (this.Pager.PageNo == 1) {
              this.Pager = response.Pager;
            }
          } else {
            this.$message.error(response.Msg);
          }
        }
      );
    },
    godd(obj) {
      let path = obj.TpCode.substring(3);
      this.$store.state.tpInfo = obj;
      sessionStorage.setItem("TpCode", obj.TpCode);
      this.$router.push("/templatesinfo/subcommissiontemplatesinfo/" + path);
    },
    setDefault(rowObj) {
      if (rowObj.State) {
        return;
      }
      this.$confirm("此操作将设置为默认模板  , 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "/template/SetUserDefaultFeeTps";
          this.$loginapi.post(url, rowObj.TpCode, response => {
            if (response.Ret == 0) {
              this.getlist();
            } else {
              this.$message.error(response.Msg);
            }
          });
        })
        .catch(() => {});
    },
    pageFn(size, PageNo) {
      this.Pager.PageSize = size;
      this.Pager.PageNo = PageNo;
      this.getList();
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    }
  }
};
</script>

<style >
</style>

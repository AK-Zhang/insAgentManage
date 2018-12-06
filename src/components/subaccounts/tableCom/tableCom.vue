<template>
  <el-table :data="data" style="width: 100%;" :row-class-name="tableRowClassName" max-height="690">
    <el-table-column label="序号" type="index" width="50">
    </el-table-column>
    <el-table-column label="客户代码" width="200" prop="UserCode">
      <!-- <template slot-scope="scope">
        <el-button @click="goUserInfo(scope.row)" type="text">{{scope.row.UserCode}}</el-button>
      </template> -->
    </el-table-column>
    <el-table-column  label="客户名称" width="230" prop="UserName">
    </el-table-column>
    <el-table-column label="手续费模板ID" width="250">
      <template slot-scope="scope">
        <el-button @click="gomTemplateInfo(scope.row)" type="text">{{scope.row.FeeTemplateID}}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="Phone" label="手机号码" width="150">
      <template slot-scope="scope">
        <span>{{scope.row.Phone == null ? "--" : (scope.row.Phone == "" ? "--" : scope.row.Phone)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="CreateDate" label="开户时间">
    </el-table-column>
    <el-table-column label="来源">
      <template slot-scope="scope">
        {{scope.row.Source | GetSource}}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row.UserCode)" type="text" size="small">客户详情</el-button>
      </template>
    </el-table-column>
    <!-- 查看明细弹窗 -->
      <el-dialog title="客户详情" :visible.sync="dialogVisible" append-to-body width="60%">
          <div class="infobox clearfix">
              <div class="infoboxinfo">
                  <span>手续费模板名称:</span>
                  <input type="text" v-model="obj.FeeTemplateName"  disabled>
              </div>
              <div class="infoboxinfo">
                  <span>保证金模板名称:</span>
                  <input type="text" v-model="obj.MarginTemplateName" disabled>
              </div>
               <div class="infoboxinfo">
                  <span>风控模板名称:</span>
                  <input type="text" v-model="obj.RiskTemplateName" disabled>
              </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
  </el-table>
</template>

<script>
import EnumConfig from "../../../assets/js/EnumConfig.js";
export default {
  // 我的客户
  name: "tableCom",
  data() {
    return {
      dialogVisible: false,
      obj: {}
    };
  },
  props: ["data"],
  filters: {
    GetSource(type) {
      return EnumConfig.GetSource(type);
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
    // goUserInfo(obj) {
    //   let path = obj.UserCode.substring(0);
    //   sessionStorage.setItem("UserCode", obj.UserCode);
    //   this.$router.push("/selectedCominfo/selectedCominfo/" + path);
    // },
    // 查看客户详情
    handleClick(row) {
      this.dialogVisible = true;
      let url = "/mycustomer/GetInsUserDetail";
      this.$loginapi.post(url, row, response => {
        if (response.Ret == 0) {
          this.obj = response.Data;
        } else {
          this.$message.error(response.Msg);
        }
      });
    },
    gomTemplateInfo(obj) {
      let path = obj.FeeTemplateID.substring(3);
      this.$store.state.tpInfo = obj;
      sessionStorage.setItem("TpCode", obj.FeeTemplateID);
      this.$router.push("/templatesinfo/subcommissiontemplatesinfo/" + path);
    }
  }
};
</script>

<style scoped>
</style>

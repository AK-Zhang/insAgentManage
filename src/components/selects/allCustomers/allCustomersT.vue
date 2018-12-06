<template>
  <el-table :data="data" style="width: 100%;" :row-class-name="tableRowClassName" max-height="660">
    <el-table-column label="序号" type="index" width="100">
    </el-table-column>
    <el-table-column prop="UserCode" label="客户代码">
    </el-table-column>
    <el-table-column prop="UserName" label="客户名称">
    </el-table-column>
    <el-table-column prop="CreateDate" label="开户时间">
    </el-table-column>
    <el-table-column prop="AgentCode" label="代理人代码">
    </el-table-column>
    <el-table-column prop="AgentName" label="代理人名称">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
      </template>
    </el-table-column>
    <!-- 查看明细弹窗 -->
      <el-dialog title="查看详情" :visible.sync="dialogVisible" append-to-body width="60%">
          <div class="infobox clearfix">
              <div class="infoboxinfo">
                  <span>保证金模板名称:</span>
                  <input type="text" v-model="obj.MarginTemplateName"  disabled>
              </div>
              <div class="infoboxinfo">
                  <span>保证金模板ID:</span>
                  <input type="text" v-model="obj.MarginTemplateID" disabled>
              </div>
               <div class="infoboxinfo">
                  <span>风控模板名称:</span>
                  <input type="text" v-model="obj.RiskTemplateName" disabled>
              </div>
               <div class="infoboxinfo">
                  <span>风控模板ID:</span>
                  <input type="text" v-model="obj.RiskTemplateID" disabled>
              </div>
               <div class="infoboxinfo">
                  <span>客户来源:</span>
                  <input type="text" v-model="obj.Source" disabled>
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
  // 表格
  name: "allCustomer",
  data() {
    return {
       dialogVisible: false,
       obj: {}
    };
  },
  props: ["data"],
    filters: {
    GetDelegateOrderStateType(type) {
      return EnumConfig.GetDelegateOrderStateType(type);
    },
    GetDirection(type) {
      return EnumConfig.GetDirection(type);
    },
    PositionEffect(type) {
      return EnumConfig.PositionEffect(type);
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
    handleClick(row) {
      this.dialogVisible = true;
      this.obj = row;
      if(typeof(this.obj.Source) == "number"){
        this.obj.Source = this.filter(this.obj.Source);
      }
    },
    filter(type){
    switch (type) {
      case 1:
        return "系统管理员";
        break;
      case 2:
        return "机构管理员";
        break;
      case 3:
        return "机构代理";
        break;
      case 4:
        return "投资用户";
        break;
      case 5:
        return "机构财务";
        break;
      default:
        return "--";
        break;
     }
    },
  }
};
</script>

<style scoped>

</style>

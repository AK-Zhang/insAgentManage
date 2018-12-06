<template>
  <el-table :data="data" style="width: 100%;" :row-class-name="tableRowClassName" max-height="660">
    <el-table-column label="序号" type="index" width="100">
    </el-table-column>
    <el-table-column prop="UserCode" label="客户代码">
    </el-table-column>
    <el-table-column prop="UserName" label="客户名称">
    </el-table-column>
    <el-table-column prop="ContractNo" label="合约代码">
    </el-table-column>
    <el-table-column prop="Direction" label="方向">
      <template slot-scope="scope">
        <span>{{scope.row.Direction | GetDirection}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="PositionEffect" label="开平">
      <template slot-scope="scope">
        <span>{{scope.row.PositionEffect | PositionEffect}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="Volume" label="委托数量">
    </el-table-column>
    <el-table-column prop="LimitPrice" label="委托价格">
    </el-table-column>
    <el-table-column prop="OrderState" label="委托状态">
      <template slot-scope="scope">
        <span>{{scope.row.OrderState | GetDelegateOrderStateType}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="VolumeTraded" label="成交数量">
    </el-table-column>
    <el-table-column prop="CommissionTraded" label="成交手续费">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
      </template>
    </el-table-column>
    <!-- 查看明细弹窗 -->
      <el-dialog title="查看详情" :visible.sync="dialogVisible" append-to-body width="60%" >
          <div class="infobox clearfix">
              <div class="infoboxinfo">
                  <span>本地委托单编号:</span>
                  <input type="text" v-model="obj.LocalOrderNo"  disabled>
              </div>
              <div class="infoboxinfo">
                  <span>上游委托单编号:</span>
                  <input type="text" v-model="obj.UserCode" disabled>
              </div>
               <div class="infoboxinfo">
                  <span>用户资金账号:</span>
                  <input type="text" v-model="obj.UserAccountNo" disabled>
              </div>
                <div class="infoboxinfo">
                  <span>货币代码:</span>
                  <input type="text" v-model="obj.CurrencyNo" disabled>
              </div>
                <div class="infoboxinfo">
                  <span>交易所编号:</span>
                  <input type="text" v-model="obj.ExchangeNo" disabled>
              </div>
                <div class="infoboxinfo">
                  <span>交易所名称:</span>
                  <input type="text" v-model="obj.ExchangeName" disabled>
              </div>
                <div class="infoboxinfo">
                  <span>品种代码 :</span>
                  <input type="text" v-model="obj.CommodityNo" disabled>
              </div>
                <div class="infoboxinfo">
                  <span>品种名称 :</span>
                  <input type="text" v-model="obj.CommodityName" disabled>
              </div>
                <div class="infoboxinfo">
                  <span>合约名称 :</span>
                  <input type="text" v-model="obj.ContractName" disabled>
              </div>
              <div class="infoboxinfo">
                  <span>总账号名称 :</span>
                  <input type="text" v-model="obj.TopAccountName	" disabled>
              </div>
              <div class="infoboxinfo">
                  <span>委托有效期 :</span>
                  <input type="text" v-model="obj.InsertDateTime" disabled>
              </div>
              <div class="infoboxinfo">
                  <span>至 :</span>
                  <input type="text" v-model="obj.ExpireDateTime" disabled>
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
  // 委托表格
  name: "daydelegationDetailT",
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
    },
  }
};
</script>

<style scoped>

</style>

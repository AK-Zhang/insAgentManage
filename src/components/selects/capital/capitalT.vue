<template>
  <el-table :data="data" style="width: 100%;" :row-class-name="tableRowClassName" max-height="660">
    <el-table-column  label="序号" type="index" width="50">
    </el-table-column>
    <el-table-column prop="TradingDay" label="结算日期" width="180">
    </el-table-column>
    <el-table-column prop="UserCode" label="客户代码">
    </el-table-column>
    <el-table-column prop="UserName" label="客户名称" width="180">
    </el-table-column>
    <el-table-column prop="Deposit" label="入金">
    </el-table-column>
    <el-table-column prop="Withdraw" label="出金">
    </el-table-column>
    <el-table-column prop="FloatingProfit" label="持仓盈亏">
    </el-table-column>
    <el-table-column prop="CloseProfit" label="平仓盈亏">
    </el-table-column>
    <el-table-column prop="Commission" label="手续费">
    </el-table-column>
    <el-table-column prop="CurrBalance" label="动态权益">
      <template slot-scope="scope">
          <span>{{scope.row.CurrBalance | KeepTwoNum}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="CurrUse" label="可用资金">
        <template slot-scope="scope">
            <span>{{scope.row.CurrUse | KeepTwoNum}}</span>
        </template>
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
                  <span>资金账号:</span>
                  <input type="text" v-model="obj.AccountNo" disabled>
              </div>
               <div class="infoboxinfo">
                  <span>币种:</span>
                  <input type="text" v-model="obj.CurrencyNo" disabled>
              </div>
                <div class="infoboxinfo">
                  <span>币种名称:</span>
                  <input type="text" v-model="obj.CurrencyName" disabled>
              </div>
                <div class="infoboxinfo">
                  <span>用户名称:</span>
                  <input type="text" v-model="obj.UserName" disabled>
              </div>
                <div class="infoboxinfo">
                  <span>保证金 :</span>
                  <input type="text" v-model="obj.CurrMargin" disabled>
              </div>
              <div class="infoboxinfo">
                  <span>当前盈利率 :</span>
                  <input type="text" v-model="obj.ProfitRatio" disabled>
              </div>
              <div class="infoboxinfo">
                  <span>今结存 :</span>
                  <input type="text" v-model="obj.CurrDeposit" disabled>
              </div>
              <div class="infoboxinfo">
                  <span>总入金 :</span>
                  <input type="text" v-model="obj.CurrDeposit" disabled>
              </div>
              <div class="infoboxinfo">
                  <span>总出金 :</span>
                  <input type="text" v-model="obj.TotalWithdraw" disabled>
              </div>
              <div class="infoboxinfo">
                  <span>总手续费 :</span>
                  <input type="text" v-model="obj.TotalCommission" disabled>
              </div>
              <div class="infoboxinfo">
                  <span>总净盈亏 :</span>
                  <input type="text" v-model="obj.NetProfit" disabled>
              </div>
              <div class="infoboxinfo">
                  <span>总平盈 :</span>
                  <input type="text" v-model="obj.TotalCloseProfit" disabled>
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
export default {
  // 资金表格
  name: "capitalT",
  data() {
    return {
       dialogVisible: false,
       obj: {}
    };
  },
  props: ["data"],
  filters: {
  KeepTwoNum(value) {
    value = Number(value);
    return value.toFixed(2);
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
.el-tabs__content {
  height: 80% !important;
}
</style>

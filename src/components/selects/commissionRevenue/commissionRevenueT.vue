<template>
  <el-table :data="data" style="width: 100%;" :row-class-name="tableRowClassName" max-height="660">
    <el-table-column label="序号" type="index" width="100">
    </el-table-column>
    <el-table-column prop="AgentCode" label="代理代码">
    </el-table-column>
    <el-table-column prop="AgentName" label="代理名称">
      <template slot-scope="scope">
        <span>{{scope.row.AgentName == null ? "--" : (scope.row.AgentName == "" ? "--" : scope.row.AgentName)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="CreateDate" label="操作时间">
      <template slot-scope="scope">
        <span>{{scope.row.CreateDate | datefmt("YYYY-MM-DD")}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="CommissionProfit" label="当日佣金">
    </el-table-column>
    <el-table-column prop="Withdraw" label="当日提现">
    </el-table-column>
    <el-table-column prop="CurrencyNo" label="货币代码">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">交易明细</el-button>
      </template>
    </el-table-column>
    <!-- 弹窗 -->
    <el-dialog title="交易明细" :visible.sync="dialogTableVisible" append-to-body width="78%" top="13vh" >
      <el-table :data="transactionDetaillist" class="celll" max-height="550" id="tableExcel" fixed>
        <el-table-column prop="UserCode" label="客户代码" ></el-table-column>
        <el-table-column prop="ContractNo" label="合约代码"></el-table-column>
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
        <el-table-column prop="Volume" label="成交手数" ></el-table-column>
        <el-table-column prop="Price" label="成交价格"></el-table-column>
        <el-table-column prop="UserCommission" label="手续费"></el-table-column>
        <el-table-column prop="OrderRef" label="成交编号" width="180"></el-table-column>
        <el-table-column prop="TradeDateTime" label="成交时间">
          <template slot-scope="scope">
            <span>{{scope.row.TradeDateTime | datefmt("HH:mm:ss")}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="TradeDateTime" label="成交日期">
            <template slot-scope="scope">
            <span>{{scope.row.TradeDateTime | datefmt("YYYY-MM-DD")}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="CommodityNo" label="品种代码"></el-table-column>
        <el-table-column prop="CommissionProfit" label="佣金"></el-table-column>
      </el-table>
      <!-- <table id="tableExcel">
        <tr>
          <td>1</td><td>admin</td>
          <td>23</td><td>程序员</td>
          <td>天津</td><td>admin@kali.com</td>
        </tr>
        <tr>
          <td>2</td><td>guest</td>
          <td>23</td><td>测试员</td>
          <td>北京</td><td>guest@kali.com</td>
        </tr>
      </table> -->
      <div class="pagination_mx text-center" style="margin-top:10px">
        <pagination :pagerPro="Pager" @ee="pageFn"></pagination>
      </div>
      <div class="total">
        <div class="total_word">
          佣金合计：
          <span class="footb_money">{{TotalCommission}}</span>
          <span class="footb_money1"> （美元）</span>
        </div>
        <div class="total_word">
          成交手数合计：
          <span class="footb_money">{{TotalVolume}}</span>
          <span class="footb_money1"> （手）</span>
        </div>
        <div class="total_word">
          手续费合计：
          <span class="footb_money">{{TotalUserCommission}}</span>
          <span class="footb_money1"> （美元）</span>
        </div>
      </div>
      <div>
        <button type="submit" @click="exportExcel('tableExcel','','交易明细.xls')" class="btn exportTable btn-primary" style="float:right;margin-top:-40px;font-size:12px;">
          <a id="dlink" href="" style="display: none;"></a>
          <i class="fa fa-download "></i> 导出表格</button>
      </div>
    </el-dialog>
  </el-table>
</template>


<script>
import pagination from "../../paging.vue";
import EnumConfig from "../../../assets/js/EnumConfig.js";
import "../../../assets/lib/jquery.min.js";
export default {
  // 表格
  name: "commissionRevenueT",
  components: {
    pagination
  },
  data() {
    return {
      idTmr: "",
      dialogTableVisible: false,
      transactionDetaillist: [],
      TotalUserCommission: "",
      TotalVolume: "",
      TotalCommission: "",
      pagerow: {},
      Pager: {
        PageNo: 1,
        PageSize: 10,
        RecordCount: 0
      }
    };
  },
  props: ["data"],
  filters: {
    GetDirection(type) {
      return EnumConfig.GetDirection(type);
    },
    PositionEffect(type) {
      return EnumConfig.PositionEffect(type);
    }
  },
  created() {},
  methods: {
    tableheaderClassname({ row, rowIndex }) {
      return "table-head-th";
    },
    tablebodyClassname({ row, rowIndex }) {
      return "table-body-td";
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    handleClick(row) {
      this.pagerow = row;
      this.dialogTableVisible = true;
      let url = "/report/QryAgentDayCommissionDetail";
      let postData = { Date: row.CreateDate };
      this.$loginapi.postWithPage(
        url,
        this.Pager.PageNo,
        this.Pager.PageSize,
        postData,
        response => {
          if (response.Ret == 0) {
            this.transactionDetaillist = response.Data.Records;
            if (this.Pager.PageNo == 1) {
              this.Pager = response.Pager;
              this.Pager.RecordCount = response.Data.RecordCount;
              this.TotalCommission = response.Data.TotalCommission;
              this.TotalVolume = response.Data.TotalVolume;
              this.TotalUserCommission = response.Data.TotalUserCommission;
            }
          } else {
            this.$message.error(response.Msg);
          }
        }
      );
    },
    pageFn(size, PageNo) {
      this.Pager.PageSize = size;
      this.Pager.PageNo = PageNo;
      this.handleClick(this.pagerow);
    },
    getExplorer() {
      var explorer = window.navigator.userAgent;

      //ie
      if (explorer.indexOf("Trident") >= 0) {
        return "ie";
      } else if (explorer.indexOf("Firefox") >= 0) {
        //firefox
        return "Firefox";
      } else if (explorer.indexOf("Chrome") >= 0) {
        //Chrome
        return "Chrome";
      } else if (explorer.indexOf("Opera") >= 0) {
        //Opera
        return "Opera";
      } else if (explorer.indexOf("Safari") >= 0) {
        //Safari
        return "Safari";
      }
    },
    exportExcel(tableid, name, filename) {
      if (this.getExplorer() == "ie") {
        var curTbl = document.getElementById(tableid);
        var oXL = new ActiveXObject("Excel.Application");
        var oWB = oXL.Workbooks.Add();
        var xlsheet = oWB.Worksheets(1);
        var sel = document.body.createTextRange();
        sel.moveToElementText(curTbl);
        sel.select();
        sel.execCommand("Copy");
        xlsheet.Paste();
        oXL.Visible = true;
        try {
          var fname = oXL.Application.GetSaveAsFilename(
            "Excel.xls",
            "Excel Spreadsheets (*.xls), *.xls"
          );
        } catch (e) {
          print("Nested catch caught " + e);
        } finally {
          oWB.SaveAs(fname);
          oWB.Close((savechanges = false));
          oXL.Quit();
          oXL = null;
          idTmr = window.setInterval("Cleanup();", 1);
        }
      } else {
        this.tableToExcel(tableid, name, filename);
      }
    },
    Cleanup() {
      window.clearInterval(idTmr);
      CollectGarbage();
    },
    tableToExcel(table, name, filename) {
      var uri = "data:application/vnd.ms-excel;base64,",
        //Excel样式代码
        template =
          '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"' +
          'xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>' +
          "<x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets>" +
          "</x:ExcelWorkbook></xml><![endif]-->" +
          ' <style type="text/css">' +
          ".excelTable  {" +
          "border-collapse:collapse;" +
          " border:thin solid #999; " +
          "}" +
          "   .excelTable  th {" +
          "   border: thin solid #999;" +
          "  padding:20px;" +
          "  text-align: center;" +
          "  border-top: thin solid #999;" +
          " background-color: #E6E6E6;" +
          " }" +
          " .excelTable  td{" +
          " border:thin solid #999;" +
          "  padding:2px 5px;" +
          "  text-align: center;" +
          " }</style>" +
          '</head><body ><table class="excelTable">{table}</table></body></html>',
        base64 = function(s) {
          return window.btoa(unescape(encodeURIComponent(s)));
        },
        format = function(s, c) {
          return s.replace(/{(\w+)}/g, function(m, p) {
            return c[p];
          });
        };
      if (!table.nodeType) table = document.getElementById(table);
      var ctx = { worksheet: name || "Worksheet", table: table.innerHTML };
      document.getElementById("dlink").href = uri + base64(format(template, ctx));
      document.getElementById("dlink").download = filename;
      document.getElementById("dlink").click();
    }
  }
};
</script>

<style scoped>
</style>

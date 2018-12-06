// 导出表格
let getExplorer = function () {
  var explorer = window.navigator.userAgent;

  //ie
  if (explorer.indexOf("MSIE") >= 0) {
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
};
let exportExcel = function (tableHeadid, tableBodyid, name, filename) {
  if (getExplorer() == "ie") {
    var curTbl = document.getElementById(tableHeadid);
    var curTb = document.getElementById(tableBodyid);
    var oXL = new ActiveXObject("Excel.Application");
    var oWB = oXL.Workbooks.Add();
    var xlsheet = oWB.Worksheets(1);
    var sel = document.body.createTextRange();
    sel.moveToElementText(curTb);
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
      idTmr = window.setInterval(Cleanup(), 1);
    }
  } else {
    tableToExcel(tableHeadid, tableBodyid, name, filename);
  }
};
let Cleanup = function () {
  window.clearInterval(idTmr);
  CollectGarbage();
};
let tableToExcel = function (tableHead, tableBody, name, filename) {
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
    base64 = function (s) {
      return window.btoa(unescape(encodeURIComponent(s)));
    },
    format = function (s, c) {
      return s.replace(/{(\w+)}/g, function (m, p) {
        return c[p];
      });
    };
  if (!tableHead.nodeType) tableHead = document.getElementById(tableHead);
  if (!tableBody.nodeType) tableBody = document.getElementById(tableBody);
  if (tableBody.children[0].children[0].children[0].innerHTML == "暂无数据") {
    tableBody.deleteRow(0)
  }
  var ctx = {
    worksheet: name || "Worksheet",
    table: tableHead.innerHTML + tableBody.innerHTML
  };
  document.getElementById("dlink").href =
    uri + base64(format(template, ctx));
  document.getElementById("dlink").download = filename;
  document.getElementById("dlink").click();
}
export default {
  exportExcel
}

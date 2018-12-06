//日期加上天数得到新的日期  
//dateTemp 需要参加计算的日期，days要添加的天数，返回新的日期，日期格式：YYYY-MM-DD  

let getNowFormatDate = function () {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
};

let getDayRanage = function () {
  let arrRange = [];
  let days = -7;

  let endDate = getNowFormatDate();

  let dateTemp = endDate.split("-");
  let nDate = new Date(dateTemp[1] + '/' + dateTemp[2] + '/' + dateTemp[0]); //转换为MM-DD-YYYY格式    
  let millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000);
  let rDate = new Date(millSeconds);
  let year = rDate.getFullYear();
  let month = rDate.getMonth() + 1;
  if (month < 10) month = "0" + month;
  let date = rDate.getDate();
  if (date < 10) date = "0" + date;

  let startDate = (year + "/" + month + "/" + date);

  arrRange.push(startDate);
  arrRange.push(endDate);
  return arrRange;
}

export default {
  getDayRanage
};

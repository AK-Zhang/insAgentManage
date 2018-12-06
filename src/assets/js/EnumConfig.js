//开平类型
let GetPositionEffectType =
  function (type) {
    switch (type) {
      case 0:
        return "不分开平";
        break;
      case 1:
        return "开仓";
        break;
      case 2:
        return "平仓";
        break;
      case 3:
        return "平开";
        break;
      case 4:
        return "平当日";
        break;
      default:
        return "--";
        break;
    }
  };
//子账户来源
let GetSource =
  function (type) {
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
  };
//买买方向
let GetDirection =
  function (type) {
    switch (type) {
      case 0:
        return "--";
        break;
      case 1:
        return "买入";
        break;
      case 2:
        return "卖出";
        break;
      default:
        return "--";
        break;
    }
  };
// 开平仓
let PositionEffect =
  function (type) {
    switch (type) {
      case 0:
        return "--";
        break;
      case 1:
        return "开仓";
        break;
      case 2:
        return "平仓";
        break;
      case 3:
        return "平开";
        break;
      default:
        return "--";
        break;
    }
  };
//委托状态类型
let GetDelegateOrderStateType =
  function (type) {
    switch (type) {
      case 0:
        return "终端提交";
        break;
      case 4:
        return "已排队";
        break;
      case 5:
        return "部分成交";
        break;
      case 6:
        return "完全成交";
        break;
      case 7:
        return " 待撤消";
        break;
      case 8:
        return "待修改";
        break;
      case 9:
        return "完全撤单";
        break;
      case 10:
        return "部分撤单";
        break;
      case 11:
        return "受理失败";
        break;
      default:
        return "--";
        break;
    }
  }
export default {
  GetSource,
  GetDirection,
  GetDelegateOrderStateType,
  PositionEffect
};

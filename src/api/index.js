import axios from 'axios';
import '../assets/lib/jquery.min.js'

const Storage = {}

Storage.get = function (name) {
  return JSON.parse(sessionStorage.getItem(name))
}

Storage.set = function (name, val) {
  sessionStorage.setItem(name, JSON.stringify(val))
}

Storage.add = function (name, addVal) {
  let oldVal = Storage.get(name)
  let newVal = oldVal.concat(addVal)
  Storage.set(name, newVal)
}

var ajax = {
  get: function (url, data, callback, token) {
    var contenttype = "text/plain";
    http({
      method: "get",
      headers: {
        "Content-Type": contenttype,
        "Token": token
      },
      url: url,
      params: data,
    }).then(function (res) {
      httpcallback(res, callback);
    }).catch(function (err) {
      errCallBack(err, callback);
    })
  },
  post: function (url, udata, callback, token) {
    var contenttype = "application/json;charset=utf-8";
    if (typeof (udata) == "string") {
      contenttype = "application/x-www-form-urlencoded;charset=utf-8";
    }
    http({
      method: "post",
      headers: {
        "Content-Type": contenttype,
        "Token": token
      },
      url: url,
      data: udata,
      timeout: 60000,
      responseType: 'text'
    }).then(function (res) {
      httpcallback(res, callback);
    }).catch(function (err) {
      errCallBack(err, callback);
    })
  }
}
let httpcallback = function (res, callback) {
  if (res.status == 200) {
    callback(res.data);
    return;
  }
  var err = {
    Ret: -1,
    Msg: '返回状态码' + res.status
  };
  if (res.status == 401) {
    err.Ret = 401;
  }
  callback(err);
}
let errCallBack = function (err, callback) {

  if(err.message.indexOf("timeout") > -1){
    err.message = "连接超时，请稍后重试。";
  }

  var errdata = {
    Ret: -1,
    Msg: err.message
  };
  if (err.response != undefined && err.response.status == 401) errdata.Ret = 401;
  callback(errdata);
}

let http;

$.ajax({
  type: "get",
  url: "../../static/config.json",
  async: false,
  success: function (data) {
    http = axios.create({
      baseURL: data.AgentApiUrl, //"http://futures.mlinsoft.com:9908/api/", //config.ApiUrl,//'http://192.168.1.205:8000/api/',

      withCredentials: true,
    });
  }
});

export default ajax;

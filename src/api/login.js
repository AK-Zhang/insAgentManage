import JsEncrypt from "jsencrypt";
import md5 from 'js-md5';
import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);
import Api from './index.js';

Vue.$api = Api;
const store = new Vuex.Store({
  state: {
    uname: sessionStorage.getItem("uname"),
    pwd: sessionStorage.getItem("pwd"),
    inscode: sessionStorage.getItem("inscode"),
    type: sessionStorage.getItem("type"),
    islogin: false,
    retryLoginCount: 0,
    apiUrl: "",
    isShow: false,
    isShow1: false,
    breadnav1: 0,
    breadnav2: 0,
    tpInfo: {},
    loaction: "/home",
    //详情 对象
    DetailInfo: {},
    userInfo: {},
    height: "500px"
  }
})

function mlogin(pubkey, callback) {
  let jse = new JsEncrypt();
  jse.setPublicKey(pubkey);
  let newpwd = jse.encrypt(store.state.pwd);
  newpwd = encodeURIComponent(newpwd);
  Vue.$api.post(
    "login/InsAgent/" + store.state.inscode,
    "name=" + store.state.uname + "&pwd=" + newpwd + "&type=" + store.state.type,
    function (res) {
      if (res.Ret == 0) {
        let mtoken = {
          token: res.Data.Token,
          expire: res.Data.ExpireDate,
          refreshtoken: res.Data.RefreshToken,
          secretkey: res.Data.SecretKey
        };
        setLoginCache(mtoken);
        store.state.userInfo = res.Data;
        sessionStorage.setItem('userInfo',JSON.stringify(store.state.userInfo));
        callback({
          Ret: 0
        });
        store.state.islogin = true;
      } else
        callback(res);
    }
  );
}

function loginByCheckPubKey(callback) {
  let pubkey = getPubKey();
  if (pubkey == "" || pubkey == null) {
    Vue.$api.get("login/PubKey", "", res => {
      if (typeof (res) != 'string') {
        callback(res);
        return;
      }
      setPubkey(res);
      mlogin(res, callback);
    });
  } else {
    mlogin(pubkey, callback);
  }
}

function gettokenName() {
  return "token" + store.state.uname;
}

function setLoginCache(token) {
  if (token != "" && token != null) {
    sessionStorage.setItem(gettokenName(), JSON.stringify(token));
  }
}

function gettoken() {
  let tokenitem = JSON.parse(sessionStorage.getItem(gettokenName()));
  if (tokenitem == null) return "";
  let d = new Date();
  let span = Date.parse(tokenitem.expire) - d.getTime();
  if (span < tokenExpire) return "";
  return tokenitem.token;
}

function getrefreshToken() {
  let tokenitem = JSON.parse(sessionStorage.getItem(gettokenName()));
  if (tokenitem == null) return "";
  let d = new Date();
  let span = tokenitem.expire - d.getTime();
  if (span < tokenExpire) return "";
  return tokenitem.refreshtoken;
}

let tokenExpire = 10 * 60 * 1000;

function getPubKey() {
  let o = JSON.parse(sessionStorage.getItem("pubkey"));
  if (o == null) return "";
  let d = new Date();
  let span = o.expire - d.getTime();
  if (span <= 0) return "";
  return o.pubkey;
}

function getSecretKey() {
  let tokenitem = JSON.parse(sessionStorage.getItem(gettokenName()));
  if (tokenitem == null) return "";
  let d = new Date();
  let span = tokenitem.expire - d.getTime();
  if (span < tokenExpire) return "";
  return tokenitem.secretkey;
}

function setPubkey(pubkey) {
  let d = new Date();
  d.setTime(d.getTime() + 50 * 60 * 1000);
  let pubkeyItem = {
    pubkey: pubkey,
    expire: d.getTime()
  };
  sessionStorage.setItem("pubkey", JSON.stringify(pubkeyItem));
}

function clearToken() {
  let token = gettokenName();
  sessionStorage.removeItem(token);
}

/*
  api请求响应检测
  检测是否为token无效 当token无效时重新登录
*/
function responseChcek(response, callback, meta) {
  if (response.Ret == 40001 || response.Ret == 40000) {
    clearToken();
    let token = gettoken();
    if (token == "") {
      vue.$alert("登录状态失效，请重新登录！", "警告", {
        confirmButtonText: '确定',
        callback: action => {
          if (localStorage.getItem("url") == null) {
            vue.$router.push("/")
            } else {
            vue.$router.push(localStorage.getItem("url").split("#")[1]);
            }
          window.location.reload();  
          return false;
        }
      });
    }
    store.state.islogin = false;
    var relogin = function (e) {
      store.state.retryLoginCount++;
      if (e.Ret != 0) {
        if (store.state.retryLoginCount > 5) {
          store.state.retryLoginCount = 0;
          callback({
            Ret: -1,
            Msg: "无法登录。"
          });
          return;
        }
        loginByCheckPubKey(relogin);
      } else {
        store.state.retryLoginCount = 0;
        let token = gettoken();
        let postdata = meta.data;
        Vue.$api.post(meta.url, postdata, x => {
          meta.callback(x);
        }, token);
      }
    }
    relogin(response);
  }else if(response.Ret == 40007){
    vue.$alert("当前账户已冻结,请联系客服解冻！", "警告", {
      confirmButtonText: '确定',
      callback: action => {
        if (localStorage.getItem("url") == null) {
          vue.$router.push("/");
          } else {
          vue.$router.push(localStorage.getItem("url").split("#")[1]);
          }
        window.location.reload();
        return false;
      }
    });
  } else callback({
    Ret: 0
  });
}

function checkLogin(callback) {
  if (store.state.islogin) {
    callback({
      Ret: 0
    });
    return;
  }
  let token = gettoken();
  if (token != null && token != "") {
    store.state.islogin = true;
    callback({
      Ret: 0
    });
    return;
  }
  loginByCheckPubKey(callback);
}

function random() {
  return Math.floor(Math.random() * 10000000000);
}

export default {
  store,
  login: function (inscode, username, pwd, callback) {
    let uname = store.state.uname;
    if (uname == "" || uname != username) store.state.islogin = false;
    // store.state.uname = username;
    //     // store.state.pwd = pwd;
    //     // store.state.inscode = inscode;
    sessionStorage.setItem("uname", username),
      // sessionStorage.setItem("pwd", pwd),
      sessionStorage.setItem("inscode", inscode),
      checkLogin(callback);
  },
  post: function (url, data, callback, pageNo, pageSize) {
    var apipostmeta = function () {
      let ts = Math.floor(new Date().getTime() / 1000);
      let nonstr = ts.toString() + random().toString();
      let key = getSecretKey();
      let raw = nonstr + ts.toString() + key;
      let sign = md5(raw);
      let postdata = {
        Data: data,
        Sign: {
          TimeStamp: ts,
          Nonstr: nonstr,
          Sign: sign
        }
      };
      postdata.Pager = {
        PageNo: pageNo,
        PageSize: pageSize,
        ResetPageNo: false,
        RecordCount: 0
      };
      return {
        url: url,
        callback: callback,
        data: postdata
      };
    };
    checkLogin(e => {
      let token = gettoken();

      if (token == "") {
          if (localStorage.getItem("url") == null) {
            vue.$router.push("/")
            } else {
            vue.$router.push(localStorage.getItem("url").split("#")[1]);
            }
        return false;
      }
      let meta = apipostmeta();
      let postdata = meta.data;
      Vue.$api.post(url, postdata, x => {
        responseChcek(x, y => {
          if (y.Ret == 0) callback(x);
        }, meta);
      }, token);
    });
  },
  postWithPage: function (url, pageNo, pageSize, data, callback) {
    this.post(url, data, callback, pageNo, pageSize);
  },
  get: function (url, data, callback) {
    checkLogin(e => {
      Vue.$api.get(url, data, e => {
        responseChcek(e, callback);
      }, gettoken());
    });
  },
  gettokenName: function () {
    return "token" + store.state.uname;
  }
}

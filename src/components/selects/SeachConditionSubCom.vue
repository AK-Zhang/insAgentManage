<template>
  <div class="flex">
    <el-select v-model="AgentValue" placeholder="请选择" size="small" class="s_padding" @change="getUserList()">
      <el-option v-for="item in AgentList" :key="item.Code" :label="item.Name" :value="item.Code">
      </el-option>
    </el-select>
    <el-select v-model="UserValue" placeholder="请选择" filterable :filter-method="remoteMethod" clearable ref="chooseFilter" size="small" class="s_padding">
      <el-option v-for="item in displaylists" :key="item.Code" :label="item.Name" :value="item.Code">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      AgentList: [
        { Code: "", Name: "机构及代理全部子账户" },
        { Code: "AllAgent", Name: "代理全部客户" },
        { Code: "AllIns", Name: "机构直属客户" }
      ],
      UserList: [{ Code: "", Name: "全部子账户" }],
      cacheUserList: [],
      displaylists: [],
      AgentValue: "",
      UserValue: ""
    };
  },
  mounted() {
    this.getAgentList();
    this.getUserList();
  },
  methods: {
    //获取代理
    getAgentList() {
      this.$loginapi.post("/insbase/GetAgentCodeList", "", response => {
        if (response.Ret == 0) {
          response.Data.forEach(item => {
            this.AgentList.push({
              Code: item.Code,
              Name: item.Code + "(" + item.Name + ")"
            });
          });
          //this.AgentList = this.AgentList.concat(response.Data);
          this.AgentValue = this.AgentList[0].Code;
        } else {
          //this.$message.error(response.Msg);
          this.$alert(response.Msg, {});
        }
      });
    },
    //获取子级用户
    getUserList() {
      this.UserList = [{ Code: "", Name: "全部子账户" }];
      var url = "/insbase/GetInsUserCodeList";
      var postData = 0;
      if (this.AgentValue == "") {
        postData = {
          type: 0,
          AgentCode: ""
        };
      } else if (this.AgentValue == "AllIns") {
        postData = {
          type: 1,
          AgentCode: ""
        };
      } else if (this.AgentValue == "AllAgent") {
        postData = {
          type: 2,
          AgentCode: ""
        };
      } else {
        postData = {
          type: 3,
          AgentCode: this.AgentValue
        };
        // url = "/agent/QueryUsersByAgent";
        // postData = this.AgentValue;
      }

      //console.log(postData);

      this.$loginapi.post(url, postData, response => {
        if (response.Ret == 0) {
          this.UserList = this.UserList.concat(response.Data);
          this.cacheUserList = jQuery.extend([], this.UserList);
          this.displaylists = jQuery.extend([], this.UserList);
          this.UserValue = this.UserList[0].Code;
        } else {
          //this.$message.error(response.Msg);
          this.$alert(response.Msg, {});
        }
      });
    },
    remoteMethod(query) {
      console.log(this.UserValue);

      if (query !== "") {
        setTimeout(() => {
          this.displaylists = this.cacheUserList.filter(item => {
            return item.Code.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.displaylists = jQuery.extend([], this.UserList);
        this.UserValue = "";
      }
    }
  }
};
</script>

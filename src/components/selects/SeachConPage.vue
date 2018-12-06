<template>
  <div>
    <el-select v-model="AgentValue" placeholder="请选择" class="s_padding" @change="getUserList()" size="small">
      <el-option v-for="item in AgentList" :key="item.Code" :label="item.Name" :value="item.Code">
      </el-option>
    </el-select>
    <el-select v-model="UserValue" placeholder="请选择" class="s_padding middleselect" size="small">
      <el-option v-for="item in UserList" :key="item.Code" :label="item.Name" :value="item.Code">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import EnumConfig from "../../assets/js/EnumConfig.js";
export default {
  data() {
    return {
      AgentList: [
        { Code: "", Name: "全部" },
        { Code: "AllAgent", Name: "下级代理全部客户" },
        { Code: "AllDirectly", Name: "全部直属客户" }
      ],
      UserList: [{ Code: "", Name: "全部子账户" }],
      AgentValue: "",
      UserValue: ""
    };
  },
  filters: {
    GetPositionEffectType(type) {
      return EnumConfig.GetPositionEffectType(type);
    },
    GetDirection(type) {
      return EnumConfig.GetDirection(type);
    }
  },
  mounted() {
    this.getAgentList();
    this.getUserList();
  },
  methods: {
    //获取代理
    getAgentList() {
      this.$loginapi.post("/common/GetAgentCodeList", "", response => {
        if (response.Ret == 0) {
          response.Data.forEach(item => {
            this.AgentList.push({
              Code: item.Code,
              Name: item.Code + "(" + item.Name + ")"
            });
          });
          this.AgentValue = this.AgentList[0].Code;
        } else {
          this.$message.error(response.Msg);
        }
      });
    },
    //获取子级用户
    getUserList() {
      this.UserList = [{ Code: "", Name: "全部子账户" }];
      var url = "/common/GetInsUserCodeList";
      var postData = "";
      if (this.AgentValue == "") {
        postData = { AgentCode: "", type: 0 };
        } else if (this.AgentValue == "AllDirectly") {
        postData = { AgentCode: "", type: 1 };
      } else if (this.AgentValue == "AllAgent") {
        postData = { AgentCode: "", type: 2 };
      } else {
        postData = { AgentCode: this.AgentValue, type: 1 };
      }
      this.$loginapi.post(url, postData, response => {
        if (response.Ret == 0) {
          this.UserList = this.UserList.concat(response.Data);
          this.UserValue = this.UserList[0].Code;
        } else {
          this.$message.error(response.Msg);
        }
      });
    }
  }
};
</script>
<style>
  .middleselect{
    margin: 0 10px 0 5px;
  }
</style>

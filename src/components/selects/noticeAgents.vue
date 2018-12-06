<template>
  <div class="po">
    <el-table :data="noticeList" v-loading="loading" height="100%" style="width: 100%;" class="table_scroll">
      <el-table-column type="index" label="序号" width="100">
      </el-table-column>
      <el-table-column prop="CreateTime" label="日期" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.CreateTime | datefmt("YYYY-MM-DD")}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="CreateTime" label="时间" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.CreateTime | datefmt("HH:mm:ss")}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Title" label="标题" width="300">
      </el-table-column>
      <el-table-column prop="Content" label="内容" width="850" >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" size="small" class="buton" icon="el-icon-plus" v-show="false" @click="dialogFormVisible = true" style="margin-top:4px">新增</el-button>
    <el-dialog title="新增代理通知" :close-on-click-modal="false" class="alert_title alert_notice" :visible.sync="dialogFormVisible" @close="resetForm('notice')" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form :model="notice" :label-position="labelPosition" :rules="rules" ref="notice">
        <el-form-item label="指定客户：">
          <el-select v-model="notice.keyWords" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" @change="addItem" style="width:100%">
            <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知标题:" prop="title">
          <el-input v-model="notice.title" placeholder="请输入标题" clearable></el-input>
        </el-form-item>

        <el-form-item label="通知内容:" prop="content">
          <el-input v-model="notice.content" auto-complete="off" type="textarea" class="input_textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('notice')" size="small">取 消</el-button>
        <el-button type="primary" @click="sendNotice()" size="small">发送通知</el-button>
      </div>
    </el-dialog>
    <el-dialog title="通知详情" :visible.sync="dialogVisible1" append-to-body width="35%" top="13vh" center>
            <p style="border-bottom:1px solid #ccc"><span style="font-size: 16px;font-weight: 700;">标题:</span><span style="margin-left:30px;font-size: 16px;">{{obj.Title}}</span></p>
            <p style="font-size: 16px;font-weight: 700;margin-top:20px;">内容：</p>
            <p style="border:1px solid #ccc;padding:10px">{{obj.Content}}</p>
    </el-dialog>
    <div class="pagination_m text-center">
      <pagination :pagerPro="Pager" @ee="pageFn"></pagination>
    </div>
  </div>
</template>

<script>
import pagination from "../paging.vue";
export default {
  //系统通知
  name: "noticeAgents",
  components: {
    pagination
  },
  data() {
    var rulesTitle = (rule, value, callback) => {
      value.split("").forEach(item => {
        if (item == " ") {
          return callback(new Error("标题中不能含有空格字符"));
        }
      });
    };
    var rulesContent = (rule, value, callback) => {
      let val = value.split("");
      val.forEach(item => {
        if (val[0] == " ") {
          return callback(new Error("不能以空格开头"));
        }
      });
    };
    return {
      dialogVisible1: false,
       obj: {},
      loading: "",
      Pager: {
        PageNo: 1,
        PageSize: 10,
        RecordCount: 0
      },
      labelPosition: "top",
      noticeList: [],
      dialogFormVisible: false,
      notice: {
        title: "",
        content: "",
        keyWords: []
      },
      rules: {
        title: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { validator: rulesTitle, trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入通知内容", trigger: "blur" },
          { validator: rulesContent, trigger: "blur" }
        ]
      },
      options4: [],
      Lists: [],
      loading: false
    };
  },
  created() {
    this.$store.state.loaction = "/selects/noticeAgents";
  },
  mounted() {
    // this.list = this.states.map(item => {
    //   return { value: item, label: item };
    // });
    this.getNotices();
  },
  methods: {
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    getNotices() {
      this.loading = true;
      //var url = "/Notice/GetInsNoticeList"
      var url = "/Notice/GetAgentNoticeList";
      this.$loginapi.postWithPage(
        url,
        this.Pager.PageNo,
        this.Pager.PageSize,
        "",
        response => {
          this.loading = false;
          if (response.Ret == 0) {
            this.noticeList = response.Data;
            if (this.Pager.PageNo == 1) {
              this.Pager = response.Pager;
            }
          } else {
            this.$message.error(response.Msg);
          }
        }
      );
    },
    sendNotice() {
      if (this.notice.title == "" || this.notice.content == "") {
        this.$message.warning("标题和内容不能为空！");
        return;
      }
      this.loading = true;
      this.$loginapi.post(
        "/Notice/AddInsNotice",
        {
          Title: this.notice.title,
          Content: this.notice.content,
          SendType: 3,
          ReceiveType: 4,
          UserCodes: this.notice.keyWords
        },
        response => {
          this.loading = false;
          if (response.Ret == 0) {
            this.dialogFormVisible = false;
            this.$message.success(response.Msg);
            this.getNotices();
          } else {
            this.$message.error(response.Msg);
          }
        }
      );
    },
    //根据关键字查找子账户
    getUserID(query) {
      this.$loginapi.postWithPage(
        "/report/QueryAllUsersForNotice",
        1,
        30,
        {
          AgentCode: JSON.parse(sessionStorage.getItem("userInfo")).UserCode,
          QueryString: query
        },
        response => {
          if (response.Ret == 0) {
            this.Lists = response.Data.map(item => {
              return { value: item.UserCode, label: item.UserName };
            });
          } else {
            this.$message.error(response.Msg);
          }
        }
      );
    },
    handleClick(row) {
      this.dialogVisible1 = true;
      this.obj = row;
    },
    pageFn(size, PageNo) {
      this.Pager.PageSize = size;
      this.Pager.PageNo = PageNo;
      this.getNotices();
    },
    addItem(value) {
      this.notice.keyWords = value;
    },
    remoteMethod(query) {
      this.getUserID(query);
      if (query !== "") {
        setTimeout(() => {
          this.options4 = this.Lists;
        }, 200);
      } else {
        this.options4 = [];
      }
    }
  }
};
</script>

<style scoped>
</style>

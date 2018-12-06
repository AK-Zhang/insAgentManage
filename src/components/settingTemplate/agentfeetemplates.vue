<template>
  <div class="po">
    <el-button-group style="position: absolute;top:6px;right:20px;z-index:21110;">
      <el-button size="small" type="primary" @click="addClick()">新增</el-button>
      <el-button size="small" type="primary" @click="batchDel()">删除
      </el-button>
    </el-button-group>
    <template>
      <el-table :data="agentfeeTemplatesList" style="width: 100%;" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" v-loading="loading" max-height="660">
        <el-table-column label="序号" type="index">
        </el-table-column>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="模板名称" width="250">
          <template slot-scope="scope">
            <a @click="goInfo(scope.row)">{{scope.row.Name}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="Remark" label="模板说明" style="width:80%" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.Remark == null ? "--" : (scope.row.Remark == "" ? "--" : scope.row.Remark)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <el-button class="el-icon-caret-bottom el-icon--right opera_btn" type="primary" size="mini"></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="clearfix" @click.native="editClick(scope.row)">
                  编辑
                  <el-badge class="mark">
                  </el-badge>
                </el-dropdown-item>
                <el-dropdown-item class="clearfix" @click.native="delClick(scope.row)">
                  删除
                  <el-badge class="mark">
                  </el-badge>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗 -->
      <el-dialog title="新增代理手续费模板(单边)" :close-on-click-modal=false :visible.sync="dialogFormVisible" class="alert_title" @close="resetForm('agentfeeTemplate')" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-form :model="agentfeeTemplate" :rules="rules" ref="agentfeeTemplate" label-width="100px" class="demo-agentfeeTemplate" size="small" :label-position="labelPosition">
          <el-form-item label="代理手续费模板名称" prop="Name">
            <el-input v-model.trim="agentfeeTemplate.Name" ></el-input>
          </el-form-item>
          <el-form-item label="模板说明">
            <el-input type="textarea" v-model.trim="agentfeeTemplate.Remark"></el-input>
          </el-form-item>
        </el-form>
        <el-table :data="agentfeeTemplate.Details">
          <el-table-column property="CommodityNo" label="品种代码" width="80px"></el-table-column>
          <el-table-column property="CommodityName" label="品种名称" width="200px"></el-table-column>
          <el-table-column label="我的成本" width="80px">
            <template slot-scope="scope">
              <span>{{scope.row.MinFee}}</span>
            </template>
          </el-table-column>
          <el-table-column label="下级代理手续费">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Fee" size="mini"></el-input>
              <span class="by">{{scope.row.CurrencyName}}/手</span>
            </template>
          </el-table-column>
          <el-table-column label="设置范围" width="100px">
            <template slot-scope="scope">
              <span>{{scope.row.MinFee}}~{{scope.row.MaxFee}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('agentfeeTemplate')" size="small">取消</el-button>
          <el-button type="primary" @click="Save()" size="small">保存</el-button>
        </div>
      </el-dialog>
      <!-- 编辑弹窗 -->
      <el-dialog title="编辑代理手续费模板" :close-on-click-modal=false :visible.sync="editDialogFormVisible" class="alert_title" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-form :model="agentfeeTemplate" :rules="rules" ref="agentfeeTemplate" label-width="100px" class="demo-agentfeeTemplate" size="small" :label-position="labelPosition">
          <el-form-item label="代理手续费模板名称">
            <el-input v-model="agentfeeTemplate.Name"></el-input>
          </el-form-item>
          <el-form-item label="模板说明">
            <el-input type="textarea" v-model="agentfeeTemplate.Remark"></el-input>
          </el-form-item>
        </el-form>
        <el-table :data="agentfeeTemplate.Details">
          <el-table-column property="CommodityNo" label="品种代码" width="80px"></el-table-column>
          <el-table-column property="CommodityName" label="品种名称" width="200px"></el-table-column>
          <el-table-column label="我的成本" width="80px">
            <template slot-scope="scope">
              <span>{{scope.row.MinFee}}</span>
            </template>
          </el-table-column>
          <el-table-column label="下级代理手续费">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Fee" size="mini"></el-input>
              <span class="by">{{scope.row.CurrencyName}}/手</span>
            </template>
          </el-table-column>
          <el-table-column label="设置范围" width="100px" s>
            <template slot-scope="scope">
              <span>{{scope.row.MinFee}}~{{scope.row.MaxFee}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('agentfeeTemplate')" size="small">取消</el-button>
          <el-button type="primary" @click="Save()" size="small">保存</el-button>
        </div>
      </el-dialog>
      <div class="pagination_m text-center">
        <pagination :pagerPro="Pager" @ee="pageFn"></pagination>
      </div>
    </template>
  </div>
</template>

<script>
import pagination from "../paging.vue";

export default {
  // 代理手续费模板
  name: "agentfeetemplates",
  data() {
    return {
      loading: "",
      Pager: {
        PageNo: 1,
        PageSize: 10,
        RecordCount: 0
      },
      agentfeeTemplatesList: [],
      agentfeeTemplate: {
        Name: ""
      },
      labelPosition: "top",
      dialogFormVisible: false,
      editDialogFormVisible: false,
      rules: {
        Name: [
          {
            required: true,
            message: "必须填写代理手续费模板名称",
            trigger: "blur"
          }
        ]
      },
      checkdTemplatesList: []
    };
  },
  components: {
    pagination
  },
  created() {
    this.$store.state.loaction = "/templates/agentfeetemplates";
    this.getlist();
  },
  methods: {
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.editDialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    getlist() {
      this.loading = true;
      let url = "/template/QueryAgentFeeTemplates";
      this.$loginapi.postWithPage(
        url,
        this.Pager.PageNo,
        this.Pager.PageSize,
        "",
        response => {
          if (response.Ret == 0) {
            this.loading = false;
            this.agentfeeTemplatesList = response.Data;
            if (this.Pager.PageNo == 1) {
              this.Pager = response.Pager;
            }
          } else {
            this.$message.error(response.Msg);
          }
        }
      );
    },
    getGridDataList(tpcode) {
      let url = "/template/QueryInsAgentFeeTpDetail";
      this.$loginapi.post(url, tpcode, response => {
        if (response.Ret == 0) {
          this.agentfeeTemplate.Details = response.Data;
          if (tpcode == "") {
            this.dialogFormVisible = true;
          } else {
            this.editDialogFormVisible = true;
          }
        } else {
          this.$message.error(response.Msg);
        }
      });
    },
    addClick() {
      this.agentfeeTemplate = {
        Name: ""
      };
      this.getGridDataList("");
    },
    editClick(rowObj) {
      this.agentfeeTemplate = jQuery.extend({}, rowObj);
      this.getGridDataList(rowObj.TpCode);
    },
    //保存
    Save() {
      if (this.agentfeeTemplate.Name == "") {
        this.$message.error("请正确填写模板名称");
        return false;
      }
      this.loading = true;
      let url = "/template/AddOrUpdateFeeTemplate";
      this.agentfeeTemplate.Name = this.agentfeeTemplate.Name.replace(/\s+/g,'');
      if(this.agentfeeTemplate.Remark == "" || this.agentfeeTemplate.Remark == undefined){
        this.agentfeeTemplate.Remark = ""
      }else{
        this.agentfeeTemplate.Remark = this.agentfeeTemplate.Remark.replace(/\s+/g,'');
      } 
      this.$loginapi.post(url, this.agentfeeTemplate, response => {
        if (response.Ret == 0) {
          this.loading = false;
          this.$message.success("保存成功！");
          this.getlist();
          this.dialogFormVisible = false;
          this.editDialogFormVisible = false;
        } else {
          this.loading = false;
          this.$message.error(response.Msg);
        }
      });
    },
    //单个删除
    delClick(rowObj) {
      this.checkdTemplatesList.push(rowObj.TpCode);
      this.batchDel();
    },
    //批量删除
    batchDel() {
      if (this.checkdTemplatesList.length == 0) {
        this.$message.warning("请选择要删除的模板！");
        return;
      }

      this.$confirm("此操作将永久删除该模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          let url = "/template/DelFeeTemplate";
          this.$loginapi.post(url, this.checkdTemplatesList, response => {
            if (response.Ret == 0) {
              this.loading = false;
              this.getlist();
              this.checkdTemplatesList = [];
            } else {
              this.loading = false;
              this.$message.error(response.Msg);
            }
          });
        })
        .catch(() => {});
    },
    pageFn(size, pageNo) {
      this.Pager.PageSize = size;
      this.Pager.PageNo = pageNo;
      this.getlist();
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    //全选
    handleSelectionChange(val) {
      let arrCode = [];
      val.forEach(function(item) {
        arrCode.push(item.TpCode);
      });
      this.checkdTemplatesList = arrCode;
    },
    goInfo(obj) {
      let path = obj.TpCode.substring(3);
      this.$store.state.tpInfo = obj;
      sessionStorage.setItem("TpCode", obj.TpCode);
      this.$router.push("/templatesinfo/agentFeeTemplatesinfo/" + path);
    }
  }
};
</script>

<style scoped>
</style>

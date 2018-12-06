<template>
  <div>
    <div class="hello flex" v-if="this.ml">
      <div class="home-left">
        <div class="home-left-top flex">
          <div class="home-left-top-one">
            <div class="home-left-top-content">
              <h3 class="a-title">可用余额</h3>
              <div class="flex">
                <div class="home-left-top-capital">
                  <strong>{{currAgentInfo.CurrUsable}}</strong>
                  <span>{{currAgentInfo.CurrencyNo}}</span><br>
                  <span>累计佣金（{{currAgentInfo.TotalCommissionProfit}} {{currAgentInfo.CurrencyNo}}）</span>
                </div>
                <div class="home-left-top-option">
                  <el-button type="primary" size="small" @click="select()">查询</el-button>
                  <!-- 个人实名认证 -->
                  <el-button type="warning" size="small" id="personalAuth" @click="PersonalAuthDialogForm  = true">实名认证</el-button>
                  <!-- 组织实名认证 -->
                  <el-button type="warning" size="small" id="corpAuth" @click="CorpAuthDialogForm = true" v-show="false">实名认证</el-button>
                  <!-- 提现 -->
                  <el-button type="warning" size="small" id="goWithdraw" @click="withdrawMnoeyAlert()" v-show="false">提现</el-button>
                  <!--认证中 -->
                  <el-button type="warning" size="small" id="btnAuthing" v-show="false">认证中,请稍等</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="home-left-top-one">
            <div class="home-left-top-content">
              <h3 class="a-title">资金信息</h3>
              <div class="flex">
                <div class="home-left-top-capital">
                  <strong style="font-size:22px;color:#000">{{currAgentInfo.TotalDeposit}}</strong><br>
                  <span>总入金（{{currAgentInfo.CurrencyNo}}）</span>
                </div>
                <div class="home-left-top-capital">
                  <strong style="font-size:22px;color:#000">{{currAgentInfo.TotalWithdraw}}</strong><br>
                  <span>已提取（{{currAgentInfo.CurrencyNo}}）</span>
                </div>
                <div class="home-left-top-capital">
                  <strong style="font-size:22px;color:#000">{{currAgentInfo.FrozenMoney}}</strong><br>
                  <span>冻结资金（{{currAgentInfo.CurrencyNo}}）</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="home-left-bottom">
          <el-tabs v-model="activeName">
            <el-tab-pane label="最近开户" name="first">
              <el-table :data="accountList" style="width: 100%" v-loading="loading">
                <el-table-column type="index" label="序号">
                </el-table-column>
                <el-table-column prop="UserCode" label="客户代码">
                </el-table-column>
                <el-table-column prop="UserName" label="客户名称">
                </el-table-column>
                <el-table-column prop="FeeTemplateName" label="手续费模板">
                </el-table-column>
                <el-table-column prop="Phone" label="联系电话">
                  <template slot-scope="scope">
                    <span>{{scope.row.Phone == null ? "--" : (scope.row.Phone == "" ? "--" : scope.row.Phone)}}</span>
                    <el-button @click="viewprivacy(scope.row,scope)" type="text" v-show="scope.row.Phone == '******' ? true : false" size="small">查看</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="CreateDate" label="开户时间">
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="最近提现" name="second">
              <el-table :data="withdrawList" style="width: 100%" v-loading="loading">
                <el-table-column type="index" label="序号">
                </el-table-column>
                <el-table-column label="操作日期" prop="OptDate">
                </el-table-column>
                <el-table-column prop="OptTime" label="操作时间">
                </el-table-column>
                <el-table-column prop="TransferMoney" label="提取金额（美元）">
                </el-table-column>
                <el-table-column prop="Id" label="提取流水号">
                </el-table-column>
                <el-table-column prop="OrderState" label="状态">
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="最近佣金" name="third">
              <el-table :data="commissionList" style="width: 100%" v-loading="loading">
                <el-table-column type="index" label="序号">
                </el-table-column>
                <el-table-column prop="CreateDate" label="结算日期">
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
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="home-right">
        <div class="bind-card" v-show="!displayCard">
          <div class="bind-card-button" @click="showBindCardPage()">
            <div class="bind-card-button-in">
              +
            </div>
          </div>
          <p style="padding-top:23px;">新增银行卡</p>
        </div>
        <div class="bankCardInfo" v-show="displayCard">
          <h3>我的银行卡</h3>
          <div class="mine-info-list1">
            <div class="mcode square">
              所属银行：{{bankCard.BankName}}
            </div>
            <div class="mname square">
              银行账号：{{bankCard.ViewCardNO}}
            </div>
          </div>
        </div>
        <div style="height:calc(100% - 183px)">
          <div class="mine-info">
            <h3>我的信息</h3>
            <div class="mine-info-list">
              <div class="mcode square">
                账户代码：{{currAgentInfo.AgentCode}}
              </div>
              <div class="mname square">
                我的姓名：{{currAgentInfo.AgentName}}
              </div>
              <div class="mphone square">
                我的手机：
                <span style="color:#2399F1;cursor:pointer;" id="noPhone" @click="bindPhonePage = true"> 绑定 </span>
                <span style="color:#2399F1;cursor:pointer;" id="havePhone" v-show="false">{{currAgentInfo.BindPhone}}</span>
                <div style="color:#2399F1;cursor:pointer;padding-left:75px;" v-show="(currAgentInfo.BindPhone == '' ||currAgentInfo.BindPhone == null || currAgentInfo.BindPhone == undefined) ? false : true" @click="bindOldPhonePage = true">修改</div>
              </div>
            </div>
          </div>
          <div class="mine-2d-code">
            <h3>我的二维码</h3>
            <div class="mine-info-list flexwrap mine-info-list22">
              <input id="text" type="text" />
              <div id="qrcode" class="codeImg" style="position: relative;">
                <div id="codeico"></div>
              </div><br>
              <a href="javascript:;" class="copylink" @click="copyUrl()">复制链接</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hello flex" v-if="this.xx">
      <div class="home-left">
        <div class="home-left-top flex">
          <div class="home-left-top-one">
            <div class="home-left-top-content">
              <h3 class="a-title">
                <i class="iconfont icon-zijin "></i> 可用余额</h3>
              <div class="flex">
                <div class="home-left-top-capital">
                  <strong>{{currAgentInfo.CurrUsable}}</strong>
                  <span>{{currAgentInfo.CurrencyNo}}</span><br>
                  <span>总收入（{{currAgentInfo.TotalCommissionProfit}} {{currAgentInfo.CurrencyNo}}）</span>
                </div>
                <div class="home-left-top-option">
                  <el-button type="primary" size="small" class="onebtn" @click="select()" style="padding: 8px 15px;">查询</el-button>
                  <!-- 个人实名认证 -->
                  <el-button type="warning" size="small" class="twobtn" id="personalAuth" @click="PersonalAuthDialogForm  = true">实名认证</el-button>
                  <!-- 组织实名认证 -->
                  <el-button type="warning" size="small" class="twobtn" id="corpAuth" @click="CorpAuthDialogForm = true" v-show="false">实名认证</el-button>
                  <!-- 提现 -->
                  <el-button type="warning" size="small" class="twobtn" id="goWithdraw" @click="withdrawMnoeyAlert()" v-show="false">提现</el-button>
                  <!--认证中 -->
                  <el-button type="warning" size="small" class="twobtn" id="btnAuthing" v-show="false">认证中,请稍等</el-button>
                </div>
              </div>
            </div>
            <div class="home-left-top-content" style="position: absolute;bottom:0;width: 100%;">
              <h3 class="a-title">资金信息</h3>
              <div class="flex">
                <div class="home-left-top-capital">
                  <strong style="font-size:22px;color:#000">{{currAgentInfo.TotalDeposit}}</strong><br>
                  <span>总入金（{{currAgentInfo.CurrencyNo}}）</span>
                </div>
                <div class="home-left-top-capital">
                  <strong style="font-size:22px;color:#000">{{currAgentInfo.TotalWithdraw}}</strong><br>
                  <span>已提取（{{currAgentInfo.CurrencyNo}}）</span>
                </div>
                <div class="home-left-top-capital">
                  <strong style="font-size:22px;color:#000">{{currAgentInfo.FrozenMoney}}</strong><br>
                  <span>冻结资金（{{currAgentInfo.CurrencyNo}}）</span>
                </div>
              </div>
            </div>
          </div>
          <div class="home-left-top-two">
            <div class="bind-card rightline" v-show="!displayCard">
              <h3>
                <i class="iconfont icon-yinhangqia"></i> 新增银行卡</h3>
              <div class="bind-card-button" @click="showBindCardPage()">
                <div class="bind-card-button-in">
                  +
                </div>
              </div>

            </div>
            <div class="bankCardInfo rightline" v-show="displayCard">
              <div class="mine-info-box">
                <h3>
                  <i class="iconfont icon-yinhangqia"></i> 我的银行卡</h3>
                <div class="mine-info-list1 mine-info-boxinfo">
                  所属银行：{{bankCard.BankName}} </br>
                  银行账号：{{bankCard.ViewCardNO}}
                </div>
              </div>
            </div>

            <div class="mine-info rightline">
              <div class="mine-info-box">
                <h3>
                  <i class="iconfont icon-touxiang"></i> 我的信息</h3>
                <div class="mine-info-list mine-info-boxinfo ">
                  账户代码：{{currAgentInfo.AgentCode}} </br>
                  我的姓名：{{currAgentInfo.AgentName}} </br>
                  我的手机：
                  <span style="color: #4be4c5;cursor:pointer;" id="noPhone" @click="bindPhonePage = true"> 绑定 </span>
                  <span style="color: #4be4c5;cursor:pointer;" id="havePhone" v-show="false">{{currAgentInfo.BindPhone}}</span>
                  <div style="color: #4be4c5;cursor:pointer;padding-left:75px;" v-show="(currAgentInfo.BindPhone == '' ||currAgentInfo.BindPhone == null || currAgentInfo.BindPhone == undefined) ? false : true" @click="bindOldPhonePage = true">修改</div>
                </div>
              </div>

            </div>

            <div class="mine-2d-code">
              <h3 style="text-align:center">
                <i class="iconfont icon-zijinzhanghu"></i> 我的二维码</h3>
              <div class="mine-info-list flexwrap mine-info-list22">
                <input id="text" type="text" />
                <div id="qrcode" class="codeImg" style="position: relative;">
                  <div id="codeico"></div>
                </div><br>

                <a href="javascript:;" class="copylink" @click="copyUrl()">复制链接</a>
              </div>
            </div>

          </div>
        </div>
        <div class="home-left-bottom">
          <el-tabs v-model="activeName">
            <el-tab-pane label="最近三个月开户" name="first">
              <el-table :data="accountList" style="width: 100%" v-loading="loading">
                <el-table-column type="index" label="序号">
                </el-table-column>
                <el-table-column prop="UserCode" label="客户代码">
                </el-table-column>
                <el-table-column prop="UserName" label="客户名称">
                </el-table-column>
                <el-table-column prop="FeeTemplateName" label="手续费模板">
                </el-table-column>
                <el-table-column prop="Phone" label="联系电话">
                  <template slot-scope="scope">
                    <span>{{scope.row.Phone == null ? "--" : (scope.row.Phone == "" ? "--" : scope.row.Phone)}}</span>
                    <el-button @click="viewprivacy(scope.row,scope)" type="text" v-show="scope.row.Phone == '******' ? true : false" size="small">查看</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="CreateDate" label="开户时间">
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="最近三个月提现" name="second">
              <el-table :data="withdrawList" style="width: 100%" v-loading="loading">
                <el-table-column type="index" label="序号">
                </el-table-column>
                <el-table-column label="操作日期" prop="OptDate">
                </el-table-column>
                <el-table-column prop="OptTime" label="操作时间">
                </el-table-column>
                <el-table-column prop="TransferMoney" label="提取金额（美元）">
                </el-table-column>
                <el-table-column prop="Id" label="提取流水号">
                </el-table-column>
                <el-table-column prop="OrderState" label="状态">
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="最近三个月佣金" name="third">
              <el-table :data="commissionList" style="width: 100%" v-loading="loading">
                <el-table-column type="index" label="序号">
                </el-table-column>
                <el-table-column prop="CreateDate" label="结算日期">
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
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <!-- 实名认证弹窗 -->
    <el-dialog title="实名认证" :visible.sync="PersonalAuthDialogForm" :close-on-click-modal="false" class="alert_title alert_ttt" width="40%" style="overflow:hidden;" @close="resetFormimg('personalAuthForm')" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form :model="personalAuthForm" :rules="rulesPersonalinfo" ref="personalAuthForm" label-width="100px" class="demo-personalAuthForm" size="small">
        <el-form-item label="真实姓名：" prop="RealName">
          <el-input v-model.trim="personalAuthForm.RealName" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" prop="IDCardNo">
          <el-input type="text" v-model.trim="personalAuthForm.IDCardNo" placeholder="请输入身份证号码"></el-input>
        </el-form-item>
      </el-form>
      <div class="card_box" style="text-align:center;display:flex;overflow:hidden;margin-top:50px;">
        <div class="card_box_left" style="margin:0px auto;width:30%;height:180px;">
          <el-upload class="avatar-uploader uploadimg" action="" :show-file-list="false" :auto-upload="false" :on-change="changeFileFront">
            <img id="giftImgFront" v-if="personalAuthForm.IDCardFront" :src="personalAuthForm.IDCardFront" class="avatar">
            <el-button v-else slot="trigger" class="btn_card" size="small" type="primary" style="margin-top:70px;">身份证正面</el-button>
          </el-upload>
        </div>
        <div class="card_box_right" style="margin:0px auto;width:30%;height:180px;">
          <el-upload class="avatar-uploader uploadimg" action="" :show-file-list="false" :auto-upload="false" :on-change="changeFileBack">
            <img id="giftImgBack" v-if="personalAuthForm.IDCardBack" :src="personalAuthForm.IDCardBack" class="avatar">
            <el-button v-else slot="trigger" class="btn_card" size="small" type="primary" style="margin-top:70px;">手持身份证</el-button>
          </el-upload>
        </div>
        <div class="card_box_right" style="margin:0px auto;width:30%;height:180px;">
          <el-upload class="avatar-uploader uploadimg" action="" :show-file-list="false" :on-change="beforeUploadVideo">
            <video :src="personalAuthForm.Video" v-if="personalAuthForm.Video" controlslist="nodownload" controls="controls" width="100%" style="margin:0px auto;width:100%;height:180px;"></video>
            <el-button v-else slot="trigger" class="btn_card" size="small" type="primary" style="margin-top:70px;">视频认证</el-button>
          </el-upload>
        </div>
      </div>
      <p style="margin-left:10px;color:red;margin-top:10px;">* 视频认证,录制视频内容：“请自拍视频时阅读以下内容：本人XXX，申请实名认证”</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeimg()" size="small">取消</el-button>
        <el-button type="primary" @click="PersonalAuth('personalAuthForm')" size="small">保存</el-button>
      </div>
    </el-dialog>
    <!-- 解绑原始手机 -->
    <el-dialog title="验证原始号码" :close-on-click-modal="false" center :visible.sync="bindOldPhonePage" class="alert_title" @close="resetForm('bindPhoneForm')" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="border-radius: 5px;">
      <el-form :model="bindPhoneForm" :rules="rulesPersonalAuth" ref="bindPhoneForm" label-width="100px" class="demo-bindPhoneForm" size="small">
        <el-form-item label="手机号：">
          <el-input v-model="currAgentInfo.BindPhone" readonly="" placeholder="请输入手机号码" style="color:blue;"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="phoneCode" class="phone_code">
          <el-input type="text" v-model="bindPhoneForm.phoneCode" placeholder="请输入验证码"></el-input>
          <el-button size="small" type="primary" @click="sendCode(1)" :disabled="isDisabled" v-loading="loading">{{buttonName}}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindPhone(1)" size="small">提交验证</el-button>
      </div>
    </el-dialog>
    <!-- 手机号绑定弹窗 -->
    <el-dialog title="手机号绑定" :close-on-click-modal="false" center :visible.sync="bindPhonePage" class="alert_title" @close="resetForm('bindPhoneForm')" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="border-radius: 5px;">
      <el-form :model="bindPhoneForm" :rules="rulesPersonalAuth" ref="bindPhoneForm" label-width="100px" class="demo-bindPhoneForm" size="small">
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model="bindPhoneForm.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="phoneCode" class="phone_code">
          <el-input type="text" v-model="bindPhoneForm.phoneCode" placeholder="请输入验证码"></el-input>
          <el-button size="small" type="primary" @click="sendCode()" :disabled="isDisabled" v-loading="loading">{{buttonName}}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindPhone()" size="small">提交验证</el-button>
      </div>
    </el-dialog>
    <!-- 银行卡绑定弹窗 -->
    <el-dialog title="银行卡绑定" :close-on-click-modal="false" center :visible.sync="bindCardPage" class="alert_title" @close="resetForm('bindCardForm')" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="border-radius: 5px;">
      <el-form :model="bindCardForm" :rules="rules" ref="bindCardForm" label-width="100px" class="demo-bindCardForm" size="small">
        <el-form-item label="账户名称：" prop="BankAccountName">
          <el-input v-model.trim="bindCardForm.BankAccountName" placeholder="请输入与银行卡一致的真实姓名" ></el-input>
        </el-form-item>
        <el-form-item label="银行卡号：" prop="CardNO" class="phone_code">
          <el-input type="text" v-model.trim="bindCardForm.CardNO" placeholder="请输入银行卡号" ></el-input>
        </el-form-item>
        <el-form-item label="所属银行：" prop="BankName" class="phone_code" required>
          <el-select v-model="bindCardForm.BankName" class="bankname" clearable placeholder="请选择银行" style="width:100%;" @focus="GetBankName()" @change="PickBankName">
            <el-option v-for="item in banklists" :key="item.Code" :label="item.Name" :value="item.Code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省份：" prop="ProvinceName" class="phone_code" required>
          <el-select v-model="bindCardForm.ProvinceName" class="provinceName" clearable placeholder="请选择所属省份" style="width:100%;" @focus="GetProvArea()" @change="PickProvCode">
            <el-option v-for="item in ProvArealists" :key="item.Code" :label="item.Name" :value="item.Code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市/县：" prop="CityName" class="phone_code" required>
          <el-select v-model="bindCardForm.CityName" class="cityname" clearable placeholder="请选择所属市县" style="width:100%;" @change="PickCithCode">
            <el-option v-for="item in CityArealists" :key="item.Code" :label="item.Name" :value="item.Code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支行名称：" class="phone_code" required>
          <el-select v-model="bindCardForm.SubbranchName" class="subbranchname" clearable placeholder="请选择开户支行名称" style="width:100%;" @change="PickOrga">
            <el-option v-for="item in GetOrgaNamelists" :key="item.Code" :label="item.Name" :value="item.Code">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subSave('bindCardForm')" size="small">绑定</el-button>
      </div>
    </el-dialog>
    <!-- 提现窗口 -->
    <el-dialog title="提现申请" width="45%" :close-on-click-modal="false" center :visible.sync="WithdrawDialogForm" class="alert_title" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form :model="withdrawData" :rules="rulesCard" ref="withdrawData" label-width="100px" class="demo-bindCardForm" size="small">
        <el-form-item label="所属银行：">
          <el-input v-model="bankCard.BankName" class="bindPhone" disabled></el-input>
        </el-form-item>
        <el-form-item label="银行账号：">
          <el-input v-model="bankCard.ViewCardNO" class="bindPhone" disabled></el-input>
        </el-form-item>
        <el-form-item label="可提金额：">
          <el-input v-model="CrrryceUsable" class="bindPhone" disabled></el-input>
          <span style="position:absolute;top:0px;left:0px;">$</span>
        </el-form-item>
        <el-form-item label="提现金额：">
          <el-input v-model="withdrawData.Money" placeholder="请输入提现金额"></el-input>
          <span style="position:absolute;right:10px;top:0px;">美元</span>
        </el-form-item>
        <el-form-item label="绑定手机：">
          <el-input v-model="currAgentInfo.BindPhone" class="bindPhone" disabled></el-input>
        </el-form-item>
        <el-form-item label="验 证 码：" class="phone_code">
          <el-input type="number" v-model="withdrawData.VerifyCode" placeholder="请输入短信验证码"></el-input>
          <el-button size="mini" type="primary" @click=" sendCodeWithdraw()" :disabled="isDisabled">{{buttonName}}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="WithdrawDialogForm = false" size="small">取消</el-button>
        <el-button type="primary" @click="withdrawMnoey()" size="small">提交申请</el-button>
      </div>
    </el-dialog>
    <el-dialog title="验证码确认" :close-on-click-modal="false" center :visible.sync="ViewPrivacy" class="alert_title" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" width="30%" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form :model="ViewPrivacyData" :rules="rulesCard" ref="withdrawData" label-width="100px" class="demo-bindCardForm" size="small">

        <el-form-item label="验 证 码：" class="phone_code">
          <el-input type="number" v-model="withdrawData.VerifyCode" placeholder="请输入短信验证码"></el-input>
          <el-button size="mini" type="primary" @click=" sendCodeWithdraw()" :disabled="isDisabled">{{buttonName}}</el-button>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ViewPrivacy = false" size="small">取消</el-button>
        <el-button type="primary" @click="viewInfo(usercode,1,codeindex)" size="small">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "../assets/lib/jquery.min.js";
import "../assets/lib/jquery.qrcode.min.js";
export default {
  name: "home",
  data() {
    var reg = /^1[345678]\d{9}$/;
    var validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
        this.codephone = true;
      }
    };
    var regname = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
    var validName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("信息不能为空"));
      } else if (!regname.test(value)) {
        callback(new Error("请输入汉字"));
      } else {
        callback();
      }
    };
    var banknumber = /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/;
    var validbanknumber = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入银行卡号"));
      } else if (!banknumber.test(value)) {
        callback(new Error("请输入正确格式的银行卡号"));
      } else {
        callback();
      }
    };
    var codeidreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var validcodeid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入身份证号"));
      } else if (codeidreg.test(value) === false) {
        callback(new Error("请输入正确格式的身份证号"));
      } else {
        callback();
      }
    };
    return {
      Agentcode: "",
      ml: "",
      xx: false,
      loading: "",
      buttonName: "发送短信验证码",
      isDisabled: false,
      time: 60,
      codephone: false,
      currAgentInfo: {},
      activeName: "first",
      accountList: [],
      withdrawList: [],
      commissionList: [],
      PersonalAuthDialogForm: false,
      CorpAuthDialogForm: false,
      WithdrawDialogForm: false,
      bindPhonePage: false,
      bindOldPhonePage: false,
      bindCardPage: false,
      ViewPrivacy: false,
      ViewPrivacyData: {},
      userInfo: {},
      bindPhoneForm: {
        phone: "",
        phoneCode: ""
      },
      bindCardForm: {
        BankAccountName: "",
        BankName: "", //所选银行名称
        ProvinceName: "",
        CityName: "",
        SubbranchName: "",
        PaymNumb: "",
        CardNO: ""
      },
      banklists: [], //银行名称列表
      bankTypeId: "",
      rules: {
        //验证
        BankAccountName: [
          { min: 2, max: 12, message: "超过最大名称长度", trigger: "blur" },
          {
            required: true,
            min: 2,
            max: 5,
            validator: validName,
            trigger: "blur"
          }
        ],
        CardNO: [
          { required: true, validator: validbanknumber, trigger: "blur" }
        ]
      },
      ProvArealists: [], //省份列表
      ProvAreaCode: "",
      CityArealists: [],
      cityId: "",
      GetOrgaNamelists: [],

      personalAuthForm: {
        RealName: "",
        IDCardNo: "",
        IDCardFront: "",
        IDCardFrontExt: "",
        IDCardBack: "",
        IDCardBackExt: "",
        InsCode: "",
        InsUserCode: "",
        UserType: 3,
        ApplyDate: "",
        Video: "",
        VideoExt: ""
      },
      withdrawData: {
        Money: "",
        VerifyCode: "",
        ClientKey: "",
        VerifyCodeKey: ""
      },
      rulesBindPhone: {},
      rulesPersonalAuth: {
        phone: [
          { required: true, trigger: "blur", validator: validPhone } //这里需要用到全局变量
        ]
      },
      rulesPersonalinfo: {
        RealName: [{ required: true, validator: validName, trigger: "blur" }],
        IDCardNo: [{ required: true, validator: validcodeid, trigger: "blur" }]
      },
      rulesCard: {},
      currDate: "",
      YearsAgo: "",
      displayCard: false,
      bankCard: {},
      usercode: "",
      codeindex: 0,
      CrrryceUsable: "" //当前可用资金
    };
  },
  created() {
    this.$store.state.loaction = "/home";
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  },
  mounted() {
    this.currDate = new Date();
    let Year = this.currDate.getFullYear();
    let currMonth = this.currDate.getMonth() - 2;
    let currDate = this.currDate.getDate();
    this.YearsAgo = Year + "-" + currMonth + "-" + currDate;
    if (this.$Agentcode == "ml") {
      this.ml = true;
      this.xx = false;
    } else {
      this.xx = true;
      this.ml = false;
    }
    this.getAgentInfo();
    this.getAccountList();
    this.getWithdrawList();
    this.getCommissionList();
    this.getBankCard();
  },
  methods: {
    viewprivacy(row, obj) {
      this.ViewPrivacy = true;
      this.usercode = row.UserCode;
      this.codeindex = obj.$index;
    },
    viewInfo(usercode, type, index) {
      if (this.withdrawData.VerifyCode == "") {
        this.$message.error("请输入短信验证码！");
        return;
      }
      let url = "/userprivacyauth/VerifyAuthInfo";
      let postData = {
        UserCode: usercode,
        Type: type,
        Phone: this.currAgentInfo.AccountPhone,
        Code: this.withdrawData.VerifyCode
      };
      //console.log(postData);
      this.$loginapi.post(url, postData, response => {
        if (response.Ret == 0) {
          this.accountList[index].Phone = response.Data.Phone;
          this.ViewPrivacy = false;
        } else {
          if (response.Msg == "无效的token" || response.Msg == "缺少token") {
            this.$router.push("/");
            return;
          }
          this.$message.error(response.Msg);
        }
      });
    },

    // 取消清空图片
    closeimg() {
      this.PersonalAuthDialogForm = false;
      this.personalAuthForm.IDCardFront = "";
      this.personalAuthForm.IDCardBack = "";
    },
    // 清空实名认证
    resetFormimg(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
      this.personalAuthForm.IDCardFront = "";
      this.personalAuthForm.IDCardBack = "";
    },
    // 清空验证
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    // 短信验证倒计时
    sendMsg() {
      let me = this;
      me.isDisabled = true;
      let interval = window.setInterval(function() {
        me.buttonName = "（" + me.time + "秒）重新发送";
        --me.time;
        if (me.time < 0) {
          me.buttonName = "发送短信验证码";
          me.time = 60;
          me.isDisabled = false;
          window.clearInterval(interval);
        }
      }, 1000);
    },
    //查询
    select() {
      this.$router.push("/selects/accountreports");
    },
    //获取当前代理人手机号码及认证信息
    getAgentInfo() {
      let url = "/subagent/GetAgentInfo";
      this.$loginapi.post(url, this.userInfo.UserCode, response => {
        if (response.Msg == "无效token" || response.Msg == "缺少token") {
          this.$router.push("/");
        }
        if (response.Ret == 0) {
          if (!response.Data.Balance) {
            //账户余额
            response.Data.Balance = 0;
          }
          if (!response.Data.TotalDeposit) {
            //总收入
            response.Data.TotalDeposit = 0;
          }
          if (!response.Data.TotalWithdraw) {
            //已提取
            response.Data.TotalWithdraw = 0;
          }
          if (!response.Data.FrozenMoney) {
            //冻结资金
            response.Data.FrozenMoney = 0;
          }
          if (!response.Data.CurrencyNo) {
            //资金单位
            response.Data.CurrencyNo = "美元";
          }
          if (!response.Data.PromoteQrcode) {
            //推广二维码
            response.Data.PromoteQrcode = "";
          }
          if (!response.Data.IsAuthed) {
            // 是否实名认证
            response.Data.IsAuthed = 0;
          }

          this.currAgentInfo = response.Data;
          if (
            this.currAgentInfo.BindPhone != null &&
            this.currAgentInfo.BindPhone != ""
          ) {
            $("#noPhone").hide();
            $("#havePhone").show();
          }

          this.getAgentAuthState();
          this.getBalanceInfo();
          this.getAgentPromoteQrcode();
        } else {
          if (response.Msg == "无效的token" || response.Msg == "缺少token") {
            this.$router.push("/");
            return;
          }
          this.$message.error(response.Msg);
        }
      });
    },
    getAgentAuthState() {
      let urlAuth = "/RealNameAuth/IsAuthed";
      this.$loginapi.post(urlAuth, "", response => {
        if (response.Ret == 0) {
          this.currAgentInfo.IsAuthed = response.Data.Result;
          if (this.currAgentInfo.IsAuthed == 0) {
            //未认证
            $("#goWithdraw").hide();
            //根据用户性质判断是个人还是组织认证
            if (this.currAgentInfo.Property == 0) {
              //个人认证
              $("#personalAuth").show();
              $("#corpAuth").hide();
            } else if (this.currAgentInfo.Property == 1) {
              //组织认证
              $("#personalAuth").hide();
              $("#corpAuth").show();
            }
          } else if (this.currAgentInfo.IsAuthed == 1) {
            //已认证
            $("#goWithdraw").show();
            $("#personalAuth").hide();
            $("#corpAuth").hide();
          } else if (this.currAgentInfo.IsAuthed == 2) {
            //正在认证
            $("#goWithdraw").hide();
            $("#personalAuth").hide();
            $("#corpAuth").hide();
            $("#btnAuthing").show();
          } else if (this.currAgentInfo.IsAuthed == 3) {
            //认证失败
            $("#goWithdraw").hide();
            //根据用户性质判断是个人还是组织认证
            if (this.currAgentInfo.Property == 0) {
              //个人认证
              $("#personalAuth").show();
              $("#personalAuth").val("认证失败,重新认证!");
              $("#corpAuth").hide();
            } else if (this.currAgentInfo.Property == 1) {
              //组织认证
              $("#personalAuth").hide();
              $("#corpAuth").show();
              $("#corpAuth").val("认证失败,重新认证!");
            }
          }
        } else {
          if (response.Msg == "无效的token" || response.Msg == "缺少token") {
            this.$router.push("/");
            return;
          }
          this.$message.error(response.Msg);
        }
      });
    },
    //获取当前登录代理的部分信息
    getBalanceInfo() {
      let url = "/Account/GetBalance";
      this.$loginapi.post(url, "", response => {
        if (response.Ret == 0) {
          this.currAgentInfo.TotalCommissionProfit =
            response.Data.TotalCommissionProfit;
          this.currAgentInfo.CurrUsable = response.Data.CurrUsable;
          this.CrrryceUsable = this.currAgentInfo.CurrUsable;
          this.currAgentInfo.TotalDeposit = response.Data.TotalDeposit;
          this.currAgentInfo.TotalWithdraw = response.Data.TotalWithdraw;
          this.currAgentInfo.FrozenMoney = response.Data.FrozenMoney;
        } else {
          if (response.Msg == "无效的token" || response.Msg == "缺少token") {
            this.$router.push("/");
            return;
          }
          this.$message.error(response.Msg);
        }
      });
    },
    //获取当前代理人推广链接
    getAgentPromoteQrcode() {
      let PromoteLinkPara =
        "?insCode=" +
        this.userInfo.InsCode +
        "&agentId=" +
        this.userInfo.UserCode;

      this.currAgentInfo.PromoteQrcode =
        window.location.host + "/#/iphonregister" + PromoteLinkPara;
      if (this.currAgentInfo.PromoteQrcode.indexOf("http://") == -1) {
        this.currAgentInfo.PromoteQrcode =
          "http://" + this.currAgentInfo.PromoteQrcode;
      }
      $("#qrcode").qrcode(this.currAgentInfo.PromoteQrcode);
      $("#text").val(this.currAgentInfo.PromoteQrcode);
      this.currAgentInfo.InsCode = sessionStorage.getItem("inscode").toLowerCase();
      if (this.currAgentInfo.InsCode == "ml1" || this.currAgentInfo.InsCode == "ml") {
        $("#codeico").css(
          "background-image",
          "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM1RUIwNkQ5OUY2NDExRTg5RURCQzQ4NzZBMzc0M0FGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM1RUIwNkRBOUY2NDExRTg5RURCQzQ4NzZBMzc0M0FGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzVFQjA2RDc5RjY0MTFFODlFREJDNDg3NkEzNzQzQUYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzVFQjA2RDg5RjY0MTFFODlFREJDNDg3NkEzNzQzQUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz46JyDbAAAD9klEQVR42pyXe0yOURzH316RMvdFKfe7hbII5TKX3Cn3+5gZXpeJzdBs2NwNmwkbIm1i+UO5FjNpqJTm0mKlXBsbSZRY+P6277Odnb3P+7z12z47z+U853uu33Mej5Jjg2xuRD+wAPQGm0Ch8aKTI8tWn/C0eD8E7AYjQTHT94YmiCyNCwtFGgC8QTl4Du6CDFTqr1nBHiYtbgwOAofkAV/AYFAEJoHNIMKi0qVgO0hABf7pL+1OPvAF98FqispH80EJOA6uuiFq9MhZcAu94mslLBnugVDlWQJIAyfBSi2/VOoKWAT6g25gAjgKvjPPWJAJ8QCzrm4I7oBhvJexCiLtwQ1N9AVYiG7Md9rPcWH+SM5RWOKJ9BTyV+ktjlVEpauTwUsKrNPKzQVhIN+0nx1ZZWz9RT4KAfv0ru4KtvL6I4gGw8FTPgvVyt0AfloOsiOrFslikMNHq9ETIapwLLtaYhVncUdQxWc+WpmF7q5XiP9GsgTUcrJuM4Rb0RwkHoAUXtdwbCWeaeWF18UsIF6A5AJvp6LVfiIcBRrx4VEl/2MKtAan+Kyc6V7QvI5mZZTRAEwT5xrNB9Il15SMZzg+J8A8sJQtf0en2kX7rEILpAHjxLHQul8mwplcYs1EUz4IVqZ7pZLxHmfkTJAEloOBoLvUGLQF+yF6CekbMNuFqDHR8ngbZOeMtnHp6CFi2WAGeEQjyWOLZ9LdZoFAWYKoRBOL7i5i2lGEvbTxU0N6IBJcZxdtUSrqzCJfQXyuC2FjCfrY3dipKsBkEMOKeJjkE/tsJ7MX4knAx0keu3pRwevWLmoqhR7h+BaY5PmjXM+RiQZxfeb7GY3x5K4TTJO3ik9gAPgAHnJ4WnLL7KHMWgnZBOLBdO1AIVFsp+9K9AJtLIQb0WA6cFIlgr7gNfjB2a9GNFodzk1DzKgnn+eI8E1jp+J6dRXGWjdOFhlgDCsiVrvMyTcTmaplp4lwKr1ZYq3i2e7aoRyF1iiuZFPWq4QXWuul5PkmlbfTkw8ou5SjHme3bOU6Sau8bKvrFd8/gcrWGNP7MJ1LYg/oU0fhkUyl9Zc57jaOu0zeHbz/YjTSroxdFD/05jgGuqPI89Q+Csgut195nchTiGFSMWjtV/0E8pZLIJ0udJ/HHlcRzkqKp08Bx0Bnvqump3fg/WmInjc77JXRIiPpzcl0LN3VpAUjuJdH8AiUoVVUes6f16n63DGzyXRiU/ZqNWq4e40Ct5WzmrOQI+4KnkTc/pMwxl/NP5SHuGjFEJyFuNpGCMbX5xdGogX/HIZxtja1yC8bSRw4BNHP9f13Mhb8TjrQeHp1F+XoU8n/qlwOTwoEq60K/S/AACsPDvKuOomIAAAAAElFTkSuQmCC)"
        );
      }else if(this.currAgentInfo.InsCode == "zz"){
        $("#codeico").css(
          "background-image",
          "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADZElEQVRIia3XX4iUVRjH8c+7rlpmJqVelGKZQ9LURc1aELVskGt/QMvKC0NZmQvtJmpk6sIKzNqkpbkp6qaXmYos0y6KlNCCMQhC2ix0umhcqVi7iKCslFZdp4v3HZl2x50/uz94b8553vM973mf8zvPCTShvrC0AI9gBbpwDYKakGEMYj/2FNLJ3xqNGUzU2ReWluB5rMP0ZiaJs3gf2wrp5PGWwH1haRqeiaEzmwSO1Rm8gB2FdHJ0bGdnHegcfIiVbQKrmoEXsQibJwT3haUrRP/ptklCqxqK4eN0ARwv764phB7D3YV0crhSzkzD43gjSOTOQ0dN4NMmv7xVfYc7YugM7MRrorxBnFx9Yel6lLSfSLU6iNWFdPJkpZy5Eh/jzrhvBMkgkRuqfvFzUwR9F70x9CYcqoGKGc9C0BeW5uFXze/Ti2mbaO9WKuXMGryN2XXizmJhJx6dJPQU0oV0clelnJmZL2dewRMTxE/Hw53onQR0CA8W0smjlXJmqWhX3NrEeys6cEub0E/Rle8OS5VyZrMok5uBwvIOLG4ROIInsSrfHV6KvXgTl7UwxsJxltlAJazLd4dHsBGvYm6LY+D/BtJIr4uW9jS+QNgulDqHRB0dQzrfHX6NLaIT65J2gfgFb3WIDvF6GsF23JzvDmeJlrm/TWhFlAursCRI5LZ3iiqHhWMCP8GWfHc4Ktoiq9qAwQ/4AO8EidzP1caegcFpnfgcq+O2b2PgYZGhP6X1LzwuOs93BonckRrY7JizAXs646AN6H+p66N9V8/6cxN2Y16ToFF8hX3YGyRyR2tgi0R12kMio5ohssz1AVTKmQBrsANLG4DO4zC+jJ+DQSL3Rwyai7tiWC9uqPN+oZhNbayCF+PHeEa1Ohu3fy9ypkF8EyRyf/UMDM7BMizH7aICoh6oViNIFrOpoQvFXqWcWS9ysRM4cfrc9J82Fe89NfzPnPm4tuZZhhtFtVSr2lrMpvoZU2X2DAy+jLW4HFdpzWAaaT/uL2ZTo+oM3I/fMX+KoYewtgodBy5mU3/jHnw2hdAD6C1mUydrG8d9VQx/AFvx7ySAZ0Rlzn1joTS4wvQMDF4n8ubHNF+lnMN72F7MpoYuFjQhuGYCC0QmsFJ0aRub0dVL2wHsLmZTDS9t/wFvxf6fsDfGSwAAAABJRU5ErkJggg==)"
        );
      }
    },
    //最近开户
    getAccountList() {
      this.loading = true;
      let url = "/mycustomer/QueryMyCustomers";
      let postData = {
        UserCode: "",
        MoneyTransSource: 0,
        BeginDate: this.YearsAgo,
        EndDate: this.currDate
      };

      this.$loginapi.postWithPage(url, 1, 10, postData, response => {
        if (response.Ret == 0) {
          this.loading = false;
          this.accountList = response.Data;
        } else {
          this.loading = false;
          if (response.Msg == "无效的token" || response.Msg == "缺少token") {
            this.$router.push("/");
            // console.log("无效的token");
            return;
          }
          this.$message.error(response.Msg);
        }
      });
    },
    //最近提现
    getWithdrawList() {
      this.loading = true;
      let url = "/report/QueryAgentHistoryMoneyTransfer";
      let postData = {
        State: 0,
        BeginDate: this.YearsAgo,
        EndDate: this.currDate
      };
      this.$loginapi.postWithPage(url, 1, 10, postData, response => {
        if (response.Ret == 0) {
          this.loading = false;
          this.withdrawList = response.Data;
          $.each(this.withdrawList, function(i, n) {
            // alert("索引"+i+"对应的值"+n);
            let YMD = n.OptDate.split("/");
            YMD = YMD[2] + "-" + YMD[0] + "-" + YMD[1];
            n.OptDate = YMD;
          });
        } else {
          this.loading = false;
          if (response.Msg == "无效的token" || response.Msg == "缺少token") {
            this.$router.push("/");
            return;
          }
          this.$message.error(response.Msg);
        }
      });
    },
    //最近佣金
    getCommissionList() {
      this.loading = true;
      let url = "/report/QryAgentDayCommissionHistory";
      let postData = {
        BeginDate: this.YearsAgo,
        EndDate: this.currDate
      };

      this.$loginapi.postWithPage(url, 1, 10, postData, response => {
        if (response.Ret == 0) {
          this.loading = false;
          this.commissionList = response.Data.Records;
        } else {
          this.loading = false;
          if (response.Msg == "无效的token" || response.Msg == "缺少token") {
            this.$router.push("/");
            return;
          }
          this.$message.error(response.Msg);
        }
      });
    },
    //复制链接
    copyUrl() {
      var Url = document.getElementById("text");
      Url.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message("已复制，可贴粘。");
    },
    //获取验证码
    sendCode(number) {
      if (number == 1) {
        this.codephone = true;
      }
      if (this.codephone == true) {
        this.loading = true;
        let url = "/common/SendVerifyCodeToPhone";
        let Phone = this.bindPhoneForm.phone;
        if (number == 1) {
          Phone = this.currAgentInfo.BindPhone;
        }
        //console.log(Phone);
        this.$loginapi.post(url, Phone, response => {
          if (response.Ret == 0) {
            this.loading = false;
            this.$message.success("验证码已发送，请注意查收!");
            this.sendMsg();
            this.codephone = false;
          } else {
            this.loading = false;
            this.$message.error(response.Msg);
          }
        });
      } else {
        this.$message.error("手机号输入有误！");
      }
    },
    sendCodeWithdraw() {
      if (
        this.currAgentInfo.BindPhone == "" ||
        this.currAgentInfo.BindPhone == null ||
        this.currAgentInfo.BindPhone.length < 11
      ) {
        this.$alert("手机号格式不正确！");
        return;
      }
      let url = "/common/SendVerifyCodeToPhone";
      this.$loginapi.post(url, this.currAgentInfo.BindPhone, response => {
        if (response.Ret == 0) {
          this.sendMsg();
          this.$message.success("验证码已发送，请注意查收!");
        } else {
          this.$message.error(response.Msg);
        }
      });
    },

    //绑定手机号
    bindPhone(number) {
      this.loading = true;
      let url = "/Account/BindPhone";

      let postData = {
        Phone: this.bindPhoneForm.phone,
        Code: this.bindPhoneForm.phoneCode
      };
      if (number == 1) {
        postData = {
          Phone: this.currAgentInfo.BindPhone,
          Code: this.bindPhoneForm.phoneCode
        };
      }
      this.$loginapi.post(url, postData, response => {
        if (response.Ret == 0) {
          this.loading = false;
          if (number == 1) {
            this.$message.success("手机号码验证成功!");
            this.bindPhonePage = true;
            this.bindOldPhonePage = false;
            return;
          }
          this.$message.success("手机号码绑定成功!");
          this.currAgentInfo.BindPhone = this.bindPhoneForm.BindPhone;
          this.bindPhonePage = false;
          $("#noPhone").hide();
          $("#havePhone").show();
          this.getAgentInfo();
        } else {
          this.loading = false;
          this.$message.error(response.Msg);
        }
      });
    },
    //打开绑定银行卡页面
    showBindCardPage() {
      if (
        this.currAgentInfo.BindPhone == null ||
        this.currAgentInfo.BindPhone == ""
      ) {
        this.$message.warning("手机号码未绑定，请先绑定手机号码！");
        return;
      }
      this.bindCardPage = true;
    },

    //删除银行卡
    UnBindBankCard() {
      let url = "/Account/UnBindBankCard";
      let postData = [];
      this.$loginapi.post(url, postData, response => {
        if (response.Ret == 0) {
          this.$message.success("银行卡已解除绑定");
        } else {
          this.$message.error(response.Msg);
        }
      });
    },
    // 提现
    withdrawMnoeyAlert() {
      if (!this.displayCard) {
        this.$message.warning("尚未绑定银行卡，请先绑定银行卡！");
        return;
      }
      this.WithdrawDialogForm = true;
    },
    withdrawMnoey() {
      if (this.withdrawData.Money == "") {
        this.$message.error("请输入提现金额");
        return;
      }
      if (isNaN(this.withdrawData.Money)) {
        this.withdrawData.Money = "";
        this.$message.error("请输入一个正确的金额");
        return;
      }
      if (this.withdrawData.Money != "") {
        //检查小数点后是否对于两位http://blog.csdn.net/shanzhizi
        if (
          this.withdrawData.Money.toString().split(".").length > 1 &&
          this.withdrawData.Money.toString().split(".")[1].length > 2
        ) {
          this.$message.error("输入金额最多两位小数");
          this.withdrawData.Money = "";
          return;
        }
      }
      this.loading = true;
      let url = "/Account/Withdraw";
      let postData = {
        Money: this.withdrawData.Money,
        VerifyCode: this.withdrawData.VerifyCode,
        ClientKey: "",
        VerifyCodeKey: this.currAgentInfo.BindPhone
      };
      let money = this.withdrawData.Money;
      this.$loginapi.post(url, postData, response => {
        this.loading = false;
        if (response.Ret == 0) {
          this.withdrawData.Money = "";
          this.withdrawData.VerifyCode = "";
          this.$message.success(response.Msg);
          this.WithdrawDialogForm = false;
          let _this = this;
          let timeshuaxun = setInterval(function() {
            _this.getBalanceInfo();
            _this.getWithdrawList();
            if (_this.withdrawData.Money < money) {
              clearInterval(timeshuaxun);
            }
          }, 1000);
        } else {
          this.$message.error(response.Msg);
        }
      });
    },
    changeFileFront(file, fileList) {
      let isJPG = file.raw.type === "image/jpeg";
      let isPNG = file.raw.type === "image/png";
      let isBMP = file.raw.type === "image/bmp";
      let isLt2M = file.raw.size / 1024 / 1024 < 1;

      this.personalAuthForm.IDCardFrontExt = file.raw.type;

      if (!isJPG && !isPNG && !isBMP) {
        this.$message.warning("上传图片必须是JPG/PNG/BMP 格式!");
        return;
      }
      if (!isLt2M) {
        this.$message.warning("上传图片大小不能超过 1MB!");
        return;
      }

      let This = this;
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function(e) {
        //this.result; // 这个就是base64编码了
        This.personalAuthForm.IDCardFront = this.result;
      };
    },
    changeFileBack(file, fileList) {
      let isJPG = file.raw.type === "image/jpeg";
      let isPNG = file.raw.type === "image/png";
      let isBMP = file.raw.type === "image/bmp";
      let isLt2M = file.raw.size / 1024 / 1024 < 1;

      this.personalAuthForm.IDCardBackExt = file.raw.type;

      if (!isJPG && !isPNG && !isBMP) {
        this.$message.warning("上传图片必须是JPG/PNG/BMP 格式!");
        return;
      }
      if (!isLt2M) {
        this.$message.warning("上传图片大小不能超过 1MB!");
        return;
      }

      let This = this;
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function(e) {
        //this.result;这个就是base64编码了
        This.personalAuthForm.IDCardBack = this.result;
      };
    },
    // 视频上传
    beforeUploadVideo(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      this.personalAuthForm.VideoExt = file.raw.type;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb"
        ].indexOf(file.raw.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过10MB哦!");
        return false;
      }
      let This = this;
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function(e) {
        //this.result;这个就是base64编码了
        This.personalAuthForm.Video = this.result;
      };
    },
    handleAvatarSuccess(res, file) {
      this.video = true;
      this.videourl = file.url;
    },
    PersonalAuth(formName) {
      let userInfo = this.userInfo;
      this.$refs[formName].validate(valid => {
        if (valid) {
          //个人验证
          let url = "/RealNameAuth/SubmitInfoForMan";
          if (this.personalAuthForm.IDCardFront == "") {
            this.$message.error("身份证正面不能为空");
            return false;
          } else if (this.personalAuthForm.IDCardFront.length < 20) {
            this.$message.error("上传图片失败，请刷新后重新上传!");
            return false;
          } else if (this.personalAuthForm.IDCardBack == "") {
            this.$message.error("手持身份证照片不能为空");
            return false;
          } else if (this.personalAuthForm.IDCardBack.length < 20) {
            this.$message.error("上传图片失败，请刷新后重新上传!");
            return false;
          } else if (this.personalAuthForm.Video == "") {
            this.$message.error("认证视频不能为空");
            return false;
          } else if (this.personalAuthForm.Video.length < 20) {
            this.$message.error("上传视频失败，请刷新后重新上传!");
            return false;
          }
          this.loading = true;
          let postData = {
            RealName: this.personalAuthForm.RealName.replace(/\s+/g,''),
            IDCardNo: this.personalAuthForm.IDCardNo.replace(/\s+/g,''),
            IDCardFront: this.personalAuthForm.IDCardFront.substring(
              this.personalAuthForm.IDCardFront.indexOf(",") + 1
            ),
            IDCardFrontExt: this.personalAuthForm.IDCardFrontExt,
            IDCardBack: this.personalAuthForm.IDCardBack.substring(
              this.personalAuthForm.IDCardBack.indexOf(",") + 1
            ),
            IDCardBackExt: this.personalAuthForm.IDCardBackExt,
            InsCode: userInfo.InsCode,
            InsUserCode: userInfo.UserCode,
            UserType: userInfo.UserType,
            ApplyDate: new Date(),
            Video: this.personalAuthForm.Video.substring(
              this.personalAuthForm.Video.indexOf(",") + 1
            ),
            VideoExt: this.personalAuthForm.VideoExt
          };
          this.$loginapi.post(url, postData, response => {
            this.loading = false;
            if (response.Ret == 0) {
              this.$message.success("认证信息已提交,请等待审核!");
              this.PersonalAuthDialogForm = false;
            } else {
              this.$message.error(response.Msg);
            }
          });
        } else {
          this.$message.warning("请按照提示完善信息！");
          return false;
        }
      });
    },
    getBankCard() {
      let url = "/Account/QueryBankCards";
      this.$loginapi.post(url, "", response => {
        if (response.Ret == 0) {
          if (response.Data.length > 0) {
            this.bankCard = response.Data[0];
            this.displayCard = true;
          }
        } else {
          this.$message.error(response.Msg);
        }
      });
    },
    // 获取银行名称
    GetBankName() {
      let url = "/openinsuser/GetBankName";
      this.$loginapi.post(url, "", response => {
        if (response.Ret == 0) {
          if (response.Data.length > 0) {
            this.banklists = response.Data;
          }
        } else {
          this.$message.error(response.Msg);
        }
      });
    },
    PickBankName(value) {
      this.bankTypeId = value;
      this.ProvArealists = null;
      this.bindCardForm.ProvinceName = null;
      this.CityArealists = null;
      this.bindCardForm.CityName = null;
      this.GetOrgaNamelists = null;
      this.bindCardForm.SubbranchName = null;
    },
    GetProvArea() {
      let url = "/openinsuser/GetProvArea";
      this.$loginapi.post(url, "", response => {
        if (response.Ret == 0) {
          if (response.Data.length > 0) {
            this.ProvArealists = response.Data;
          }
        } else {
          this.$message.error(response.Msg);
        }
      });
    },
    PickProvCode(value) {
      this.ProvAreaCode = value;
      this.CityArealists = null;
      this.bindCardForm.CityName = null;
      this.GetOrgaNamelists = null;
      this.bindCardForm.SubbranchName = null;
      this.GetCityArea(value);
    },
    GetCityArea(value) {
      if (value == "" || value == null) {
        return;
      }
      let url = "openinsuser/GetCityArea/";
      let postData = "provId=" + value;
      this.$indexapi.post(url, postData, res => {
        if (res.Ret == 0) {
          this.CityArealists = res.Data;
        } else {
          this.$message.error(res.Msg);
        }
      });
    },
    PickCithCode(value) {
      this.cityId = value;
      this.GetOrgaNamelists = null;
      this.bindCardForm.SubbranchName = null;
      this.GetOrgaName(value);
    },
    GetOrgaName(value) {
      if (value == "" || value == null) {
        return;
      }
      let url = "openinsuser/GetOrgaName/";
      let postData =
        "bankTypeId=" +
        this.bankTypeId +
        "&provId=" +
        this.ProvAreaCode +
        "&cityId=" +
        value;
      this.$indexapi.post(url, postData, res => {
        if (res.Ret == 0) {
          this.GetOrgaNamelists = res.Data;
        } else {
          this.$message.error(res.Msg);
        }
      });
    },
    PickOrga(value) {
      this.bindCardForm.PaymNumb = value;
    },
    //绑定银行卡
    subSave(formName) {
      if (this.currAgentInfo.IsAuthed == 0) {
        this.$message.error("请先进行实名认证！");
        return;
      } else if (this.currAgentInfo.IsAuthed == 2) {
        //正在认证
        this.$message.error("实名认证正在审核，请稍后绑卡！");
        return;
      } else if (this.currAgentInfo.IsAuthed == 3) {
        this.$message.error("实名认证认证失败，请重新提交实名认证信息！");
        return;
      }

      this.bindCardForm.BankName = $(".bankname")
        .children(".el-input")
        .children("input")
        .val();
      this.bindCardForm.ProvinceName = $(".provinceName")
        .children(".el-input")
        .children("input")
        .val();
      this.bindCardForm.CityName = $(".cityname")
        .children(".el-input")
        .children("input")
        .val();
      this.bindCardForm.SubbranchName = $(".subbranchname")
        .children(".el-input")
        .children("input")
        .val();
      for (let key in this.bindCardForm) {
        if (this.bindCardForm[key] == "") {
          this.$message.error("请完整填写信息后提交！");
          return;
        }
      }
      let url = "/Account/BindBankCard";
      this.bindCardForm.BankAccountName = this.bindCardForm.BankAccountName.replace(/\s+/g,'');
      this.bindCardForm.CardNO = this.bindCardForm.CardNO.replace(/\s+/g,'');
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$loginapi.post(url, this.bindCardForm, response => {
            this.loading = false;
            if (response.Ret == 0) {
              this.$message.success("银行卡绑定成功!");
              this.bindCardForm = {};
              this.bindCardPage = false;
              this.getBankCard();
            } else {
              this.$message.error(response.Msg);
              // this.$message.error(response.Msg);
            }
          });
        } else {
          this.$message.error("填写信息有误请核对");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
#codeico {
  position: absolute;
  z-index: 999;
  width: 30px;
  height: 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* background: url(../assets/images/SmartStar_logo.png) 50% no-repeat; */
  background-size: cover;
  background-color: #fff;
}
</style>

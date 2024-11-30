<template>
  <t-card :bordered="false">
    <t-form
      ref="form"
      :data="formData"
      :rules="FORM_RULES"
      label-align="top"
      :label-width="100"
      @reset="onReset"
      @submit="onSubmit"
    >
      <div class="form-basic-container">
        <div class="form-basic-item">
          <div class="form-basic-container-title" align="center">从您的帐户部署站点</div>
          <!-- 提示连接 -->
          <div v-if="access_token === null">
            <t-card :cover="cover" title="Gitee" description="我的仓库" :style="{ width: '600px',height:'300px'}">
              <template #avatar>
                <t-avatar image="https://tdesign.gtimg.com/site/avatar-boy.jpg" size="56px"></t-avatar>
              </template>
              <template #footer>
                通过导入现有 Git 存储库创建
                <t-button theme="primary" @click="authGitee">连接到git</t-button>
              </template>
            </t-card>
          </div>
          <!-- 合同名称,合同类型 -->
          <div v-else>
            <t-row class="row-gap" :gutter="[16, 24]">
              <t-col :span="6">
                <t-form-item label="chart名称" name="name">
                  <t-input v-model="formData.name" :style="{ width: '322px' }" placeholder="请输入内容"/>
                </t-form-item>
              </t-col>
              <t-col :span="6">
                <t-form-item label="类型" name="type">
                  <t-select
                    v-model="formData.type"
                    :style="{ width: '322px' }"
                    placeholder="请选择类型"
                    class="demo-select-base"
                    clearable
                  >
                    <t-option v-for="(item, index) in typeOptions" :key="index" :value="item.value" :label="item.label">
                      {{ item.label }}
                    </t-option>
                  </t-select>
                </t-form-item>
              </t-col>
              <!-- 合同收付类型 -->
              <!--            <t-col :span="8">-->
              <!--              <t-form-item label="合同收付类型" name="payment">-->
              <!--                <t-radio-group v-model="formData.payment">-->
              <!--                  <t-radio value="1"> 收款 </t-radio>-->
              <!--                  <t-radio value="2"> 付款 </t-radio>-->
              <!--                </t-radio-group>-->
              <!--                <span class="space-item" />-->
              <!--                <t-input placeholder="请输入金额" :style="{ width: '160px' }" />-->
              <!--              </t-form-item>-->
              <!--            </t-col>-->

              <t-col :span="6">
                <t-form-item label="模板" name="partyA">
                  <t-select
                    v-model="formData.partyA"
                    :style="{ width: '322px' }"
                    class="demo-select-base"
                    placeholder="请选择类型"
                    clearable
                  >
                    <t-option v-for="(item, index) in partyAOptions" :key="index" :value="item.value"
                              :label="item.label">
                      {{ item.label }}
                    </t-option>
                  </t-select>
                </t-form-item>
              </t-col>
              <t-col :span="6">
                <t-form-item label="仓库地址" name="partyB">
                  <t-select
                    v-model="formData.partyB"
                    :style="{ width: '322px' }"
                    placeholder="请选择类型"
                    class="demo-select-base"
                    clearable
                  >
                    <t-option v-for="(item, index) in partyBOptions" :key="index" :value="item.value"
                              :label="item.label">
                      {{ item.label }}
                    </t-option>
                  </t-select>
                </t-form-item>
              </t-col>
              <t-col :span="6">
                <t-form-item label="用户名" name="signDate">
                  <t-input
                    v-model="formData.signDate"
                    :style="{ width: '322px' }"
                    theme="primary"
                    mode="date"
                    separator="/"
                  />
                </t-form-item>
              </t-col>
              <t-col :span="6">
                <t-form-item label="密码" name="startDate">
                  <t-input
                    v-model="formData.startDate"
                    :style="{ width: '322px' }"
                    theme="primary"
                    mode="date"
                    separator="/"
                  />
                </t-form-item>
              </t-col>
              <!--            <t-col :span="6">-->
              <!--              <t-form-item label="合同结束日期" name="endDate">-->
              <!--                <t-date-picker-->
              <!--                  v-model="formData.endDate"-->
              <!--                  :style="{ width: '322px' }"-->
              <!--                  theme="primary"-->
              <!--                  mode="date"-->
              <!--                  separator="/"-->
              <!--                />-->
              <!--              </t-form-item>-->
              <!--            </t-col>-->
              <t-col :span="6">
                <t-form-item label="" name="files">
                  <t-upload
                    v-model="formData.files"
                    action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
                    tips="请上传文件，大小在10M以内"
                    :size-limit="{ size: 60, unit: 'MB' }"
                    :format-response="formatResponse"
                    :before-upload="beforeUpload"
                    @fail="handleFail"
                  >
                    <t-button class="form-submit-upload-btn" variant="outline"> 上传chart文件</t-button>
                  </t-upload>
                </t-form-item>
              </t-col>
            </t-row>
            <div class="form-basic-container-title form-title-gap">其它信息</div>
            <t-form-item label="备注" name="comment">
              <t-textarea v-model="formData.comment" :height="124" placeholder="请输入备注"/>
            </t-form-item>
            <t-form-item label="团队成员">
              <t-avatar-group>
                <t-avatar>D</t-avatar>
                <t-avatar>S</t-avatar>
                <t-avatar>+</t-avatar>
              </t-avatar-group>
            </t-form-item>
            <div class="form-submit-container">
              <div class="form-submit-sub">
                <div class="form-submit-left">
                  <t-button theme="primary" class="form-submit-confirm" type="submit"> 提交</t-button>
                  <t-button type="reset" class="form-submit-cancel" theme="default" variant="base"> 取消</t-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </t-form>
  </t-card>
</template>
<script>
import {prefix} from '@/config/global';

const INITIAL_DATA = {
  name: '',
  type: '',
  partyA: '',
  partyB: '',
  signDate: '',
  startDate: '',
  endDate: '',
  payment: '1',
  amount: 0,
  comment: '',
  files: [],
};
const FORM_RULES = {
  name: [{required: false, message: '请输入合同名称', type: 'error'}],
  type: [{required: false, message: '请选择合同类型', type: 'error'}],
  payment: [{required: false, message: '请选择合同收付类型', type: 'error'}],
  amount: [{required: false, message: '请输入合同金额', type: 'error'}],
  partyA: [{required: false, message: '请选择甲方', type: 'error'}],
  partyB: [{required: false, message: '请选择乙方', type: 'error'}],
  signDate: [{required: false, message: '请选择日期', type: 'error'}],
  startDate: [{required: false, message: '请选择日期', type: 'error'}],
  endDate: [{required: false, message: '请选择日期', type: 'error'}],
};

export default {
  name: 'FormBase',
  props: ['code','refresh_token','access_token'],
  data() {
    return {
      prefix,
      stepSuccess: true,
      formData: {...INITIAL_DATA},
      FORM_RULES,
      typeOptions: [
        {label: '应用类型A', value: '1'},
        {label: '应用类型B', value: '2'},
        {label: '应用类型C', value: '3'},
      ],
      partyAOptions: [
        {label: '模板A', value: '1'},
        {label: '模板B', value: '2'},
        {label: '模板C', value: '3'},
      ],
      partyBOptions: [
        {label: '仓库地址A', value: '1'},
        {label: '仓库地址B', value: '2'},
        {label: '仓库地址C', value: '3'},
      ],
      textareaValue: '',
      rules: {
        name: [{required: false, message: '请输入合同名称', type: 'error'}],
        type: [{required: false, message: '请选择合同类型', type: 'error'}],
        payment: [{required: false, message: '请选择合同收付类型', type: 'error'}],
        amount: [{required: false, message: '请输入合同金额', type: 'error'}],
        partyA: [{required: false, message: '请选择甲方', type: 'error'}],
        partyB: [{required: false, message: '请选择乙方', type: 'error'}],
        signDate: [{required: false, message: '请选择日期', type: 'error'}],
        startDate: [{required: false, message: '请选择日期', type: 'error'}],
        endDate: [{required: false, message: '请选择日期', type: 'error'}],
      },
    };
  },
  methods: {
    handleFail({file}) {
      this.$message.error(`文件 ${file.name} 上传失败`);
    },
    beforeUpload(file) {
      if (!/\.(pdf)$/.test(file.name)) {
        this.$message.warning('请上传文件');
        return false;
      }
      return true;
    },
    // 用于格式化接口响应值，error 会被用于上传失败的提示文字；url 表示文件/图片地址
    formatResponse(res) {
      return {...res, error: '上传失败，请重试', url: res.url};
    },
    changeStatus() {
      this.stepSuccess = !this.stepSuccess;
    },
    onReset() {
      this.$message.warning('取消新建');
      this.$emit('transfer', "list")
    },
    onSubmit({validateResult}) {
      if (validateResult === true) {
        this.$message.success('新建成功');
        setTimeout(() => {
          this.$router.push("/build/helm")
        }, 1000)
      }
    },
    authGitee() {
      const redirect_uri = "https://gpg123.cn/git/gitee";
      const url = "https://gitee.com/oauth/authorize?client_id=4205d9756e46effb45c437308d808f7b551414563cbec9f5aa0ec9402e0753d6&redirect_uri=" + redirect_uri + "&response_type=code"
      console.log(url)
      window.location.href = url;
    },
    getToken() {

    }
  },
};
</script>
<style lang="less" scoped>
@import './index';
</style>

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
          <div class="form-basic-container-title">基本信息</div>
          <!-- 表单内容 -->
          <t-row class="row-gap" :gutter="[16, 24]">
            <t-col :span="6">
              <t-form-item label="镜像名称" name="name">
                <t-input v-model="formData.name" :style="{ width: '322px' }" placeholder="请输入内容"/>
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="平台类型" name="type">
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
            <t-col :span="6">
              <t-form-item label="命名空间" name="signDate">
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
              <t-form-item label="镜像版本" name="version">
                <t-input v-model="formData.version" :style="{ width: '322px' }" placeholder="请输入内容"></t-input>
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="仓库地址" name="repo">
                <t-select
                  v-model="formData.repo"
                  :style="{ width: '322px' }"
                  placeholder="请选择类型"
                  class="demo-select-base"
                  clearable
                >
                  <t-option v-for="(item, index) in repoOptions" :key="index" :value="item.value" :label="item.label">
                    {{ item.label }}
                  </t-option>
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="构建超时(s)" name="timeOut">
                <t-input
                  v-model="formData.timeOut"
                  :style="{ width: '322px' }"
                  theme="primary"
                />
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="" name="files">
                <t-upload
                  v-model="formData.file"
                  action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
                  tips="请上传文件，大小在10M以内"
                  :size-limit="{ size: 60, unit: 'MB' }"
                  :format-response="formatResponse"
                  :before-upload="beforeUpload"
                  @fail="handleFail"
                >
                  <t-button class="form-submit-upload-btn" variant="outline"> 上传dockerfile</t-button>
                </t-upload>
              </t-form-item>
            </t-col>
            <t-col>
              <t-form-item label="备注" name="remark">
                <t-textarea v-model="formData.remark" :height="124" :style="{ width: '322px' }"
                            placeholder="请输入备注"/>
              </t-form-item>
            </t-col>
          </t-row>
        </div>
      </div>

      <div class="form-submit-container">
        <div class="form-submit-sub">
          <div class="form-submit-left">
            <t-button theme="primary" class="form-submit-confirm" type="submit"> 提交</t-button>
            <t-button type="reset" class="form-submit-cancel" theme="default" variant="base"> 取消</t-button>
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
  type: 'linux/amd64',
  namespace: '',
  version: '',
  repo: '',
  timeOut: 180,
  remark: '',
  file: [],
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
  data() {
    return {
      prefix,
      stepSuccess: true,
      formData: {...INITIAL_DATA},
      FORM_RULES,
      typeOptions: [
        {label: 'ARM', value: '1'},
        {label: 'AMD', value: '2'}
      ],
      repoOptions: [
        {label: '地址A', value: '1'},
        {label: '地址B', value: '2'},
        {label: '地址C', value: '3'},
      ],
      partyBOptions: [
        {label: '地址A', value: '1'},
        {label: '地址B', value: '2'},
        {label: '地址C', value: '3'},
      ],
      textareaValue: '',
      rules: {
        name: [{required: true, message: '请输入合同名称', type: 'error'}],
        type: [{required: true, message: '请选择合同类型', type: 'error'}],
        payment: [{required: true, message: '请选择合同收付类型', type: 'error'}],
        amount: [{required: true, message: '请输入合同金额', type: 'error'}],
        partyA: [{required: true, message: '请选择甲方', type: 'error'}],
        partyB: [{required: true, message: '请选择乙方', type: 'error'}],
        signDate: [{required: true, message: '请选择日期', type: 'error'}],
        startDate: [{required: true, message: '请选择日期', type: 'error'}],
        endDate: [{required: true, message: '请选择日期', type: 'error'}],
      }
    };
  },
  methods: {
    getTypeList() {
      this.$request.get("/build/image/typeList").then(res => {
        this.typeOptions = []
        res.data.data.forEach(e => {
          this.typeOptions.push({
            label: e,
            value: e
          })
        })
      }).catch((err) => {
      })
    },
    getRepoList() {
      this.$request.get("/build/image/repoList").then(res => {
        this.repoOptions = []
        res.data.data.forEach(e => {
          this.repoOptions.push({
            label: e,
            value: e
          })
        })
      }).catch((err) => {
      })
    },
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
        this.$request.post("/build/image/add", this.formData).then(res => {
          this.$message.success('新建成功');
        }).catch(err => {

        })
        // setTimeout(()=>{
        //   this.$router.push('/build/image');
        // },1000)
      }
    },
  },
  created() {
    this.getTypeList();
    this.getRepoList();
  }
};
</script>
<style lang="less" scoped>
@import './index';
</style>

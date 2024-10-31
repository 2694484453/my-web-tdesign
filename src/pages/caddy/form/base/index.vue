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

          <!-- 合同名称,合同类型 -->
          <t-row class="row-gap" :gutter="[16, 24]">
            <t-col :span="6">
              <t-form-item label="名称" name="name">
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
                  <t-option v-for="(item, index) in typeList" :key="index" :value="item" :label="item">
                    {{ item }}
                  </t-option>
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="端点" name="targets">
                <t-input
                  v-model="formData.targets"
                  :style="{ width: '322px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="12">
              <t-form-item label="备注" name="comment">
                <t-textarea v-model="formData.labels" :height="124" placeholder="请输入备注"/>
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
  type: '',
  targets: '',
  labels: [],
};
const FORM_RULES = {
  name: [{required: false, message: '请输入合同名称', type: 'error'}],
  type: [{required: false, message: '请选择合同类型', type: 'error'}],
  targets: [{required: false, message: '请选择合同收付类型', type: 'error'}],
  labels: [{required: false, message: '请输入合同金额', type: 'error'}],
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
        name: [{required: true, message: '请输入合同名称', type: 'error'}],
        type: [{required: true, message: '请选择合同类型', type: 'error'}],
        payment: [{required: false, message: '请选择合同收付类型', type: 'error'}],
        amount: [{required: false, message: '请输入合同金额', type: 'error'}],
        partyA: [{required: false, message: '请选择甲方', type: 'error'}],
        partyB: [{required: false, message: '请选择乙方', type: 'error'}],
        signDate: [{required: false, message: '请选择日期', type: 'error'}],
        startDate: [{required: false, message: '请选择日期', type: 'error'}],
        endDate: [{required: false, message: '请选择日期', type: 'error'}],
      },
      typeList: []
    };
  },
  methods: {
    // 用于格式化接口响应值，error 会被用于上传失败的提示文字；url 表示文件/图片地址
    formatResponse(res) {
      return {...res, error: '上传失败，请重试', url: res.url};
    },
    changeStatus() {
      this.stepSuccess = !this.stepSuccess;
    },
    onReset() {
      this.$message.warning('取消新建');
    },
    onSubmit({validateResult}) {
      if (validateResult === true) {
        this.$request.post("/monitor/add", {} = this.formData).then(res => {
          if (res.data.data === true) {
            this.$message.success('新建成功');
            // setTimeout(()=>{
            //   this.$router.push("/build/helm")
            // },1000)
          }
        }).catch(err => {

        })

      }
    },
    getTypeList() {
      this.$request.get("/monitor/typeList").then(res => {
        this.typeList = res.data.data
      }).catch((err) => {

      })
    }
  },
  created() {
    this.getTypeList()
  }
};
</script>
<style lang="less" scoped>
@import 'index';
</style>

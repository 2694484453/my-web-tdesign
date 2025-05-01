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
          <!-- 卡片列表 -->
          <div v-else>
            <template v-if="pagination.total > 0">
              <div class="list-card-items">
                <t-row :gutter="[16, 16]">
                  <t-col :lg="4" :xs="6" :xl="3" v-for="product in data.slice(pagination.pageSize * (pagination.current - 1),pagination.pageSize * pagination.current,)"
                    :key="product.index">
<!--                    <product-card :product="product" @delete-item="handleDeleteItem"-->
<!--                                  @manage-product="handleManageProduct"/>-->
                  </t-col>
                </t-row>
              </div>
              <div class="list-card-pagination">
                <t-pagination
                  v-model="pagination.current"
                  :total="pagination.total"
                  :pageSizeOptions="[12, 24, 36]"
                  :page-size.sync="pagination.pageSize"
                  @page-size-change="onPageSizeChange"
                  @current-change="onCurrentChange"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </t-form>
  </t-card>
</template>
<script>
import {prefix} from '@/config/global';
import ProductCard from "@/components/product-card/index.vue";

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
  components: {ProductCard},
  props: ['code', 'refresh_token', 'access_token'],
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
      // 与pagination对齐
      pagination: {
        defaultPageSize: 10,
        total: 0,
        defaultCurrent: 1,
      },
      data: [],
    };
  },
  mounted() {
    if (this.access_token !== null) {
      this.repos()
    }
  },
  methods: {
    onPageSizeChange(size, pageInfo) {
      console.log('Page Size:', this.pageSize, size, pageInfo);
      // 刷新
      this.formData.pageSize = size
    },
    onCurrentChange(current, pageInfo) {
      console.log('Current Page', this.current, current, pageInfo);
      // 刷新
      this.formData.pageNum = current
      this.getList()
    },
    onChange(pageInfo) {
      console.log('Page Info: ', pageInfo);
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
    repos() {
      this.$request.get('https://gitee.com/api/v5/user/repos?access_token=' + this.access_token + '&sort=full_name&page=1&per_page=100').then(res => {
         this.data = res.data.root
      })
    }
  },
};
</script>
<style lang="less" scoped>
@import './index';
</style>

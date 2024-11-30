<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-form
        ref="form"
        :data="formData"
        :label-width="80"
        colon
        @reset="onReset"
        @submit="onSubmit"
        :style="{ marginBottom: '8px' }"
      >
        <t-row justify="space-between">
          <div class="left-operation-container">
            <t-button @click="formVisible = true">导入</t-button>
            <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length"> 导出</t-button>
            <p v-if="!!selectedRowKeys.length" class="selected-count">已选{{ selectedRowKeys.length }}项</p>
          </div>
          <t-input v-model="searchValue" class="search-input" placeholder="请输入你需要搜索的内容" clearable>
            <template #suffix-icon>
              <search-icon size="20px"/>
            </template>
          </t-input>
          <t-col :span="2" class="operation-container">
            <t-button theme="primary" type="submit" :style="{ marginLeft: '8px' }"> 查询</t-button>
            <t-button type="reset" variant="base" theme="default"> 重置</t-button>
          </t-col>
        </t-row>
      </t-form>
      <div class="table-container">
        <t-table
          :columns="columns"
          :data="data"
          :rowKey="rowKey"
          :verticalAlign="verticalAlign"
          :hover="hover"
          :pagination="pagination"
          :selected-row-keys="selectedRowKeys"
          :loading="dataLoading"
          @page-change="rehandlePageChange"
          @change="rehandleChange"
          @select-change="rehandleSelectChange"
          :headerAffixedTop="true"
          :headerAffixProps="{ offsetTop: offsetTop, container: getContainer }"
        >
          <template #status="{ row }">
            <t-tag v-if="row.status === CONTRACT_STATUS.FAIL" theme="danger" variant="light">构建失败</t-tag>
            <t-tag v-if="row.status === CONTRACT_STATUS.AUDIT_PENDING" theme="warning" variant="light">未知</t-tag>
            <t-tag v-if="row.status === CONTRACT_STATUS.EXEC_PENDING" theme="warning" variant="light">错误</t-tag>
            <t-tag v-if="row.status === CONTRACT_STATUS.EXECUTING" theme="success" variant="light">构建中</t-tag>
            <t-tag v-if="row.status === CONTRACT_STATUS.FINISH" theme="success" variant="light">构建成功</t-tag>
          </template>
          <template #repo="{ row }">
            <p v-if="row.contractType === CONTRACT_TYPES.MAIN">AMD</p>
            <p v-if="row.contractType === CONTRACT_TYPES.SUB">ARM</p>
            <p v-if="row.contractType === CONTRACT_TYPES.SUPPLEMENT">其他</p>
            <p>{{ row.repo }}/{{ row.namespace }}/{{ row.name }}:{{ row.version }}</p>
          </template>
          <template #hasJob="{ row }">
            <p v-if="row.hasJob === true">是</p>
            <p v-if="row.hasJob === false">否</p>
          </template>
          <template #paymentType="{ row }">
            <p v-if="row.paymentType === CONTRACT_PAYMENT_TYPES.PAYMENT" class="payment-col">
              推送失败
              <trend class="dashboard-item-trend" type="up"/>
            </p>
            <p v-if="row.paymentType === CONTRACT_PAYMENT_TYPES.RECEIPT" class="payment-col">
              推送成功
              <trend class="dashboard-item-trend" type="down"/>
            </p>
          </template>
          <template #op="slotProps">
            <a class="t-button-link" @click="handleClickSuccess()">执行</a>
            <a class="t-button-link" @click="handleClickDetail()">详情</a>
            <a class="t-button-link" @click="handleClickEdit()">编辑</a>
            <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a>
          </template>
        </t-table>
      </div>
    </t-card>
    <!-- 产品管理弹窗 -->
    <t-dialog header="从仓库导入" :visible.sync="formVisible" :width="680" :footer="false">
      <div slot="body">
        <!-- 表单内容 -->
        <t-form :data="formData" ref="form" :rules="rules" @submit="onSubmit" :labelWidth="100">
          <t-form-item label="git仓库" name="type">
            <t-select v-model="formData.type" clearable :style="{ width: '480px' }">
              <t-option v-for="(item, index) in options" :value="item.value" :label="item.label" :key="index">
                {{ item.label }}
              </t-option>
            </t-select>
          </t-form-item>
          <t-form-item style="float: right">
            <t-button variant="outline" @click="onClickCloseBtn">取消</t-button>
            <t-button theme="primary" @click="toAuthGit">确定</t-button>
          </t-form-item>
        </t-form>
      </div>
    </t-dialog>
    <t-dialog
      header="确认删除当前所选合同？"
      :body="confirmBody"
      :visible.sync="confirmVisible"
      @confirm="onConfirmDelete"
      :onCancel="onCancel"
    >
    </t-dialog>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import {SearchIcon} from 'tdesign-icons-vue';
import Trend from '@/components/trend/index.vue';
import {prefix} from '@/config/global';

import {CONTRACT_STATUS, CONTRACT_STATUS_OPTIONS, CONTRACT_TYPES, CONTRACT_PAYMENT_TYPES} from '@/constants';

export default Vue.extend({
  name: 'ListBase',
  components: {
    SearchIcon,
    Trend,
  },
  data() {
    return {
      CONTRACT_STATUS,
      CONTRACT_STATUS_OPTIONS,
      CONTRACT_TYPES,
      CONTRACT_PAYMENT_TYPES,
      prefix,
      dataLoading: false,
      data: [],
      options: [
        {label: 'gitee', value: 'gitee'},
        {label: 'github', value: 'github'},
        {label: 'gitlab', value: 'gitlab'},
      ],
      selectedRowKeys: [1, 2],
      value: 'first',
      columns: [
        {colKey: 'row-select', type: 'multiple', width: 60, fixed: 'left'},
        {
          title: '名称',
          align: 'left',
          width: 150,
          ellipsis: true,
          colKey: 'home',
          fixed: 'left',
        },
        {
          title: '类型',
          width: 80,
          ellipsis: true,
          colKey: 'type',
        },
        {
          title: '语言',
          width: 80,
          ellipsis: true,
          colKey: 'language',
        },
        {
          title: '仓库地址',
          width: 250,
          ellipsis: true,
          colKey: 'httpUrl',
        },
        {
          title: '是否有流水线',
          width: 80,
          ellipsis: true,
          colKey: 'hasJob',
        },
        {
          title: '流水线数量',
          width: 80,
          ellipsis: true,
          colKey: 'jobNumber',
        },
        {
          title: '创建时间',
          width: 120,
          ellipsis: true,
          colKey: 'createTime',
        },
        {
          title: '修改时间',
          width: 120,
          ellipsis: true,
          colKey: 'updateTime',
        },
        {
          align: 'left',
          fixed: 'right',
          width: 200,
          colKey: 'op',
          title: '操作',
        },
      ],
      rowKey: 'index',
      tableLayout: 'auto',
      verticalAlign: 'top',
      hover: true,
      rowClassName: (rowKey: string) => `${rowKey}-class`,
      // 与pagination对齐
      pagination: {
        defaultPageSize: 20,
        total: 0,
        defaultCurrent: 1,
      },
      searchValue: '',
      confirmVisible: false,
      formVisible: false,
      deleteIdx: -1,
      formData: {
        name: "",
        type: ""
      },
      rules: {
        name: [{required: true, message: '请输入产品名称', type: 'error'}],
      },
    };
  },
  computed: {
    confirmBody() {
      if (this.deleteIdx > -1) {
        const {name} = this.data?.[this.deleteIdx];
        return `删除后，${name}的所有信息将被清空，且无法恢复`;
      }
      return '';
    },
    offsetTop() {
      return this.$store.state.setting.isUseTabsRouter ? 48 : 0;
    },
  },
  mounted() {

  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.dataLoading = true;
      const type = this.formData.type != "" ? this.formData.type : "gitee";
      this.$request
        .get('/git/page?type='+type)
        .then((res) => {
          if (res.data.code === 200) {
            this.data = res.data.rows;
            this.pagination = {
              ...this.pagination,
              total: res.data.total,
            };
          }
        })
        .catch((e: Error) => {
          console.log(e);
        })
        .finally(() => {
          this.dataLoading = false;
        });
    },
    getContainer() {
      return document.querySelector('.tdesign-starter-layout');
    },
    rehandlePageChange(curr, pageInfo) {
      console.log('分页变化', curr, pageInfo);
    },
    rehandleSelectChange(selectedRowKeys: number[]) {
      this.selectedRowKeys = selectedRowKeys;
    },
    rehandleChange(changeParams, triggerAndData) {
      console.log('统一Change', changeParams, triggerAndData);
    },
    handleClickDetail(row) {
      //this.$router.push('/build/imageDetail');
      this.$emit('transfer', "detail", row)
    },
    handleSetupContract() {
      //this.$router.push('/build/imageForm');
      //this.$emit('transfer', "form")
    },
    onClickCloseBtn(): void {
      this.formVisible = false;
      this.formData = {}
    },
    handleClickDelete(row: { rowIndex: any }) {
      this.deleteIdx = row.rowIndex;
      this.confirmVisible = true;
    },
    handleClickEdit(row) {
      //this.$router.push('/build/imageEdit');
      this.$emit('transfer', "form", row)
    },
    handleClickSuccess() {
      this.$router.push('/build/success');
    },
    onConfirmDelete() {
      // 真实业务请发起请求
      this.data.splice(this.deleteIdx, 1);
      this.pagination.total = this.data.length;
      const selectedIdx = this.selectedRowKeys.indexOf(this.deleteIdx);
      if (selectedIdx > -1) {
        this.selectedRowKeys.splice(selectedIdx, 1);
      }
      this.confirmVisible = false;
      this.$message.success('删除成功');
      this.resetIdx();
    },
    onCancel() {
      this.resetIdx();
    },
    resetIdx() {
      this.deleteIdx = -1;
    },
    onReset(data) {
      console.log(data);
    },
    onSubmit(data) {
      console.log(this.formData);
      this.getList(this.formData);
    },
    toAuthGit() {
      const redirect_uri = "https://gpg123.cn/build/image";
      // 如果是gitee
      if (this.formData.type === "gitee") {
        const url = "https://gitee.com/oauth/authorize?client_id=4205d9756e46effb45c437308d808f7b551414563cbec9f5aa0ec9402e0753d6&redirect_uri=" + redirect_uri + "&response_type=code"
        console.log(url)
        window.location.href = url;
      }
    },
    /**
     * 打开小窗口
     */
    openWindow(url, title, w, h) {
      const dualScreenLeft =
        window.screenLeft !== undefined ? window.screenLeft : screen.left;
      const dualScreenTop =
        window.screenTop !== undefined ? window.screenTop : screen.top;

      const width = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
          ? document.documentElement.clientWidth
          : screen.width;
      const height = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
          ? document.documentElement.clientHeight
          : screen.height;

      const left = width / 3 - w / 3 + dualScreenLeft;
      const top = height / 3 - h / 3 + dualScreenTop;
      const newWindow = window.open(
        url,
        title,
        "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        top +
        ", left=" +
        left
      );

      if (window.focus) {
        newWindow.focus();
      }
    }
  },
});
</script>

<style lang="less" scoped>
@import '@/style/variables';

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}

.left-operation-container {
  padding: 0 0 6px 0;
  margin-bottom: 16px;

  .selected-count {
    display: inline-block;
    margin-left: var(--td-comp-margin-s);
    color: var(--td-text-color-secondary);
  }
}

.search-input {
  width: 360px;
}

.t-button + .t-button {
  margin-left: var(--td-comp-margin-s);
}
</style>

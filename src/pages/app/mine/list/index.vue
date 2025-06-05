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
            <t-button @click="handleSetupContract">创建应用</t-button>
            <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length">导出应用</t-button>
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
          :selected-row-keys="selectedRowKeys"
          :loading="dataLoading"
          :headerAffixedTop="true"
          :headerAffixProps="{ offsetTop: offsetTop, container: getContainer }"
        >
          <template #status="{ row }">
            <t-tag v-if="row.status === CONTRACT_STATUS.FAIL" theme="danger" variant="light">审核失败</t-tag>
            <t-tag v-if="row.status === CONTRACT_STATUS.AUDIT_PENDING" theme="warning" variant="light">待审核</t-tag>
            <t-tag v-if="row.status === CONTRACT_STATUS.EXEC_PENDING" theme="warning" variant="light">待履行</t-tag>
            <t-tag v-if="row.status === CONTRACT_STATUS.EXECUTING" theme="success" variant="light">履行中</t-tag>
            <t-tag v-if="row.status === CONTRACT_STATUS.FINISH" theme="success" variant="light">已完成</t-tag>
          </template>
          <template #contractType="{ row }">
            <p v-if="row.contractType === CONTRACT_TYPES.MAIN">审核失败</p>
            <p v-if="row.contractType === CONTRACT_TYPES.SUB">待审核</p>
            <p v-if="row.contractType === CONTRACT_TYPES.SUPPLEMENT">待履行</p>
          </template>
          <template #paymentType="{ row }">
            <p v-if="row.paymentType === CONTRACT_PAYMENT_TYPES.PAYMENT" class="payment-col">
              付款
              <trend class="dashboard-item-trend" type="up"/>
            </p>
            <p v-if="row.paymentType === CONTRACT_PAYMENT_TYPES.RECEIPT" class="payment-col">
              收款
              <trend class="dashboard-item-trend" type="down"/>
            </p>
          </template>
          <template #op="slotProps">
            <a class="t-button-link" @click="handleClickDetail(slotProps.row)">详情</a>
            <a class="t-button-link" @click="handleClickEdit(slotProps.row)">管理</a>
            <a class="t-button-link" @click="handleClickDelete(slotProps.row)">卸载</a>
          </template>
        </t-table>
        <div>
          <t-pagination
            v-model="formData.pageNum"
            :total="pagination.total"
            :page-size.sync="formData.pageSize"
            @current-change="onCurrentChange"
            @page-size-change="onPageSizeChange"
            @change="onChange"
          />
        </div>
      </div>
    </t-card>
    <t-dialog
      header="确认删除当前所选合同？"
      :body="confirmBody"
      :visible.sync="confirmVisible"
      @confirm="onConfirmDelete"
      :onCancel="onCancel"
    >
    </t-dialog>
    <t-drawer
      :visible.sync="formConfig.visible"
      :header="formConfig.header"
      :on-overlay-click="() => (formConfig.visible = false)"
      placement="right"
      destroyOnClose
      showOverlay
      :sizeDraggable="true"
      :on-size-drag-end="handleSizeDrag"
      :size="formConfig.size"
      @cancel="formConfig.visible = false"
      @close="handleClose"
      :onConfirm="onSubmitCreate">
      <t-space direction="vertical" style="width: 100%" v-show="formConfig.operate !== 'info'">
        <t-form
          ref="formValidatorStatus"
          :data="form"
          :rules="rules"
          :label-width="120"
          :status-icon="formStatusIcon"
          @reset="onReset"
        >
          <t-form-item label="id" name="id" v-show="false">
            <t-input v-model="form.id" placeholder="请输入内容" :maxlength="32" with="200" :readonly="formConfig.operate === 'info'"></t-input>
          </t-form-item>
          <t-form-item label="服务名称" name="branch">
            <t-input v-model="form.name" placeholder="请输入英文字母和数字的组合名称" :maxlength="64" with="200" :readonly="formConfig.operate === 'info'"></t-input>
          </t-form-item>
          <t-form-item label="命名空间" name="localIp">
            <t-input v-model="form.namespace" :maxlength="64" with="200" :readonly="formConfig.operate === 'info'"></t-input>
          </t-form-item>
          <t-form-item label="版本" name="localPort">
            <t-input v-model="form.version" :maxlength="32" with="200" :readonly="formConfig.operate === 'info'"></t-input>
          </t-form-item>
          <t-form-item label="状态" name="customDomains">
            <t-input v-model="form.info.status" placeholder="请输入域名地址" :maxlength="32" with="200" :readonly="formConfig.operate === 'info'"></t-input>
          </t-form-item>
          <t-form-item label="描述" name="description">
            <t-textarea v-model="form.info.description" placeholder="请输入备注内容" :maxlength="120" with="200" :readonly="formConfig.operate === 'info'"></t-textarea>
          </t-form-item>
        </t-form>
      </t-space>
      <t-space direction="vertical" style="width: 100%" v-show="formConfig.operate === 'info'">
        <t-descriptions :title="form.name+'应用详情'" bordered :layout="'vertical'" :item-layout="'horizontal'" :column="3">
          <t-descriptions-item label="名称" >{{form.name}}</t-descriptions-item>
          <t-descriptions-item label="命名空间">{{form.namespace}}</t-descriptions-item>
          <t-descriptions-item label="版本">{{form.version}}</t-descriptions-item>
          <t-descriptions-item label="状态">{{form.info.status}}</t-descriptions-item>
          <t-descriptions-item label="第一次部署">{{form.info.first_deployed}}</t-descriptions-item>
          <t-descriptions-item label="最近一次部署">{{form.info.last_deployed}}</t-descriptions-item>
          <t-descriptions-item label="描述">{{form.info.description}}</t-descriptions-item>
        </t-descriptions>
      </t-space>
    </t-drawer>
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
      selectedRowKeys: [1, 2],
      value: 'first',
      columns: [
        {colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left'},
        {
          title: '应用名称',
          align: 'left',
          width: 120,
          ellipsis: true,
          colKey: 'appName',
          fixed: 'left',
        },
        {title: '状态', colKey: 'status', width: 80, cell: {col: 'status'}},
        {
          title: 'chart名称',
          width: 120,
          ellipsis: true,
          colKey: 'chartName',
        },
        {
          title: '类型',
          width: 80,
          ellipsis: true,
          colKey: 'source',
        },
        {
          title: '命名空间',
          width: 180,
          ellipsis: true,
          colKey: 'nameSpace',
        },
        {
          title: '集群',
          width: 180,
          ellipsis: true,
          colKey: 'clusterName',
        },
        {
          title: '描述',
          width: 180,
          ellipsis: true,
          colKey: 'description',
        },
        {
          title: '创建时间',
          width: 200,
          ellipsis: true,
          colKey: 'createTime',
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
        defaultPageSize: 10,
        total: 0,
        defaultCurrent: 1,
      },
      searchValue: '',
      confirmVisible: false,
      deleteIdx: -1,
      formData: {
        name: "",
        version: "",
        type: "",
        namespace: "",
        pageNum: 1,
        pageSize: 10
      },
      form: {
        id: '',
        name: '',
        namespace: '',
        version: '',
        info: {
          deleted: "",
          description: "",
          first_deployed: "",
          last_deployed: "",
          status: ""
        },
        manifest: 80,
      },
      formConfig: {
        title: '新增',
        visible: false,
        header: '新增',
        operate: "add",
        size: '50%',
      },
    };
  },
  computed: {
    confirmBody() {
      if (this.deleteIdx > -1) {
        const {name} = this.data?.[this.deleteIdx];
        return `删除后，${name}的所有合同信息将被清空，且无法恢复`;
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
      this.$request.get('/mineApp/page', {
        params: this.formData
      }).then((res) => {
          if (res.data.code === 200) {
            console.log(res.data)
            this.data = res.data.rows;
            this.pagination.total = res.data.total;
          }
        }).catch((e: Error) => {
          console.log(e);
        }).finally(() => {
          this.dataLoading = false;
        });
    },
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
    // 详情
    handleClickDetail(row) {
      this.formConfig = {
        header: '详情',
        visible: true,
        operate: "info",
        size: '40%',
      };
      this.$request.get('/helm/info', {
        params: {
          name: row.appName
        }
      }).then((res) => {
        this.form = res.data.data;
      });
    },
    // 创建应用
    handleSetupContract() {
      this.formConfig = {
        header: '新增',
        visible: true,
        operate: "add",
        size: '50%',
      };
    },
    // 编辑
    handleClickEdit(row) {
      this.formConfig = {
        header: '管理',
        visible: true,
        operate: "edit",
        size: '80%',
      };
    },
    handleClickDelete(row: { rowIndex: any }) {
      this.deleteIdx = row.rowIndex;
      this.confirmVisible = true;
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
      this.getList();
    },
    onSubmit(data) {
      console.log(this.formData);
      this.getList(this.formData);
    },
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

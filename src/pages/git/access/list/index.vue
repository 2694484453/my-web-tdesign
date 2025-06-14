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
            <t-button @click="handleSetupContract">新建</t-button>
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
          :selected-row-keys="selectedRowKeys"
          :loading="dataLoading"
          :headerAffixedTop="true"
          :headerAffixProps="{ offsetTop: offsetTop, container: getContainer }"
        >
          <template #status="{ row }">
            <t-tag v-if="row.status === CONTRACT_STATUS.FAIL" theme="danger" variant="light">校验失败</t-tag>
            <t-tag v-if="row.status === CONTRACT_STATUS.AUDIT_PENDING" theme="warning" variant="light">打包失败</t-tag>
            <t-tag v-if="row.status === CONTRACT_STATUS.EXEC_PENDING" theme="warning" variant="light">未知</t-tag>
            <t-tag v-if="row.status === CONTRACT_STATUS.EXECUTING" theme="success" variant="light">打包中</t-tag>
            <t-tag v-if="row.status === CONTRACT_STATUS.FINISH" theme="success" variant="light">已完成</t-tag>
          </template>
          <template #contractType="{ row }">
            <p v-if="row.contractType === CONTRACT_TYPES.MAIN">审核失败</p>
            <p v-if="row.contractType === CONTRACT_TYPES.SUB">待审核</p>
            <p v-if="row.contractType === CONTRACT_TYPES.SUPPLEMENT">待履行</p>
          </template>
          <template #paymentType="{ row }">
            <p v-if="row.paymentType === CONTRACT_PAYMENT_TYPES.PAYMENT" class="payment-col">
              推送成功
              <trend class="dashboard-item-trend" type="up"/>
            </p>
            <p v-if="row.paymentType === CONTRACT_PAYMENT_TYPES.RECEIPT" class="payment-col">
              推送失败
              <trend class="dashboard-item-trend" type="down"/>
            </p>
          </template>
          <template #html_url="{ row }">
            <a :href="row.html_url" target="_blank">{{ row.html_url }}</a>
          </template>
          <template #op="slotProps">
            <a class="t-button-link" @click="handleClickDetail(slotProps)">详情</a>
            <a class="t-button-link" @click="handleClickEdit(slotProps)">编辑</a>
            <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a>
          </template>
        </t-table>
      </div>
    </t-card>
    <div>
      <t-pagination
        v-model="formData.pageNum"
        :total="pagination.total"
        :page-size.sync="formData.pageSize"
        @current-change="onCurrentChange"
        @page-size-change="onPageSizeChange"
        @change="onChange"/>
    </div>
    <t-dialog
      header="确认删除当前所选？"
      :body="confirmBody"
      :visible.sync="confirmVisible"
      @confirm="onConfirmDelete"
      :onCancel="onCancel"
    >
    </t-dialog>
    <!--抽屉-->
    <t-drawer
      :visible.sync="form.visible"
      :header="form.header"
      :on-overlay-click="() => (form.visible = false)"
      :on-size-drag-end="handleSizeDrag"
      showOverlay
      :sizeDraggable="true"
      placement="right"
      destroyOnClose
      size="30%"
      @close="form.visible = false"
      :onConfirm="handleConfirm"
      @cancel="form.visible = false"
    >
      <t-form>
        <t-form-item label="名称" name="name" initial-data="">
          <t-input v-model="form.name" placeholder="请输入内容"/>
        </t-form-item>
        <t-form-item label="类型" name="type">
          <t-select v-model="form.type" class="demo-select-base" clearable>
            <t-option v-for="(item, index) in typeOptions" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="token" name="accessToken">
          <t-textarea v-model="form.accessToken" placeholder="请填写accessToken" clearable />
        </t-form-item>
        <t-form-item label="主页地址" name="homeUrl" initial-data="">
          <t-input v-model="form.homeUrl" placeholder="请输入内容"/>
        </t-form-item>
        <t-form-item label="描述" name="description">
          <t-textarea v-model="form.description" placeholder="简单描述" clearable />
        </t-form-item>
      </t-form>
      <span v-show="form.action==='add'">

      </span>
      <span v-show="form.action==='detail'">

      </span>
    </t-drawer>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import {SearchIcon} from 'tdesign-icons-vue';
import Trend from '@/components/trend/index.vue';
import {prefix} from '@/config/global';

import {CONTRACT_STATUS, CONTRACT_STATUS_OPTIONS, CONTRACT_TYPES, CONTRACT_PAYMENT_TYPES} from '@/constants';
import {marked} from "marked";
import options = marked.options;

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
          title: '名称',
          align: 'left',
          width: 120,
          ellipsis: true,
          colKey: 'name',
          fixed: 'left',
        },
        {
          title: '类型',
          colKey: 'type',
          width: 80,
          fixed: 'left'
        },
        {
          title: '状态',
          width: 80,
          ellipsis: true,
          colKey: 'status',
        },
        {
          title: '地址',
          width: 200,
          ellipsis: true,
          colKey: 'homeUrl',
        },
        {
          title: '创建人',
          width: 120,
          ellipsis: true,
          colKey: 'createBy',
        },
        {
          title: '描述',
          width: 200,
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
          title: '更新时间',
          width: 200,
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
        defaultPageSize: 10,
        total: 0,
        defaultCurrent: 1,
      },
      searchValue: '',
      confirmVisible: false,
      deleteIdx: -1,
      formData: {
        name: "",
        type: "",
        pageNum: 1,
        pageSize: 10
      },
      form: {
        header: "",
        visible: false,
        name: "",
        type: "",
        homeUrl: "",
        accessToken: "",
        description: "",
        action: "add",
        row: {}
      },
      typeOptions: [
        {
          value: "gitee",
          label: "gitee"
        },
        {
          value: "github",
          label: "github"
        },
        {
          value: "gitlab",
          label: "gitlab"
        },
        {
          value: "gitCode",
          label: "gitCode"
        }
      ]
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
    options, marked,
    getList() {
      this.dataLoading = true;
      this.$request
        .get('/gitAccess/page')
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
    onPageSizeChange(size, pageInfo) {
      console.log('Page Size:', this.pageSize, size, pageInfo);
      // 刷新
      this.formData.pageSize = size
      this.getList()
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
    handleClickDetail(row) {
      //this.$router.push('/build/helmDetail');
      this.$emit('transfer', "detail", row)
      this.form.header = "详情"
      this.form.visible = true
      this.$request.get("/gitAccess/info",{
        params:{
          id:row.id
        }
      }).then(res=>{
        this.form.row = res.data.data
      })
    },
    handleSetupContract() {
      this.form.header = "添加"
      this.form.visible = true
    },
    handleClickDelete(row: { rowIndex: any }) {
      this.deleteIdx = row.rowIndex;
      this.confirmVisible = true;
    },
    handleClickEdit(row) {
      this.form.header = "编辑"
      this.form.visible = true
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
    // 添加
    handleConfirm() {
      this.$request.post("/gitAccess/add",this.form).then(res=>{
        if (res.data.code ===200) {
          this.$message.success(res.data.msg)
          this.form.visible = false;
          this.getList()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    onCancel() {
      this.resetIdx();
    },
    handleSizeDrag({size}) {
      console.log('size drag size: ', size);
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

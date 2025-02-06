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
            <t-button @click="repoForm.visible=true;getRepoList({type:'github'})"> 新建</t-button>
            <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length"> 导出配置</t-button>
            <p v-if="!!selectedRowKeys.length" class="selected-count">已选{{ selectedRowKeys.length }}项</p>
          </div>
          <t-col :span="3">
            <t-form-item label="名称" name="name">
              <t-input v-model="formData.name" :style="{ width: '200px' }" placeholder="请输入内容"/>
            </t-form-item>
          </t-col>
          <t-col :span="3">
            <t-form-item label="类型" name="type">
              <t-select
                v-model="formData.type"
                :style="{ width: '200px' }"
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
          <!--        <t-input v-model="searchValue" class="search-input" placeholder="请输入你需要搜索的内容" clearable>-->
          <!--          <template #suffix-icon>-->
          <!--            <search-icon size="20px"/>-->
          <!--          </template>-->
          <!--        </t-input>-->
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
          <template #metadata.labels="{ row }">
            <span v-for="(value,key) in row.metadata.labels">
              <p>{{ key }}:{{ value }}</p>
            </span>
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
            <a class="t-button-link" @click="handleClickDetail()">执行</a>
            <a class="t-button-link" @click="handleClickDetail()">详情</a>
            <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a>
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
      :onCancel="onCancel">
    </t-dialog>
    <t-dialog
      v-show="repoForm.visible"
      header="选择从你的git应用构建"
      width="40%"
      :confirm-on-enter="true"
      :on-cancel="onFormCancel"
      :on-esc-keydown="onFormEscKeydown"
      :on-close-btn-click="onFormCloseBtnClick"
      :on-overlay-click="onFormOverlayClick"
      :on-close="formClose"
      :on-confirm="onFormConfirmAnother"
    >
      <t-space direction="vertical" style="width: 100%">
        <div>
          <div class="list-card">
            <!-- 搜索区域 -->
            <div class="list-card-operation">
              <t-input v-model="searchValue" class="search-input" placeholder="请输入你需要搜索的内容" clearable>
                <template #suffix-icon>
                  <search-icon v-if="searchValue === ''" size="20px"/>
                </template>
              </t-input>
            </div>
            <!-- 卡片列表 -->
            <template>
              <t-list :split="true">
                <span v-for="item in repoForm.data" :key="item.index">
                <t-list-item>
                  <t-list-item-meta :title="item.name" :description="item.description" />
                </t-list-item>
                </span>
              </t-list>
            </template>
          </div>
        </div>
        <t-pagination v-model="current" v-model:pageSize="pageSize" :total="30"/>
      </t-space>
    </t-dialog>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import {SearchIcon} from 'tdesign-icons-vue';
import Trend from '@/components/trend/index.vue';
import {prefix} from '@/config/global';

import {CONTRACT_STATUS, CONTRACT_STATUS_OPTIONS, CONTRACT_TYPES, CONTRACT_PAYMENT_TYPES} from '@/constants';
import ProductCard from "@/components/product-card/index.vue";

export default Vue.extend({
  name: 'ListBase',
  components: {
    ProductCard,
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
        {
          title: '名称',
          align: 'left',
          width: 220,
          ellipsis: true,
          colKey: 'metadata.name',
          fixed: 'left',
        },
        {
          title: '类型',
          width: 80,
          ellipsis: true,
          fixed: 'left',
          colKey: 'kind',
        },
        {
          title: '状态',
          colKey: 'status.ready',
          width: 100, cell:
            {col: 'status'}
        },
        {
          title: '失败',
          colKey: 'status.failed',
          width: 100, cell:
            {col: 'status'}
        },
        {
          title: '标签',
          width: 200,
          ellipsis: true,
          colKey: 'metadata.labels',
        },
        {
          title: '最近一次执行',
          width: 200,
          ellipsis: true,
          colKey: "status.startTime"
        },
        {
          title: "创建时间",
          width: 200,
          ellipsis: true,
          colKey: "metadata.creationTimestamp"
        },
        {
          align: 'left',
          fixed: 'right',
          width: 150,
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
      deleteType: -1,
      formData: {
        name: "",
        type: "",
        pageNum: 1,
        pageSize: 10
      },
      typeList: [],
      // 对话框
      repoForm: {
        visible: false,
        data: []
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
    //this.getTypeList()
    this.getList()
  },
  methods: {
    getContainer() {
      return document.querySelector('.tdesign-starter-layout');
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
    handleClickDetail() {
      this.$router.push('/detail/base');
    },
    handleSetupContract() {
      this.$router.push('/prometheus/add');
    },
    handleClickDelete(row: { rowIndex: any, type: any }) {
      this.deleteIdx = row.rowIndex;
      this.deleteType = row.type;
      this.confirmVisible = true;
      console.log("this", this.deleteType)
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
      // 请求删除
      this.$request.delete("/monitor/delete", {
        params: {
          index: this.deleteIdx,
          type: this.deleteType
        }
      }).then(res => {
        this.$message.success(res.data.msg);
      }).catch(err => {

      })

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
    getTypeList() {
      this.$request.get("/monitor/typeList").then(res => {
        this.typeList = res.data.data
      }).catch((err) => {

      })
    },
    getList() {
      this.dataLoading = true;
      this.$request
        .get('/devops/page', {
          params: this.formData
        }).then((res) => {
        if (res.data.code === 200) {
          this.data = res.data.rows;
          this.pagination = res.data.total
        }
      }).catch((e: Error) => {
        console.log(e);
      }).finally(() => {
        this.dataLoading = false;
      });
    },
    getRepoList(params) {
      let url = "";
      switch (params.type) {
        case "gitee":
          url = "/gitee/page";
          break;
        case "github":
          url = "/github/page";
          break;
        case "gitlab":
          break;
      }
      this.$request.get(url,{}).then(res=>{
        console.log(res)
        this.repoForm.data=res.data.rows
      })
    },
    // 对话框
    formClose(context) {
      console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', context);
    },
    onFormCancel(context) {
      console.log('点击了取消按钮', context);
      this.repoForm.visible = false;
    },
    onFormEscKeydown(context) {
      console.log('按下了ESC', context);
      this.repoForm.visible = false;
    },
    onFormCloseBtnClick(context) {
      console.log('点击了关闭按钮', context);
      this.repoForm.visible = false; this.formVisible = false;
    },
    onFormConfirmAnother(context) {
      console.log('点击了确认按钮', context);
      this.repoForm.visible = false;
    },
    onFormOverlayClick(context) {
      console.log('点击了蒙层', context);
      this.repoForm.visible = false;
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

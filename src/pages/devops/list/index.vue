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
            <t-button @click="handleSetupContract"> 新建</t-button>
            <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length"> 导出配置</t-button>
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
            <span v-if="row.status.succeeded === 1">
              <t-tag theme="success" variant="light">已完成</t-tag>
            </span>
            <span v-if="row.status.successed === 0">
              <span v-if="row.status.ready === 0">
                <t-tag variant="light">未运行</t-tag>
              </span>
              <span v-if="row.status.ready === 1">
                <t-tag theme="warning" variant="light">运行中</t-tag>
              </span>
              <span v-if="row.status.terminating === 1">
                 <t-tag theme="warning" variant="light">等待中</t-tag>
              </span>
               <t-tag theme="danger" variant="light">失败</t-tag>
            </span>
          </template>
          <template #metadata.labels="{ row }">
            <span v-for="(v,k) in row.metadata.labels">
              <t-tag theme="primary" variant="light">{{ k }}:{{ v }}</t-tag>
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
            <a class="t-button-link" @click="">重试</a>
            <a class="t-button-link" @click="editor.visible = true;handleClickDetail(slotProps.row)">日志流</a>
            <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a>
          </template>
        </t-table>
        <div style="margin-top: 10px">
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
        header="确认删除当前所选？"
        :body="confirmBody"
        :visible.sync="confirmVisible"
        @confirm="onConfirmDelete"
        :onCancel="onCancel">
    </t-dialog>
    <t-drawer
        :visible="editor.visible"
        :header="editor.header"
        :on-overlay-click="() => (editor.visible = false)"
        placement="right"
        :sizeDraggable="true"
        :on-size-drag-end="handleSizeDrag"
        size="50%"
        @cancel="editor.visible = false"
        @onClose="onClose">
      <MonacoEditor :config="editor" :value="editor.value"/>
    </t-drawer>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import {SearchIcon} from 'tdesign-icons-vue';
import Trend from '@/components/trend/index.vue';
import {prefix} from '@/config/global';

import {CONTRACT_STATUS, CONTRACT_STATUS_OPTIONS, CONTRACT_TYPES, CONTRACT_PAYMENT_TYPES} from '@/constants';
import MonacoEditor from "@/components/editor/MonacoEditor.vue";

export default Vue.extend({
  name: 'ListBase',
  components: {
    MonacoEditor,
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
          title: '任务名称',
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
          title: '标签',
          width: 200,
          ellipsis: true,
          colKey: 'metadata.labels',
        },
        {
          title: '状态',
          colKey: 'status',
          width: 100,
          ellipsis: true,
          cell: {col: 'status'}
        },
        {
          title: '命名空间',
          colKey: 'metadata.namespace',
          ellipsis: true,
          width: 100,
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
      deleteType: -1,
      formData: {
        name: "",
        type: "",
        pageNum: 1,
        pageSize: 10,
        selectedJob: {
          jobName: "",
          nameSpace: ""
        }
      },
      typeList: [],
      // monaco
      editor: {
        language: "text",
        fontSize: "15",
        value: "",
        readOnly: true,
        header: "",
        // 抽屉
        visible: false,
      }
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
    handleSizeDrag({size}) {
      console.log('size drag size: ', size);
    },
    handleClickDetail(row) {
      this.editor.header = row.metadata.name
      this.editor.value = ""
      this.formData.selectedJob.jobName = row.metadata.name;
      this.formData.selectedJob.nameSpace = row.metadata.namespace;
      // 连接sse
      this.connectSSE({
        jobName: row.metadata.name,
        nameSpace: row.metadata.namespace
      }, "onmessage")
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
    onClose() {
      this.connectSSE(this.formData.selectedJob, "close")
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
          .get('/devops/job/page', {
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
    connectWebSocket(params) {
      const socket = new WebSocket('ws://ecs.gpg123.vip:9099/ws/podLog?podName=' + params.podName + "&nameSpace=" + params.nameSpace);
      // 连接成功时触发
      socket.onopen = () => {
        console.log('WebSocket connection established');
      };
      // 收到消息时触发
      socket.onmessage = (event) => {
        console.log('Message from server ', event.data);
        this.editor.value = this.editor.value + "\n" + event.data
      };
      // 连接关闭时触发
      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
      // 发生错误时触发
      socket.onerror = (error) => {
        console.error('WebSocket error observed:', error);
      };
    },
    connectSSE(params, operation) {
      const eventSource = new EventSource("https://my-server.gpg123.vip/devops/job/podLogs?jobName=" + params.jobName + "&nameSpace=" + params.nameSpace);
      switch (operation) {
          // 接受
        case "onmessage":
          eventSource.onmessage = (event) => {
            //console.log(event)
            // 传递给monaco
            this.editor.value = this.editor.value + "\n\t" + event.data
          }
          break;
        case "onopen":
          eventSource.onopen = (event) => {
            //console.log(event)
          };
          break;
        case "onerror":
          eventSource.onerror = (event) => {
            //console.log(event)
          };
          break;
        case "close":
          eventSource.close();
          break;
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

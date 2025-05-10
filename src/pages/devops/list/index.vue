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
            <span v-if="row.status === 1">
              <t-tag theme="success" variant="light">已完成</t-tag>
            </span>
            <span v-if="row.status === 2">
              <t-tag theme="warning" variant="light">运行中</t-tag>
            </span>
            <span v-if="row.status === 3">
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
            <a class="t-button-link" @click="">编辑</a>
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
      :visible.sync="editor.visible"
      :header="editor.header"
      :on-overlay-click="() => (editor.visible = false)"
      placement="right"
      destroyOnClose
      showOverlay
      :sizeDraggable="true"
      :on-size-drag-end="handleSizeDrag"
      size="50%"
      @cancel="closeSSE;editor.visible = false"
      @close="handleClose"
      :onConfirm="handleClose">
      <MonacoEditor :config="editor" :value="editor.value"/>
    </t-drawer>
    <t-drawer
        :visible.sync="formConfig.visible"
        :header="formConfig.header"
        :on-overlay-click="() => (editor.visible = false)"
        placement="right"
        destroyOnClose
        showOverlay
        :sizeDraggable="true"
        :on-size-drag-end="handleSizeDrag"
        size="50%"
        @cancel="formConfig.visible = false"
        @close="handleClose"
        :onConfirm="onSubmitCreateJob">
      <t-space direction="vertical" style="width: 80%">
        <t-form
          ref="formValidatorStatus"
          :data="form"
          :rules="rules"
          :label-width="120"
          :status-icon="formStatusIcon"
          @reset="onReset"
        >
          <t-space direction="vertical" size="32px">
            <t-tabs :value="form.step" placement="left" @change="handlerChange">
              <t-tab-panel value="git" label="仓库">
                <p style="padding: 25px;width: 100%;" >
                  <t-form-item label="仓库类型" name="type" >
                    <t-select v-model="form.params.git.taskGitType" placeholder="请选择" @change="getGitRepoList">
                      <t-option v-for="(item,index) in form.gitRepoTypeList" :key="index" :label="item" :value="item" >{{item}}</t-option>
                    </t-select>
                  </t-form-item>
                  <t-form-item label="地址" name="url" >
                    <t-select v-model="form.params.git.taskGitUrl" placeholder="请选择" style="width: 322px">
                      <t-option v-for="item in form.gitRepoList" :key="item.id" :label="item.name" :value="item.gitUrl" >{{item.name}}</t-option>
                    </t-select>
                  </t-form-item>
                  <t-form-item label="分支" name="branch" >
                    <t-input v-model="form.params.git.taskGitBranch" placeholder="请输入内容" :maxlength="32" with="200"></t-input>
                  </t-form-item>
                </p>
              </t-tab-panel>
              <t-tab-panel value="build" label="构建">
                <p style="padding: 25px">
                  <t-form-item label="任务名称" name="taskBuildName" >
                    <t-input v-model="form.params.build.taskBuildName" placeholder="请输入内容" :maxlength="32" with="200"></t-input>
                  </t-form-item>
                  <t-form-item label="任务类型" name="taskBuildType" >
                    <t-select v-model="form.params.build.taskBuildType" placeholder="请选择" style="width: 322px" @change="getTaskBuildImageList">
                      <t-option v-for="(item,index) in form.taskBuildTypeList" :key="index" :label="item" :value="item" >{{item}}</t-option>
                    </t-select>
                  </t-form-item>
                  <t-form-item label="镜像名称" name="taskBuildImage">
                    <t-select v-model="form.params.build.taskBuildImage" placeholder="请选择" style="width: 322px" clearable="">
                      <t-option v-for="(item,index) in form.taskBuildImageList" :key="index" :label="item" :value="item" >{{item}}</t-option>
                    </t-select>
                  </t-form-item>
                  <t-form-item label="容器名称" name="containerName">
                    <t-input v-model="form.params.build.containerName" placeholder="请输入内容"></t-input>
                  </t-form-item>
                  <t-form-item label="环境变量" name="env">
                    <t-input v-model="form.params.build.env" placeholder="请输入内容"></t-input>
                  </t-form-item>
                  <t-form-item label="命令行" name="">
                    <t-textarea
                      v-model="form.params.build.cmd"
                      placeholder="['/bin/sh', '-c', 'xxx']"
                      name="description"
                      :autosize="{ minRows: 3, maxRows: 20 }"
                    />
                  </t-form-item>
                  <t-form-item label="重试机制" name="restartPolicy">
                    <t-input v-model="form.restartPolicy" placeholder="请输入内容"></t-input>
                  </t-form-item>
                </p>
              </t-tab-panel>
              <t-tab-panel value="push" label="推送">
                <p style="padding: 25px">选项卡3</p>
              </t-tab-panel>
              <t-tab-panel value="deploy" label="部署">
                <p style="padding: 25px">选项卡3</p>
              </t-tab-panel>
            </t-tabs>
          </t-space>

        </t-form>
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
          colKey: 'jobName',
          fixed: 'left',
        },
        {
          title: '类型',
          width: 80,
          ellipsis: true,
          fixed: 'left',
          colKey: 'type',
        },
        {
          title: '标签',
          width: 200,
          ellipsis: true,
          colKey: 'labels',
        },
        {
          title: '状态',
          colKey: 'status',
          width: 100,
          ellipsis: true,
        },
        {
          title: '命名空间',
          colKey: 'nameSpace',
          ellipsis: true,
          width: 100,
        },
        {
          title: '最近一次执行',
          width: 200,
          ellipsis: true,
          colKey: "updateTime"
        },
        {
          title: "创建时间",
          width: 200,
          ellipsis: true,
          colKey: "createTime"
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
      },
      form: {
        step: "git",
        params:{
          git: {
            taskGitType: "",
            taskGitUrl: "",
            taskGitBranch: "",
          },
          build: {
            taskBuildName: "",
            taskBuildType: "",
            taskBuildImage: "",
            containerName: "",
            env: [],
            cmd: "",
            restartPolicy: "OnFailure"
          }
        },
        gitRepoList: [],
        gitRepoTypeList: [],
        taskBuildTypeList: [],
        taskBuildImageList: [],
        name: "",
      },
      formConfig: {
        visible: false,
        header: "新增"
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
      },
      selectedJob: {
        jobName: "",
        nameSpace: ""
      },
      eventSource: null,
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
    this.getGitRepoTypeList();
    this.getList();
    this.getTaskBuildTypeList();
  },
  beforeDestroy() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  },
  methods: {
    getGitRepoList() {
      this.dataLoading = true;
      this.$request.get('/git/repo/list',{
        params: {
          type: this.form.params.git.taskGitType,
          name: this.form.params.git.name
        }
      }).then((res) => {
        if (res.data.code === 200) {
          console.log("data",res.data.data)
          this.form.gitRepoList = res.data.data;
        }
      }).catch((e: Error) => {
          console.log(e);
      }).finally(() => {
          this.dataLoading = false;
      });
    },
    getGitRepoTypeList() {
      this.$request.get('/git/common/types').then((res) => {
        if (res.data.code === 200) {
          this.form.gitRepoTypeList = res.data.data;
        }
      }).catch((e: Error) => {
        console.log(e);
      });
    },
    getTaskBuildTypeList() {
      this.$request.get('/devops/common/types').then((res) => {
        if (res.data.code === 200) {
          this.form.taskBuildTypeList = res.data.data;
        }
      }).catch((e: Error) => {
        console.log(e);
      });
    },
    getTaskBuildImageList() {
      console.log("taskBuildType",this.form)
      this.$request.get('/devops/common/images?type=' + this.form.params.build.taskBuildType).then((res) => {
        if (res.data.code === 200) {
          this.form.taskBuildImageList = res.data.data;
        }
      }).catch((e: Error) => {
        console.log(e);
      });
    },
    handlerChange(newValue) {
      this.form.step = newValue;
      switch (newValue) {
        case "git":
          this.getGitRepoTypeList();
          break;
        case "build":
          this.getTaskBuildTypeList();
          break;
      }
    },
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
      this.selectedJob.jobName = row.metadata.name;
      this.selectedJob.nameSpace = row.metadata.namespace;
      // 连接sse
      this.connectSSE({
        jobName: row.metadata.name,
        nameSpace: row.metadata.namespace
      }, "onmessage")
    },
    // 新增
    handleSetupContract() {
      // 打开drawer
      this.formConfig.visible = true;
      this.getGitRepoTypeList();
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
    handleClose() {
      this.closeSSE();
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
    // 创建job
    onSubmitCreateJob() {
      this.$request.post("/devops/job/add", {
        git: this.form.params.git,
        build: this.form.params.build,
        push: this.form.params.push,
        deploy: this.form.params.deploy
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.msg);
          this.formConfig.visible = false;
          this.getList();
        }else {
          this.$message.error(res.data.msg);
        }
      }).catch((err) => {

      })
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
    connectSSE(params) {
      if (!!window.EventSource) {
        // 打开连接
        this.eventSource = new EventSource("https://my-server.gpg123.vip/devops/job/jobLogs?jobName=" + params.jobName + "&nameSpace=" + params.nameSpace);
        // 接收消息
        this.eventSource.onmessage = (event) => {
          //console.log(event)
          // 传递给monaco
          this.editor.value = this.editor.value + "\n\t" + event.data
        }
        // 打开通道
        this.eventSource.onopen = (event) => {
          //console.log(event)
        };
        // 异常
        this.eventSource.onerror = (event) => {
          //console.log(event)
        };
      } else {
        console.log('您的浏览器不支持SSE.');
      }
    },
    closeSSE() {
      console.log("调用关闭SSE...");
      if (this.eventSource) {
        this.eventSource.close();
        console.log("SSE连接已关闭");
      }
    },
  }
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

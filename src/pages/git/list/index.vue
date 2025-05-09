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
            <t-button @click="handleSetupContract">导入</t-button>
            <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length"> 导出</t-button>
            <!--            <p v-if="!!selectedRowKeys.length" class="selected-count">已选{{ selectedRowKeys.length }}项</p>-->
          </div>
          <t-input v-model="searchValue" class="search-input" placeholder="请输入你需要搜索的内容" clearable>
            <template #suffix-icon>
              <search-icon size="20px"/>
            </template>
          </t-input>
          <t-col :span="2" class="operation-container">
            <t-button theme="primary" :style="{ marginLeft: '8px' }" @click="getList"> 查询</t-button>
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
            <!--            <t-tag v-if="row.status === CONTRACT_STATUS.FAIL" theme="danger" variant="light">校验失败</t-tag>-->
            <!--            <t-tag v-if="row.status === CONTRACT_STATUS.AUDIT_PENDING" theme="warning" variant="light">打包失败</t-tag>-->
            <!--            <t-tag v-if="row.status === CONTRACT_STATUS.EXEC_PENDING" theme="warning" variant="light">未知</t-tag>-->
            <!--            <t-tag v-if="row.status === CONTRACT_STATUS.EXECUTING" theme="success" variant="light">打包中</t-tag>-->
            <!--            <t-tag v-if="row.status === CONTRACT_STATUS.FINISH" theme="success" variant="light">已完成</t-tag>-->
          </template>
          <template #language="{ row }">
            <p v-if="row.language === '' || row.language === null">未知</p>
            <p v-else>{{ row.language }}</p>
          </template>
          <template #html_url="{ row }">
            <a :href="row.html_url" target="_blank">{{ row.html_url }}</a>
          </template>
          <template #op="slotProps">
            <a class="t-button-link" @click="handleClickSuccess()">在线预览</a>
            <a class="t-button-link" @click="handleClickDetail(slotProps)">详情</a>
            <a class="t-button-link" @click="handleClickDelete(slotProps.row)">删除</a>
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
      header="确认删除当前所选合同？"
      :body="confirmBody"
      :visible.sync="confirmVisible"
      @confirm="onConfirmDelete"
      :onCancel="onCancel"
    >
    </t-dialog>
    <!--git-->
    <t-dialog
      :visible.sync="dialog.visible"
      :header="dialog.header"
      width="60%"
      :confirm-on-enter="true"
      :on-cancel="onCancel"
      :on-close-btn-click="onCloseDialogBtnClick"
      :on-confirm="onConfirmDialog"
    >
      <t-card class="list-card-container" :bordered="false">
        <div>
            <t-form
              ref="form"
              :data="formData"
              label-align="left"
              @reset="onReset"
              @submit="onSubmit"
              layout="inline"
            >
              <div class="left-operation-container">
                <t-form-item label="名称" name="name">
                  <t-input v-model="dialog.name" style="width: 250px" class="search-input" placeholder="请输入你需要搜索的内容" clearable>
                    <template #suffix-icon>
                      <search-icon size="18px"/>
                    </template>
                  </t-input>
                </t-form-item>
                <t-form-item label="类型" name="type">
                  <t-select
                    v-model="dialog.type"
                    :style="{ width: '120px' }"
                    placeholder="请选择类型"
                    class="demo-select-base"
                    clearable>
                    <t-option v-for="(item, index) in dialog.gitRepoTypeList" :key="index" :value="item" :label="item">
                      {{ item }}
                    </t-option>
                  </t-select>
                </t-form-item>
              </div>
              <div class="right-operation-container">
                <t-button theme="primary" :style="{ marginLeft: '8px' }" @click="getRepoList"> 查询</t-button>
                <t-button type="reset" variant="base" theme="default"> 重置</t-button>
              </div>
            </t-form>
          <t-table
            :columns="dialog.gitRepoColumns"
            :data="dialog.gitRepoList"
            :rowKey="rowKey"
            :selected-row-keys="selectedRowKeys"
            :loading="dataLoading"
            :headerAffixedTop="true"
            :headerAffixProps="{ offsetTop: offsetTop, container: getContainer }"
          >
            <template #html_url="{row}">
              <a :href="row.html_url" target="_blank">{{row.html_url}}</a>
            </template>
            <template #op="slotProps">
              <a class="t-button-link" @click="importRepo(slotProps.row)">导入</a>
            </template>
          </t-table>
        </div>
        <t-pagination v-model="dialog.current" v-model:pageSize="dialog.pageSize" :total="dialog.total"/>
      </t-card>
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
      selectedRowKeys: [1, 2],
      value: 'first',
      columns: [
        {colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left'},
        {
          title: '仓库名称',
          align: 'left',
          width: 200,
          ellipsis: true,
          colKey: 'name',
          fixed: 'left',
        },
        {
          title: "类型",
          align: 'left',
          width: 200,
          ellipsis: true,
          colKey: 'type',
        },
        {
          title: '语言',
          colKey: 'language',
          width: 120
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
          colKey: 'gitUrl',
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
          title: '描述',
          width: 200,
          ellipsis: true,
          colKey: 'description',
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
      deleteIdx: -1,
      formData: {
        name: "",
        type: "",
        pageNum: 1,
        pageSize: 10,
        params: {}
      },
      dialog: {
        visible: false,
        header: "仓库导入",
        current: 1,
        pageSize: 10,
        total: 0,
        type: "gitee",
        name: "",
        gitRepoList: [],
        gitRepoTypeList: [],
        gitRepoColumns: [
          {
            title: '仓库名称',
            align: 'left',
            width: 150,
            ellipsis: true,
            colKey: 'name',
          },
          {
            title: '语言',
            colKey: 'language',
            width: 120
          },
          {
            title: '状态',
            width: 60,
            ellipsis: true,
            colKey: 'status',
          },
          {
            title: '地址',
            width: 160,
            ellipsis: true,
            colKey: 'html_url',
          },
          {
            align: 'left',
            fixed: 'right',
            width: 60,
            colKey: 'op',
            title: '操作',
          },
        ]
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
    this.getList()
  },
  methods: {
    getList() {
      this.dataLoading = true;
      this.$request.get('/git/repo/page', {
        params: this.formData
      }).then((res) => {
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
    getRepoList() {
      this.dataLoading = true;
      this.$request.get('/git/accessRepo/page', {
        params: {
          type: this.dialog.type,
          name: this.dialog.name
        }
      }).then((res) => {
        if (res.data.code === 200) {
          console.log("repos", res.data.rows)
          this.dialog.gitRepoList = res.data.rows;
          this.dialog.total = res.data.total;
        }
      }).catch((e: Error) => {
        console.log(e);
      }).finally(() => {
        this.dataLoading = false;
      });
    },
    getRepoTypeList() {
      this.dataLoading = true;
      this.$request.get('/git/accessRepo/types').then((res) => {
        if (res.data.code === 200) {
          console.log("types", res.data.data)
          this.dialog.gitRepoTypeList = res.data.data;
        }
      })
    },
    getContainer() {
      return document.querySelector('.tdesign-starter-layout');
    },
    // 导入仓库
    importRepo(row) {
      this.$request.post('/git/repo/import?type=' + this.dialog.type, [
        {
          id: row.id,
          name: row.name,
          type: this.dialog.type,
          gitUrl: row.hasOwnProperty("git_url") ? row.git_url : row.html_url,
          language: row.language,
          description: row.description,
          status: row.status,
          htmlUrl: row.html_url,
          sshUrl: row.ssh_url,
          fullName: row.full_name,
          humanName: row.human_name,
        }
      ]).then((res) => {
        if (res.data.code === 200) {
          this.$message.success("导入成功")
          this.getList()
        }
      })
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
    },
    // 点击导入
    handleSetupContract() {
      this.dialog.visible = true
      this.getRepoList()
      this.getRepoTypeList()
    },
    // 点击删除
    handleClickDelete(row: { rowIndex: any }) {
      this.formData.params = row;
      this.deleteIdx = row.rowIndex;
      this.confirmVisible = true;
    },
    handleClickEdit(row) {
      //this.$router.push('/build/helmEdit');
      this.$emit('transfer', "form", row)
    },
    handleClickSuccess() {
      this.$router.push('/build/success');
    },
    // 确认删除
    onConfirmDelete() {
      // 真实业务请发起请求
      this.$request.delete("/git/repo/delete?id="+ this.formData.params.id).then(res=>{
        if (res.data.code === 200) {
          this.$message.success(res.data.msg)
          this.confirmVisible = false;
          this.resetIdx();
          this.getList();
        }
      })
    },
    // 确认对话框
    onConfirmDialog() {

    },
    // 确定关闭对话框
    onCloseDialogBtnClick() {

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

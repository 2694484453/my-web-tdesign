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
          <t-col :span="3">
            <t-form-item label="名称" name="name">
              <t-input v-model="searchForm.name" :style="{ width: '200px' }" placeholder="请输入内容"/>
            </t-form-item>
          </t-col>
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
          <template #repoUrl="{ row }">
            <a v-bind:href="row.repoUrl" target="_blank">{{ row.repoUrl }}</a>
          </template>
          <template #generated="{ row }">
            <p>{{ new Date(row.generated).toLocaleString() }}</p>
          </template>
          <template #status="{ row }">
            <t-tag v-show="row.status === 'success'" theme="success" variant="light">更新成功</t-tag>
            <t-tag v-show="row.status === 'fail'" theme="danger" variant="light">更新失败</t-tag>
          </template>
          <template #op="slotProps">
            <a v-show="!slotProps.row.isInstalled" class="t-button-link" @click="handleClickUpdate(slotProps.row)">更新</a>
            <a class="t-button-link" @click="form.visible=true;handleClickDetail()">详情</a>
            <a class="t-button-link" @click="form.visible=true;handleClickDetail()">修改</a>
            <a v-show="slotProps.row.isInstalled" class="t-button-link" @click="handleClickDelete(slotProps)">删除</a>
          </template>
        </t-table>
        <div style="margin-top: 10px">
          <t-pagination
            v-model="searchForm.pageNum"
            :total="pagination.total"
            :page-size.sync="searchForm.pageSize"
            @current-change="onCurrentChange"
            @page-size-change="onPageSizeChange"
            @change="onChange"
          />
        </div>
      </div>
    </t-card>
    <t-dialog
      :header="confirm.header"
      :body="confirm.body"
      :visible.sync="confirm.visible"
      @confirm="handleClickConfirm"
      :onCancel="onCancel">
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
      :onConfirm="handleInstall"
      @cancel="form.visible = false"
    >
      <span v-show="form.action==='add'">

      </span>
      <span v-show="form.action==='detail'">

      </span>
      <p>抽屉的内容</p>
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
        {
          title: '仓库名称',
          align: 'left',
          width: 120,
          ellipsis: true,
          colKey: 'repoName',
          fixed: 'left',
        },
        {
          title: '制品数量',
          width: 80,
          ellipsis: true,
          fixed: 'left',
          colKey: 'artifactTotal',
        },
        {
          title: '版本数量',
          width: 80,
          ellipsis: true,
          fixed: 'left',
          colKey: 'artifactVersionTotal',
        },
        {
          title: '状态',
          width: 80,
          ellipsis: true,
          fixed: 'left',
          colKey: 'status',
        },
        {
          title: '仓库地址',
          width: 200,
          ellipsis: true,
          colKey: "repoUrl"
        },
        {
          title: '更新时间',
          width: 160,
          ellipsis: true,
          fixed: 'left',
          colKey: 'repoUpdateTime',
        },
        {
          align: 'left',
          fixed: 'right',
          width: 180,
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
      searchForm: {
        name: "",
        version: "",
        type: "",
        pageNum: 1,
        pageSize: 10
      },
      formData: [],
      form: {
        header: "",
        visible: false,
        type: "",
        action: "add",
        row: {}
      },
      confirm: {
        header: "",
        body: "",
        operation: "update",
        visible: false
      },
      typeList: []
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
    this.getTypeList()
    this.getList()
  },
  methods: {
    getContainer() {
      return document.querySelector('.tdesign-starter-layout');
    },
    onPageSizeChange(size, pageInfo) {
      console.log('Page Size:', this.pageSize, size, pageInfo);
      // 刷新
      this.searchForm.pageSize = size
    },
    onCurrentChange(current, pageInfo) {
      console.log('Current Page', this.current, current, pageInfo);
      // 刷新
      this.searchForm.pageNum = current
      this.getList()
    },
    onChange(pageInfo) {
      console.log('Page Info: ', pageInfo);
    },
    // 点击安装
    handleClickInstall(row) {
      this.form.action = 'add'
      this.form.header = '安装' + row.name;
      this.form.row = row
    },
    // 执行安装
    handleInstall() {
      const row = this.form.row
      this.$request.post("/helm/install?name=" + row.name, {
        params: {
          name: row.name,
          status: 'success'
        }
      }).then(res => {
        console.log("安装成功")
        if (res.data.code === 200) {
          this.$message.success(res.data.msg)
          this.form.visible = false;
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 更新
    handleClickUpdate(row) {
      this.confirm.visible = true;
      this.confirm.header = "确定要更新吗？";
      this.confirm.body = `可能需要几十秒到几分钟时间`;
      this.confirm.operation = 'update'
      this.form = row;
    },
    // 对话框确定
    handleClickConfirm() {
      switch (this.confirm.operation) {
        case "update":
          this.$request.post("/helmRepo/update?repoName=" + this.form.repoName).then(res => {

          })
          break;
        case "default":
          break;
      }
      this.confirm.visible = false;
      this.getList();
    },
    // 点击详情
    handleClickDetail() {
      this.form.action = 'detail'
      this.$router.push('/detail/base');
    },
    handleSetupContract() {
      this.$router.push('/prometheus/add');
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
      this.getList();
    },
    onSubmit(data) {
      console.log(this.formData);
      this.getList(this.formData);
    },
    getTypeList() {
      this.$request.get("/imageRepo/typeList").then(res => {
        this.typeList = res.data.data
      }).catch((err) => {

      })
    },
    // 分页查询
    getList() {
      this.dataLoading = true;
      this.$request.get('/helmRepo/page', {
        params: this.searchForm
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

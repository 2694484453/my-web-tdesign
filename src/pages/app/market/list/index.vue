<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-form
        ref="form"
        :data="formData"
        :label-width="80"
        colon
        @reset="onReset"
        @submit="drawer.operation='search';handleSubmit()"
        :style="{ marginBottom: '8px' }"
      >
        <t-row justify="space-between">
          <div class="left-operation-container">
            <t-button @click="handleSetupContract">添加仓库</t-button>
            <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length">导出仓库</t-button>
            <p v-if="!!selectedRowKeys.length" class="selected-count">已选{{ selectedRowKeys.length }}项</p>
          </div>
          <t-col :span="3">
            <t-form-item label="名称" name="name">
              <t-input v-model="searchForm.repoName" :style="{ width: '200px' }" placeholder="请输入内容"/>
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
            <t-tag v-show="row.status === 'updating'" theme="warning" variant="light">更新中</t-tag>
            <t-tag v-show="row.status === 'init'" theme="default" variant="light">未更新</t-tag>
            <t-tag v-show="row.status === 'fail'" theme="danger" variant="light">更新失败</t-tag>
            <t-tag v-show="row.status === 'deleting'" theme="warning" variant="light">删除中</t-tag>
          </template>
          <template #op="slotProps">
            <a class="t-button-link" @click="handleClickUpdate(slotProps.row)">更新</a>
            <a class="t-button-link" @click="handleClickDetail(slotProps.row)">详情</a>
            <a class="t-button-link" @click="handleClickDetail(slotProps.row)">编辑</a>
            <a class="t-button-link" @click="handleClickDelete(slotProps.row)">删除</a>
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
      @confirm="handleSubmit"
      :onCancel="onCancel">
    </t-dialog>
    <!--抽屉-->
    <t-drawer
      :visible.sync="drawer.visible"
      :header="drawer.header"
      :on-overlay-click="() => (drawer.visible = false)"
      :on-size-drag-end="handleSizeDrag"
      showOverlay
      :sizeDraggable="true"
      placement="right"
      destroyOnClose
      size="30%"
      @close="drawer.visible = false"
      :onConfirm="handleSubmit"
      @cancel="drawer.visible = false"
    >
      <t-space v-show="drawer.operation === 'add'||'edit'" direction="vertical" style="width: 100%">
        <t-form
          ref="formValidatorStatus"
          :data="form"
          :label-width="100"
          @reset="onReset"
        >
        <t-form-item label="id" name="id" v-show="false">
          <t-input v-model="form.id" :maxlength="32" with="120"></t-input>
        </t-form-item>
        <t-form-item label="仓库名称" name="repoName">
          <t-input v-model="form.repoName" placeholder="请输入仓库名称" :maxlength="64" with="120"></t-input>
        </t-form-item>
        <t-form-item label="仓库地址" name="repoUrl">
          <t-input v-model="form.repoUrl" placeholder="请输入仓库地址" :maxlength="64" with="120"></t-input>
        </t-form-item>
        </t-form>
      </t-space>
      <t-space v-show="drawer.operation === 'info'" direction="vertical" style="width: 100%" >
        <t-descriptions :title="form.repoName+'详情'" bordered :layout="'vertical'" :item-layout="'horizontal'" :column="3">
          <t-descriptions-item label="仓库名称" >{{form.repoName}}</t-descriptions-item>
          <t-descriptions-item label="仓库地址">{{form.repoUrl}}</t-descriptions-item>
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
          width: 160,
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
        repoName: "",
        pageNum: 1,
        pageSize: 10
      },
      formData: [],
      drawer: {
        header: "",
        visible: false,
        type: "",
        operation: "add",
        row: {}
      },
      confirm: {
        header: "",
        body: "",
        operation: "update",
        visible: false
      },
      form: {
        id: "",
        repoName: "",
        repoUrl: ""
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
  watch: {
    // form(newVal, oldVal) {
    //   console.log(newVal, oldVal)
    // },
    drawer(newVal, oldVal) {
      console.log(oldVal.operation, newVal.operation)
    }
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
    // 更新
    handleClickUpdate(row) {
      this.confirm.visible = true;
      this.confirm.header = "确定要更新吗？";
      this.confirm.body = `可能需要几十秒到几分钟时间`;
      this.drawer.operation = 'update'
      this.form = row;
    },
    // 点击详情
    handleClickDetail(row) {
      this.drawer.visible = true;
      this.drawer.header = "详情";
      this.drawer.operation = 'info';
      this.form = row;
    },
    // 添加仓库
    handleSetupContract() {
      this.form = {};
      this.drawer.visible = true;
      this.drawer.header = "新增";
      this.drawer.operation = 'add';
    },
    // 删除
    handleClickDelete(row) {
      this.confirm.visible = true;
      this.confirm.header = "确定要删除吗？";
      this.confirm.body = "一旦删除成功后，无法恢复！";
      this.drawer.operation = 'delete';
      this.form = row;
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
    // 提交执行创建
    handleSubmit() {
      switch (this.drawer.operation) {
        // 添加
        case "add":
          this.$request.post("/helmRepo/add", this.form).then(res=>{
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              this.drawer.visible = false;
              this.getList();
            }else {
              this.$message.error(res.data.msg);
            }
          })
          break;
        case "edit":
          break;
        case "update":
          this.$request.put("/helmRepo/update?repoName=" + this.form.repoName).then(res => {
            if(res.data.code === 200) {
              this.$message.success(res.data.msg);
              this.confirm.visible = false;
              this.getList();
            }else {
              this.$message.error(res.data.msg);
            }
          })
          break;
        case "delete":
          this.$request.delete("helmRepo/delete?repoName=" + this.form.repoName).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg)
              this.confirm.visible = false;
              this.getList();
            }else {
              this.$message.error(res.data.msg);
            }
          })
          break;
        case "search":
          this.getList(this.formData);
          break;
        case "default":
          break;
      }
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

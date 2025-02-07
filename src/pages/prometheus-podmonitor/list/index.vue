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
        :style="{ marginBottom: '8px' }">
        <t-row justify="space-between">
          <div class="left-operation-container">
            <t-button @click="handleSetupContract">添加</t-button>
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
                clearable>
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
          :pagination="pagination"
          :selected-row-keys="selectedRowKeys"
          :loading="dataLoading"
          @page-change="rehandlePageChange"
          @change="rehandleChange"
          @select-change="rehandleSelectChange"
          :headerAffixedTop="true"
          :headerAffixProps="{ offsetTop: offsetTop, container: getContainer }"
        >
          <template #metadata.labels="{ row }">
            {{row}}
            <span v-for="(v,k) in row.metadata.labels" :key="k">
              {{k}}:{{v}}
            </span>
          </template>
          <template #contractType="{ row }">
            <p v-if="row.contractType === CONTRACT_TYPES.MAIN">审核失败</p>
            <p v-if="row.contractType === CONTRACT_TYPES.SUB">待审核</p>
            <p v-if="row.contractType === CONTRACT_TYPES.SUPPLEMENT">待履行</p>
          </template>
          <template #op="{row}">
            <a class="t-button-link" @click="handleClickDetail(row)">详情</a>
            <a class="t-button-link" @click="handleClickDelete(row)">删除</a>
          </template>
        </t-table>
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
          title: '名称',
          align: 'left',
          width: 180,
          ellipsis: true,
          colKey: 'metadata.name',
          fixed: 'left',
        },
        {
          title: '类型',
          width: 120,
          ellipsis: true,
          fixed: 'left',
          colKey: 'kind',
        },
        {
          title: '标签',
          width: 180,
          ellipsis: true,
          colKey: 'labels',
        },
        {
          title: '命名空间',
          align: 'left',
          width: 120,
          ellipsis: true,
          colKey: 'metadata.namespace',
          fixed: 'left',
        },
        {
          title: '状态',
          colKey: 'metadata.namespace',
          width: 100, cell:
            {col: 'status'}
        },
        {
          title: '创建时间',
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
        type: ""
      },
      typeList: []
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
    this.getTypeList()
    this.getList()
  },
  methods: {
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
      //this.$router.push('/detail/base');
      //console.log("id", row)
      const rowData = [
        {
          name: "id",
          value: row.id,
        },
        {
          name: '名称',
          value: row.name,
        }
      ]
      this.$emit('transfer', "detail", rowData)
    },
    handleSetupContract() {
      //this.$router.push('/prometheus/add');
      this.$emit('transfer', "form")
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
      this.$request.get("/monitorCloud/typeList").then(res => {
        this.typeList = res.data.data
      }).catch((err) => {

      })
    },
    getList() {
      this.dataLoading = true;
      this.$request
        .get('/monitorCloud/page', {
          params: this.formData
        }).then((res) => {
        if (res.data.code === 200) {
          //console.log(res.data.data)
          this.data = res.data.rows;
          //console.log(this.data)
          this.pagination = {
            ...this.pagination,
            total: res.data.data.length,
          };
        }
      })
        .catch((e: Error) => {
          console.log(e);
        })
        .finally(() => {
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

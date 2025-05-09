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
    <t-space>
      <t-dialog
        v-model:visible="dialog.visible"
        :header="dialog.header"
        width="40%"
        :confirm-on-enter="true"
        :on-cancel="onCancel"
        :on-close-btn-click="onCloseDialogBtnClick"
        :on-confirm="onConfirmDialog"
      >
        <t-space direction="vertical" style="width: 100%">
          <div>
            <t-card :bordered="false">
              <t-form
                ref="form"
                :data="formData"
                :rules="FORM_RULES"
                label-align="top"
                :label-width="100"
                @reset="onReset"
                @submit="onSubmit"
              >
                <div class="form-basic-container">
                  <div class="form-basic-item">
                    <div class="form-basic-container-title">合同信息</div>
                    <!-- 表单内容 -->
                    <!-- 合同名称,合同类型 -->
                    <t-row class="row-gap" :gutter="[16, 24]">
                      <t-col :span="6">
                        <t-form-item label="合同名称" name="name">
                          <t-input v-model="formData.name" :style="{ width: '322px' }" placeholder="请输入内容"/>
                        </t-form-item>
                      </t-col>
                      <t-col :span="6">
                        <t-form-item label="合同类型" name="type">
                          <t-select
                            v-model="formData.type"
                            :style="{ width: '322px' }"
                            placeholder="请选择类型"
                            class="demo-select-base"
                            clearable
                          >
                            <t-option v-for="(item, index) in typeOptions" :key="index" :value="item.value"
                                      :label="item.label">
                              {{ item.label }}
                            </t-option>
                          </t-select>
                        </t-form-item>
                      </t-col>
                      <!-- 合同收付类型 -->
                      <t-col :span="8">
                        <t-form-item label="合同收付类型" name="payment">
                          <t-radio-group v-model="formData.payment">
                            <t-radio value="1"> 收款</t-radio>
                            <t-radio value="2"> 付款</t-radio>
                          </t-radio-group>
                          <span class="space-item"/>
                          <t-input placeholder="请输入金额" :style="{ width: '160px' }"/>
                        </t-form-item>
                      </t-col>

                      <t-col :span="6">
                        <t-form-item label="甲方" name="partyA">
                          <t-select
                            v-model="formData.partyA"
                            :style="{ width: '322px' }"
                            class="demo-select-base"
                            placeholder="请选择类型"
                            clearable>
                            <t-option v-for="(item, index) in partyAOptions" :key="index" :value="item.value"
                                      :label="item.label">
                              {{ item.label }}
                            </t-option>
                          </t-select>
                        </t-form-item>
                      </t-col>
                      <t-col :span="6">
                        <t-form-item label="乙方" name="partyB">
                          <t-select
                            v-model="formData.partyB"
                            :style="{ width: '322px' }"
                            placeholder="请选择类型"
                            class="demo-select-base"
                            clearable
                          >
                            <t-option v-for="(item, index) in partyBOptions" :key="index" :value="item.value"
                                      :label="item.label">
                              {{ item.label }}
                            </t-option>
                          </t-select>
                        </t-form-item>
                      </t-col>
                      <t-col :span="6">
                        <t-form-item label="合同签订日期" name="signDate">
                          <t-date-picker
                            v-model="formData.signDate"
                            :style="{ width: '322px' }"
                            theme="primary"
                            mode="date"
                            separator="/"
                          />
                        </t-form-item>
                      </t-col>
                      <t-col :span="6">
                        <t-form-item label="合同生效日期" name="startDate">
                          <t-date-picker
                            v-model="formData.startDate"
                            :style="{ width: '322px' }"
                            theme="primary"
                            mode="date"
                            separator="/"
                          />
                        </t-form-item>
                      </t-col>
                      <t-col :span="6">
                        <t-form-item label="合同结束日期" name="endDate">
                          <t-date-picker
                            v-model="formData.endDate"
                            :style="{ width: '322px' }"
                            theme="primary"
                            mode="date"
                            separator="/"
                          />
                        </t-form-item>
                      </t-col>
                      <t-col :span="6">
                        <t-form-item label="" name="files">
                          <t-upload
                            v-model="formData.files"
                            action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
                            tips="请上传pdf文件，大小在60M以内"
                            :size-limit="{ size: 60, unit: 'MB' }"
                            :format-response="formatResponse"
                            :before-upload="beforeUpload"
                            @fail="handleFail"
                          >
                            <t-button class="form-submit-upload-btn" variant="outline"> 上传合同文件</t-button>
                          </t-upload>
                        </t-form-item>
                      </t-col>
                    </t-row>
                    <div class="form-basic-container-title form-title-gap">其它信息</div>
                    <t-form-item label="备注" name="comment">
                      <t-textarea v-model="formData.comment" :height="124" placeholder="请输入备注"/>
                    </t-form-item>
                    <t-form-item label="公证人">
                      <t-avatar-group>
                        <t-avatar>D</t-avatar>
                        <t-avatar>S</t-avatar>
                        <t-avatar>+</t-avatar>
                      </t-avatar-group>
                    </t-form-item>
                  </div>
                </div>

                <div class="form-submit-container">
                  <div class="form-submit-sub">
                    <div class="form-submit-left">
                      <t-button theme="primary" class="form-submit-confirm" type="submit"> 提交</t-button>
                      <t-button type="reset" class="form-submit-cancel" theme="default" variant="base"> 取消</t-button>
                    </div>
                  </div>
                </div>
              </t-form>
            </t-card>
          </div>
          <t-pagination v-model="dialog.current" v-model:pageSize="dialog.pageSize" :total="30"/>
        </t-space>
      </t-dialog>
    </t-space>
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
        type: "gitee",
        pageNum: 1,
        pageSize: 10
      },
      dialog: {
        visible: false,
        header: "仓库导入",
        current: 1,
        pageSize: 10,
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
    },
    handleSetupContract() {
      this.dialog.visible = true
    },
    handleClickDelete(row: { rowIndex: any }) {
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

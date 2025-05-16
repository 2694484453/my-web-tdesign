<template>
  <div>
    <t-row :gutter="[16, 16]">
      <t-col :flex="3">
        <div class="user-left-greeting">
          <div>
            Hi，{{form.nickName}}
            <span class="regular"> 下午好，今天是你加入云服务平台的第 {{Math.round((new Date().getTime() -new Date(form.createTime).getTime())/ (1000 * 3600 * 24))}} 天～</span>
          </div>
          <img src="@/assets/assets-tencent-logo.png" class="logo"/>
        </div>

        <t-card class="user-info-list" title="个人信息" :bordered="false">
          <div style="float: right;position: relative">
            <t-button theme="default" shape="square" variant="text" style="width: 120px;float: right" @click="handleClickEdit">
              <edit-icon size="18"/>编辑信息
            </t-button>
          </div>
          <t-row class="content" justify="space-between">
            <t-col v-for="(item, index) in USER_INFO_LIST" :key="index" class="contract" :span="item.span || 3">
              <div class="contract-title">
                {{ item.title }}
              </div>
              <div class="contract-detail">
                {{ item.content }}
              </div>
            </t-col>
          </t-row>
        </t-card>

        <t-card class="content-container" :bordered="false">
          <t-tabs value="second">
            <t-tab-panel value="first" label="内容列表">
              <p>内容列表</p>
            </t-tab-panel>
            <t-tab-panel value="second" label="内容列表">
              <t-card :bordered="false" title="主页访问数据" subtitle="（次）">
                <template #options>
                  <t-date-rang-picker
                    class="card-date-picker-container"
                    :default-value="LAST_7_DAYS"
                    theme="primary"
                    mode="date"
                    @change="onLineChange"
                  />
                </template>
                <div id="lineContainer" style="width: 100%; height: 330px"/>
              </t-card>
            </t-tab-panel>
            <t-tab-panel value="third" label="内容列表">
              <p>内容列表</p>
            </t-tab-panel>
          </t-tabs>
        </t-card>
      </t-col>
      <t-col :flex="1">
        <t-card class="user-intro" :bordered="false">
          <t-avatar size="90px">T</t-avatar>
          <div class="name">My Account</div>
          <div class="position">XXG 港澳业务拓展组员工 直客销售</div>
        </t-card>

        <t-card title="团队成员" class="user-team" :bordered="false">
          <template #option>
            <t-button theme="default" shape="square" variant="text">
              <edit-icon size="18"/>
            </t-button>
          </template>
          <t-list :split="false">
            <t-list-item v-for="(item, index) in TEAM_MEMBERS" :key="index">
              <t-list-item-meta :image="item.avatar" :title="item.title" :description="item.description"/>
            </t-list-item>
          </t-list>
        </t-card>

        <t-card title="服务产品" class="product-container" :bordered="false">
          <template #option>
            <t-button theme="default" shape="square" variant="text">
              <edit-icon size="18"/>
            </t-button>
          </template>
          <t-row class="content" :getters="16">
            <t-col :span="3">
              <product-a-icon/>
            </t-col>
            <t-col :span="3">
              <product-b-icon/>
            </t-col>
            <t-col :span="3">
              <product-c-icon/>
            </t-col>
            <t-col :span="3">
              <product-d-icon/>
            </t-col>
          </t-row>
        </t-card>
      </t-col>
    </t-row>
    <t-drawer
      :visible.sync="formConfig.visible"
      :header="formConfig.header"
      :on-overlay-click="() => (formConfig.visible = false)"
      placement="right"
      destroyOnClose
      showOverlay
      :sizeDraggable="true"
      :on-size-drag-end="handleSizeDrag"
      size="40%"
      @cancel="formConfig.visible = false"
      @close="handleClose"
      :onConfirm="onSubmit">
      <t-space direction="vertical" style="width: 100%">
        <t-form
          ref="formValidatorStatus"
          :data="form"
          :rules="rules"
          :label-width="120"
          :status-icon="formStatusIcon"
          @reset="onReset"
        >
          <t-form-item label="id" name="id" v-show="false">
            <t-input v-model="form.id" placeholder="请输入内容" :maxlength="32" with="200"></t-input>
          </t-form-item>
          <t-form-item label="名称" name="nickName" >
            <t-input v-model="form.nickName" placeholder="请输入名称" :maxlength="32" with="200"></t-input>
          </t-form-item>
          <t-form-item label="性别" name="sex" >
            <t-input v-model="form.sex" placeholder="请输入性别" :maxlength="32" with="200"></t-input>
          </t-form-item>
          <t-form-item label="电话" name="phonenumber" >
            <t-input v-model="form.phonenumber" placeholder="请选择"></t-input>
          </t-form-item>
          <t-form-item label="邮箱" name="email" >
            <t-input v-model="form.email" placeholder="请选择" style="width: 322px"></t-input>
          </t-form-item>
          <t-form-item label="备注" name="remark" >
            <t-textarea v-model="form.remark" placeholder="请输入备注内容" :maxlength="120" with="200"></t-textarea>
          </t-form-item>
        </t-form>
      </t-space>
    </t-drawer>
  </div>
</template>
<script>
import {GridComponent, TooltipComponent, LegendComponent} from 'echarts/components';
import {LineChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
import * as echarts from 'echarts/core';
import {EditIcon} from 'tdesign-icons-vue';

import {mapState} from 'vuex';

import {getFolderLineDataSet} from './index';
import {changeChartsTheme} from '@/utils/color';
import {LAST_7_DAYS} from '@/utils/date';

import {USER_INFO_LIST, TEAM_MEMBERS, PRODUCT_LIST} from '@/service/service-user';
import ProductAIcon from '@/assets/assets-product-1.svg';
import ProductBIcon from '@/assets/assets-product-2.svg';
import ProductCIcon from '@/assets/assets-product-3.svg';
import ProductDIcon from '@/assets/assets-product-4.svg';

echarts.use([GridComponent, TooltipComponent, LineChart, CanvasRenderer, LegendComponent]);

export default {
  name: 'UserIndex',
  components: {
    ProductAIcon,
    ProductBIcon,
    ProductCIcon,
    ProductDIcon,
    EditIcon,
  },
  data() {
    return {
      dashboardBase: '',
      lineContainer: '',
      lineChart: '',
      LAST_7_DAYS,
      USER_INFO_LIST: [],
      TEAM_MEMBERS,
      PRODUCT_LIST,
      formConfig: {
        visible: false,
        header: '新增',
      },
      form: {
        id: '',
        nickName: '',
        phonenumber: '',
        email: '',
        sex: '',
        createTime: '',
        updateTime: '',
        remark: '',
      },
    };
  },
  computed: {
    ...mapState('setting', ['brandTheme', 'mode']),
  },
  watch: {
    brandTheme() {
      changeChartsTheme([this.lineChart]);
    },
    mode() {
      this.renderCharts();
    },
    lineChart() {
      this.updateContainer();
    },
  },
  mounted() {
    window.addEventListener('resize', this.updateContainer, false);
    this.renderCharts();
    this.$nextTick(() => {
      this.updateContainer();
    });
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    // 获取信息
    getUserInfo() {
      this.USER_INFO_LIST = [];
      this.$request.get("/getInfo").then(res => {
        if (res.data.code === 200) {
          this.form = res.data.user;
          this.USER_INFO_LIST.push(
            {
              title: '昵称',
              content: this.form.nickName,
            },
            {
              title: '手机',
              content: this.form.phonenumber,
            },
            {
              title: '邮箱',
              content: this.form.email,
            },
            {
              title: '管理主体',
              content: this.form.nickName,
            },
            {
              title: '备注',
              content: this.form.remark,
            }
          )
        }
      })
    },
    // 点击编辑
    handleClickEdit() {
      this.formConfig.header = "编辑";
      this.formConfig.visible = true;
    },
    // 提交信息
    onSubmit() {
      this.$request.put("/system/user/profile/updateProfile",this.form).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.msg);
          this.formConfig.visible = false;
          this.getUserInfo();
        }
      })
    },
    /** 图表选择 */
    onLineChange(value) {
      this.lineChart.setOption(getFolderLineDataSet({dateTime: value}));
    },
    updateContainer() {
      this.lineChart.resize?.({
        width: this.lineContainer.clientWidth,
        height: this.lineContainer.clientHeight,
      });
    },
    renderCharts() {
      const {chartColors} = this.$store.state.setting;
      if (!this.lineContainer) {
        this.lineContainer = document.getElementById('lineContainer');
      }
      this.lineChart = echarts.init(this.lineContainer);
      this.lineChart.setOption({
        grid: {
          x: 30, // 默认是80px
          y: 30, // 默认是60px
          x2: 10, // 默认80px
          y2: 30, // 默认60px
        },
        ...getFolderLineDataSet({...chartColors}),
      });
    },
    getIcon(type) {
      const typeMap = {
        a: ProductAIcon,
        b: ProductBIcon,
        c: ProductCIcon,
        d: ProductDIcon,
      };
      return typeMap[type || 'a'];
    },
  },
};
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>

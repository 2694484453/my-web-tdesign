<template>
  <div class="detail-base">
    <t-card title="基本信息" :bordered="false" class="info-block">
      <t-descriptions>
        <t-descriptions-item v-for="(item, index) in baseInfoData" :key="index" :label="item.name">
          <span
            slot="content"
            :class="{
              ['inProgress']: item.type && item.type.value === 'inProgress',
              ['pdf']: item.type && item.type.value === 'pdf',
            }"
          >
            <i v-if="item.type && item.type.key === 'contractStatus'" />
            {{ item.value }}
          </span>
        </t-descriptions-item>
      </t-descriptions>
    </t-card>

    <t-card title="构建记录" class="container-base-margin-top" :bordered="false">
      <t-steps class="detail-base-info-steps" layout="vertical" theme="dot" :current="1">
        <t-step-item title="执行打包" content="这里是提示文字" />
        <t-step-item title="修改values.yaml" content="这里是提示文字" />
        <t-step-item title="新建chart" content="2020-12-01 15:00:00 管理员-李川操作" />
      </t-steps>
    </t-card>
  </div>
</template>
<script>
import { prefix } from '@/config/global';
import model from '@/service/service-detail-base';

export default {
  name: 'DetailBase',
  data() {
    return {
      prefix,
      baseInfoData: [
        {
          name: 'chart名称',
          value: 'spring-boot-demo',
        },
        {
          name: '状态',
          value: '打包中',
          type: {
            key: 'contractStatus',
            value: 'inProgress',
          },
        },
        {
          name: '编号',
          value: 'BH00010',
        },
        {
          name: '类型',
          value: '应用类型A',
        },
        {
          name: '仓库地址',
          value: 'hangzhou.aliyun.resgisty.com',
        },
        {
          name: '用户名',
          value: '欧尚',
        },
        {
          name: '密码',
          value: 'xxx',
        },
        {
          name: '创建人',
          value: 'admin',
        },
        {
          name: '备注',
          value: '--',
        },
        {
          name: '创建时间',
          value: '2020-12-22 10:00:00',
        },
      ],
    };
  },
  methods: {},
};
</script>
<style lang="less" scoped>
@import 'index';
</style>

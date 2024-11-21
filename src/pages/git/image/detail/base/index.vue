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

    <t-card title="构建执行记录" class="container-base-margin-top" :bordered="false">
      <t-steps class="detail-base-info-steps" layout="vertical" theme="dot" :current="1">
        <t-step-item title="上传dockerfile" content="这里是提示文字" />
        <t-step-item title="修改" content="这里是提示文字" />
        <t-step-item title="新建" content="2020-12-01 15:00:00 管理员-李川操作" />
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
          name: '镜像名称',
          value: 'cloud-app-service',
        },
        {
          name: '状态',
          value: '构建中',
          type: {
            key: 'contractStatus',
            value: 'inProgress',
          },
        },
        {
          name: '镜像编号',
          value: 'BH00010',
        },
        {
          name: '类型',
          value: 'AMD',
        },
        {
          name: '镜像仓库',
          value: 'hangzhou.aliyun.resgistry.com',
        },
        {
          name: '用户名',
          value: 'admin',
        },
        {
          name: '用户密码',
          value: 'xxxx',
        },
        {
          name: '备注',
          value: '--',
        },
        {
          name: '创建时间',
          value: '2020-12-22 10:00:00',
        },
        {
          name: '修改时间',
          value: '2020-12-23 10:00:00',
        },
        {
          name: '创建人',
          value: '张三',
        },
      ],
    };
  },
  methods: {},
};
</script>
<style lang="less" scoped>
@import './index';
</style>

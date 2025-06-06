<template>
  <div class="detail-base">
    <t-card title="基本信息" :bordered="false" class="info-block">
      <t-descriptions>
        <t-descriptions-item v-for="(item, index) in rowData" :key="index" :label="item.name">
             <span
               slot="content"
               :class="{
                        ['inProgress']: item.type && item.type.value === 'inProgress',
                        ['pdf']: item.type && item.type.value === 'pdf',
                      }"
             >
               <i v-if="item.type && item.type.key === 'contractStatus'"/>
                {{ item.value }}
             </span>
        </t-descriptions-item>
      </t-descriptions>
    </t-card>
<!--    {{ row }}-->
    <t-card title="构建记录" class="container-base-margin-top" :bordered="false">
      <t-steps class="detail-base-info-steps" layout="vertical" theme="dot" :current="1">
        <t-step-item title="执行打包" content="这里是提示文字"/>
        <t-step-item title="修改values.yaml" content="这里是提示文字"/>
        <t-step-item title="新建chart" content="2020-12-01 15:00:00 管理员-李川操作"/>
      </t-steps>
    </t-card>
  </div>
</template>
<script>
import {prefix} from '@/config/global';

export default {
  name: 'DetailBase',
  props: ['rowData'],
  data() {
    return {
      prefix,
      baseInfoData: [],
    };
  },
  methods: {},
  created() {
  },
  mounted() {
  },
  watch: {
    row: function (newVal, oldVal) {
      this.baseInfoData = [
        {
          name: '名称',
          value: newVal.name,
        }, {
          name: '名称',
          value: newVal.name,
        }
      ]
      // this.baseInfoData.push(
      //   {
      //     name: '名称',
      //     value: newVal.name,
      //   }
      // )
      // [
      // {
      //   name: '名称',
      //   value: row.name,
      // },
      //   {
      //     name: 'ID',
      //     value: row.id,
      //   },
      //   {
      //     name: '名称',
      //     value: row.name,
      //   },
      //   {
      //     name: '类型',
      //     value: row.type,
      //   }
      // ]
    }
  }
};
</script>
<style lang="less" scoped>
@import 'index';
</style>

<template>
  <t-space direction="vertical">
    <div>
      <t-layout>
        <t-layout>
          <t-content>
            <t-row :gutter="16">
              <t-col :span="3">
                <div>
                  <t-card title="Java链路追踪" :subtitle="subtitle" hover-shadow :style="{ width: '300px',height:'150px' }">
                    <t-image src="https://dev-1306623386.cos.ap-shanghai.myqcloud.com/icon/code/java.png" :style="{ width: '60px', height: '60px' }"></t-image>
                    <template #actions>
                      <a href="javascript:void(0)" @click="clickHandler">操作</a>
                    </template>
                  </t-card>
                </div>
              </t-col>
              <t-col :span="3">
                <div>
                  <t-card title="Go链路追踪" :subtitle="subtitle" hover-shadow :style="{ width: '300px',height:'150px' }">
                    <t-image src="https://dev-1306623386.cos.ap-shanghai.myqcloud.com/icon/code/Golang.png" :style="{ width: '60px', height: '60px' }"></t-image>
                    <template #actions>
                      <a href="javascript:void(0)" @click="clickHandler">操作</a>
                    </template>
                  </t-card>
                </div>
              </t-col>
              <t-col :span="3">
                <div>
                  <t-card title="Nodejs链路追踪" :subtitle="subtitle" hover-shadow :style="{ width: '300px',height:'150px' }">
                  <t-image src="https://dev-1306623386.cos.ap-shanghai.myqcloud.com/icon/code/Node.js.png" :style="{ width: '60px', height: '60px' }"></t-image>
                  <template #actions>
                    <a href="javascript:void(0)" @click="clickHandler">操作</a>
                  </template>
                </t-card>
                </div>
              </t-col>
              <t-col :span="3">
                <div>
                  <t-card title="Python链路追踪" :subtitle="subtitle" hover-shadow :style="{ width: '300px',height:'150px' }">
                    <t-image src="https://dev-1306623386.cos.ap-shanghai.myqcloud.com/icon/code/Python.png" :style="{ width: '60px', height: '60px' }"></t-image>
                    <template #actions>
                      <a href="javascript:void(0)" @click="clickHandler">操作</a>
                    </template>
                  </t-card>
                </div>
              </t-col>
            </t-row>
          </t-content>
          <t-aside>
            <t-anchor>
              <t-anchor-item href="" title="后端应用"/>
              <t-anchor-item href="" title="开源框架"/>
              <t-anchor-item href="" title="LLM应用"/>
            </t-anchor>
          </t-aside>
        </t-layout>
      </t-layout>
    </div>
  </t-space>
</template>
<script lang="ts">

export default {
  name: "index"
}
</script>
<style scoped lang="less">

</style>

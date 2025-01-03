<template>
  <div>
    <t-card title="接入中心" class="list-card-container" :bordered="false">
      <t-space>
        <t-space align="start" class="space-border">
          <t-row>
            <t-anchor>
              <t-anchor-item href="#${path}#back" title="后端应用"/>
              <t-anchor-item href="#${path}#open" title="开源框架"/>
              <t-anchor-item href="#${path}#llm" title="LLM应用"/>
            </t-anchor>
          </t-row>
        </t-space>
        <t-space align="center" class="space-border" direction=vertical>
          <t-row>
            <t-row>
              <t-space :gutter="16">
                <t-input v-model="searchValue" class="search-input" placeholder="请输入你需要搜索的内容" clearable
                         style="width: 500px">
                  <template #suffix-icon>
                    <search-icon size="30px"/>
                  </template>
                </t-input>
                <t-button variant="outline" :icon="renderIcon"> 搜索</t-button>
              </t-space>
            </t-row>
            <t-row :gutter="16" style="margin-top: 40px">
              <t-col :span="3">
                <div>
                  <t-card title="Java链路追踪" :subtitle="subtitle" hover-shadow :style="{ width: '230px',height:'120px' }"
                          @click="clickHandler('java')">
                    <t-image src="https://dev-1306623386.cos.ap-shanghai.myqcloud.com/icon/code/java.png"
                             :style="{ width: '30px', height: '30px' }"></t-image>
                  </t-card>
                </div>
              </t-col>
              <t-col :span="3">
                <div>
                  <t-card title="Go链路追踪" :subtitle="subtitle" hover-shadow :style="{ width: '230px',height:'120px' }"
                          @click="clickHandler('go')">
                    <t-image src="https://dev-1306623386.cos.ap-shanghai.myqcloud.com/icon/code/Golang.png"
                             :style="{ width: '30px', height: '30px' }"></t-image>
                  </t-card>
                </div>
              </t-col>
              <t-col :span="3">
                <div>
                  <t-card title="Nodejs链路追踪" :subtitle="subtitle" hover-shadow
                          :style="{ width: '230px',height:'120px' }" @click="clickHandler('go')">
                    <t-image src="https://dev-1306623386.cos.ap-shanghai.myqcloud.com/icon/code/Node.js.png"
                             :style="{ width: '30px', height: '30px' }"></t-image>
                  </t-card>
                </div>
              </t-col>
              <t-col :span="3">
                <div>
                  <t-card title="Python链路追踪" :subtitle="subtitle" hover-shadow
                          :style="{ width: '230px',height:'120px' }" @click="clickHandler('go')">
                    <t-image src="https://dev-1306623386.cos.ap-shanghai.myqcloud.com/icon/code/Python.png"
                             :style="{ width: '30px', height: '30px' }"></t-image>
                  </t-card>
                </div>
              </t-col>
            </t-row>
          </t-row>
        </t-space>
      </t-space>
    </t-card>
  </div>
</template>
<script lang="ts">

export default {
  name: "index"
}
</script>
<style scoped lang="less">

</style>

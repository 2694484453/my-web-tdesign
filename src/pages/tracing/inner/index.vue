<template>
  <div>
    <t-card title="接入中心" class="list-card-container" :bordered="false">
      <t-space>
        <t-space align="center" class="space-border">
          <t-row>
            <t-anchor>
              <t-anchor-item href="#${path}#back" title="后端应用"/>
              <t-anchor-item href="#${path}#open" title="开源框架"/>
              <t-anchor-item href="#${path}#llm" title="LLM应用"/>
            </t-anchor>
          </t-row>
        </t-space>
        <t-space >
          <t-row>
            <t-space align="center" class="space-border">
              <t-row :gutter="16">
                <t-col span="14">
                  <t-input v-model="searchValue" class="search-input" placeholder="请输入你需要搜索的内容" clearable
                           style="width: 300px">
                    <template #suffix-icon>
                      <search-icon size="30px"/>
                    </template>
                  </t-input>
                </t-col>
                <t-col span="2">
                  <t-button variant="outline"> 搜索</t-button>
                </t-col>
              </t-row>
            </t-space>
            <t-space align="start" class="space-border" style="margin-top: 40px">
              <t-row :gutter="16" >
                <t-col :span="3">
                  <t-card title="Java链路追踪" hover-shadow
                          :style="{ width: '230px',height:'120px' }"
                          @click="clickHandler('java')">
                    <t-image src="https://dev-1306623386.cos.ap-shanghai.myqcloud.com/icon/code/java.png"
                             :style="{ width: '40px', height: '40px' }"></t-image>
                  </t-card>
                </t-col>
                <t-col :span="3">
                  <t-card title="Go链路追踪" hover-shadow
                          :style="{ width: '230px',height:'120px' }"
                          @click="clickHandler('go')">
                    <t-image src="https://dev-1306623386.cos.ap-shanghai.myqcloud.com/icon/code/Golang.png"
                             :style="{ width: '40px', height: '40px' }"></t-image>
                  </t-card>
                </t-col>
                <t-col :span="3">
                  <t-card title="Nodejs链路追踪" hover-shadow
                          :style="{ width: '230px',height:'120px' }" @click="clickHandler('go')">
                    <t-image src="https://dev-1306623386.cos.ap-shanghai.myqcloud.com/icon/code/Node.js.png"
                             :style="{ width: '40px', height: '40px' }"></t-image>
                  </t-card>
                </t-col>
                <t-col :span="3">
                  <t-card title="Python链路追踪" hover-shadow
                          :style="{ width: '230px',height:'120px' }" @click="clickHandler('go')">
                    <t-image src="https://dev-1306623386.cos.ap-shanghai.myqcloud.com/icon/code/Python.png"
                             :style="{ width: '40px', height: '40px' }"></t-image>
                  </t-card>
                </t-col>
              </t-row>
            </t-space>
          </t-row>
        </t-space>
      </t-space>
      <div>
        <t-drawer v-model:visible="visible" header="header" :on-confirm="onClickConfirm" :close-btn="true">
          <p>This is a controlled drawer</p>
        </t-drawer>
      </div>
    </t-card>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import {SearchIcon} from "tdesign-icons-vue";

export default Vue.extend({
  name: "index",
  components: {
    SearchIcon,
  },
  data() {
    return {
      visible: false,
      map: null,
      data: [
        {
          name: "java",
          title: "",
          description: ""
        }
      ],
      searchValue: ""
    }
  },
  created() {

  },
  mounted() {
    // 转化
    const map = {};
    for (const item of this.data) {
      map[item.name] = item;
    }
    this.map = map;
  },
  methods: {
    clickHandler(name) {
      // 显示
      this.visible = true;
      // 选择name
      this.map.get(name)
    },
    onClickConfirm() {

    }
  }
})
</script>
<style scoped lang="less">

</style>

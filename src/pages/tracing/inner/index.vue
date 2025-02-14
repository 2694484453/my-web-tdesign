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
        <t-space>
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
              <t-row :gutter="16">
                <span v-for="(value,key,index) in data" :key="key">
                 <t-col :span="3">
                  <t-card :title="value.title +'链路追踪'" hover-shadow :style="{ width: '280px',height:'140px' }">
                    {{ value.description }}
                    <template #actions>
                      <a href="javascript:void(0)" @click="drawer.visible = true;clickHandler(key)"
                         style="line-height: 24px">操作</a>
                    </template>
                  </t-card>
                </t-col>
                </span>
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
    <t-drawer
        :visible.sync="drawer.visible"
        :header="drawer.header"
        :on-overlay-click="() => (drawer.visible = false)"
        placement="right"
        destroyOnClose
        showOverlay
        :sizeDraggable="true"
        :on-size-drag-end="handleSizeDrag"
        size="50%"
        @cancel="drawer.visible = false"
        @close="drawer.visible = false"
        @onConfirm="drawer.visible = false">
      <span v-html="markdownContent"></span>
    </t-drawer>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import {SearchIcon} from "tdesign-icons-vue";
import {marked} from "marked";

export default Vue.extend({
  name: "index",
  components: {
    SearchIcon,
  },
  data() {
    return {
      visible: false,
      map: null,
      data: {
        java: {
          name: "java",
          title: "Java",
          description: "卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。"
        },
        nodejs: {
          name: "java",
          title: "Nodejs",
          description: "卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。"
        },
        go: {
          name: "java",
          title: "Go",
          description: "卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。"
        },
        python: {
          name: "java",
          title: "Python",
          description: "卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。"
        }
      },
      searchValue: "",
      //drawer
      drawer: {
        visible: false,
        header: "",
        value: {},
        action: ""
      },
      //
      markdownContent: ''
    }
  },
  created() {

  },
  computed() {

  },
  mounted() {

  },
  methods: {
    clickHandler(name) {
      this.drawer.header = name + "应用接入指引";
      this.drawer.action = name;
      // 假设你的 Markdown 文件位于 public 目录下名为 example.md
      fetch("/docs/" + name + ".md")
          .then(response => response.text())
          .then(text => {
            this.markdownContent = marked(text);
          })
          .catch(error => console.error('Error loading the markdown file:', error));
    },
    onClickConfirm() {

    },
    handleSizeDrag({size}) {
      console.log('size drag size: ', size);
    },
  }
})
</script>
<style scoped lang="less">

</style>

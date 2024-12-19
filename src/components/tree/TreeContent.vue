<template>
  <div>
    <t-layout>
      <t-aside>
        <t-space direction="vertical" style="width: 100%" class="tdesign-tree-operations">
          <t-space :size="'large'">
            <t-input-adornment prepend="filter:">
              <t-input v-model="filterByText" @change="onInputChange"/>
            </t-input-adornment>
          </t-space>
          {{items}}
          <t-tree :data="items" activable hover transition>

          </t-tree>
        </t-space>
      </t-aside>
      <t-layout>
        <t-header>xxxx</t-header>
        <t-content>
          <MonacoEditor :config="editor" :value="editor.value"
                        style="height: 800px;margin-top: 20px;margin-bottom: 20px"/>
        </t-content>
        <t-footer>xxx</t-footer>
      </t-layout>
    </t-layout>


  </div>
</template>
<script lang="ts">
import Vue from "vue";
import MonacoEditor from "@/components/editor/MonacoEditor.vue";

export default Vue.extend({
  name: "TreeContent",
  components: {MonacoEditor},
  props: ["config", "value"],
  data() {
    return {
      // monaco
      editor: {
        language: "yaml",
        fontSize: "15",
        value: "",
        readOnly: true,
        header: "",
        // 抽屉
        visible: false,
      },
      filterByText: "",
      items: {
        label: '第一段',
        children: [
          {
            label: '第二段',
          },
          {
            label: '第二段',
          },
        ],
      }
    }
  },
  mounted() {

  },
  created() {

  },
  methods: {
    onInputChange() {

    }
  }
})
</script>
<style scoped lang="less">

</style>

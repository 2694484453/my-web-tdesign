<template>
  <div class="container">
    <div class="left-column" :style="{ width: leftWidth + '%' }">
        <t-space direction="vertical" class="tdesign-tree-operations">
          <t-space :size="'large'">
            <t-input-adornment prepend="filter:">
              <t-input v-model="filterByText" @change="onInputChange"/>
            </t-input-adornment>
          </t-space>
          <t-tree :data="items" activable hover transition>

          </t-tree>
        </t-space>
    </div>
    <div class="separator" @mousedown="startDrag"></div>
    <div class="right-column" :style="{ width: rightWidth + '%' }">
      <t-layout>
        <div class="right" id="right">
          <t-header>xxxx</t-header>
          <t-content>
            <MonacoEditor :config="editor" :value="editor.value"
                          style="height: 800px;margin-top: 20px;margin-bottom: 20px"/>
          </t-content>
          <t-footer>xxx</t-footer>
        </div>
      </t-layout>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import MonacoEditor from "@/components/editor/MonacoEditor.vue";

export default Vue.extend({
  name: "TreeContent",
  components: {MonacoEditor},
  props: ["config", "value", "items"],
  data() {
    return {
      // monaco
      editor: {
        language: "yaml",
        fontSize: "15",
        value: this.value,
        readOnly: true,
      },
      path: "",
      filterByText: "",
      leftWidth: 25, // 初始左侧宽度比例
      isDragging: true,
      startX: 0,
      startWidth: 0
    }
  },
  mounted() {
    // 获取目录结构
    console.log("mounted")
  },
  created() {
    // 获取目录结构
    console.log("created")
  },
  computed: {
    rightWidth() {
      return 100 - this.leftWidth;
    }
  },
  methods: {
    onInputChange() {
    },
    startDrag(event) {
      this.isDragging = true;
      this.startX = event.clientX;
      this.startWidth = this.leftWidth;
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.stopDrag);
    },
    onDrag(event) {
      if (!this.isDragging) return;
      let newWidth = this.startWidth + (event.clientX - this.startX) / window.innerWidth * 100;
      // 限制最小最大宽度
      if (newWidth > 20 && newWidth < 80) {
        this.leftWidth = newWidth;
      }
    },
    stopDrag() {
      this.isDragging = false;
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.stopDrag);
    }
  }
})
</script>
<style scoped lang="less">
.container {
  display: flex;
  height: 100vh; /* 设置为全高 */
}

.left-column, .right-column {
  overflow: auto;
  box-sizing: border-box;
}

.separator {
  width: 5px;
  background-color: #ccc;
  cursor: col-resize;
}
</style>

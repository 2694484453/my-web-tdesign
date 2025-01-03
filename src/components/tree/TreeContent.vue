<template>
  <div class="container">
    <div class="left-column" :style="{ width: leftWidth + '%' }">
      <t-space direction="vertical" class="tdesign-tree-operations">

<!--          <t-input-adornment prepend="filter:">-->
<!--            <t-input v-model="filterByText" @change="onInputChange"/>-->
<!--          </t-input-adornment>-->
<!--          <t-row justify="end">-->
<!--            <t-col :span="5">-->
<!--              <t-icon name="file-add" size="18px"></t-icon>-->
<!--            </t-col>-->
<!--            <t-col :span="5">-->
<!--              <t-icon name="file-add" size="18px"></t-icon>-->
<!--            </t-col>-->
<!--            <t-col :span="5">-->
<!--              <t-icon name="file-add" size="18px"></t-icon>-->
<!--            </t-col>-->
<!--            <t-col :span="5">-->
<!--              <t-icon name="file-add" size="18px"></t-icon>-->
<!--            </t-col>-->
<!--          </t-row>-->
        <t-tree
          :data="items"
          lazy activable
          hover transition
          :expand-level="2"
          @change="onChange"
          @click="onClick"
        >
          <template #isFile="{ row }">
            <t-icon v-if="row.isFile" name="file-1" size="40px"/>
            <t-icon v-else name="folder" size="40px"/>
          </template>
          <template #operations="{row}">
            <!--            <t-space :size="10">-->
            <!--              <t-button size="small" variant="base" >添加子节点</t-button>-->
            <!--            </t-space>-->
          </template>
        </t-tree>
      </t-space>
    </div>
    <div class="separator" @mousedown="startDrag"></div>
    <div class="right-column" :style="{ width: rightWidth + '%' }">
      <t-layout>
        <div class="right" id="right">
          <t-header>
            <t-space>
              <t-tabs v-model="value" theme="card" :addable="true" @add="addTab" @remove="removeTab" @change="handlerChange">
                <t-tab-panel
                  v-for="data in panelData"
                  :key="data.value"
                  :value="data.value"
                  :label="data.label"
                  :removable="data.removable"
                >
<!--                  <p style="padding: 25px">-->
<!--                    {{ data.content }}-->
<!--                  </p>-->
                </t-tab-panel>
              </t-tabs>
            </t-space>
          </t-header>
          <t-content>
            <div>
             <MonacoEditor :config="editor" :value="this.currentSelected.fileContent" style="height: 800px;margin-top: 20px;margin-bottom: 20px"/>
            </div>
          </t-content>
<!--          <t-footer>xxx</t-footer>-->
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
  props: ["path"],
  data() {
    return {
      // monaco
      editor: {
        language: "yaml",
        fontSize: "15",
        readOnly: true,
        value: ""
      },
      filterByText: "",
      leftWidth: 20, // 初始左侧宽度比例
      isDragging: true,
      startX: 0,
      startWidth: 0,
      items: [],
      currentSelected: {
        label: "",
        path: "",
        size: "",
        extName: "",
        isFile: false,
        fileContent: "",
      },
      rootPath: this.path,
      panelData: [],
      id: "",
      value: ""
    }
  },
  watch: {
    path(newVal, oldVal) {
      // 当 message 发生变化时调用此方法
      console.log('Message changed from', oldVal, 'to', newVal);
      // 重新获取目录
      this.treeList(newVal)
    },
    id(newVal, oldVal){
      // 当 message 发生变化时调用此方法
      console.log('id changed from', oldVal, 'to', newVal);
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
    },
    // 选中文件
    onClick(context) {
      console.info('onClick context:', context);
      const {node} = context;
      this.currentSelected = node.data
      console.log("selected:", this.currentSelected)
      // 选中之后就开始读取文件
      this.read()
    },
    //
    onChange(checked, context) {
      console.info('onChange checked:', checked, 'context:', context);
      const {node} = context;
      console.info(node.value, 'onChange context.node.checked:', node.checked);
    },
    // 新增选项卡
    addTab(data) {
      this.panelData.push(data);
    },
    // 关闭选项卡
    removeTab({value: val, index}) {
      if (index < 0) return false;
      this.panelData.splice(index, 1);
      if (this.panelData.length === 0) return;
      if (this.value.value === val) {
        this.value.value = this.panelData.value[Math.max(index - 1, 0)].value;
      }
    },
    // 切换显示卡
    handlerChange(newValue) {
      console.log("当前选中：",newValue)
      this.id = newValue
      // 从panelData取出数据

    },
    // 获取目录
    treeList(path) {
      this.$request.get("/build/chart/tree", {
        params: {
          path: path
        }
      }).then(res => {
        this.items = res.data.data;
      }).catch((e: Error) => {
        console.log(e);
      })
    },
    // 读取一个文件
    read() {
      if (this.currentSelected.isFile) {
        this.$request.get("/build/chart/read", {
          params: {
            path: this.currentSelected.path
          }
        }).then(res => {
          this.currentSelected.fileContent = res.data.data
          this.editor.value = res.data.data
          this.editor.language = this.currentSelected.extName
          // 选中之后添加到选项卡
          console.log("当前：",this.currentSelected)
        }).catch((e: Error) => {
          console.log(e);
        }).finally(() => {
          this.addTab({
            value: this.currentSelected.label,
            label: this.currentSelected.label,
            removable: true,
            content: this.currentSelected.fileContent,
          })
          this.id = this.currentSelected.label;
        })
      }
    }
  }
})
</script>
<style scoped lang="less">
.container {
  display: flex;
  height: 85vh; /* 设置为全高 */
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

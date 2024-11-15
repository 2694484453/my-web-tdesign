<template>
  <a-layout>
    <div id="container" v-bind:style="{height: height,width:width,border: '1px',marginTop: '25px'}">
    </div>
  </a-layout>
</template>

<script lang="js">
import * as monaco from "monaco-editor";

let editor;
export default {
  name: "Monaco",
  props: {
    width: {
      default: "100%"
    },
    height: {
      default: "600px"
    }
  },
  data() {
    return {
      defaultOpts: {
        value: '',
        language: 'yaml',
        theme: 'vs', // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
        roundedSelection: false, // 右侧不显示编辑器预览框
        autoIndent: true, // 自动缩进
        readOnly: false, // 是否只读
        glyphMargin: true, //字形边缘
        fontSize: 15, //字体大小
        selectOnLineNumbers: true, //显示行号
        automaticLayout: true, //自动布局
      }
    }
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      // 初始化编辑器，确保dom已经渲染
      this.editor = monaco.editor.create(document.getElementById('container'), this.defaultOpts);
    },
  }
}
</script>
<style scoped>

</style>

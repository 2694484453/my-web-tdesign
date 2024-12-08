<template>
    <div id="container" v-bind:style="{height: height,width:width}"/>
</template>

<script lang="js">
import * as monaco from "monaco-editor";

export default {
  name: "MonacoEditor",
  props: {
    width: {
      default: "100%"
    },
    height: {
      default: "600px"
    },
    fontSize: {
      default: "15"
    },
    language: {
      default: "txt"
    },
    theme: {
      default: "vs"
    },
    value: {
      default: ""
    },
    roundedSelection: {
      default: false
    },
    readOnly: {
      default: true
    }
  },
  data() {
    return {
      defaultOpts: {
        value: this.value,
        language: this.language,
        theme: this.theme, // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
        roundedSelection: this.roundedSelection, // 右侧不显示编辑器预览框
        autoIndent: true, // 自动缩进
        readOnly: this.readOnly, // 是否只读
        glyphMargin: true, //字形边缘
        fontSize: this.fontSize, //字体大小
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

<template>
  <div id="container" style="width: 100%;"/>
</template>

<script lang="ts">
import Vue from "vue";
import {setLocaleData} from 'monaco-editor-nls';
import zh_CN from 'monaco-editor-nls/locale/zh-hans.json';
// 设置中文
setLocaleData(zh_CN);
import * as monaco from "monaco-editor";

export default Vue.extend({
  name: "MonacoEditor",
  props: ['config', 'value'],
  computed: {
    // config() {
    //   console.log('Created with props:', this.$props);
    //   console.log("xx", this.defaultOpts.value)
    // },
  },
  data() {
    return {
      defaultOpts: {
        value: this.value,
        language: this.config.language,
        theme: this.config.theme !== undefined ? this.config.theme : "vs", // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
        roundedSelection: this.config.roundedSelection !== undefined ? this.config.roundedSelection : true, // 右侧不显示编辑器预览框
        autoIndent: true, // 自动缩进
        readOnly: this.config.readOnly, // 是否只读
        glyphMargin: true, //字形边缘
        fontSize: this.config.fontSize !== undefined ? this.config.fontSize : 15, //字体大小
        selectOnLineNumbers: true, //显示行号
        automaticLayout: true, //自动布局
      }
    }
  },
  created() {
    console.log("created")
  },
  beforeCreate() {
    console.log("beforeCreate")
  },
  mounted() {
    console.log('Created with props:', this.$props);
    console.log("xx", this.defaultOpts.value)
    this.initEditor();
  },
  watch: {
    value(newVal, oldVal) {
      if (this.editor) {
        if (newVal !== this.editor.getValue()) {
          this.editor.setValue(newVal);
          this.editor.trigger(this.editor.getValue(), 'editor.action.formatDocument')
        }
      }
    },
    config(newVal, oldVal) {
      if (this.editor) {
        if (newVal !== this.defaultOpts) {
        }
      }
    }
  },
  methods: {
    initEditor() {
      // 初始化编辑器，确保dom已经渲染
      this.editor = monaco.editor.create(document.getElementById('container'), this.defaultOpts);
      this.editor.onDidChangeModelContent(function (event) {
        //编辑器内容changge事件
      })
    },
    /**
     * 设置编辑器的内容且滚动到最底部
     */
    setEditorContent(val) {
      this.editor.setValue(val);
    },
    /**
     * 获取编辑器的内容
     */
    getEditorContent() {
      this.editor.getValue();
    },
    addAction() {
      this.editor.addAction({
        id: 'file_formatter',
        label: '格式化文档',    // 菜单名称
        keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF], // 快捷键
        contextMenuGroupId: 'code_formatter',
        run: () => {
          // const content = this.editor.getValue()
          // this.editor.setValue(format(content, { indent: '    ' }))
          // TODO 添加格式化操作
        }
      })
    }
  }
})
</script>
<style scoped>

</style>

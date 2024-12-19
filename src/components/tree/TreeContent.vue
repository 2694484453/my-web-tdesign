<template>
  <div>

    <MonacoEditor :config="editor" :value="editor.value"/>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import MonacoEditor from "@/components/editor/MonacoEditor.vue";

export default Vue.extend({
  name: "TreeContent",
  components: {MonacoEditor},
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
      }
    }
  },
  mounted() {

  },
  created() {

  },
  methods: {

  }
})
</script>
<style scoped lang="less">

</style>

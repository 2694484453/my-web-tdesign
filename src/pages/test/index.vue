<template>
  <div>
    <h1>xx</h1>
    <icon name="caret-right" />
    <icon name="tangerinr" color="orange" />
    <t-icon name="logo-adobe-illustrate"></t-icon>
    <LogoQqIcon />
    <LogoAndroidIcon />
    <t-icon name="file-1" size="100px" />
    <t-space>
      <t-button theme="primary" @click="visible=true">基础确认对话框</t-button>
      <t-dialog
        v-model:visible="visible"
        header="对话框标题"
        width="40%"
        :confirm-on-enter="true"
      >
        <t-space direction="vertical" style="width: 100%">
          <div>
            <p>这是弹框内容</p>
            <p>This is Dialog Content</p>
          </div>
        </t-space>
      </t-dialog>
    </t-space>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "test",
  data() {
    return {
      visible: false
    }
  },
  methods: {}
})
</script>

<style scoped lang="less">

</style>

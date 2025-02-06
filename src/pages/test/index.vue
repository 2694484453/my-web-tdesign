<template>
  <div>
    <t-space>
      <t-button theme="primary" @click="visible=true">基础确认对话框</t-button>
      <t-dialog
        v-show="visible"
        header="对话框标题"
        width="40%"
        :confirm-on-enter="true"
        :on-close="formClose"
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
  methods: {
    formClose(context) {
      console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', context);
      this.visible = false;
    },
  }
})
</script>

<style scoped lang="less">

</style>

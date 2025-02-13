<template>
  <div>
    <t-space>11
      <t-collapse :default-value="[1]" @change="handlePanelChange">
        <t-collapse-panel header="这是一个折叠标题">11
          这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
        </t-collapse-panel>
      </t-collapse>
      <t-button theme="primary" @click="visible=true">基础确认对话框</t-button>
      <t-dialog
        v-show="visible"
        header="对话框标题"
        width="40%"
        :confirm-on-enter="true"
        :on-close="formClose">
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
    handlePanelChange(val) {
      this.currentItem = val;
    },
  }
})
</script>

<style scoped lang="less">

</style>

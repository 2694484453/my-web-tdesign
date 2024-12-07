<template>
  <div>
    <t-button @click="handleClick">Open Drawer</t-button>
    <t-drawer :visible="visible">
      <template #header>header</template>
      <p>This is a Drawer</p>
    </t-drawer>
  </div>
</template>

<script>
export default {
  name: "demo",
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    handleClick() {
      this.visible = true
    }
  }
}
</script>

<style scoped lang="less">

</style>

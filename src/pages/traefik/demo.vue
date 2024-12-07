<template>
  <div>
    <t-button @click="handleClick">Open Drawer</t-button>
    <t-drawer v-model:visible="visible">
      <template #header>header</template>
      <p>This is a Drawer</p>
    </t-drawer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "demo",
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    handleClick() {

    }
  }
})
</script>

<style scoped lang="less">

</style>

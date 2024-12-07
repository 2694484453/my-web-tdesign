<template>
  <t-space :size="32" direction="vertical">
    <t-space direction="vertical">
      <h3>属性设置 jsx 形式</h3>
      <t-tree :data="items" hover expand-all :load="load" :icon="icon"/>
    </t-space>
    <t-space direction="vertical">
      <h3>slot 形式</h3>
      <t-tree :data="items" hover lazy :load="load">
        <template #icon="{ node }">
          <icon v-if="node.getChildren() && !node.expanded" name="caret-right"/>
          <icon v-else-if="node.getChildren() && node.expanded && node.loading" name="loading"/>
          <icon v-else-if="node.getChildren() && node.expanded" name="caret-down"/>
          <icon v-else name="attach"/>
        </template>
      </t-tree>
    </t-space>
  </t-space>
</template>
<script lang="ts">
export default {
  name: "Editor",
  data() {
    return {};
  },
  mounted() {

  },
  methods: {}
}
</script>
<style scoped lang="less">

</style>

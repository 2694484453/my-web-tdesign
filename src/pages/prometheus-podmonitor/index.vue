<template>
  <div>
    <ListBase v-show="type === 'list'" @transfer="changeKey"/>
    <FormBase v-show="type === 'form'" @transfer="changeKey"/>
    <EditBase v-show="type === 'edit'" :rowData="rowData"  @transfer="changeKey"/>
    <DetailBase v-show="type === 'detail'" :rowData="rowData" @transfer="changeKey"/>
  </div>
</template>
<script>
import ListBase from "@/pages/prometheus-cloud/list/index.vue"
import FormBase from "@/pages/prometheus-cloud/form/base/index.vue"
import EditBase from "@/pages/prometheus-cloud/edit/base/index.vue"
import DetailBase from "@/pages/prometheus-cloud/detail/base/index.vue";

export default {
  components: {
    ListBase,
    FormBase,
    EditBase,
    DetailBase
  },
  data() {
    return {
      type: "list",
      rowData: Object
    };
  },
  methods: {
    changeKey(key, rowData) {
      console.log("key:id", key, rowData)
      this.type = key
      this.rowData = rowData
    }
  }
}
</script>
<style scoped lang="less">

</style>

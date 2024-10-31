<template>
  <div>
    <ListBase v-show="type === 'list'" @transfer="changeKey"/>
    <FormBase v-show="type === 'form'" @transfer="changeKey"/>
    <EditBase v-show="type === 'edit'" :row="row"  @transfer="changeKey"/>
    <DetailBase v-show="type === 'detail'" :row="row" @transfer="changeKey"/>
  </div>
</template>
<script>
import ListBase from "@/pages/build/image/list/index.vue";
import FormBase from "@/pages/build/image/form/base/index.vue";
import EditBase from "@/pages/build/image/edit/base/index.vue";
import DetailBase from "@/pages/build/image/detail/base/index.vue";

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
      row: Object
    };
  },
  methods: {
    changeKey(key, row) {
      console.log("key:id", key, row)
      this.type = key
      this.row = row.row
    }
  }
}
</script>
<style scoped lang="less">

</style>

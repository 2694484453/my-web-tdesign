<template>
  <div>
    <ListBase v-show="type === 'list'" @transfer="changeKey"/>
    <FormBase v-show="type === 'form'" @transfer="changeKey"/>
    <EditBase v-show="type === 'edit'" :row="row" @transfer="changeKey"/>
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
      row: Object,
      code: ""
    };
  },
  mounted() {
    // 判断是否存储code
    const code = this.getCode()
    this.getGiteeAccessToken(code)
  },
  methods: {
    changeKey(key, row) {
      console.log("key:id", key, row)
      this.type = key
      this.row = row.row
    },
    getCode() {
      // 先判断url是否带有code
      let code = this.$route.query.code
      console.log("code", code)
      if (code != null && code !== "" && code !== 'undefined') {
        // 从url获取code
        console.log("url取code", code)
        localStorage.setItem("code", code)
      } else {
        // 从本地取code
        code = localStorage.getItem("code");
        if (code != null && code !== "" && code !== 'undefined') {
          // 从localstorage取
          console.log("本地取code", code)
        }
      }
      return code;
    },
    getGiteeAccessToken(code) {
      this.$request.post("/gitee/getAccessToken?code="+code).then(res => {
          console.log("res",res)
      }).catch(err => {

      })
    }
  }
}
</script>
<style scoped lang="less">

</style>

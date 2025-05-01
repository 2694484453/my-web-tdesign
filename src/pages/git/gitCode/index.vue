<template>
  <div>
    <ListBase v-show="type === 'list'" @transfer="changeKey"/>
    <FormBase v-show="type === 'form'" :code="code" :access_token="access_token" @transfer="changeKey"/>
    <EditBase v-show="type === 'edit'" :row="row" @transfer="changeKey"/>
    <DetailBase v-show="type === 'detail'" :row="row" @transfer="changeKey"/>
  </div>
</template>
<script>
import ListBase from "@/pages/git/gitee/list/index.vue"
import FormBase from "@/pages/git/gitee/form/base/index.vue"
import EditBase from "@/pages/git/gitee/edit/base/index.vue"
import DetailBase from "@/pages/git/gitee/detail/base/index.vue";

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
      access_token: null,
      refresh_token: null
    };
  },
  mounted() {
    // 判断是否存储access_token
    const access_token = localStorage.getItem("gitee_access_token")
    if (access_token !== null && access_token !== 'undefined') {
      this.access_token = access_token;
    }else {
      this.getCode();
    }
  },
  methods: {
    changeKey(key, row) {
      console.log("key:id", key, row)
      this.type = key
    },
    getCode() {
      // 先判断url是否带有code
      let code = this.$route.query.code
      console.log("code", code)
      if (code != null || code !== "" || code !== undefined) {
        // 从url获取code后请求
        this.getGiteeAccessToken(code)
      }
    },
    getGiteeAccessToken(code) {
      this.$request.post("/git/gitee/token?code=" + code).then(res => {
        localStorage.setItem("gitee_access_token", res.data.access_token)
        this.access_token = res.data.access_token
        localStorage.setItem("gitee_refresh_token", res.data.refresh_token)
        this.refresh_token = res.data.refresh_token
      }).catch(err => {

      })
    }
  }
}
</script>
<style scoped lang="less">

</style>

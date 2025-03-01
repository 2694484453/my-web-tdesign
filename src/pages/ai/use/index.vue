<template>
  <div>
    <t-card>
      <t-list :split="true">
        <t-list-item v-for="(item, index) in formData.messages" :key="index">
          <template #content>
            <span v-if="item.role ==='user'" style="float: right">
              <t-comment avatar="https://tdesign.gtimg.com/site/avatar.jpg" :content="item.content">
              <template #actions>
                <t-space key="thumbUp" :size="6">
                  <t-icon name="thumb-up" />
                  <span>6</span>
                </t-space>
                <t-space key="chat" :size="6">
                  <t-icon name="chat" />
                  <span>回复</span>
                </t-space>
              </template>
            </t-comment>
            </span>
            <span v-if="item.role === 'assistant'" style="float: left">
              <t-comment avatar="" :content="item.content">
              <template #actions>
                <t-space key="thumbUp" :size="6">
                  <t-icon name="thumb-up" />
                  <span>6</span>
                </t-space>
                <t-space key="chat" :size="6">
                  <t-icon name="chat" />
                  <span>回复</span>
                </t-space>
              </template>
            </t-comment>
            </span>
          </template>
        </t-list-item>
      </t-list>
    </t-card>
    <t-affix class="fixed-input">
      <t-comment avatar="">
        <template #content>
          <div class="form-container">
            <t-textarea v-model="formData.input" placeholder="请输入内容" />
            <t-button class="form-submit" @click="send">发送</t-button>
          </div>
        </template>
      </t-comment>
    </t-affix>
  </div>

</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      loading: false,
      formData: {
        input: "",
        messages: []
      }
    }
  },
  methods:{
    send(){
      // 获取input，加入message
      this.formData.messages.push({
          role: "user",
          content: this.formData.input,
      })
      this.$request.post("/ai/tyqw/send",this.formData.messages).then(res=>{
        console.log(res)
        res.data.data.choices.forEach(e=>{
          this.formData.messages.push({
            "content": e.message.content,
            "role": e.message.role
          })
        })
      })
    }
  }
})
</script>

<style scoped lang="less">
/* 确保输入框容器宽度为100%，并固定在页面底部 */
.fixed-input {
  position: fixed;
  bottom: 0;
  left: 60%; /* 将左边距设置为50% */
  transform: translateX(-50%); /* 使用transform属性来实现水平居中 */
  background: white; /* 设置背景色以覆盖可能的内容 */
  padding: 10px; /* 可选：增加一些内边距来美化外观 */
  box-sizing: border-box; /* 确保padding不会影响宽度和高度 */
  border-top: 1px solid #ddd; /* 可选：增加顶部边框以区分内容 */
  width: 80%; /* 或者指定一个具体的宽度值 */
  max-width: 600px; /* 可选：设置最大宽度，避免过宽 */
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1); /* 可选：添加阴影效果 */
}

/* 确保输入框占满其容器 */
.fixed-input input {
  width: 80%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>

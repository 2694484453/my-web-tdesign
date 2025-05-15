<template>
  <t-form
    ref="form"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <template v-if="type == 'password'">
      <t-form-item name="account">
        <t-input v-model="formData.account" size="large" placeholder="请输入账号：admin">
          <template #prefix-icon>
            <user-icon/>
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          key="password"
          placeholder="请输入登录密码：admin123"
        >
          <template #prefix-icon>
            <lock-on-icon/>
          </template>
          <template #suffix-icon>
            <browse-icon v-if="showPsw" @click="showPsw = !showPsw" key="browse"/>
            <browse-off-icon v-else @click="showPsw = !showPsw" key="browse-off"/>
          </template>
        </t-input>
      </t-form-item>

      <div class="check-container remember-pwd">
        <t-checkbox>记住账号</t-checkbox>
        <span class="tip">忘记账号？</span>
      </div>
    </template>

    <!-- 扫码登陆 -->
    <template v-else-if="type == 'qrcode'">
      <div class="tip-container">
        <span class="tip">请使用微信扫一扫登录</span>
        <span class="refresh"
        >刷新
          <refresh-icon color="#0052D9"/>
        </span>
      </div>
      <qrcode-vue value="" :size="192" level="H"/>
    </template>

    <!-- 手机号登陆 -->
    <template v-else-if="type == 'phone'">
      <t-form-item name="phone">
        <t-input v-model="formData.phone" size="large" placeholder="请输入您的手机号">
          <template #prefix-icon>
            <user-icon/>
          </template>
        </t-input>
      </t-form-item>
      <t-form-item class="verification-code" name="verifyCode">
        <t-input v-model="formData.verifyCode" size="large" placeholder="请输入验证码" key="verifyCode"/>
        <t-button variant="outline" :disabled="countDown > 0" @click="handleCounter">
          {{ countDown == 0 ? '发送验证码' : `${countDown}秒后可重发` }}
        </t-button>
      </t-form-item>
    </template>

    <!--使用邮箱登录-->
    <template v-else-if="type == 'email'">
      <t-form-item name="email">
        <t-input v-model="formData.email" size="large" placeholder="请输入您的邮箱地址">
          <template #prefix-icon>
            <user-icon/>
          </template>
        </t-input>
      </t-form-item>
    </template>

    <template v-else>

    </template>

    <t-form-item v-if="type !== 'qrcode'" class="btn-container">
      <t-button block size="large" type="submit"> 登录</t-button>
    </t-form-item>

    <div class="switch-container">
      <span v-if="type !== 'password'" class="tip" @click="switchType('password')">使用账号密码登录</span>
      <span v-if="type !== 'qrcode'" class="tip" @click="switchType('qrcode')">使用微信扫码登录</span>
      <span v-if="type !== 'phone'" class="tip" @click="switchType('phone')">使用手机号登录</span>
      <span v-if="type !== 'email'" class="tip" @click="switchType('email')">使用邮箱登录</span>
    </div>
  </t-form>
</template>
<script lang="ts">
import Vue from 'vue';
import QrcodeVue from 'qrcode.vue';
import {UserIcon, LockOnIcon, BrowseOffIcon, BrowseIcon, RefreshIcon} from 'tdesign-icons-vue';

const INITIAL_DATA = {
  phone: '',
  email: '',
  account: '',
  password: '',
  verifyCode: '',
  checked: false,
};

const FORM_RULES = {
  phone: [{required: true, message: '手机号必填', type: 'error'}],
  account: [{required: true, message: '账号必填', type: 'error'}],
  email: [{required: true, message: '邮箱必填', type: 'error'}],
  password: [{required: true, message: '密码必填', type: 'error'}],
  verifyCode: [{required: true, message: '验证码必填', type: 'error'}],
};
/** 高级详情 */
export default Vue.extend({
  name: 'Login',
  components: {
    QrcodeVue,
    UserIcon,
    LockOnIcon,
    BrowseOffIcon,
    BrowseIcon,
    RefreshIcon,
  },
  data() {
    return {
      FORM_RULES,
      type: 'password',
      formData: {...INITIAL_DATA},
      showPsw: false,
      countDown: 0,
      intervalTimer: null,
    };
  },
  beforeDestroy() {
    clearInterval(this.intervalTimer);
  },
  methods: {
    switchType(val) {
      this.type = val;
      this.$refs.form.reset();
    },
    async onSubmit({validateResult}) {
      if (validateResult === true) {
        const data = {
          userName: this.formData.account,
          passWord: this.formData.password
        }
        await this.$store.dispatch('user/login', data);
        this.$request.post('/login', data).then((res) => {
          console.log(res)
          if (res.data.code === 200) {
            // 存入cookie
            // this.$cookies.set('token', res.data.data.token);
            this.$cookies.set("username", this.formData.account)
            this.$cookies.set("token", res.data.token)
            localStorage.setItem("ACCESS_TOKEN", res.data.token)
            this.$message.success("登录成功")
            setTimeout(()=>{
              this.$router.push("/").catch(err => {
              });
            },2000)
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch((err) => {
          this.$message.error(err.message);
        });
      }
    },
    handleCounter() {
      this.countDown = 60;
      this.intervalTimer = setInterval(() => {
        if (this.countDown > 0) {
          this.countDown -= 1;
        } else {
          clearInterval(this.intervalTimer);
          this.countDown = 0;
        }
      }, 1000);
    },
  },
});
</script>

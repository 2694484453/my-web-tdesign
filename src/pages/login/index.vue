<template>
  <div class="login-wrapper">
    <login-header />

    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">登录到</h1>
        <h1 class="title">云服务平台</h1>
        <div class="sub-title">
          <p class="tip">{{ type == 'register' ? '已有账号?' : '没有账号吗?' }}</p>
          <p class="tip" @click="switchType(type == 'register' ? 'login' : 'register')">
            {{ type == 'register' ? '登录' : '注册新账号' }}
          </p>
        </div>
      </div>

      <login v-if="type === 'login'" />
      <register v-else @register-success="switchType('login')" />
      <tdesign-setting />
    </div>

    <footer class="copyright">Copyright @ 2021-2022 Tencent. All Rights Reserved</footer>
  </div>
</template>
<script>
import Login from './components/components-login.vue';
import Register from './components/components-register.vue';
import LoginHeader from './components/components-header.vue';
import TdesignSetting from '@/layouts/setting.vue';

export default {
  name: 'LoginIndex',
  components: {
    LoginHeader,
    Login,
    Register,
    TdesignSetting,
  },
  data() {
    return {
      type: 'login',
    };
  },
  created() {
    // 验证是否登录
    //this.getCookie();
  },
  methods: {
    switchType(val) {
      this.type = val;
    },
    // getCookie() {
    //   const username = getUsername();
    //   const password = getPassword();
    //   const rememberMe = getRememberMe();
    //   const tenantName = getTenantName();
    //   this.loginForm = {
    //     ...this.loginForm,
    //     username: username ? username : this.loginForm.username,
    //     password: password ? password : this.loginForm.password,
    //     rememberMe: rememberMe ? getRememberMe() : false,
    //     tenantName: tenantName ? tenantName : this.loginForm.tenantName,
    //   };
    // },
  },
};
</script>
<style lang="less">
@import url('./index.less');
</style>

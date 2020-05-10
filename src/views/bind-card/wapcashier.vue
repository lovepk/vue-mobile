<template>
  <div id="wapcashier">

  </div>
</template>

<script>
export default {
  name: 'wapcashier',
  mounted() {
    this.$loading('loading')
    // 获取token信息并缓存
    const jwtToken = this.$route.query.token;
    window.localStorage.setItem('cilJwtToken', jwtToken);
    // 根据jwt信息做路由跳转
    const jwtTokenJSON = JSON.parse(window.atob(jwtToken.split('.')[1]));
    const orderType = jwtTokenJSON.orderType;
    switch (orderType) {
      case 1:
        // 绑卡业务
        this.$router.replace({
          path: 'bind-card',
        });

        break;
    }
  },
  beforeRouteLeave(to, form, next) {
    this.$loading.close();
    next();
  }
}
</script>

<style></style>

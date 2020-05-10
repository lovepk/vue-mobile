<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" :acqName="acqName"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <div v-show="!$route.meta.loading" class="watermark">Powered by {{ acqName }} </div>
  </div>
</template>

<script>
import 'vue2-toast/lib/toast.css'
export default {
  name: 'App',
  data: () => {
    return {
      acqName: '',
    }
  },
  methods: {
    // 获取订单详情获取机构信息
    getOrderDetail() {
      this.$axios({
        method: 'POST',
        url: '/v2/og/wap-cashier/order/detail',
        data: {},
      }).then((response) => {
        if (response.code === '00') {
          this.acqName = response.data.institutionNameEn;
        }
      })
    }
  },
  mounted() {
    this.getOrderDetail();
  }
}
</script>

<style>
* {
  padding: 0px;
  margin: 0px;
}
body, html {
  width: 100%;
  height: 100%;
  font-family:PingFangSC-Medium,PingFang SC;
}
a {
  text-decoration: none;
}
input {
  outline: none;
  border: none;
}
.clear:after {
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
  zoom: 1;
}
.watermark {
  margin: 100px 0 47px;
  width: 100%;
  height: 14px;
  line-height: 14px;
  text-align: center;
  font-size: 10px;
  font-weight: 400;
  color: #bdbdbd;
}
</style>

<template>
  <div class="page-header">
    <div class="back"><img v-on:click="back" src="../../assets/bindcard/back.png" alt="返回"></div>
    <div class="title"><span>{{title}}</span></div>
  </div>
</template>

<script>
export default {
  name: 'wapHeader',
  props: {
    title: String
  },
  methods: {
    back() {
      this.$router.back(-1);
    }
  }
}
</script>

<style scoped>
  .page-header {
    position: relative;
    width: 100%;
    height: 25px;
    line-height: 25px;
    padding: 15px 0px;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: #333;
    background-color: #ffffff;
  }
  .page-header .back, .page-header .title {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  .page-header .back img {
    float: left;
    margin: 15px 0 15px 12px;
  }
  .page-header .back {
    z-index: 1000;
  }
  .page-header .title {
    text-align: center;
    line-height: 55px;
    z-index: 900;
  }
</style>

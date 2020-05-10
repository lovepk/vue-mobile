<template>
  <div>
    <wapHeader v-bind:title="title" />
    <div class="bind-result">
      <img src="../../assets/bindcard/fail.png" alt="绑卡结果图标">
      <p class="result-text">绑卡失败</p>
      <div class="footer">
        <div class="btn">返回</div>
      </div>
    </div>
  </div>
</template>

<script>
import wapHeader from '../../components/common/header'
export default {
  name: 'bindCardResult',
  components: {
    wapHeader
  },
   computed: {
    title: () => {
      return document.title;
    }
  },
}
</script>

<style scoped>
  .bind-result{
    text-align: center;
  }
  .bind-result img {
    margin: 82px 0 40px;
  }
  .result-text {
    height: 30px;
    line-height: 30px;
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 40px;
  }
   .btn {
    width: calc(100% - 38px);
    height: 49px;
    line-height: 49px;
    margin: 0 auto;
    text-align: center;
    font-size: 18px;
    color: #fff;
    background-color: #3d73dd;
    border-radius: 25px;
  }

</style>

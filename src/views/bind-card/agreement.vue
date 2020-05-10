<template>
  <div>
    <wapHeader v-bind:title="title" />
    <div id="agreement">
      <div v-html="content"></div>
      <div class="footer">
        <div class="btn" v-on:click="agreement">同意</div>
      </div>
    </div>
  </div>
</template>

<script>
import wapHeader from '../../components/common/header'
export default {
  name: 'agreement',
  data: () => {
    return {
      content: '',
      contentCopy: '',
    }
  },
  props: {
    acqName: String,
  },
  watch: {
    acqName(value) {
      this.content = this.contentCopy.replace('${institutionName}', value);
    }
  },
  components: {
    wapHeader
  },
   computed: {
    title: () => {
      return document.title;
    }
  },
  methods: {
    agreement() {
      this._bindAgreement.value = true;
      this.$router.back(-1);
    },
    getAgreement() {
      this.$axios({
        method: 'POST',
        url: '/v2/og/wap-cashier/user/agreement',
        data: {},
      }).then((response) => {
        if (response.code === '00') {
          this.contentCopy = response.data.content;
          this.content = response.data.content.replace('${institutionName}', this.acqName);
        } else {
          this.$toast.center('订单已过期')
        }
      })
    },
  },
  mounted() {
    this.getAgreement();
  }
}
</script>

<style>
  #agreement {
    padding: 0 34px 34px;
    margin-bottom: 83px;
    color: #4c4c4c;
  }
  #agreement p>strong {
    display: block;
    margin-top: 15px;
    font-size: 13px;
    font-weight: bold;
  }
  #agreement p {
    font-size: 13px;
    margin-bottom: 15px;
    line-height: 18px;
    vertical-align: top;
    font-weight: 500;
  }
  #agreement p>br {
    line-height: 30px;
  }
  #agreement ul li {
    list-style-type: none;
    font-size: 13px;
    line-height: 18px;
    vertical-align: top;
    font-weight: 500;
  }
  #agreement .footer {
    position: fixed;
    width: 100%;
    height: 49px;
    left: 0;
    bottom: 0;
    padding: 16px 0;
    background-color: #fff;
    border-top: 1px solid #e3e3e3;
  }
  #agreement .btn {
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

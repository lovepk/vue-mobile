<template>
  <div class="bind-card">
    <wapHeader v-bind:title="title" />
    <div class="merchant-info">
      <img src="../../assets/bindcard/logo.png" alt="商户图标">
      <span>坑德基</span>
    </div>
    <div class="card-info">
      <div class="form-title">输入您的卡片信息</div>
      <form action="">
        <div class="input-item">
          <label for="">卡片号码</label>
          <input type="number" v-model="cardNumber" placeholder="输入卡号或拍摄卡片识别" pattern="\d*">
          <div class="input-mask" v-show="isSee === 'nosee'">**** ****</div>
          <div class="ext-info" v-show="!!cardNumber">
            <img v-show="cardBrand" class="card-icon" src="../../assets/bindcard/card.png" alt="卡图标">
            <img v-show="isSee === 'see'" src="../../assets/bindcard/see.png" v-on:click="isSee = 'nosee'" alt="卡图标">
            <img v-show="isSee === 'nosee'" src="../../assets/bindcard/nosee.png" v-on:click="isSee = 'see'" alt="卡图标">
          </div>
        </div>
        <div class="input-item">
          <label for="">有效期</label>
          <input type="number" v-model="cardValidity" placeholder="输入卡片有效期MMYY">
        </div>
        <div class="input-item">
          <label for="">安全码</label>
          <input type="number" v-model="safetyCode" placeholder="输入卡片背后三位数" pattern="\d*">
        </div>
        <div class="input-item">
          <img class="check" v-show="checked" v-on:click="checked = false" src="../../assets/bindcard/checked.png" alt="选中">
          <img class="check" v-show="!checked" v-on:click="checked = true" src="../../assets/bindcard/uncheck.png" alt="未选中">
          <router-link to="/agreement" tag="span" class="agreement">用户协议</router-link>
        </div>
      </form>
    </div>
    <div class="footer">
      <div class="btn" v-on:click="submit" v-bind:class="{disabled: !validate}">绑定</div>
    </div>
  </div>
</template>

<script>
import wapHeader from '../../components/common/header'

export default {
  name: 'bindCard',
  components: {
    wapHeader
  },
  data: () => {
    return {
      seeUrl: '../../assets/bindcard/see.png',
      isSee: 'see',
      cardNumber: '',
      cardBrand: '',
      cardValidity: '',
      safetyCode: '',
      checked: false,
      timer: undefined,
      publicKey: '',
    }
  },
  computed: {
    title: () => {
      return document.title;
    },
    validate: function() {
      return this.checked && this.cardNumber && this.cardValidity && this.safetyCode;
    }
  },
  watch: {
    // 根据输入卡号请求卡信息
    cardNumber() {
      if(!this.cardNumber || this.cardNumber.length < 8) {
        this.cardBrand = '';
        return;
      }
      if (this.timer) {
        clearTimeout(this.timer);
      }
      const that = this;
      this.timer = setTimeout(function() {
        if (!that.publicKey) {
          that.$toast.center('订单已过期')
          return;
        }
         that.$axios({
          method: 'POST',
          url: '/v2/og/wap-cashier/card/brand/judge',
          data: {
            cardNumberberEncrypt: that.$jsencrypt.encrypt(that.cardNumber),
          }
        }).then((response) => {
          if (response.code === '00') {
            that.cardBrand = response.data.data.cardBrand;
          } else {
            that.$toast.center('订单已过期')
          }
        })
      }, 3000)
    },
    checked() {
      this._bindAgreement.value = this.checked;
    },
  },
  methods: {
    // 获取RSA公钥
    getRSAKey() {
      this.$axios({
        method: 'POST',
        url: '/v2/og/wap-cashier/encrypt/key',
        data: {},
      }).then((response) => {
        if (response.code === '00') {
          this.publicKey = response.data.encryptKey;
          this.$jsencrypt.setPublicKey(`-----BEGIN PUBLIC KEY-----${response.data.encryptKey}==-----END PUBLIC KEY-----`);
        } else {
          this.$toast.center('订单已过期')
        }
      })
    },
    submit() {
      if (!this.validate) return;
      const cardEncrypt = {
        cardNumber: this.cardNumber,
        cardBrand: this.cardBrand,
        cardValidity: this.cardValidity,
        safetyCode: this.safetyCode,
      };
      this.$axios({
        method: 'POST',
        url: '/v2/og/wap-cashier/order/update',
        data: {
          cardEncrypt: this.$jsencrypt.encrypt(cardEncrypt),
        },
      }).then((response) => {
        if (response.code === '00') {
          // 询问是否需要进行3DS验证
          this.threeDs();
        } else {
          this.$toast.center('订单已过期')
        }
      })
    },
    threeDs() {
      this.$axios({
        method: 'POST',
        url: '/v2/og/wap-cashier/3ds/auth',
        data: {
          returnUrl: 'https://www.baidu.com',
        },
      }).then((response) => {
        if (response.code === '00') {
          if (response.data.mode === 'NEEDED') {
            // 跳转到3DS认证页面
            window.location.replace(response.data.authUrl);
          } else {
            this.orderSubmit();
          }
        } else {
          this.$toast.center('订单已过期')
        }
      })
    },
    // 提交订单
    orderSubmit() {
      this.$axios({
        method: 'POST',
        url: '/v2/og/wap-cashier/order/submit',
        data: {},
      }).then((response) => {
        if (response.code === '00') {
          window.location.replace(response.data.returnUrl);
        } else {
          this.$toast.center('订单已过期')
        }
      })
    }
  }, 
  mounted() {
    this.getRSAKey();
  },
  // 从协议页面返回后
  activated() {
    this.checked = this._bindAgreement.value;
  }
}
</script>

<style scoped>
  .bind-card {
    background-color: #fff;
  }
  .merchant-info {
    width: calc(100% - 28px);
    height: 47px;
    line-height: 47px;
    padding: 16px 0 16px 28px;
  }
  .merchant-info img {
    float: left;
    margin-right: 26px;
    width: 46px;
    height: 47px;
  }
  .merchant-info span {
    font-size: 20px;
    color: #333;
    font-weight: 600;
  }
  .card-info {
    padding: 16px 0 0 28px;
  }
  .form-title {
    margin-bottom: 22px;
    height: 22px;
    line-height: 22px;
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }
  .input-item {
    position: relative;
    padding: 16px 0;
    height: 20px;
    line-height: 20px;
  }
  .input-item label {
    display: inline-block;
    width: 87px;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: #3f3f3f;
    font-weight: 600;
  }
  .input-item input {
    height: 20px;
    vertical-align: top;
    color: #000;
    font-size: 14px;
    font-weight: 400;
  }
  .input-item .check {
    float: left;
    margin: 4px 8px 0 0;
  }
  .input-item .agreement {
    font-size: 12px;
    color: #5c5c5c;
    line-height: 17px;
  }
  .input-item input:-ms-input-placeholder {
    color: #9b9b9b;
  }
  .input-item input::-webkit-input-placeholder {
    color: #9b9b9b;
  }
  .ext-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    width: 64px;
    height: 100%;
    right: 12px;
    top: 0;
  }
  .ext-info .card-icon {
    height: 22px;
  }
  .input-mask {
    position: absolute;
    width: calc(100% - 87px);
    height: 100%;
    left: 87px;
    top: 0;
    line-height: 55px;
    background-color: #fff;
  }
  .footer {
    width: 100%;
  }
  .footer .btn {
    width: calc(100% - 38px);
    height: 49px;
    line-height: 49px;
    text-align: center;
    margin: 4px auto 0;
    border-radius: 25px;
    background-color: #3d73dd;
    font-size: 18px;
    color: #fff;
  }
  .footer .btn.disabled {
    background-color: #3d3f49;
    opacity: 0.2;
  }
</style>

import bindCard from './views/bind-card/bind-card'
import bindCardResult from './views/bind-card/bind-card-result'
import agreement from './views/bind-card/agreement'
import wapcashier from './views/bind-card/wapcashier'

export default {
  routes: [
    {
      path: '/bind-card-result',
      component: bindCardResult,
      meta: {
        title: '绑卡结果'
      }
    },
    {
      path: '/bind-card', 
      component: bindCard,
      meta: {
        title: '绑卡',
        keepAlive: true,
      }
    },
    {
      path: '/agreement', 
      component: agreement,
      meta: {
        title: '用户协议',
        keepAlive: true,
      }
    },
    {
      path: '/', 
      component: wapcashier,
      meta: {
        loading: true,
      },
    },
    {
      path: '*',  
      redirect: '/'
    }
  ]
}
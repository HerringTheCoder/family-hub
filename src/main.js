import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import VueAxios from 'vue-axios'
import cookieHelper from './helpers/cookie'


Vue.config.productionTip = false
Vue.use(VueAxios, axios)

Vue.axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
Vue.axios.interceptors.request.use(
  (config) => {
    let token = cookieHelper.getTokenCookie();

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    //config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Vue.axios.interceptors.response.use(response => {
  return response;
}, async error => {
  if (!error.response) {
    router.push({
      name: "login"
    });
    error.response = {
      data: {
        success: false,
        message: "Connection error"
      }
    };
  } else
    store.dispatch('deleteSession');
  return Promise.reject(error.response)
});


new Vue({
  router,
  store,
  vuetify,
  render: function (h) {
    return h(App)
  }
}).$mount('#app')
import Vue from 'vue'
import router from './router/router'
import App from './components/App'
import store from './store/index.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import VModal from 'vue-js-modal'
import GSignInButton from 'vue-google-signin-button'
Vue.use(GSignInButton)
Vue.use(VModal, { dynamic: true, injectModalsContainer: true, dialog:true })

Vue.prototype.HOST = '/api';

const app = new Vue({
    el: '#app',
		components: { App },
		template: '<App/>',
    store,
    router,
});

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'

import Login from '../page/Login'
import Register from '../page/Register'
import Home from '../page/Home'


// import guest from './middleware/guest'
// import auth from './middleware/auth'
// import middlewarePipeline from './middlewarePipeline'

Vue.use(VueRouter)
// const = 'test_laravel/public/';
const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path : "/login",
            name : 'login',
            component : Login,
            // meta:{
            //     requiresUser: true
            // }
				},
				{
					path : "/register",
					name : 'register',
					component : Register,
					// meta:{
					//     requiresUser: true
					// }
				},
        {
            path : "/",
            name : 'home',
            component : Home,
            // meta: {
            //     requiresAuth: true
            // }
        },

    ]
});

router.beforeEach((to, from, next) => {
    store.dispatch('fetchAccessToken');
    // if (to.fullPath === '/') {
    //   if (!store.state.accessToken) {
    //     next('/login');
    //   }
		// }
		switch (to.fullPath) {
			case '/':
				if (!store.state.accessToken) {
					next('/login');
				}
				break;
			case '/login':
				if (store.state.accessToken) {
					next('/');
				}
				break;
			case '/register':
				if (store.state.accessToken) {
					next('/');
				}
				break;
			default:
				break;
		}
    next();
})

export default router;

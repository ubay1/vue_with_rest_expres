
import axios from 'axios'
export default {
    login({commit}, data){
        return new Promise (function(resolve, reject){
        commit('auth_request')
				switch (data.data.success) {
					case true:
						const userData = {
							token: data.data.token,
							user: data.data.user
						}
						const token = data.data.token
						localStorage.setItem('data', JSON.stringify(userData))
						axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
						commit('auth_success', userData)
						commit('updateAccessToken', response.data.data.token);
						this.$router.push('/');
						resolve()
						break;
					case false:
						commit('auth_error')
						localStorage.removeItem('data')
						reject(data.message)
						break;
					default:
						break;
				}
        });
    },
    logout({ commit }) {
        localStorage.removeItem('data')
        commit('logout')
    },
    fetchAccessToken({ commit }) {
        commit('updateAccessToken', localStorage.getItem('data'));
		},
    products({commit}, data){
			return new Promise (function(resolve, reject){
        commit('auth_request')
				switch (data.success) {
					case true:
						// console.log(data)
						commit('products', data)
						resolve()
						break;
					case false:
						commit('auth_error')
						reject(data.message)
						break;
					default:
						break;
				}
      });
		}
}

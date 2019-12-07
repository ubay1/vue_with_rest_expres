export default {
    updateAccessToken: (state, accessToken) => {
        state.accessToken = accessToken;
    },
    auth_request(state) {
        state.status = 'loading'
    },
    auth_success(state, userData) {
        state.status = 'success'
        state.userData = userData
    },
    auth_error(state) {
        state.status = 'error'
    },
    logout(state) {
        state.status = ''
        state.userData = ''
		},
		products: (state, data)=>{
			state.products = data
		}
}

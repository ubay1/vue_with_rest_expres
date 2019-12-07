// getters sebagai tempat pengolahan data-data yang didapat dari state, jika tidak ingin ada modifikasi bisa langsung direturn, lihat contoh dibawah.

export default {
    isLoggedIn: state => !!state.userData,
    authStatus: state => state.status,
		userData: state => state.userData,
		products: state=> state.products
}

// state bisa dikatakan sebagai sumber data kita. bisa saja kita ambilnya dari API, dari localstorage, atau kita buat langsung disini. state.js mengandung data murni, tidak boleh edit" atau modifikasi di area ini, jika ingin mengolah data-datanya seperti pengurutan nilai tertinggi atau lainnya kita bisa buat di getters.js

export default{
    accessToken: null,
    status: '',
		userData: localStorage.data || '',
		products:[]
}

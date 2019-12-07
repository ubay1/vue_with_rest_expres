<template>
    <div>
        <Menu/>
        <div class="homepage-header-background">
            <div class="container-fluid">
                <div class="row">

                    <vue-toastr ref="mytoast"></vue-toastr>

                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <div class="container">
                            <div class="bg-primary p-2 text-center text-white">
                                Halaman Login
                            </div>
                            <form method="post" @submit.prevent="onSubmit()">
                                <div class="mb-3 mt-3">
                                    <input type="text" class="form-control" v-model="form.email" name="email" id="email" placeholder="masukan email"> <br>

																		<input type="password" class="form-control" v-model="form.password" name="password" id="password" placeholder="masukan password"> <br>

																		<button type="submit" :disabled="btnsubmit" class="btn btn-primary btn-login">Login <img v-show="showloader" :src="'static/assets/img/loader/loading_send.gif'" class="img_loader" alt=""></button> <br><br>

																		<div class="text-center">
																			<router-link to="/register">belum punya akun ? daftar disini</router-link>
																		</div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Footer/>
    </div>
</template>

<script>
    import axios from 'axios'
    import Menu from '../components/Menu'
    import VueToastr from "vue-toastr"

    export default {
        components:{
            'vue-toastr':VueToastr,
            Menu
        },
        data() {
            return {
                form: {
                    email: '',
                    password: ''
                },
                showloader: false,
                btnsubmit: false
            }
        },
        mounted() {
					console.log(this.HOST);
          console.log(process.env.ROOT_API);
        },
        methods: {
            onSubmit(){
                this.showloader = true;
                this.btnsubmit  = true;
                var formData = {
                    email: this.form.email,
                    password: this.form.password
                }

                axios.post(process.env.ROOT_API+"users/login", formData)
                .then( response => {
									// console.log(response)
                    switch (response.data.data.success) {
                        case false:
                            this.$refs.mytoast.Add({
                                msg: 'Perhatian',
                                title: response.data.data.message,
                                clickClose: true,
                                timeout: 3500,
                                position: 'toast-top-center',
                                type: 'error'
														});

														console.log(response.data)

                            this.$store.dispatch('login', response.data).then(() => {
                                console.log('success is false');
                            }).catch((err)=>{
                                // console.log('ada yang error');
                            })

                            this.showloader = !this.showloader;
                            this.btnsubmit  = false;
                            break;

                        case true:
                            this.$store.dispatch('login', response.data).then(() => {
                                console.log('login is success')
														}).catch((err) => {
															// console.log('ada yang error')
														});

														// console.log(response.data);

														this.showloader = !this.showloader;
                            this.btnsubmit  = false;

                            this.$router.push('/');
                            break;

                        default:
                            break;
                    }
                })
                .catch(function(error){
                    console.log(error);
                });
						},
						getproduct(){
								axios.get(process.env.ROOT_API+"products")
                .then( response => {
									console.log(response.data.data)
							}).catch((err) => {
								console.log(err)
							})
						}
        },
    }
</script>

<style>
	@media(min-width:993px){
		.col-lg-12{
			max-width: 50% !important;
			margin:auto;
		}
	}
    .img_loader {
        width: 20px;
    }
    .homepage-header-background{
        margin-top: 100px;
    }
    .img-slides{
        height: 300px;
        width: 100%;
        object-fit: cover;
        object-position: center;
    }
    form{
        background:white;
        padding: 20px;
        box-shadow: 0px 2px 4px lightgrey;
    }
    .form-control, .btn-login{
        border-radius: 0px;
    }
</style>

<template>
    <div>
        <Menu/>
        <div class="homepage-header-background">
            <div class="container-fluid">
                <div class="row">
                    <vue-toastr ref="mytoast"></vue-toastr>

                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <div class="container bg-formdaftar">
                            <div class="bg-primary p-2 text-center text-white">
                                Halaman Pendaftaran
                            </div>
                            <form action="" method="post" v-on:submit.prevent="onSubmit()">
                                <div class="mb-3 mt-2">
                                    <input type="text" class="form-control" name="username" id="username" placeholder="masukan username" v-model="form.username"> <br>
                                    <input type="text" class="form-control" name="email" id="email" placeholder="masukan email" v-model="form.email"> <br>
                                    <input type="password" class="form-control" name="password" id="password" placeholder="masukan password" v-model="form.password"> <br>

                                    <button type="submit" :disabled="btnsubmit" class="btn btn-primary btn-daftar">Daftar <img v-show="showloader" :src="'static/assets/img/loader/loading_send.gif'" class="img_loader" alt=""></button>
                                </div>
                                <div class="text-center">
                                    <router-link to="/login">sudah punya akun ? masuk disini lae</router-link>
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
    import swal from 'sweetalert2'
    import VueToastr from "vue-toastr"

    export default {
        components:{
            'vue-toastr':VueToastr,
            Menu
        },
        data() {
            return {
                form: {
                    username: '',
                    email: '',
                    password: '',
                },
                showloader: false,
                btnsubmit: false
            }
        },
        computed: {

        },
        mounted() {
            console.log(process.env.ROOT_API);
        },
        methods: {
            onSubmit() {
                this.text_send_service = !this.text_send_service;
                this.showloader        = !this.showloader;
                this.btnsubmit         = true;

                let currentObj = this;

                let formData = {
									username:this.form.username,
									email:this.form.email,
									password:this.form.password
								}

                axios.post(process.env.ROOT_API+'users/register', formData)
                .then(response => {
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


														this.showloader = !this.showloader;
														this.btnsubmit = !this.btnsubmit;
                            break;

                        case true:
                            this.$refs.mytoast.Add({
                                msg: 'Perhatian',
                                title: response.data.data.message,
                                clickClose: true,
                                timeout: 3500,
                                position: 'toast-top-center',
                                type: 'success'
														});

														this.showloader = !this.showloader;
														this.btnsubmit  = !this.btnsubmit;
														this.form = '';
                            break;

                        default:
                            break;
                    }
                })
                .catch(function (error){
                    currentObj.output = error;
                });
            }
        },
    }
</script>

<style>
		@media(min-width:993px){
			.bg-formdaftar{
				max-width: 50% !important;
				margin:auto;
			}
		}
    @media (min-width: 768px) {
        .bg-formdaftar {
            max-width: 520px !important;
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
    .form-control, .btn-daftar{
        border-radius: 0px;
    }
</style>

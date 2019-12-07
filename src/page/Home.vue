<template>
    <div>
        <Menu/>
        <div class="homepage-header-background">
            <div class="container-fluid">
							 <vue-toastr ref="mytoast"></vue-toastr>
									<div class="bg-add-product">
                    <span class="txt-apiblog">Product Terbaru</span>
										<button data-toggle="modal" data-target="#addproduct" class="btn btn-primary btn-add">Tambah Product</button> <br><br>
									</div>

								<!-- add productModal -->
								<div class="modal fade" id="addproduct" tabindex="-1" role="dialog" aria-labelledby="addproductLabel" aria-hidden="true">
									<div class="modal-dialog" role="document">
										<div class="modal-content">
											<div class="modal-header">
												<h5 class="modal-title" id="addproductLabel">Tambah Product</h5>
												<button type="button" class="close" data-dismiss="modal" aria-label="Close">
													<span aria-hidden="true">&times;</span>
												</button>
											</div>
											<div class="modal-body">
												<form @submit.prevent="addProduct()" method="post">
													<input type="text" class="form-control form-addproduct" v-model="form.nama" name="nama" placeholder="masukan nama product"> <br>

													<input type="text" class="form-control form-addproduct" v-model="form.price" name="price" placeholder="masukan harga product"> <br>

													<button type="submit" :disabled="btnsubmit" class="btn btn-primary form-addproduct">Simpan <img v-show="showloader" :src="'static/assets/img/loader/loading_send.gif'" class="img_loader" alt=""></button>
												</form>
											</div>
											<div class="modal-footer">
												<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
											</div>
										</div>
									</div>
								</div>

                <div class="bg-apiblog row ">
                    <div v-for="(product, index) in products" :key="index" class="data-product col-lg-4 col-md-6 col-sm-6 col-xs-12">
											<div class="card" style="width:100%">
											<div class="card-body">
												<h2 class="card-title"><b>{{product.nama}}</b></h2>
											</div>
											<div class="card-footer bg-footer">
												<!-- <span>{{product.id}}</span> -->
												<span>Rp. {{product.price}}</span>

												<div style="display:flex; justify-content:right;">
													<button @click="showModalEdit(product.id,product.nama, product.price)" style="border-radius:0px;" type="button"  class="btn btn-warning btn-sm" :value="product.id">Edit</button>

													<button style="border-radius:0px;" @click.prevent="deleteProduct(product.id)" type="button" class="btn btn-danger btn-sm" :value="product.id">Hapus</button>
												</div>
											</div>
										</div>
										</div>
                </div>

								<!-- edit productModal -->
								<!-- <modal-update /> -->
            </div>
        </div>

        <Footer/>
    </div>
</template>

<script>
		import axios from 'axios'
		import Menu from '../components/Menu'
		import VueToastr from "vue-toastr"
		import ModalUpdate from './ModalUpdateProduct'

    export default {
				components:{
					'vue-toastr':VueToastr,
					Menu,
					'modal-update':ModalUpdate
				},
				props:['product'],
        data() {
            return {
							// products:[],
							form:{
								nama:'',
								price:'',
							},
							user: {
								token: "",
								email: "",
							},
							showloader: false,
							btnsubmit: false,
            }
				},
				computed: {
					products(){
						return this.$store.state.products.data;
					}
				},
        mounted() {
            if (localStorage.data) {
                let data = JSON.parse(localStorage.data);
                this.token = data.token;
                this.user.email = data.user.email;
								// console.log(data)

								axios.get(process.env.ROOT_API+"products")
                .then( response => {
									this.$store.dispatch('products', response.data).then(() => {
											console.log('get product success')
									}).catch((err) => {
										// console.log('ada yang error')
									});
                })
                .catch(function(error){
                    console.log(error);
                });
						}
        },
				methods: {
					addProduct(){
						this.showloader = !this.showloader;
						this.btnsubmit  = !this.btnsubmit;

						var formdata = {
							nama: this.form.nama,
							price: this.form.price
						}

						axios.post(process.env.ROOT_API + 'products', formdata)
						.then(response => {
							console.log(response);
							this.showloader = !this.showloader;
							this.btnsubmit  = !this.btnsubmit;
							switch (response.data.data.statuscode) {
								case 500:
									this.$refs.mytoast.Add({
											msg: 'Perhatian',
											title: response.data.data.message,
											clickClose: true,
											timeout: 3500,
											position: 'toast-top-center',
											type: 'error'
									});
									break;
								case 200:
									this.$refs.mytoast.Add({
											msg: 'Perhatian',
											title: response.data.data.message,
											clickClose: true,
											timeout: 3500,
											position: 'toast-top-center',
											type: 'success'
									});

									this.form = '';

									axios.get(process.env.ROOT_API+"products")
									.then( response => {
										this.$store.dispatch('products', response.data).then(() => {
											console.log(response.data.data)
												console.log('update product success')
										}).catch((err) => {
											// console.log('ada yang error')
										});
									})
									.catch(function(error){
											console.log(error);
									});

									break;
								default:
									console.log('//////// \n<(o)=(o)>');
									break;
							}
						})
						.catch(err => {
							console.log(err);
							this.showloader = !this.showloader;
							this.btnsubmit  = !this.btnsubmit;
						});
					},
					deleteProduct(id){
						axios.delete(process.env.ROOT_API + 'products/'+id)
						.then(response => {
							axios.get(process.env.ROOT_API+"products")
							.then( response => {
									axios.get(process.env.ROOT_API+"products")
									.then( response => {
										this.$store.dispatch('products', response.data).then(() => {
											// console.log(response.data.data)
												console.log('update product success')
										}).catch((err) => {
											// console.log('ada yang error')
										});
									})
									.catch(function(error){
											console.log(error);
									});
							})
							.catch(function(error){
									console.log(error);
							});
						})
						.catch(err => {
							// console.log(err);
							this.showloader = !this.showloader;
							this.btnsubmit  = !this.btnsubmit;
						});
					},
					showModalEdit(id, nama, price) {
						this.$modal.show(ModalUpdate, {
							id: id,
							nama: nama,
							price:price,
							buttons: [
								{
									title: 'Deal with it',
									handler: () => { alert('Woot!') }
								},
								{
									title: '',       // Button title
									default: true,    // Will be triggered by default if 'Enter' pressed.
									handler: () => {} // Button click handler
								},
								{
									title: 'Close'
								}
							]
						},
						{
							draggable: true
						}
						);

						console.log(nama);
					},
				},
    }
</script>

<style>
    @media(min-width:768px){
        .bg-img-home{
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
        }
        .bg-welcome{
            margin-bottom: 100px;
            text-align: left;
            margin-left: 60px;
            margin-right: 60px;
        }
        .welcome{
            color: #393636;
            font-weight: bold;
            font-size: 20px;

        }
        .txt-home{
            font-size: 20px;
            color: #393636;
            text-transform: uppercase;
            font-weight: bold;
        }
    }

    @media (min-width:320px) and (max-width:767px){
        .bg-img-home{
            display: flex;
            flex-direction: column;
            margin-bottom: 40px;
        }
        .bg-img-home span{
            margin-bottom: 20px;
        }
        .bg-welcome{
            margin-bottom: 100px;
            text-align: left;
            margin-left: 60px;
            margin-right: 60px;
        }
        .welcome{
            color: #393636;
            font-weight: bold;
            font-size: 20px;
        }
        .txt-home{
            font-size: 20px;
            color: #393636;
            text-transform: uppercase;
            font-weight: bold;
        }
    }

    /* =============================== fixed bottom ========================== */
        @media (min-width: 992px) {
            .img-tulis-blog{
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 70px;
                box-shadow: 0px 2px 6px lightgrey;
                border-radius: 100%;
            }

            .img-upload-gambar{
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 70px;
                box-shadow: 0px 2px 6px lightgrey;
                border-radius: 100%;
            }
        }

        @media(min-width:768px) and (max-width:991px){
            .img-tulis-blog{
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 70px;
                box-shadow: 0px 2px 6px lightgrey;
                border-radius: 100%;
            }

            .img-upload-gambar{
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 70px;
                box-shadow: 0px 2px 6px lightgrey;
                border-radius: 100%;
            }
        }
    /* =============================== End fixed bottom ========================== */

    .fixed-bottom {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1030;
        padding: 15px;
    }

    .img-home{
        width: 150px;
    }

    .hr-home{
        /* margin-left: 60px; */
        /* margin-right: 60px; */
        margin-bottom: 20px;
    }

    .bg-apiblog{
        margin-top: 20px;
        margin-bottom: 80px;
        /* margin-left: 60px; */
        /* margin-right: 60px; */
    }
    .txt-apiblog{
        background: #393636;
        padding: 10px;
        color: #fff;
        font-size: 15px;
        font-weight: bold;
    }

    .homepage-header-background{
        margin-top: 100px;
    }

		.bg-add-product{
			display: flex;
			/* justify-content: space-between; */
			align-content: center;
		}

		.btn-add{
			border-radius: 0;
			padding: 10px;
			color: #fff;
			float: right;
		}

		.form-addproduct{
			border-radius: 0px;
		}

		.img_loader {
        width: 20px;
    }

		.data-product{
			margin-bottom: 20px;
		}

		.bg-footer{
			display: flex;
			justify-content: space-between;
			align-content: center;
		}
</style>

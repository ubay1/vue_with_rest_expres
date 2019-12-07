<template>
	<div>
			<!-- <div class="modal fade"> -->
				<!-- <vmodal name="modalEditBank"> -->
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="updateproductLabel">Edit Product</h5>
					</div>
					<div class="modal-body">
						<form @submit.prevent="updateProduct()" method="post">
							<input type="hidden" v-model="form.id" class="form-control">
							<input type="text" class="form-control form-updateproduct" v-model="form.nama" name="nama"
								placeholder="masukan nama product"> <br>

							<input type="text" class="form-control form-updateproduct" v-model="form.price" name="price"
								placeholder="masukan harga product"> <br>

							<button type="submit" :disabled="btnsubmit" class="btn btn-primary form-updateproduct">Simpan <img
									v-show="showloader" :src="'static/assets/img/loader/loading_send.gif'" class="img_loader"
									alt=""></button>
						</form>
					</div>
				</div>
				<!-- </vmodal> -->
			<!-- </div> -->
	</div>
</template>

<script>
import axios from 'axios'

	export default {
		components: {
		},
		props: ['id','nama', 'price'],
		data() {
			return {
				products:[],
				form:{
					id:this.id,
					nama:this.nama,
					price:this.price,
				},
				showloader: false,
				btnsubmit: false,
			}
		},
		methods: {
			updateProduct(event){
				this.showloader = !this.showloader;
				this.btnsubmit  = !this.btnsubmit;

				var formdata = {
					nama: this.form.nama,
					price: this.form.price
				}

				axios.put(process.env.ROOT_API + 'products/'+this.form.id, formdata)
				.then(response => {
					// console.log(response);
					this.showloader = !this.showloader;
					this.btnsubmit  = !this.btnsubmit;

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
				.catch(err => {
					console.log(err);
					this.showloader = !this.showloader;
					this.btnsubmit  = !this.btnsubmit;
				});
			},
		},
		computed: {

		},
		mounted() {

		}
	}

</script>

<style>
	.v--modal{
		height: auto !important;
	}
</style>

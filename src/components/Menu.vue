<template>
    <div>
        <template v-if="accessToken">
            <nav class="navbar navbar-expand-lg  navbar-dark fixed-top bg-primary">
                <router-link class="navbar-brand" to="/">Home</router-link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#mynavbar" aria-controls="mynavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="mynavbar">
                    <ul class="navbar-nav ml-auto">
                        <!-- <li class="nav-item">
                            <b  class="nav-link">{{user.nama}}</b>
                        </li> -->
                        <li class="nav-item">
                            <button type="button" class="btn btn-danger" @click.prevent="logout()">Logout</button>
                            <!-- <button type="button" class="btn btn-info" @click.prevent="getuser()">getuser</button> -->
                        </li>
                    </ul>
                </div>
            </nav>

        </template>
        <template v-else-if="!accessToken">
            <nav class="navbar navbar-expand-lg  navbar-dark fixed-top bg-primary">
                <router-link class="navbar-brand" to="/login">Home</router-link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#mynavbar" aria-controls="mynavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="mynavbar">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/login">Login</router-link>
                        </li>
												<li class="nav-item">
                            <router-link class="nav-link" to="/register">Register</router-link>
                        </li>
                    </ul>
                </div>
            </nav>
        </template>
    </div>
</template>

<style>
</style>

<script>
    import axios from 'axios'
    import {mapState} from 'vuex'
    export default {
        data() {
            return {
                token: "",
                user: {
                    email: "",
                }
            }
        },
        computed: mapState([
            'accessToken'
        ]),
        mounted() {
            if (localStorage.data) {
                let data = JSON.parse(localStorage.data);
                this.user.email = data.user.email;
                // console.log(data)
            }
        },
        methods: {
            logout() {
                this.email = JSON.parse(localStorage.data).user.email;
								this.token = JSON.parse(localStorage.data).token;
								this.$store.dispatch("logout").then(() => {
									this.$router.push('/login')
										// window.location.assign(process.env.MIX_APP_URL+"login");
								});
            },
            getuser() {
                this.email = JSON.parse(localStorage.data).user.email;
                this.token = JSON.parse(localStorage.data).user.token.access_token;
                // console.log("token = ", this.token);

                const headers = {
                    "Accept":"application/json",
                    "Authorization": "Bearer " + this.token
                };

                axios.get(process.env.MIX_API_URL + "user/getuser", {
                    headers: headers
                })
                .then(response => {
                    console.log("Response", response.data);
                });
		    },
        }
    }

</script>
<style>
	.ml-auto .dropdown-menu {
		left: auto !important;
		right: 0px;
	}

    .tulis-blog-xs{
        color: #fff;
    }

    @media (min-width: 992px) {
        .navbar-expand-lg .navbar-collapse {
            display: -webkit-box !important;
            display: flex !important;
            flex-direction: row-reverse;
            flex-basis: auto;
        }
    }

	.navbar-dark .navbar-nav .nav-link{
		color:#fff;
	}

    .navbar-dark .navbar-toggler {
        /* color: rgba(255, 255, 255, 0.5); */
        border-color: rgba(255, 255, 255, 0);
    }

    button:focus {
        outline: none;
    }

</style>

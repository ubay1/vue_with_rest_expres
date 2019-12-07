<template>
    <div>
        <main>
            <transition name="fade">
                <router-view></router-view>
            </transition>
        </main>
    </div>
</template>

<script>
    export default {

    }
</script>

<style>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
      opacity: 0
    }

    html, body{
        background: rgb(248, 248, 248);
    }
</style>

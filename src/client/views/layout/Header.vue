<template>
  <header class="header-global">
    <base-nav class="navbar-main mb-4" type="" effect="dark" expand>
      <router-link slot="brand" class="navbar-brand mr-sm-5" to="/">
        <!-- <img src="img/brand/white.png" alt="logo"> -->
        <h5 class="align-middle my-0 text-white"><i class="far fa-comment-dots mx-2"></i> {{appTitle()}}</h5>
      </router-link>

      <ul class="navbar-nav align-items-center ml-auto">
        <li class="nav-item">
          <a class="nav-link nav-link-icon"
             href="https://github.com/supermemo/"
             target="_blank"
             data-toggle="tooltip" title="See the SuperMemo Github">
            <i class="fab fa-github"></i>
            <span class="nav-link-inner--text d-none">Github</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-link-icon" href="https://discord.gg/vUQhqCT"
              target="_blank" data-toggle="tooltip" title="Join our Discord server">
              <i class="fab fa-discord"></i>
              <span class="nav-link-inner--text d-none">Discord</span>
          </a>
        </li>
        <li class="nav-item ml-sm-4" v-if="isLoggedIn">
          <a href="/auth/logout"
             :alt="user.username"
             target="_self"
             class="btn btn-sm btn-user">
            <img :src="user.photos[0].value" />
          </a>
        </li>
        <li class="nav-item ml-sm-4" v-else>
          <a href="/auth"
             target="_self"
             class="btn btn-success btn-icon btn-sm">
            <span class="btn-inner--icon h6 text-white">
              <i class="fab fa-github mr-2"></i>
            </span>
            <span class="nav-link-inner--text">Sign In</span>
          </a>
        </li>
      </ul>
    </base-nav>
  </header>
</template>

<script>
import BaseNav from '@/components/BaseNav.vue';

export default {
  components: {
    BaseNav,
  },
  computed: {
    user() {
      return this.$store.getters['auth/user'];
    },
    isLoggedIn() {
      return this.$store.getters['auth/isAuthenticated'];
    },
  },
  data() {
    return {
      appTitle: () => process.env.VUE_APP_TITLE,
    };
  },
};
</script>

<style scoped lang="scss">
.btn.btn-user {
    text-align: center;
    max-width: 2.0rem;
    padding: 0;
    border-radius: 0;

    img {
      max-width: 100%;
      max-height: 100%;
      border-radius: 50%;
    }
}
</style>

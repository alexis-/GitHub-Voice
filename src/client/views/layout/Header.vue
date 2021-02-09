<template>
  <header class="header-global">
    <base-nav class="navbar-main mb-4" type="" effect="dark" expand>
      <router-link slot="brand" class="navbar-brand mr-sm-5" to="/">
        <!-- <img src="img/brand/white.png" alt="logo"> -->
        <h5 class="align-middle my-0 text-white">
          <i class="far fa-comment-dots mx-2"></i> {{appTitle()}}
          <badge class="ml-1 pt-2" custom-color="red">BETA</badge>
        </h5>
      </router-link>

      <ul class="navbar-nav align-items-center ml-auto">
        <li class="nav-item" v-if="socialLinkGitHub">
          <a class="nav-link nav-link-icon"
             :href="socialLinkGitHub"
             target="_blank"
             data-toggle="tooltip" title="Visit our Github page">
            <i class="fab fa-github"></i>
            <span class="nav-link-inner--text d-none">Github</span>
          </a>
        </li>
        <li class="nav-item" v-if="socialLinkFacebook">
          <a class="nav-link nav-link-icon"
             :href="socialLinkFacebook"
             target="_blank"
             data-toggle="tooltip" title="Visit our Facebook page">
            <i class="fab fa-facebook"></i>
            <span class="nav-link-inner--text d-none">Facebook</span>
          </a>
        </li>
        <li class="nav-item" v-if="socialLinkTwitter">
          <a class="nav-link nav-link-icon"
             :href="socialLinkTwitter"
             target="_blank"
             data-toggle="tooltip" title="Visit our Twitter page">
            <i class="fab fa-twitter"></i>
            <span class="nav-link-inner--text d-none">Twitter</span>
          </a>
        </li>
        <li class="nav-item" v-if="socialLinkGitHub">
          <a class="nav-link nav-link-icon"
             href="https://discord.gg/vUQhqCT"
             target="_blank"
             data-toggle="tooltip" title="Join our Discord server">
              <i class="fab fa-discord"></i>
              <span class="nav-link-inner--text d-none">Discord</span>
          </a>
        </li>
        <li class="nav-item" v-if="socialLinkPatreon">
          <a class="nav-link nav-link-icon"
             :href="socialLinkPatreon"
             target="_blank"
             data-toggle="tooltip" title="Checkout our Patreon">
              <i class="fab fa-patreon"></i>
              <span class="nav-link-inner--text d-none">Patreon</span>
          </a>
        </li>
        <li class="nav-item ml-sm-3" v-if="isLoggedIn">
          <a :href="authSignOut"
             :alt="user.username"
             target="_self"
             class="btn btn-sm btn-user">
            <img :src="user.photos[0].value" />
          </a>
        </li>
        <li class="nav-item ml-sm-3" v-else>
          <a :href="authSignIn"
             target="_self"
             class="btn btn-signin btn-outline-secondary btn-icon btn-sm">
            <span class="btn-inner--icon h6">
              <i class="fab fa-github mr-2"></i>
            </span>
            <span class="nav-link-inner--text">Sign In</span>
          </a>
        </li>
      </ul>
    </base-nav>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseNav from '@/components/base/BaseNav.vue';
import Badge from '@/components/base/Badge.vue';

export default Vue.extend({
  components: {
    BaseNav,
    Badge,
  },
  computed: {
    user() {
      return this.$store.getters['auth/user'];
    },
    isLoggedIn() {
      return this.$store.getters['auth/isAuthenticated'];
    },
    authSignIn() {
      return `${process.env.VUE_APP_API_URL}auth`;
    },
    authSignOut() {
      return `${process.env.VUE_APP_API_URL}auth/logout`;
    },
    socialLinkGitHub() {
      return process.env.VUE_APP_SOCIAL_GIT_HUB;
    },
    socialLinkFacebook() {
      return process.env.VUE_APP_SOCIAL_FACEBOOK;
    },
    socialLinkTwitter() {
      return process.env.VUE_APP_SOCIAL_TWITTER;
    },
    socialLinkDiscord() {
      return process.env.VUE_APP_SOCIAL_DISCORD;
    },
    socialLinkPatreon() {
      return process.env.VUE_APP_SOCIAL_PATREON;
    },
  },
  data() {
    return {
      appTitle: () => process.env.VUE_APP_TITLE,
    };
  },
});
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
.btn.btn-signin span {
  color: white;
}
.btn.btn-signin:hover span {
  color: black;
}
</style>

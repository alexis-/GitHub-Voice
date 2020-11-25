<template>
  <div>
   <modal :show.sync="showModal"
          modal-classes="modal-dialog-centered">
      <div class="text-default text-center mb-3">
          <b>Sign into GitHub to vote on issues.</b>
      </div>
      <div class="text-muted text-center mb-3">
          <small>Sign in with</small>
      </div>
      <div class="btn-wrapper text-center">
          <base-button type="neutral" @click='SignInWithGithub'>
              <img slot="icon" src="img/icons/common/github.svg">
              Github
          </base-button>
      </div>
   </modal>

  </div>
</template>

<script>
export default {
  computed: {
    showModal: {
      get() {
        return this.$store.getters.isSignInModalDisplayed;
      },
      set() {
        this.$store.commit('TOGGLE_SIGN_IN_MODAL');
      },
    },
  },
  methods: {
    SignInWithGithub(evt) {
      window.location = '/auth';
    },
  },
};
</script>

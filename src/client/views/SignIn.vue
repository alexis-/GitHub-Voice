<template>
    <section class="section section-shaped section-lg my-0">
        <div class="shape shape-style-1 bg-gradient-default">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="container pt-md">
            <div class="row justify-content-center">
                <div class="col-md-7">
                    <card type="secondary" shadow
                          header-classes="bg-white pb-5"
                          body-classes="px-md-5 py-md-5"
                          class="border-0">
                        <template>
                            <div class="text-primary text-center mb-3">
                                <b>Please sign in to view and vote on issues.</b>
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
                        </template>
                    </card>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
  methods: {
    SignInWithGithub(evt) {
      console.log(evt);
    },
  },
};
</script>

<style>
</style>

<template>
  <div id="app">
    <Header />
    <main>
      <SignInModal />
      <router-view/>
    </main>
  </div>
</template>

<script>
import Header from '@/views/layout/Header.vue';
import SignInModal from '@/views/layout/SignInModal.vue';

export default {
  components: {
    Header,
    SignInModal,
  },
};
</script>

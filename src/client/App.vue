<template>
  <div id="app">
    <Header />
    <main class="mb-4">
      <SignInModal />
      <router-view/>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Header from '@/views/layout/Header.vue';
import SignInModal from '@/views/layout/SignInModal.vue';

export default {
  components: {
    Header,
    SignInModal,
  },
};
</script>

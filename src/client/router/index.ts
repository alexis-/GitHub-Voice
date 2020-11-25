import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import store from '@/store';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Issues.vue'), /* {
      if (store.getters['auth/isAuthenticated']) {
        return import('@/views/Issues.vue');
      }

      return import('@/views/SignIn.vue');
    }, */
  },
  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireAuth)) {
    if (store.getters['auth/isAuthenticated']) {
      next();
    } else {
      next({
        path: '/home',
        query: { requireSignIn: 'true' },
      });
    }
  } else {
    next();
  }
});

export default router;

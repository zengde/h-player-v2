<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { historyMixin } from './mixin/video';

export default {
  name: 'App',
  mixins: [historyMixin],
  created() {
    window.addEventListener('message', (e) => {
      const {
        data: {
          message,
          from = '',
        },
      } = e;
      if (from === 'mini-video') this.gotoPlayer(message);
    }, false);

    this.$store.dispatch('getLatestVersion');
    this.$store.dispatch('loadSiteList').then((storeSiteList) => {
      if (!storeSiteList || storeSiteList.length === 0) {
        this.$router.push('/import');
      }
    });
  },
};
</script>

<style>
</style>

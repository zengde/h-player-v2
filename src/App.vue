<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import {
  Plugins,
} from '@capacitor/core';
import { historyMixin } from './mixin/video';

const { StatusBar } = Plugins;

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

    StatusBar.hide();
  },
};
</script>

<style>
</style>

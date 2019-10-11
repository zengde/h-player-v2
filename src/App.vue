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
    const ipc = this.$q.electron.ipcRenderer;
    ipc.on('from-mini', (event, message) => {
      this.gotoPlayer(message);
    });
    this.$store.dispatch('getLatestVersion');
    this.$store.dispatch('loadSiteList').then((storeSiteList) => {
      if (!storeSiteList || storeSiteList.length === 0) {
        this.$router.push('/import');
      }
    });
    this.$store.dispatch('loadSettings');
    this.$store.dispatch('loadHistory');
    this.$store.dispatch('loadDownload');
  },
};
</script>

<style>
</style>

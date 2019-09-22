<template>
  <q-bar class="q-electron-drag">
    <q-avatar
      square
      color="orange"
    >H</q-avatar>
    <div>H-PLAYER</div>

    <q-space />

    <q-btn
      v-show="layout.includes('config')"
      dense
      flat
      round
      icon="settings"
      @click="configClick"
    />

    <play-history />
    <download-queue />

    <q-btn
      dense
      flat
      icon="minimize"
      @click="minimize"
    />
    <q-btn
      dense
      flat
      icon="crop_square"
      @click="maximize"
    />
    <q-btn
      dense
      flat
      icon="close"
      @click="closeApp"
    />
  </q-bar>
</template>

<script>
import PlayHistory from '../layouts/History.vue';
import DownloadQueue from '../layouts/VideoDownload.vue';

export default {
  name: 'titleBar',
  props: {
    layout: {
      type: Array,
      default() {
        return ['config', 'minimize', 'maximize', 'close'];
      },
    },
  },
  components: {
    PlayHistory,
    DownloadQueue,
  },
  methods: {
    minimize() {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize();
      }
    },

    maximize() {
      if (process.env.MODE === 'electron') {
        const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow();

        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }
    },

    closeApp() {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().close();
      }
    },
    configClick() {
      this.$emit('config');
    },
  },
};
</script>

<style>
</style>

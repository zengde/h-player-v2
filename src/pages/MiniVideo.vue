<template>
  <q-page
    class="video-warp"
    padding
  >
    <hls-player
      :source="normalizeUrl(currentEpisode.url)"
      :options="options"
      :startTime="startTime"
      ref="player"
    ></hls-player>
     <q-page-sticky
      position="top-right"
      :offset="[5, 5]"
    >
      <q-btn
        round
        color="accent"
        icon="crop_square"
        @click="maximize"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import HlsPlayer from 'components/HlsPlayer';
import videoMixin from '../mixin/video';

export default {
  name: 'MiniVideo',
  mixins: [videoMixin],
  data() {
    return {
      options: {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'captions',
          'settings',
          'airplay',
          'fullscreen',
        ],
      },
      currentVideo: {},
    };
  },
  components: {
    HlsPlayer,
  },
  mounted() {
    this.currentVideo = JSON.parse(this.$route.query.video);

    this.initGroup(this.currentVideo, this.$route.query.h);
    document.querySelector('title').text = `${this.currentVideo.name[0]}-${this.currentEpisode.episode}`;
  },
  methods: {
    maximize() {
      const ipc = this.$q.electron.ipcRenderer;
      const { getCurrentWindow } = this.$q.electron.remote;
      const { player } = this.$refs.player;
      const { playing } = player;
      if (playing) {
        player.pause();
      }
      player.pause();
      this.$q.dialog({
        title: '还原',
        message: '此操作将在主窗口中打开视频并关闭当前窗口，是否继续',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        const message = this.setHistory(true);
        ipc.send('from-mini', message);
        const window = getCurrentWindow();
        window.close();
      }).onCancel(() => {
        if (playing) {
          player.play();
        }
      });
    },
  },
};
</script>

<style>
.video-warp {
  height: 100vh;
}
</style>

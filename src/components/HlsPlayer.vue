<template>
  <div class="hls-plyr-player">
    <video
      preload="none"
      ref="video"
    ></video>
  </div>
</template>

<script>
import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import '../assets/plyr/plyr-plugin-capture';
import '../assets/plyr/plyr-rotate';
import '../assets/plyr/plyr-thumbnail-generate';

export default {
  name: 'HlsPlayer',
  props: {
    source: {
      type: String,
      required: true,
    },
    emit: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    options: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
    startTime: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
      hls: {},
      player: {},
    };
  },
  mounted() {
    console.log('HLSPlayer:mounted');
    this.player = new Plyr(this.video, this.options);
    this.$emit('player', this.player);
    this.emit.forEach((element) => {
      console.dir(this.emitPlayerEvent);
      this.player.on(element, this.emitPlayerEvent);
    });
    this.$once('hook:beforeDestroy', () => {
      this.player.destroy();
      if (this.hls.stopLoad && this.hls.destroy) {
        console.log('HLSPlayer:clear');
        this.hls.stopLoad();
        this.hls.destroy();
      }
      console.log('HLSPlayer:beforeDestroy');
    });
  },
  computed: {
    video() {
      return this.$refs.video;
    },
  },
  watch: {
    source() {
      console.log('HLSPlayer:watch:source');
      this.initPlayer();
    },
    startTime(value) {
      this.video.currentTime = value;
    },
  },
  methods: {
    initPlayer() {
      console.log('HLSPlayer:initPlayer');
      if (!Hls.isSupported()) {
        this.video.src = this.source;
      } else {
        if (this.hls.stopLoad && this.hls.destroy) {
          console.log('HLSPlayer:clear');
          this.hls.stopLoad();
          this.hls.destroy();
        }
        const hls = new Hls();
        this.hls = hls;
        hls.on(Hls.Events.ERROR, (event, data) => {
          this.$emit('hls-error', event, data);
        });

        hls.loadSource(this.source);
        hls.attachMedia(this.video);
        this.video.currentTime = this.startTime;
      }
    },
  },
};
</script>

<style lang="stylus">
.hls-plyr-player {
  width: 100%;
  height: 100%;

  .plyr {
    width: 100%;
    height: 100%;
  }

  .plyr__video-wrapper {
    width: 100%;
    height: 100%;

    video {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>

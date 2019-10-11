<template>
  <q-linear-progress v-if="video.isDownloading" :value="progress" stripe rounded style="height: 10px" class="q-mt-sm"  />
</template>
<script>
import { mapState, mapActions } from 'vuex';
import ChildProcessFFmpeg from '../utils/ffmpeg';

const ffmpeg = new ChildProcessFFmpeg();

export default {
  name: 'downloadVideo',
  props: {
    video: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      progress: 0.0,
    };
  },
  computed: {
    ...mapState({
      save: state => state.app.savePath,
    }),
  },
  methods: {
    ...mapActions(['finishDown']),
    msg(msg, type = 'success') {
      const colors = { error: 'negative', success: 'primary', waring: 'warning' };
      this.$q.notify({
        message: msg,
        color: colors[type],
      });
    },
    startConversion(command, format, time) {
      let inputPath = [];
      switch (command) {
        case 'downLoadM3u8':
          inputPath = [this.video.downUrl];
          break;
        default:
          inputPath = [this.videoPath];
          break;
      }
      const params = {
        inputPath,
        outputPath: this.save,
        onProgress: this.onProgress,
        command,
        format,
        time,
        onFinish: this.onFinish,
      };
      ffmpeg.convert({ ...params });
    },
    onProgress(data) {
      data = parseFloat(data);
      if (Number.isNaN(data)) return;
      this.progress = +data / 100;
    },
    onFinish(savefile) {
      this.msg('下载完成！');
      this.$emit('finish', this.video);
      this.finishDown({ video: this.video, savefile });
    },
    // 开始转码
    startCommand() {
      // 基于fluentFFmpeg的转码
      this.startConversion('downLoadM3u8', 'mp4');
    },
    // 停止转码
    stopCommand() {
      ffmpeg.stop();
      this.progress = 0.0;
    },
  },
  created() {
    if (this.video.isDownloading) {
      if (this.save === '') {
        this.msg('请先设置视频下载保存地址！', 'error');
      } else {
        this.startCommand();
      }
    }
  },
  beforeDestroy() {
    this.stopCommand();
  },
};
</script>

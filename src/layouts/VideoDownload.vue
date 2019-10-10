<template>
  <q-btn dense flat round icon="save_alt">
    <q-badge color="red" floating>{{ downList.length }}</q-badge>
    <q-menu auto-close>
      <div class="q-pa-md q-gutter-sm">
        <q-toggle label="清空" color="red" v-model="clear" />
        <q-btn flat label="全部取消" color="secondary" @click="stopAll()" />
        <q-btn flat label="全部删除" color="red" @click="delAll()" />
      </div>
      <q-list dense style="min-width: 100px" separator>
        <q-item clickable v-for="(video,k) in downList" :key="k" v-close-popup>
          <q-item-section avatar @click="onItemClick(video)">
            <q-img :src="video.pic[0]" color="primary" />
          </q-item-section>
          <q-item-section @click="onItemClick(video)">
            <q-item-label>{{ video.name[0] }}</q-item-label>
            <q-item-label caption>{{ video.last[0] }}</q-item-label>
            <q-item-label>
              <download-video :video="video" />
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon v-if="video.progress === 100" name="close" color="red" @click="removeDown(video)" />
            <q-toggle v-else color="blue" v-model="video.isDownloading" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import downloadVideo from 'components/downloadVideo';

export default {
  name: 'videoDownload',
  data() {
    return {
      clear: false,
    };
  },
  computed: {
    ...mapState({
      downList: state => state.download.downList,
    }),
  },
  components: {
    downloadVideo,
  },
  watch: {
    clear(bool) {
      if (bool) {
        this.clearDown();
      }
    },
  },
  methods: {
    ...mapMutations(['setCurrentVideo']),
    ...mapActions(['removeDown', 'clearDown']),
    onItemClick(video) {
      const { downFile } = video;
      const { shell } = this.$q.electron;
      shell.openItem(downFile);
    },
    stopAll() {
      this.clearDown();
    },
    delAll() {

    },
  },
};
</script>

<template>
  <q-btn dense flat round icon="save_alt">
    <q-badge color="red" floating>{{ downList.length }}</q-badge>
    <q-menu auto-close>
      <div class="q-pa-md q-gutter-sm">
        <q-toggle label="清空" color="red" v-model="clear" />
        <q-btn flat label="全部启动" color="secondary" @click="startAll()" />
        <q-btn flat label="全部暂停" color="red" @click="pauseAll()" />
      </div>
      <q-list dense style="min-width: 100px" separator>
        <q-item clickable v-for="(video,k) in downList" :key="k" v-close-popup>
          <q-item-section avatar @click="onItemClick(video)">
            <q-img :src="video.pic[0]" color="primary" />
          </q-item-section>
          <q-item-section @click="onItemClick(video)">
            <q-item-label>{{ video.name[0] }}</q-item-label>
            <q-item-label caption>February 22, 2016</q-item-label>
            <q-item-label>
              <q-linear-progress :value="video.progress" />
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
      console.dir(video);
    },
    startAll() {

    },
    pauseAll() {

    },
  },
};
</script>

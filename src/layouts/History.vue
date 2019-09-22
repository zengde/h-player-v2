<template>
  <q-btn dense flat round icon="access_time">
    <q-menu auto-close>
      <q-toggle label="清空" v-model="clear" />
      <q-list dense style="min-width: 100px" separator>
        <q-item clickable v-for="(video,k) in historyList" :key="k" v-close-popup>
          <q-item-section avatar @click="onItemClick(video)">
            <q-img :src="video.pic[0]" color="primary" />
          </q-item-section>
          <q-item-section @click="onItemClick(video)">
            <q-item-label>{{ video.name[0] }}</q-item-label>
            <q-item-label caption>{{ video.last[0] }}</q-item-label>
          </q-item-section>
          <q-item-section side @click="removeItem(video)">
            <q-icon name="close" color="red" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script>
import { mapMutations, mapState, mapActions } from 'vuex';

export default {
  name: 'History',
  data() {
    return {
      clear: false,
    };
  },
  computed: {
    ...mapState({
      historyList: state => state.history.historyList,
    }),
  },
  methods: {
    ...mapMutations(['setCurrentVideo']),
    ...mapActions(['removeHistory']),
    onItemClick(video) {
      this.setCurrentVideo(video);
      if (this.$route.path === '/video') {
        this.$router.replace({
          path: '/video',
          query: {
            t: Date.now(),
          },
        });
      } else {
        this.$router.push('/video');
      }
    },
    removeItem(video) {
      this.removeHistory(video);
    },
  },
};
</script>

<template>
  <q-btn dense flat round icon="access_time">
    <q-menu auto-close>
      <q-toggle label="清空" v-model="clear" v-show="historyList.length" />
      <q-list dense style="min-width: 100px" separator>
        <q-item clickable v-for="(video,k) in historyList" :key="k" v-close-popup>
          <q-item-section avatar @click="onItemClick(video)">
            <q-img :src="video.pic[0]" color="primary" />
          </q-item-section>
          <q-item-section @click="onItemClick(video)">
            <q-item-label>{{ video.name[0] }}</q-item-label>
            <q-item-label caption>观看至 <span class="text-blue">{{ video.startTime|timeFormat }}</span></q-item-label>
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
  watch: {
    clear(bool) {
      if (bool) {
        this.clearHistory();
      }
    },
  },
  methods: {
    ...mapMutations(['setCurrentVideo']),
    ...mapActions(['removeHistory', 'clearHistory']),
    onItemClick(video) {
      this.setCurrentVideo(video);
      const route = {
        path: '/video',
        query: {
          t: Date.now(),
          h: '1',
        },
      };
      if (this.$route.path === '/video') {
        this.$router.replace(route);
      } else {
        this.$router.push(route);
      }
    },
    removeItem(video) {
      this.removeHistory(video);
    },
  },
  filters: {
    timeFormat(str) {
      const secNum = parseInt(str, 10); // don't forget the second param
      let hours = Math.floor(secNum / 3600);
      let minutes = Math.floor((secNum - (hours * 3600)) / 60);
      let seconds = secNum - (hours * 3600) - (minutes * 60);

      if (hours < 10) { hours = `0${hours}`; }
      if (minutes < 10) { minutes = `0${minutes}`; }
      if (seconds < 10) { seconds = `0${seconds}`; }
      return `${hours}:${minutes}:${seconds}`;
    },
  },
};
</script>

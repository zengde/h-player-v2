<template>
  <q-btn dense flat round icon="access_time">
    <q-menu auto-close>
      <q-toggle label="清空" v-model="clear" v-show="historyList.length" />
      <q-list dense style="min-width: 100px" separator>
        <q-item clickable v-for="(video,k) in historyList" :key="k" v-close-popup>
          <q-item-section avatar @click="gotoPlayer(video)">
            <q-img :src="video.pic[0]" color="primary" />
          </q-item-section>
          <q-item-section @click="gotoPlayer(video)">
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
import { mapState, mapActions } from 'vuex';
import { historyMixin } from '../mixin/video';

export default {
  name: 'History',
  mixins: [historyMixin],
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
    ...mapActions(['removeHistory', 'clearHistory']),
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

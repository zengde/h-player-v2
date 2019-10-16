<template>
  <q-page
    padding
    class="flex"
  >
    <scrollWarp>
      <q-scroll-area
        :thumb-style="thumbStyle"
        class="fit"
      >
        <viewArea>
          <hls-player
            :source="normalizeUrl(currentEpisode.url)"
            :options="options"
            :startTime="startTime"
            @hls-error="errorHandler"
            ref="player"
          ></hls-player>
        </viewArea>
        <q-expansion-item
          icon="info"
          :label="`${currentVideo.name[0]}-${currentEpisode.episode}`"
          header-class="bg-primary text-white"
          expand-icon-class="text-white"
        >
          <q-card>
            <q-card-section>
              <div class="text-h6">演员: {{currentVideo.actor[0]}}</div>
              <div class="text-h6">地区: {{currentVideo.area[0]}}</div>
              <div class="text-h6">简介: {{currentVideo.des[0]}}</div>
              <div class="text-h6">导演: {{currentVideo.director[0]}}</div>
              <div class="text-h6">语言: {{currentVideo.lang[0]}}</div>
              <div class="text-h6">时间: {{currentVideo.last[0]}}</div>
              <div class="text-h6">备注: {{currentVideo.note[0]}}</div>
              <div class="text-h6">
                图片:
                <q-img
                  :src="currentVideo.pic[0]"
                  spinner-color="white"
                  style="height: 140px; max-width: 150px"
                />
              </div>
              <div class="text-h6">评分: {{currentVideo.state[0]}}</div>
              <div class="text-h6">类型: {{currentVideo.type[0]}}</div>
              <div class="text-h6">年份: {{currentVideo.year[0]}}</div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-toolbar>
          播放来源：
          <q-tabs v-model="currentEpisodeGroup" class="text-teal" align="left">
            <q-tab
            v-for="(value) in groupEpisodeInfo"
            :key="value.$.flag"
            :name="value.$.flag"
            :label="value.$.flag"
            />
          </q-tabs>
        </q-toolbar>
        <q-tab-panels
          v-model="currentEpisodeGroup"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel v-for="(value) in groupEpisodeInfo" :key="value.$.flag" :name="value.$.flag">
            <q-table
              :data="value.episodeInfo"
              :columns="columns"
              row-key="name"
            >
              <q-td
                slot="body-cell-actions"
                slot-scope="props"
                :props="props"
              >
                <q-chip
                  v-if="currentEpisode.url === props.row.url"
                  icon="play_arrow"
                  size="10px"
                >正在播放</q-chip>
                <q-btn
                  v-else
                  round
                  color="primary"
                  icon="play_arrow"
                  @click="setCurrentEpisode(props)"
                />
              </q-td>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
        <q-page-sticky
          position="top-left"
          :offset="[5, 5]"
        >
          <q-btn
            round
            color="accent"
            icon="arrow_back"
            @click="goback"
          />
        </q-page-sticky>
        <q-page-sticky
          position="top-right"
          :offset="[5, 5]"
        >
          <q-btn
            round
            color="accent"
            icon="layers"
            @click="minimize"
          />
        </q-page-sticky>
      </q-scroll-area>
    </scrollWarp>
  </q-page>
</template>

<script>
import scrollWarp from 'components/scrollWarp';
import viewArea from 'components/viewArea';
import HlsPlayer from 'components/HlsPlayer';
import { mapState } from 'vuex';
import { stringify } from 'query-string';

import videoMixin from '../mixin/video';

export default {
  name: 'Videop',
  mixins: [videoMixin],
  data() {
    return {
      options: {
        controls: [
          'play-large',
          'rewind',
          'play',
          'fast-forward',
          'progress',
          'current-time',
          'mute',
          'volume',
          'captions',
          'settings',
          'airplay',
          'fullscreen',
          'capture',
          'rotate',
        ],
        thumbnailCreate: {
          after: 'download',
          width: 220,
          height: 170,
        },
      },
      columns: [
        {
          name: 'episode',
          label: '分集',
          field: 'episode',
          sortable: true,
        },
        {
          name: 'url',
          label: '链接',
          field: 'url',
          sortable: true,
        },
        {
          name: 'player',
          label: '播放器类型',
          field: 'player',
          sortable: true,
        },
        {
          name: 'actions',
          label: '操作',
        },
      ],
      episodeInfo: [],
    };
  },
  components: {
    HlsPlayer,
    scrollWarp,
    viewArea,
  },
  mounted() {
    this.initGroup(this.currentVideo, this.$route.query.h);
  },
  watch: {
    currentVideo(currentVideo) {
      this.initGroup(currentVideo, this.$route.query.h);
    },
  },
  methods: {
    setCurrentEpisode(props) {
      this.currentEpisode = props.row;
    },
    pause() {
      const { player } = this.$refs.player;
      player.pause();
    },
    goback() {
      this.$router.go(-1);
    },
    minimize() {
      this.pause();
      const videoInfo = JSON.stringify(this.setHistory(true));
      const encodeUrl = stringify({ video: videoInfo, h: '1' });
      const url = `${process.env.APP_URL}#/mini-video?${encodeUrl}`;
      window.open(url, '_blank', 'height=300,width=400,toolbar=0,status=0,location=0,menubar=0');
    },
    errorHandler(event, data) {
      if (data.details && data.details === 'manifestLoadError') {
        this.$q.dialog({
          title: '错误',
          message: '无法加载资源',
          persistent: true,
        });
      }
    },
  },
  computed: {
    ...mapState({
      currentVideo: state => state.video.currentVideo,
    }),
    thumbStyle() {
      return {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75,
      };
    },
  },
  beforeDestroy() {
    console.log('destroyed');
    this.setHistory();
  },
};
</script>

<style>
</style>

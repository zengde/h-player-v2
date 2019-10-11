import _find from 'lodash/find';
import _get from 'lodash/get';
import { cloneDeep } from 'lodash';
import _isElement from 'lodash/isElement';
import { mapMutations, mapActions } from 'vuex';
import isAbsoluteUrl from 'is-absolute-url';
import normalizeUrl from 'normalize-url';

export default {
  data() {
    return {
      currentEpisode: {
        episode: '无',
        url: '',
        player: '无',
      },
      groupEpisodeInfo: [],
      currentEpisodeGroup: '',
      startTime: 0,
    };
  },
  methods: {
    ...mapActions(['addHistory']),
    sliceUrl(str) {
      return str.split('#');
    },
    initUrl(str) {
      const slicedUrl = this.sliceUrl(str);
      return slicedUrl.map(element => this.getUrlInfo(element));
    },
    getUrlInfo(str) {
      const splitStr = str.split('$');
      const url = _find(splitStr, isAbsoluteUrl);
      if (splitStr.length === 3) {
        return {
          episode: splitStr[0],
          url,
          player: splitStr[2],
        };
      }
      return {
        episode: splitStr[0],
        url,
        player: '无',
      };
    },
    normalizeUrl(url) {
      if (isAbsoluteUrl(url)) {
        return normalizeUrl(url, { stripWWW: false });
      }
      return '';
    },
    initGroup(video, history = '0') {
      const cloneVideo = cloneDeep(video, value => (_isElement(value) ? value.cloneNode(true) : undefined));
      const groups = _get(cloneVideo, 'dl[0].dd', []);
      groups.map((element) => {
        const uris = _get(element, '_', '');
        element.episodeInfo = this.initUrl(uris);
        return element;
      });
      this.groupEpisodeInfo = groups;
      if (history === '1') {
        this.currentEpisodeGroup = video.currentEpisodeGroup;
        this.currentEpisode = video.currentEpisode;
        this.startTime = video.startTime;
      } else {
        const [currentGroup] = this.groupEpisodeInfo;
        this.currentEpisodeGroup = currentGroup.$.flag;
        [this.currentEpisode] = currentGroup.episodeInfo;
        this.startTime = 0;
      }
    },
    setHistory(isReturn = false) {
      const startTime = this.$refs.player.video.currentTime;
      const { currentEpisodeGroup, currentEpisode } = this;
      const currentVideo = {
        ...this.currentVideo,
        currentEpisodeGroup,
        currentEpisode,
        startTime,
      };
      if (!isReturn) this.addHistory(currentVideo);
      return currentVideo;
    },
  },
};

export const historyMixin = {
  methods: {
    ...mapMutations(['setCurrentVideo']),
    gotoPlayer(video) {
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
  },
};

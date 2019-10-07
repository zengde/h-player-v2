import axios from 'axios';
import Store from 'electron-store';
import pkg from '../../../package.json';

const store = new Store();

export default {
  state: {
    https: true,
    loadImage: true,
    currentVersion: pkg.version,
    latestVersion: '0.0.0',
    savePath: '',
  },
  mutations: {
    setHttps(state, status) {
      state.https = status;
      store.set('settings', {
        https: state.https,
        loadImage: state.loadImage,
        savePath: state.savePath,
      });
    },
    setLoadImage(state, status) {
      state.loadImage = status;
      store.set('settings', {
        https: state.https,
        loadImage: state.loadImage,
        savePath: state.savePath,
      });
    },
    setLatestVersion(state, latestVersion) {
      state.latestVersion = latestVersion;
    },
    setSavePath(state, savePath) {
      state.savePath = savePath;
      store.set('settings', {
        https: state.https,
        loadImage: state.loadImage,
        savePath: state.savePath,
      });
    },
    setSettings(state, settings) {
      state.https = settings.https;
      state.loadImage = settings.loadImage;
      state.savePath = settings.savePath || '';
      store.set('settings', settings);
    },
  },
  actions: {
    getLatestVersion(context) {
      return axios
        .get(
          'https://api.github.com/repos/ZyqGitHub1/h-player-v2/releases/latest',
        )
        .then((response) => {
          const tag = response.data.tag_name;
          context.commit('setLatestVersion', tag);
          return response;
        });
    },
    loadSettings(context) {
      const settings = store.get('settings');
      console.log('store->app->action.loadSettings');
      console.log(settings);
      if (!settings) {
        context.commit('setSettings', {
          https: true,
          loadImage: true,
          savePath: '',
        });
      } else {
        context.commit('setSettings', settings);
      }

      return settings;
    },
  },
};

import Store from 'electron-store';

const store = new Store();

export default {
  state: {
    downList: [],
  },
  mutations: {
    setDownList(state, list) {
      if (!Array.isArray(list)) {
        state.downList = [];
      } else {
        state.downList = list;
      }
      store.set('downList', state.downList);
    },
  },
  actions: {
    loadDownload(context) {
      const storeList = store.get('downList');
      if (!Array.isArray(storeList)) {
        context.commit('setDownList', []);
      } else {
        context.commit('setDownList', storeList);
      }


      return storeList;
    },
    addDown(context, { video, url }) {
      let storeList = store.get('downList');
      if (url === '' || url.indexOf('.m3u8') === -1) {
        console.error('不是有效的m3u8下载地址!');
        return storeList;
      }
      video.downUrl = url;
      video.progress = 0;
      video.isDownloading = true;
      if (!Array.isArray(storeList)) {
        context.commit('setDownList', [video]);
      } else {
        storeList = storeList.filter(elem => elem.downUrl !== '' && elem.downUrl !== url);
        if (storeList.length === 20) {
          storeList[19] = video;
        } else {
          storeList.push(video);
        }
        context.commit('setDownList', storeList);
      }


      return storeList;
    },
    removeDown(context, url) {
      let storeList = store.get('downList');
      storeList = storeList.filter(elem => elem.downUrl !== '' && elem.downUrl !== url);
      context.commit('setDownList', storeList);
    },
    clearDown(context) {
      context.commit('setDownList', []);
    },
    finishDown(context, { video, savefile }) {
      let storeList = store.get('downList');
      if (savefile === '' || savefile.indexOf('.mp4') === -1) {
        console.error('不是有效的本地视频地址!');
        return storeList;
      }
      video.progress = 100;
      video.isDownloading = false;
      video.downFile = savefile;
      if (!Array.isArray(storeList)) {
        context.commit('setDownList', [video]);
      } else {
        storeList = storeList.filter(elem => elem.downUrl !== '' && elem.downUrl !== video.downUrl);
        if (storeList.length === 20) {
          storeList[19] = video;
        } else {
          storeList.push(video);
        }
        context.commit('setDownList', storeList);
      }


      return storeList;
    },
  },
};

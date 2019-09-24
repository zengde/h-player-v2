import Store from 'electron-store';

const store = new Store();

export default {
  state: {
    historyList: [],
  },
  mutations: {
    setHistoryList(state, list) {
      if (!Array.isArray(list)) {
        state.historyList = [];
      } else {
        state.historyList = list;
      }
      store.set('historyList', state.historyList);
    },
  },
  actions: {
    loadHistory(context) {
      const storeList = store.get('historyList');
      if (!Array.isArray(storeList)) {
        context.commit('setHistoryList', []);
      } else {
        context.commit('setHistoryList', storeList);
      }


      return storeList;
    },
    addHistory(context, video) {
      let storeList = store.get('historyList');
      if (!Array.isArray(storeList)) {
        context.commit('setHistoryList', [video]);
      } else {
        storeList = storeList.filter(elem => elem.name[0] !== '' && elem.name[0] !== video.name[0]);
        if (storeList.length === 20) {
          storeList[19] = video;
        } else {
          storeList.push(video);
        }
        context.commit('setHistoryList', storeList);
      }


      return storeList;
    },
    removeHistory(context, video) {
      let storeList = store.get('historyList');
      storeList = storeList.filter(elem => elem.name[0] !== '' && elem.name[0] !== video.name[0]);
      context.commit('setHistoryList', storeList);
    },
    clearHistory(context) {
      context.commit('setHistoryList', []);
    },
  },
};

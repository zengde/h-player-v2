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
    addHistory(context, video) {
      let storeList = store.get('historyList');
      if (!Array.isArray(storeList)) {
        context.commit('setHistoryList', [video]);
      } else {
        storeList = storeList.filter(elem => elem.name[0] !== '' && elem.name[0] !== video.name[0]);
        storeList.push(video);
        console.dir(storeList);
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

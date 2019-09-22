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
      const storeList = store.get('historyList');
      if (!Array.isArray(storeList)) {
        context.commit('setHistoryList', [video]);
      } else {
        const find = storeList.find(elem => elem.name[0] === video.name[0]);
        console.log(find);
        if (typeof find === 'undefined') {
          storeList.push(video);
          context.commit('setHistoryList', storeList);
        }
      }


      return storeList;
    },
    removeHistory(context, video) {
      context.commit('setHistoryList', [video]);
    },
    clearHistory(context) {
      context.commit('setHistoryList', []);
    },
  },
};

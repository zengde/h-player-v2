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
    },
  },
  actions: {
    addHistory({ commit, state }, video) {
      let storeList = state.historyList;
      if (!Array.isArray(storeList)) {
        commit('setHistoryList', [video]);
      } else {
        storeList = storeList.filter(elem => elem.name[0] !== '' && elem.name[0] !== video.name[0]);
        if (storeList.length === 20) {
          storeList[19] = video;
        } else {
          storeList.push(video);
        }
        commit('setHistoryList', storeList);
      }


      return storeList;
    },
    removeHistory({ commit, state }, video) {
      let storeList = state.historyList;
      storeList = storeList.filter(elem => elem.name[0] !== '' && elem.name[0] !== video.name[0]);
      commit('setHistoryList', storeList);
    },
    clearHistory(context) {
      context.commit('setHistoryList', []);
    },
  },
};

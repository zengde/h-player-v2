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
    addDown(context) {
      const storeList = store.get('downList');
      if (!Array.isArray(storeList)) {
        context.commit('setDownList', []);
      } else {
        context.commit('setDownList', storeList);
      }


      return storeList;
    },
    removeDown(context) {
      context.commit('setDownList', []);
    },
    clearDown(context) {
      context.commit('setDownList', []);
    },
  },
};

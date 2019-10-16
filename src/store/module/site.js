export default {
  state: {
    siteList: [],
    currentSiteId: 1,
    currentClass: '',
    keyWord: '',
  },
  mutations: {
    setCurrentSiteId(state, currentSiteId) {
      state.currentSiteId = currentSiteId;
    },
    setCurrentClass(state, currentClass) {
      state.currentClass = currentClass;
    },
    setKeyWord(state, keyWord) {
      state.keyWord = keyWord;
    },
    setSiteList(state, siteList) {
      if (!Array.isArray(siteList)) {
        state.siteList = [];
      } else {
        state.siteList = siteList;
      }
    },
  },
  getters: {
    currentSite: state => state.siteList.find(item => item.id === state.currentSiteId),
  },
  actions: {
    loadSiteList({ commit, state }) {
      const storeSiteList = state.siteList;
      if (!Array.isArray(storeSiteList)) {
        commit('setSiteList', []);
      } else {
        commit('setSiteList', storeSiteList);
      }


      return storeSiteList;
    },
  },
};

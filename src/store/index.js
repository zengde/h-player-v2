import Vue from 'vue';
import Vuex from 'vuex';

import createLogger from 'vuex/dist/logger';
import VuexPersistence from 'vuex-persist';
import site from './module/site';
import video from './module/video';
import app from './module/app';
import history from './module/history';


Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      site,
      video,
      app,
      history,
    },

    plugins: [createLogger(), new VuexPersistence({
      modules: ['site', 'app', 'history'],
    }).plugin],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV,
  });

  return Store;
}

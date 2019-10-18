// import axios from 'axios';

export default async ({ Vue }) => {
  Vue.prototype.$axios = cordova.plugin.http;
};

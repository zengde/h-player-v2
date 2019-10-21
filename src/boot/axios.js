import axios from '../api/apiNative';

export default async ({ Vue }) => {
  Vue.prototype.$axios = axios;
};

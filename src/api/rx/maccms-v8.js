import { from } from 'rxjs';
// import axios from 'axios';
// import { stringify } from 'query-string';

// todo 封装
const { http } = cordova.plugin;
export function getList(api, query) {
  const defaultParams = {
    ac: 'list',
  };
  const params = Object.assign(defaultParams, query);
  // adveanced http 只支持string
  const paramsString = {};
  Object.entries(params).forEach((index, value) => {
    paramsString[index] = value.toString();
  });
  return from(
    new Promise((resolve, reject) => {
      http.get(
        api,
        paramsString,
        {},
        response => resolve(response),
        error => reject(error),
      );
    }),
  );
}

export function getDetail(api, query) {
  const defaultParams = {
    ac: 'videolist',
  };
  const params = Object.assign(defaultParams, query);
  const paramsString = {};
  Object.entries(params).forEach((index, value) => {
    paramsString[index] = value.toString();
  });
  console.log(JSON.stringify(params));
  return from(
    new Promise((resolve, reject) => {
      http.get(
        api,
        params,
        {},
        response => resolve(response),
        error => reject(error),
      );
    }),
  );
  /*
  return from(
    axios.get(api, {
      params,
      paramsSerializer(qs) {
        return stringify(qs, {
          arrayFormat: 'comma',
        });
      },
    }),
  );
  */
}

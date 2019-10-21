import { from } from 'rxjs';
import { stringify } from 'query-string';
import axios from '../apiNative';

export function getList(api, query) {
  const defaultParams = {
    ac: 'list',
  };
  const params = Object.assign(defaultParams, query);
  return from(
    axios.get(api, {
      params,
    }),
  );
}

export function getDetail(api, query) {
  const defaultParams = {
    ac: 'videolist',
  };
  const params = Object.assign(defaultParams, query);
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
}

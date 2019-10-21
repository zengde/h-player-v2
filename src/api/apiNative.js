const { http } = cordova.plugin;

// adveanced http 只支持string
function getStringObject (params) {
  const paramsString = {};
  Object.entries(params).forEach(([index, value]) => {
    if (typeof value === 'object') {
      paramsString[index] = getStringObject(value);
    } else {
      paramsString[index] = value.toString();
    }
  });
  return paramsString;
}

class apiNative {
  static get (api, { params, paramsSerializer }) {
    let paramsConvert = {};
    if (typeof paramsSerializer === 'function') {
      const seperator = (api.indexOf('?') === -1 ? '?' : '&');
      api += `${seperator}${paramsSerializer(params)}`;
    } else {
      paramsConvert = getStringObject(params);
    }
    return new Promise((resolve, reject) => {
      http.get(
        api,
        paramsConvert,
        {},
        response => resolve(response),
        error => reject(error),
      );
    });
  }
}

export default apiNative;
